-- Fills every habit of one account with two years of plausible history.
--
-- Used twice: to profile the year view under real load (~5.8k candidate rows
-- for 8 habits), and to keep the demo account looking lived-in.
--
-- Replace the email before running. Safe to re-run: the unique constraint on
-- (habit_id, entry_date) makes existing days no-ops.
insert into public.entries (habit_id, user_id, entry_date, value)
select
  h.id,
  h.user_id,
  d::date,
  case when h.kind = 'scale' then 1 + floor(random() * 5)::int else 1 end
from public.habits h
cross join generate_series(
  current_date - interval '730 days',
  current_date,
  interval '1 day'
) d
where h.user_id = (select id from auth.users where email = 'demo1@example.com')
  -- Leave gaps: a perfect streak does not look like real usage.
  and random() < 0.7
on conflict (habit_id, entry_date) do nothing;

-- Undo:
-- delete from public.entries
-- where user_id = (select id from auth.users where email = 'demo1@example.com');
