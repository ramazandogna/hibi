-- Reorder a user's habits in one atomic statement.
--
-- The client sends the habit ids in their new order; ordinality turns that
-- array into (id, position) rows, so a single UPDATE rewrites every sort_order.
-- Doing it as N round trips would leave the list half-sorted if one call fails.
--
-- security invoker (the default) is deliberate: the function runs as the caller,
-- so RLS still applies and a user can only reorder their own rows.
create function public.reorder_habits(ids uuid[])
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.habits as h
  set sort_order = new_order.ord
  from unnest(ids) with ordinality as new_order(id, ord)
  where h.id = new_order.id;
$$;

grant execute on function public.reorder_habits(uuid[]) to authenticated;
