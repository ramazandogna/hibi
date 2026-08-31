-- Web Push subscriptions.
--
-- One row per browser, not per user: the same account on a phone and a laptop
-- has two endpoints, and each has to be pushed to separately.
create table public.push_subscriptions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users(id) on delete cascade,

  -- The push service URL the browser handed us, plus the two keys the payload
  -- is encrypted with. Opaque to us; only the push service can use them.
  endpoint      text not null,
  p256dh        text not null,
  auth          text not null,

  -- Reminders are sent by a server that has no session, so the two things the
  -- copy depends on travel with the subscription.
  locale        text not null default 'en',
  -- IANA name, e.g. 'Europe/Istanbul'. 08:00 has to mean 08:00 where the
  -- person is, not where the database happens to run.
  time_zone     text not null default 'UTC',

  -- Send-once bookkeeping. The cron runs hourly and would otherwise re-send
  -- for every hour the local time still matches.
  last_morning_on date,
  last_evening_on date,

  created_at    timestamptz not null default now(),

  -- Re-subscribing on the same browser must update the row, not add a second.
  constraint push_subscriptions_endpoint_key unique (endpoint)
);

-- The sender scans by local hour across all users; the reader only ever asks
-- for its own rows.
create index push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

-- Same rule as every other table: you can only see and change your own rows.
-- The Edge Function reads with the service role, which bypasses RLS.
create policy "own subscriptions read" on public.push_subscriptions
  for select using ( (select auth.uid()) = user_id );
create policy "own subscriptions insert" on public.push_subscriptions
  for insert with check ( (select auth.uid()) = user_id );
create policy "own subscriptions update" on public.push_subscriptions
  for update using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "own subscriptions delete" on public.push_subscriptions
  for delete using ( (select auth.uid()) = user_id );
