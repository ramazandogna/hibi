-- Let the database fill user_id from the JWT instead of trusting the client.
--
-- Keeps the API layer free of any auth/store dependency, and the value cannot
-- be spoofed. The not null constraint still applies: if auth.uid() is null
-- (no session), the insert fails.
alter table public.habits    alter column user_id set default auth.uid();
alter table public.entries   alter column user_id set default auth.uid();
alter table public.day_notes alter column user_id set default auth.uid();
