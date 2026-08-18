-- Önce RLS'i aç. Bu satırlar olmadan aşağıdaki politikalar hiçbir işe yaramaz.
alter table public.profiles  enable row level security;
alter table public.habits    enable row level security;
alter table public.entries   enable row level security;
alter table public.day_notes enable row level security;

-- profiles: sadece kendi satırını gör ve güncelle.
-- insert politikası YOK — satırı handle_new_user trigger'ı (security definer) açıyor.
create policy "own profile read"   on public.profiles
  for select using ( (select auth.uid()) = id );
create policy "own profile update" on public.profiles
  for update using ( (select auth.uid()) = id ) with check ( (select auth.uid()) = id );

-- habits: dört işlem, aynı kural
create policy "own habits read"   on public.habits
  for select using ( (select auth.uid()) = user_id );
create policy "own habits insert" on public.habits
  for insert with check ( (select auth.uid()) = user_id );
create policy "own habits update" on public.habits
  for update using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "own habits delete" on public.habits
  for delete using ( (select auth.uid()) = user_id );

-- entries
create policy "own entries read"   on public.entries
  for select using ( (select auth.uid()) = user_id );
create policy "own entries insert" on public.entries
  for insert with check ( (select auth.uid()) = user_id );
create policy "own entries update" on public.entries
  for update using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
create policy "own entries delete" on public.entries
  for delete using ( (select auth.uid()) = user_id );

-- day_notes: dört işlemin hepsi aynı kurala uyduğu için tek "for all" politikası
create policy "own notes all" on public.day_notes
  for all using ( (select auth.uid()) = user_id ) with check ( (select auth.uid()) = user_id );
