create table if not exists public.app_snapshots (
  key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_snapshots enable row level security;

revoke all on table public.app_snapshots from anon, authenticated;
grant all on table public.app_snapshots to service_role;
