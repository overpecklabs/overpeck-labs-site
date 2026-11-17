-- Free-mockup form: optional "Want any of these on your site?" feature picks.
-- Not run automatically. Apply in the Supabase SQL editor (or supabase db push).
-- Safe to run more than once. The existing anon INSERT-only RLS policy covers the new column; the grant
-- below only matters if insert privileges were granted per column (harmless otherwise).

alter table public.mockup_requests
  add column if not exists features text[] not null default '{}';

comment on column public.mockup_requests.features is
  'Optional features picked on /free-mockup (AI phone receptionist, website AI chat, cost calculator, ...).';

grant insert (features) on public.mockup_requests to anon;

-- Make PostgREST see the new column right away.
notify pgrst, 'reload schema';
