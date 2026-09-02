-- Half-hourly trigger for the reminder sender.
--
-- The slots moved from exact hours (08:00, 21:00) to windows (08:30-12:00,
-- 21:00-23:00), so the trigger has to fire inside them: 08:30 is unreachable on
-- a schedule that only wakes at the top of the hour.
--
-- Sending stays idempotent per person per slot per day (last_morning_on /
-- last_evening_on), so twice the runs is not twice the notifications -- the
-- extra ones simply find the slot already claimed.
--
-- cron.schedule upserts on the job name, so this replaces the hourly job from
-- 0006 rather than adding a second one beside it.
select cron.schedule(
  'hibi-reminders',
  '*/30 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'reminder_endpoint'),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-reminder-secret',
      (select decrypted_secret from vault.decrypted_secrets where name = 'reminder_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
