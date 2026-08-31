-- Hourly trigger for the reminder sender.
--
-- Hourly, not twice daily: 08:00 is a different instant in every time zone, so
-- the function wakes up each hour and asks who it is 08:00 or 21:00 for right
-- now. Sending is idempotent per person per day (last_morning_on /
-- last_evening_on), so an extra run is harmless.
--
-- Before this works, add two secrets in the dashboard under Vault:
--
--   reminder_endpoint  https://<project-ref>.supabase.co/functions/v1/send-reminders
--   reminder_secret    <the same value as the REMINDER_SECRET function secret>
--
-- They live in Vault rather than in this file so the file can be committed.
-- Enable both from Dashboard -> Database -> Extensions before running this.
-- These lines are a no-op once they are on; left in so a fresh project fails
-- here with a clear message rather than at cron.schedule with an obscure one.
-- pg_cron gets no schema clause: it installs its own `cron` schema, and forcing
-- it elsewhere is what makes this step fail on Supabase.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'hibi-reminders',
  '0 * * * *',
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
