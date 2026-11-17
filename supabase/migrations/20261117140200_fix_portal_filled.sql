-- Overpeck Labs: fix private.portal_filled so unanswered (missing / NULL) values count as empty.
-- Run after 20261117140100_client_portal_functions.sql. Safe to run more than once.
--
-- Bug: the old version used "case jsonb_typeof(v) ... when null then false". jsonb_typeof(NULL) is NULL, and a
-- simple CASE compares with "=", which never matches NULL, so a missing key fell through to "else true" and
-- portal_submit accepted onboardings with required answers missing.

create or replace function private.portal_filled(v jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case coalesce(jsonb_typeof(v), 'null')
    when 'string' then btrim(v #>> '{}') <> ''
    when 'array' then jsonb_array_length(v) > 0
    when 'null' then false
    else true
  end
$$;

revoke all on function private.portal_filled(jsonb) from public, anon, authenticated;
