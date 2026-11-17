-- Overpeck Labs: client portal tables, helper functions, RLS and storage policies.
-- Not run automatically. Apply in the Supabase SQL editor (or supabase db push), then run
-- 20261117140100_client_portal_functions.sql. Safe to run more than once.
--
-- Assumes these already exist on the live database: public.clients, public.client_files, public.communications,
-- public.admin_users, private.is_admin(), private.set_updated_at(), the client-files storage bucket, and
-- public.client_subscriptions (20261117130000_client_subscriptions.sql).
--
-- Security model (no service role key anywhere)
--   * Clients sign in with a magic link. A SECURITY DEFINER function (portal_claim_invite) links their auth user to
--     their CRM client, only when they hold an unused, unexpired invite token AND their JWT email equals the invite email.
--   * Every table below has RLS on. Clients can only read their own rows; all writes go through SECURITY DEFINER
--     functions (next migration) or admin-only policies. Admins are decided by private.is_admin().
--   * client_subscriptions stays closed to clients. Admins get a read-only policy.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
-- Policies call private.* helper functions, so the signed-in role needs USAGE on the schema (not on any table in it).
grant usage on schema private to authenticated;

-- ---------- tables ----------
create table if not exists public.client_portal_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
create index if not exists client_portal_members_client_idx on public.client_portal_members (client_id);

create table if not exists public.onboarding_invites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  subscription_id uuid references public.client_subscriptions(id) on delete set null,
  email text not null,
  token_sha256 bytea not null unique, -- only the hash is stored; the raw token exists only in the email link
  expires_at timestamptz not null default (now() + interval '14 days'),
  used_at timestamptz,
  used_by uuid, -- auth user id
  created_at timestamptz not null default now()
);
create index if not exists onboarding_invites_client_idx on public.onboarding_invites (client_id, created_at desc);

create table if not exists public.client_onboarding (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  subscription_id uuid references public.client_subscriptions(id) on delete set null,
  plan text check (plan is null or plan in ('starter', 'growth', 'pro')),
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'submitted', 'reopened', 'complete')),
  current_step text,
  answers jsonb not null default '{}'::jsonb check (jsonb_typeof(answers) = 'object'),
  submitted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists client_onboarding_set_updated_at on public.client_onboarding;
create trigger client_onboarding_set_updated_at
  before update on public.client_onboarding
  for each row execute function private.set_updated_at();

alter table public.client_portal_members enable row level security;
alter table public.onboarding_invites enable row level security;
alter table public.client_onboarding enable row level security;

-- ---------- helper functions ----------
-- The caller's client, from their membership row.
create or replace function private.portal_client_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select m.client_id from public.client_portal_members m where m.user_id = (select auth.uid())
$$;

-- True while the caller's onboarding is still editable by the client.
create or replace function private.portal_can_edit()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.client_onboarding o
     where o.client_id = private.portal_client_id()
       and o.status in ('not_started', 'in_progress', 'reopened')
  )
$$;

-- Number of onboarding photos the caller's client already has (for the 40-photo cap).
create or replace function private.portal_photo_count()
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::integer from public.client_files f
   where f.client_id = private.portal_client_id() and f.label = 'Onboarding: photo'
$$;

revoke all on function private.portal_client_id() from public, anon, authenticated;
revoke all on function private.portal_can_edit() from public, anon, authenticated;
revoke all on function private.portal_photo_count() from public, anon, authenticated;
grant execute on function private.portal_client_id() to authenticated;
grant execute on function private.portal_can_edit() to authenticated;
grant execute on function private.portal_photo_count() to authenticated;

-- ---------- grants + policies: new tables ----------
revoke all on public.client_portal_members, public.onboarding_invites, public.client_onboarding from anon, authenticated;
grant select, insert, update, delete on public.client_portal_members to authenticated;
grant select on public.onboarding_invites to authenticated;              -- admin-only policy below; writes only via functions
grant select, insert, update, delete on public.client_onboarding to authenticated;

drop policy if exists portal_members_select_own on public.client_portal_members;
create policy portal_members_select_own on public.client_portal_members
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists portal_members_admin on public.client_portal_members;
create policy portal_members_admin on public.client_portal_members
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists onboarding_invites_admin_select on public.onboarding_invites;
create policy onboarding_invites_admin_select on public.onboarding_invites
  for select to authenticated using (private.is_admin());

-- Members can read their own row. They have no UPDATE policy: answers, plan and status change only through
-- portal_save_step / portal_submit (SECURITY DEFINER), so plan, status and client_id can't be tampered with.
drop policy if exists client_onboarding_select_own on public.client_onboarding;
create policy client_onboarding_select_own on public.client_onboarding
  for select to authenticated using (client_id = private.portal_client_id());
drop policy if exists client_onboarding_admin on public.client_onboarding;
create policy client_onboarding_admin on public.client_onboarding
  for all to authenticated using (private.is_admin()) with check (private.is_admin());

-- ---------- admins can read billing records (clients cannot) ----------
grant select on public.client_subscriptions to authenticated;
drop policy if exists client_subscriptions_admin_select on public.client_subscriptions;
create policy client_subscriptions_admin_select on public.client_subscriptions
  for select to authenticated using (private.is_admin());

-- ---------- uploads: client_files rows ----------
-- Members manage only their own onboarding files: path clients/{client_id}/onboarding/{logo|photos}/{file}.
-- Logo up to 10 MB, photos are images up to 15 MB, max 40 photos. Locked once the onboarding is submitted.
grant select, insert, delete on public.client_files to authenticated;

drop policy if exists client_files_portal_select on public.client_files;
create policy client_files_portal_select on public.client_files
  for select to authenticated
  using (client_id = private.portal_client_id() and storage_path ~ ('^clients/' || client_id::text || '/onboarding/'));

drop policy if exists client_files_portal_insert on public.client_files;
create policy client_files_portal_insert on public.client_files
  for insert to authenticated
  with check (
    client_id = private.portal_client_id()
    and private.portal_can_edit()
    and uploaded_by = lower((select auth.jwt() ->> 'email'))
    and (
      (label = 'Onboarding: logo'
        and storage_path ~ ('^clients/' || client_id::text || '/onboarding/logo/[^/]+$')
        and size_bytes between 0 and 10 * 1024 * 1024)
      or
      (label = 'Onboarding: photo'
        and storage_path ~ ('^clients/' || client_id::text || '/onboarding/photos/[^/]+$')
        and mime_type like 'image/%'
        and size_bytes between 0 and 15 * 1024 * 1024
        and private.portal_photo_count() < 40)
    )
  );

drop policy if exists client_files_portal_delete on public.client_files;
create policy client_files_portal_delete on public.client_files
  for delete to authenticated
  using (
    client_id = private.portal_client_id()
    and private.portal_can_edit()
    and storage_path ~ ('^clients/' || client_id::text || '/onboarding/(logo|photos)/[^/]+$')
  );

-- ---------- uploads: storage objects in the existing private client-files bucket ----------
drop policy if exists client_files_portal_obj_insert on storage.objects;
create policy client_files_portal_obj_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'client-files'
    and private.portal_client_id() is not null
    and private.portal_can_edit()
    and name ~ ('^clients/' || private.portal_client_id()::text || '/onboarding/(logo|photos)/[^/]+$')
  );

drop policy if exists client_files_portal_obj_select on storage.objects;
create policy client_files_portal_obj_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'client-files'
    and private.portal_client_id() is not null
    and name ~ ('^clients/' || private.portal_client_id()::text || '/onboarding/')
  );

drop policy if exists client_files_portal_obj_delete on storage.objects;
create policy client_files_portal_obj_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'client-files'
    and private.portal_client_id() is not null
    and private.portal_can_edit()
    and name ~ ('^clients/' || private.portal_client_id()::text || '/onboarding/(logo|photos)/[^/]+$')
  );

notify pgrst, 'reload schema';
