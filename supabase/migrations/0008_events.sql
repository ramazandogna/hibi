-- Product events.
--
-- Just enough to answer the questions the monetization audit depends on --
-- does a first habit get marked, do people come back, do notes get written --
-- without a third-party analytics script reading a page full of habit names.
--
-- Nothing personal goes in here by design: no habit name, no note text. The
-- client only sends an event name and a few flat properties, and the name is
-- constrained so a free-text value cannot slip in through it.
create table public.events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null check (name ~ '^[a-z_]{3,40}$'),
  props      jsonb not null default '{}'::jsonb check (jsonb_typeof(props) = 'object'),
  created_at timestamptz not null default now()
);

create index events_name_created_idx on public.events (name, created_at desc);
create index events_user_created_idx on public.events (user_id, created_at desc);

alter table public.events enable row level security;

-- Write-only from the client. Reading happens in the dashboard with the
-- service role; nobody needs to read their own event log back.
create policy "own events insert" on public.events
  for insert with check ( (select auth.uid()) = user_id );
