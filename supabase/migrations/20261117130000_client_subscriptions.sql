-- Overpeck Labs: Stripe billing records, written through secret-checked RPC functions (no service role key).
-- Not run automatically. Apply in the Supabase SQL editor (or supabase db push). Safe to run more than once.
--
-- How it works
--   * The Stripe webhook (app/api/stripe/webhook) verifies Stripe's signature, then calls the billing_* functions
--     below with the PUBLIC anon key plus BILLING_RPC_SECRET (a server-only env var in Vercel).
--   * The functions are SECURITY DEFINER: they run as their owner, so they can write tables that anon can't touch.
--     Each one first checks the secret against a SHA-256 hash stored in private.billing_rpc_secret. A wrong or
--     missing secret raises "forbidden" before anything is read or written.
--   * anon and authenticated have no table privileges and no RLS policies on client_subscriptions, and the private
--     schema isn't exposed by the API at all. The only way in is the three functions, and only with the secret.
--   * NOTE: public.clients already exists (CRM table). This migration does not change its columns; the functions
--     only read it, set status to client / old_client, and insert a new client when no match exists.
--
-- After running this file, set the secret (see the bottom of this file).

-- ---------- private schema: not exposed through the Supabase API ----------
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.billing_rpc_secret (
  id boolean primary key default true check (id), -- single row
  secret_sha256 bytea not null,
  updated_at timestamptz not null default now()
);
revoke all on private.billing_rpc_secret from public, anon, authenticated;

-- ---------- billing table ----------
create table if not exists public.client_subscriptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  email text not null,
  name text,
  phone text,
  plan text not null,
  stripe_customer_id text,
  stripe_subscription_id text not null unique,
  status text not null default 'active' check (status in ('active', 'canceled')),
  welcome_claimed_at timestamptz, -- set while a webhook call is sending the welcome email (stops double sends)
  welcome_sent_at timestamptz,
  created_at timestamptz not null default now(),
  canceled_at timestamptz
);
-- In case an earlier draft of this table was already created without the claim column.
alter table public.client_subscriptions add column if not exists welcome_claimed_at timestamptz;

create index if not exists client_subscriptions_email_idx on public.client_subscriptions (lower(email));
create index if not exists client_subscriptions_client_idx on public.client_subscriptions (client_id);

alter table public.client_subscriptions enable row level security;
-- No policies on purpose: anon and signed-in users can't read or write it directly.
revoke all on public.client_subscriptions from anon, authenticated;

-- ---------- secret check (internal) ----------
create or replace function private.billing_check_secret(p_secret text)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if p_secret is null
     or length(p_secret) < 32
     or not exists (select 1 from private.billing_rpc_secret s where s.secret_sha256 = sha256(convert_to(p_secret, 'UTF8')))
  then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end;
$$;
revoke all on function private.billing_check_secret(text) from public, anon, authenticated;

-- ---------- checkout.session.completed ----------
-- Records (or re-activates) the subscription, links or creates the CRM client, and claims the welcome email.
-- Returns {"id": <client_subscriptions.id>, "send_welcome": true|false}. send_welcome is true for exactly one
-- caller until the email is marked sent (or the claim is released, or it goes stale after 10 minutes).
create or replace function public.billing_checkout_completed(
  p_secret text,
  p_subscription_id text,
  p_customer_id text,
  p_email text,
  p_name text,
  p_phone text,
  p_plan text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := nullif(btrim(p_email), '');
  v_name text := nullif(btrim(p_name), '');
  v_phone text := nullif(btrim(p_phone), '');
  v_digits text := regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g');
  v_sub_id uuid;
  v_client_id uuid;
  v_match_id uuid;
  v_match_status text;
  v_send boolean;
begin
  perform private.billing_check_secret(p_secret);
  if nullif(btrim(p_subscription_id), '') is null or v_email is null then
    raise exception 'subscription id and email are required' using errcode = '22023';
  end if;

  -- One checkout per email at a time, so two deliveries can't create two CRM clients.
  perform pg_advisory_xact_lock(hashtext('billing:' || lower(v_email)));

  insert into public.client_subscriptions as s (email, name, phone, plan, stripe_customer_id, stripe_subscription_id, status, canceled_at)
  values (v_email, v_name, v_phone, coalesce(nullif(btrim(p_plan), ''), 'unknown'), nullif(btrim(p_customer_id), ''), btrim(p_subscription_id), 'active', null)
  on conflict (stripe_subscription_id) do update
    set email = excluded.email, name = excluded.name, phone = excluded.phone, plan = excluded.plan,
        stripe_customer_id = excluded.stripe_customer_id, status = 'active', canceled_at = null
  returning s.id, s.client_id into v_sub_id, v_client_id;

  if v_client_id is null then
    -- Match the CRM client by email, then by phone (Stripe sends +1XXXXXXXXXX; the CRM may store 10 or 11 digits).
    select c.id, c.status into v_match_id, v_match_status
      from public.clients c
     where lower(c.email) = lower(v_email)
     order by c.created_at
     limit 1;
    if v_match_id is null and length(v_digits) >= 10 then
      select c.id, c.status into v_match_id, v_match_status
        from public.clients c
       where c.phone_digits in (v_digits, right(v_digits, 10), '1' || right(v_digits, 10))
       order by c.created_at
       limit 1;
    end if;

    if v_match_id is not null then
      v_client_id := v_match_id;
      if v_match_status is distinct from 'client' then
        update public.clients set status = 'client', status_changed_at = now() where id = v_client_id;
      end if;
    else
      -- clients.source is free text in this repo (the admin form allows any value up to 100 characters), but the
      -- table was created outside these migrations. If a CHECK on the live table ever rejects 'stripe', the client
      -- is still created, with no source, rather than failing the payment webhook.
      begin
        insert into public.clients (business_name, contact_name, email, phone, status, source)
        values (coalesce(v_name, v_email), v_name, v_email, v_phone, 'client', 'stripe')
        returning id into v_client_id;
      exception when check_violation then
        insert into public.clients (business_name, contact_name, email, phone, status, source)
        values (coalesce(v_name, v_email), v_name, v_email, v_phone, 'client', null)
        returning id into v_client_id;
      end;
    end if;

    update public.client_subscriptions set client_id = v_client_id where id = v_sub_id;
  end if;

  update public.client_subscriptions
     set welcome_claimed_at = now()
   where id = v_sub_id
     and welcome_sent_at is null
     and (welcome_claimed_at is null or welcome_claimed_at < now() - interval '10 minutes');
  v_send := found;

  return jsonb_build_object('id', v_sub_id, 'send_welcome', v_send);
end;
$$;

-- ---------- welcome email result ----------
-- p_sent = true marks the email sent; false releases the claim so Stripe's retry sends it.
create or replace function public.billing_welcome_result(p_secret text, p_id uuid, p_sent boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.billing_check_secret(p_secret);
  if p_sent then
    update public.client_subscriptions set welcome_sent_at = now() where id = p_id and welcome_sent_at is null;
  else
    update public.client_subscriptions set welcome_claimed_at = null where id = p_id and welcome_sent_at is null;
  end if;
end;
$$;

-- ---------- customer.subscription.deleted ----------
-- Marks the subscription canceled; when the client has no other active subscription, moves them to old_client.
create or replace function public.billing_subscription_deleted(p_secret text, p_subscription_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client_id uuid;
begin
  perform private.billing_check_secret(p_secret);

  update public.client_subscriptions
     set status = 'canceled', canceled_at = coalesce(canceled_at, now())
   where stripe_subscription_id = btrim(p_subscription_id)
  returning client_id into v_client_id;

  if v_client_id is not null and not exists (
    select 1 from public.client_subscriptions where client_id = v_client_id and status = 'active'
  ) then
    update public.clients set status = 'old_client', status_changed_at = now()
     where id = v_client_id and status = 'client';
  end if;
end;
$$;

-- Only anon (the webhook's key) may call the functions, and each one checks the secret first.
revoke all on function public.billing_checkout_completed(text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.billing_welcome_result(text, uuid, boolean) from public, anon, authenticated;
revoke all on function public.billing_subscription_deleted(text, text) from public, anon, authenticated;
grant execute on function public.billing_checkout_completed(text, text, text, text, text, text, text) to anon;
grant execute on function public.billing_welcome_result(text, uuid, boolean) to anon;
grant execute on function public.billing_subscription_deleted(text, text) to anon;

notify pgrst, 'reload schema';

-- ---------- set the secret (run separately) ----------
-- Generate a random secret locally, put it in Vercel as BILLING_RPC_SECRET, and store only its hash here:
--
--   insert into private.billing_rpc_secret (id, secret_sha256)
--   values (true, decode('<sha256 hex of the secret>', 'hex'))
--   on conflict (id) do update set secret_sha256 = excluded.secret_sha256, updated_at = now();
--
-- To rotate: generate a new secret, update Vercel, run the insert again with the new hash, redeploy.
