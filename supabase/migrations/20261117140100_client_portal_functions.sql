-- Overpeck Labs: client portal functions (all SECURITY DEFINER, search_path = '').
-- Run after 20261117140000_client_portal_tables.sql. Safe to run more than once.
--
-- Callers
--   anon + BILLING_RPC_SECRET (the Stripe webhook / server actions): portal_create_invite, portal_invite_email
--   anon / authenticated, no secret (returns nothing sensitive):      portal_invite_status
--   authenticated client:                                              portal_claim_invite, portal_me, portal_save_step, portal_submit
--   authenticated admin (private.is_admin()):                          portal_admin_create_invite

-- ---------- internal helpers ----------
create or replace function private.portal_steps(p_plan text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case p_plan
    when 'starter' then array['basics','brand','services','photos','pages','domain','review']
    when 'growth'  then array['basics','brand','services','photos','pages','domain','chat','alerts','gbp','content','review']
    when 'pro'     then array['basics','brand','services','photos','pages','domain','chat','alerts','gbp','content','phone','script','booking','transfers','review']
  end
$$;

-- Keys that must be filled before submit. Mirrors the required fields in lib/portal/steps.ts.
create or replace function private.portal_required(p_step text)
returns text[]
language sql
immutable
set search_path = ''
as $$
  select case p_step
    when 'basics'    then array['business_name','contact_name','phone','lead_email','trade','service_area','hours']
    when 'services'  then array['services']
    when 'pages'     then array['pages','main_goal']
    when 'domain'    then array['has_domain','access_choice']
    when 'chat'      then array['faqs','lead_info','handoff']
    when 'alerts'    then array['alert_numbers','sms_consent']
    when 'gbp'       then array['has_gbp','categories']
    when 'content'   then array['approver_name','reach_method']
    when 'phone'     then array['business_number','carrier','forwarding']
    when 'script'    then array['greeting','caller_faqs']
    when 'booking'   then array['job_types','availability','confirm_method']
    when 'transfers' then array['transfer_number','summary_numbers']
    else array[]::text[]
  end
$$;

create or replace function private.portal_filled(v jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  -- coalesce: jsonb_typeof(NULL) is NULL (a missing key), and a simple CASE never matches NULL, so it would fall to
  -- "else true". Missing values must count as empty.
  select case coalesce(jsonb_typeof(v), 'null')
    when 'string' then btrim(v #>> '{}') <> ''
    when 'array' then jsonb_array_length(v) > 0
    when 'null' then false
    else true
  end
$$;

create or replace function private.portal_plan_rank(p_plan text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_plan when 'starter' then 1 when 'growth' then 2 when 'pro' then 3 else 0 end
$$;

-- The plan on the client's latest active subscription (null when none, or not one of the three plans).
create or replace function private.portal_plan_of(p_client uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when lower(btrim(s.plan)) in ('starter','growth','pro') then lower(btrim(s.plan)) end
    from public.client_subscriptions s
   where s.client_id = p_client and s.status = 'active'
   order by s.created_at desc
   limit 1
$$;

-- Keeps client_onboarding.plan in step with the latest active subscription. Answers are kept. If a finished
-- onboarding moves to a higher tier, it is reopened so the new steps can be filled in.
create or replace function private.portal_sync_plan(p_client uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_new text := private.portal_plan_of(p_client);
  v_sub uuid;
  o public.client_onboarding%rowtype;
begin
  select * into o from public.client_onboarding where client_id = p_client for update;
  if not found or v_new is null or o.plan is not distinct from v_new then return; end if;

  select s.id into v_sub from public.client_subscriptions s
   where s.client_id = p_client and s.status = 'active' order by s.created_at desc limit 1;

  update public.client_onboarding
     set plan = v_new,
         subscription_id = v_sub,
         status = case when status in ('submitted','complete') and private.portal_plan_rank(v_new) > private.portal_plan_rank(o.plan)
                       then 'reopened' else status end,
         completed_at = case when status = 'complete' and private.portal_plan_rank(v_new) > private.portal_plan_rank(o.plan)
                             then null else completed_at end
   where client_id = p_client;
end;
$$;

-- Creates an invite (raw token returned once, only its SHA-256 stored). Older unused invites for the client stop working.
create or replace function private.portal_make_invite(p_subscription_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  s public.client_subscriptions%rowtype;
  v_token text;
begin
  select * into s from public.client_subscriptions where id = p_subscription_id;
  if not found or s.client_id is null then
    raise exception 'subscription not found or not linked to a client' using errcode = '22023';
  end if;

  update public.onboarding_invites set expires_at = now()
   where client_id = s.client_id and used_at is null and expires_at > now();

  v_token := rtrim(translate(encode(extensions.gen_random_bytes(32), 'base64'), '+/', '-_'), '=');
  insert into public.onboarding_invites (client_id, subscription_id, email, token_sha256)
  values (s.client_id, s.id, lower(btrim(s.email)), sha256(convert_to(v_token, 'UTF8')));
  return v_token;
end;
$$;

revoke all on function private.portal_steps(text) from public, anon, authenticated;
revoke all on function private.portal_required(text) from public, anon, authenticated;
revoke all on function private.portal_filled(jsonb) from public, anon, authenticated;
revoke all on function private.portal_plan_rank(text) from public, anon, authenticated;
revoke all on function private.portal_plan_of(uuid) from public, anon, authenticated;
revoke all on function private.portal_sync_plan(uuid) from public, anon, authenticated;
revoke all on function private.portal_make_invite(uuid) from public, anon, authenticated;

-- ---------- invite creation (webhook) ----------
create or replace function public.portal_create_invite(p_secret text, p_subscription_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.billing_check_secret(p_secret);
  return private.portal_make_invite(p_subscription_id);
end;
$$;

-- Admin "Resend onboarding link": uses the client's latest subscription (an active one first).
create or replace function public.portal_admin_create_invite(p_client_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub uuid;
begin
  if not private.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select s.id into v_sub from public.client_subscriptions s
   where s.client_id = p_client_id
   order by (s.status = 'active') desc, s.created_at desc
   limit 1;
  if v_sub is null then
    raise exception 'no subscription for this client' using errcode = '22023';
  end if;
  return private.portal_make_invite(v_sub);
end;
$$;

-- ---------- token status for the landing page (no secret, nothing sensitive) ----------
create or replace function public.portal_invite_status(p_token text)
returns jsonb
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  i public.onboarding_invites%rowtype;
  v_state text;
begin
  if p_token is null or length(p_token) not between 20 and 100 then
    return jsonb_build_object('state', 'invalid');
  end if;
  select * into i from public.onboarding_invites where token_sha256 = sha256(convert_to(p_token, 'UTF8'));
  if not found then return jsonb_build_object('state', 'invalid'); end if;
  v_state := case when i.used_at is not null then 'used' when i.expires_at <= now() then 'expired' else 'valid' end;
  return jsonb_build_object(
    'state', v_state,
    'masked_email', left(split_part(i.email, '@', 1), 1) || '***@' || split_part(i.email, '@', 2)
  );
end;
$$;

-- The invite's email, for the server action that sends the sign-in link. Needs the billing secret.
create or replace function public.portal_invite_email(p_secret text, p_token text)
returns text
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  v_email text;
begin
  perform private.billing_check_secret(p_secret);
  if p_token is null or length(p_token) not between 20 and 100 then return null; end if;
  select i.email into v_email from public.onboarding_invites i
   where i.token_sha256 = sha256(convert_to(p_token, 'UTF8')) and i.used_at is null and i.expires_at > now();
  return v_email;
end;
$$;

-- ---------- claim ----------
-- Returns 'ok' | 'invalid' | 'used' | 'expired' | 'email_mismatch' | 'conflict' | 'unauthenticated'.
create or replace function public.portal_claim_invite(p_token text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := (select auth.uid());
  v_email text := lower(coalesce((select auth.jwt()) ->> 'email', ''));
  i public.onboarding_invites%rowtype;
  v_member_client uuid;
  v_plan text;
begin
  if v_uid is null or v_email = '' then return 'unauthenticated'; end if;
  if p_token is null or length(p_token) not between 20 and 100 then return 'invalid'; end if;

  select * into i from public.onboarding_invites where token_sha256 = sha256(convert_to(p_token, 'UTF8')) for update;
  if not found then return 'invalid'; end if;

  if i.used_at is not null then
    -- Re-opening the same link while signed in as the person who claimed it is fine.
    if i.used_by = v_uid then return 'ok'; end if;
    return 'used';
  end if;
  if i.expires_at <= now() then return 'expired'; end if;
  if lower(i.email) <> v_email then return 'email_mismatch'; end if;

  insert into public.client_portal_members (user_id, client_id, email)
  values (v_uid, i.client_id, v_email)
  on conflict (user_id) do nothing;
  select m.client_id into v_member_client from public.client_portal_members m where m.user_id = v_uid;
  if v_member_client is distinct from i.client_id then return 'conflict'; end if;

  v_plan := private.portal_plan_of(i.client_id);
  insert into public.client_onboarding (client_id, subscription_id, plan)
  values (i.client_id, i.subscription_id, v_plan)
  on conflict (client_id) do nothing;

  update public.onboarding_invites set used_at = now(), used_by = v_uid where id = i.id;
  return 'ok';
end;
$$;

-- ---------- portal_me ----------
-- Everything the portal home and the wizard need, for the caller's own client. Null when the caller has no portal.
create or replace function public.portal_me()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client uuid := private.portal_client_id();
  v_name text;
  v_sub_status text;
  o public.client_onboarding%rowtype;
begin
  if v_client is null then return null; end if;
  perform private.portal_sync_plan(v_client);

  select c.business_name into v_name from public.clients c where c.id = v_client;
  select s.status into v_sub_status from public.client_subscriptions s
   where s.client_id = v_client order by (s.status = 'active') desc, s.created_at desc limit 1;
  select * into o from public.client_onboarding where client_id = v_client;

  return jsonb_build_object(
    'client_id', v_client,
    'business_name', v_name,
    'plan', o.plan,
    'subscription_status', v_sub_status,
    'onboarding_status', coalesce(o.status, 'not_started'),
    'current_step', o.current_step,
    'answers', coalesce(o.answers, '{}'::jsonb),
    'submitted_at', o.submitted_at
  );
end;
$$;

-- ---------- autosave ----------
-- Merges one step's answers and moves the resume pointer. Locked unless not_started / in_progress / reopened.
create or replace function public.portal_save_step(p_step text, p_answers jsonb, p_current_step text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client uuid := private.portal_client_id();
  o public.client_onboarding%rowtype;
  v_steps text[];
begin
  if v_client is null then raise exception 'forbidden' using errcode = '42501'; end if;
  perform private.portal_sync_plan(v_client);
  select * into o from public.client_onboarding where client_id = v_client for update;
  if not found then raise exception 'no onboarding' using errcode = '42501'; end if;
  if o.status not in ('not_started','in_progress','reopened') then
    raise exception 'locked' using errcode = '55000';
  end if;
  v_steps := private.portal_steps(o.plan);
  if v_steps is null then raise exception 'no plan' using errcode = '22023'; end if;
  if p_answers is not null then
    if p_step is null or p_step = 'review' or not (p_step = any (v_steps)) then
      raise exception 'invalid step' using errcode = '22023';
    end if;
    if jsonb_typeof(p_answers) <> 'object' or octet_length(p_answers::text) > 200000 then
      raise exception 'invalid answers' using errcode = '22023';
    end if;
  end if;
  if p_current_step is not null and not (p_current_step = any (v_steps)) then
    raise exception 'invalid step' using errcode = '22023';
  end if;

  update public.client_onboarding
     set answers = case when p_answers is null then answers else answers || jsonb_build_object(p_step, p_answers) end,
         current_step = coalesce(p_current_step, p_step, current_step),
         status = case when status = 'not_started' then 'in_progress' else status end
   where client_id = v_client;
  return 'ok';
end;
$$;

-- ---------- submit ----------
create or replace function public.portal_submit()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client uuid := private.portal_client_id();
  v_email text := lower(coalesce((select auth.jwt()) ->> 'email', ''));
  o public.client_onboarding%rowtype;
  v_step text;
  v_key text;
  v_name text;
begin
  if v_client is null then raise exception 'forbidden' using errcode = '42501'; end if;
  perform private.portal_sync_plan(v_client);
  select * into o from public.client_onboarding where client_id = v_client for update;
  if not found then raise exception 'no onboarding' using errcode = '42501'; end if;
  if o.status not in ('not_started','in_progress','reopened') then
    raise exception 'locked' using errcode = '55000';
  end if;
  if private.portal_steps(o.plan) is null then raise exception 'no plan' using errcode = '22023'; end if;

  foreach v_step in array private.portal_steps(o.plan) loop
    foreach v_key in array private.portal_required(v_step) loop
      if not private.portal_filled(o.answers -> v_step -> v_key) then
        raise exception 'incomplete: %.%', v_step, v_key using errcode = '22023';
      end if;
    end loop;
  end loop;
  if (o.answers -> 'alerts' -> 'sms_consent') is not null and (o.answers -> 'alerts' ->> 'sms_consent') <> 'true' then
    raise exception 'incomplete: alerts.sms_consent' using errcode = '22023';
  end if;

  update public.client_onboarding set status = 'submitted', submitted_at = now(), completed_at = null where client_id = v_client;
  select c.business_name into v_name from public.clients c where c.id = v_client;

  insert into public.communications (client_id, channel, direction, summary, body, occurred_at, created_by)
  values (v_client, 'note', null, 'Onboarding submitted', 'Plan: ' || coalesce(o.plan, 'unknown'), now(), nullif(v_email, ''));

  return jsonb_build_object('client_id', v_client, 'business_name', v_name, 'plan', o.plan, 'email', nullif(v_email, ''));
end;
$$;

-- ---------- grants ----------
revoke all on function public.portal_create_invite(text, uuid) from public, anon, authenticated;
revoke all on function public.portal_invite_email(text, text) from public, anon, authenticated;
revoke all on function public.portal_invite_status(text) from public, anon, authenticated;
revoke all on function public.portal_claim_invite(text) from public, anon, authenticated;
revoke all on function public.portal_me() from public, anon, authenticated;
revoke all on function public.portal_save_step(text, jsonb, text) from public, anon, authenticated;
revoke all on function public.portal_submit() from public, anon, authenticated;
revoke all on function public.portal_admin_create_invite(uuid) from public, anon, authenticated;

grant execute on function public.portal_create_invite(text, uuid) to anon;      -- + billing secret
grant execute on function public.portal_invite_email(text, text) to anon;       -- + billing secret
grant execute on function public.portal_invite_status(text) to anon, authenticated;
grant execute on function public.portal_claim_invite(text) to authenticated;
grant execute on function public.portal_me() to authenticated;
grant execute on function public.portal_save_step(text, jsonb, text) to authenticated;
grant execute on function public.portal_submit() to authenticated;
grant execute on function public.portal_admin_create_invite(uuid) to authenticated; -- is_admin() checked inside

notify pgrst, 'reload schema';
