-- ============ ENUM: üç takip modu ============
create type habit_kind as enum ('build', 'quit', 'scale');

-- ============ profiles ============
create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  display_name   text,
  theme          text not null default 'system',
  week_starts_on smallint not null default 1,   -- 1 = Pazartesi
  created_at     timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ habits ============
create table public.habits (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null check (char_length(name) between 1 and 40),
  kind            habit_kind not null,
  icon            text not null default 'circle',
  target_per_week smallint not null default 7 check (target_per_week between 1 and 7),
  sort_order      smallint not null default 0,
  archived_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index habits_user_active_idx
  on public.habits (user_id, sort_order)
  where archived_at is null;

-- ============ entries ============
create table public.entries (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  value      smallint not null default 1 check (value between 1 and 5),
  note       text check (char_length(note) <= 280),
  created_at timestamptz not null default now(),
  constraint entries_one_per_day unique (habit_id, entry_date)
);

create index entries_user_date_idx on public.entries (user_id, entry_date desc);
create index entries_habit_date_idx on public.entries (habit_id, entry_date desc);

-- ============ day_notes (Faz 7) ============
create table public.day_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  body       text not null check (char_length(body) <= 500),
  updated_at timestamptz not null default now(),
  constraint day_notes_one_per_day unique (user_id, entry_date)
);
