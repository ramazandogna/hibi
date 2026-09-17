-- Who has Plus.
--
-- Deliberately not a column on profiles: users can update their own profile
-- row, so an `is_plus` there would be one devtools call away from free.
--
-- This table has a read policy and nothing else. Rows are written only by the
-- billing webhook, which runs with the service role and bypasses RLS; there is
-- no path from the browser to a row it could grant itself.
create table public.entitlements (
  user_id              uuid primary key references auth.users(id) on delete cascade,
  plan                 text not null check (plan in ('plus_monthly', 'plus_yearly', 'plus_lifetime')),
  status               text not null check (status in ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  -- Null for a lifetime purchase, which never ends.
  current_period_end   timestamptz,
  provider             text not null,
  provider_customer_id text,
  provider_sub_id      text unique,
  updated_at           timestamptz not null default now()
);

alter table public.entitlements enable row level security;

create policy "own entitlement read" on public.entitlements
  for select using ( (select auth.uid()) = user_id );

-- Webhook deliveries, keyed by the provider's event id. Retries are normal, so
-- a delivery seen before must be a no-op rather than a second grant.
create table public.billing_events (
  id          text primary key,
  received_at timestamptz not null default now(),
  payload     jsonb not null
);

-- RLS on and no policies: service role only.
alter table public.billing_events enable row level security;

-- The one answer to "does this person have Plus", for anything that has to be
-- enforced rather than displayed. Mirrors isPlusActive() in
-- src/features/premium/entitlement.ts, which only decides what to show.
--
-- security definer so it can be called from other policies and triggers later;
-- it takes no user id, so it can only ever answer for the caller.
create function public.has_plus()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.entitlements e
    where e.user_id = (select auth.uid())
      and e.status in ('active', 'trialing', 'past_due')
      and (e.current_period_end is null or e.current_period_end > now())
  );
$$;

revoke execute on function public.has_plus() from public, anon;
grant execute on function public.has_plus() to authenticated;
