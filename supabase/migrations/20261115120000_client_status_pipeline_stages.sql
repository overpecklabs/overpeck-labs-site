-- One-time data migration: legacy client statuses -> pipeline stages.
-- Not run automatically. Review, then apply in the Supabase SQL editor (or supabase db push).
-- Note: if a trigger stamps clients.status_changed_at on status changes, these rows will show
-- "days in stage" counted from when this runs.

begin;

update public.clients set status = 'client'   where status in ('active', 'paused');
update public.clients set status = 'old_client' where status = 'past';

commit;
