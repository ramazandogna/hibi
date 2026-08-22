import { supabase } from '@/shared/lib/supabase'
import { toAppError } from '@/shared/lib/app-error'
import type { Habit, HabitPatch, NewHabit } from './habit.types'

/**
 * Data access for habits.
 *
 * Pure async functions — no Vue, no Pinia, no vue-query. Every function either
 * resolves with data or throws an `AppError`, so callers can use plain
 * try/catch and the whole file is testable without mounting anything.
 */

/** Active habits, in the user's chosen order. */
export async function listHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .is('archived_at', null)
    .order('sort_order', { ascending: true })

  if (error) throw toAppError(error)
  return data
}

/** Archived habits, most recently archived first. */
export async function listArchivedHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .not('archived_at', 'is', null)
    .order('archived_at', { ascending: false })

  if (error) throw toAppError(error)
  return data
}

/** Creates a habit and returns the stored row, including database defaults. */
export async function createHabit(input: NewHabit): Promise<Habit> {
  const { data, error } = await supabase.from('habits').insert(input).select().single()

  if (error) throw toAppError(error)
  return data
}

/** Applies a partial update and returns the updated row. */
export async function updateHabit(id: string, patch: HabitPatch): Promise<Habit> {
  const { data, error } = await supabase.from('habits').update(patch).eq('id', id).select().single()

  if (error) throw toAppError(error)
  return data
}

/** Hides a habit from all lists without losing its entries. Reversible. */
export async function archiveHabit(id: string): Promise<void> {
  const { error } = await supabase
    .from('habits')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw toAppError(error)
}

/** Permanently deletes a habit. Its entries go with it via cascade. */
export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id)

  if (error) throw toAppError(error)
}

/**
 * Writes a new order for the given habits in one atomic call.
 *
 * Delegates to the `reorder_habits` Postgres function: N separate updates could
 * fail halfway and leave the list half-sorted.
 *
 * @param ids - Habit ids in their new order; index becomes `sort_order`.
 */
export async function reorderHabits(ids: string[]): Promise<void> {
  const { error } = await supabase.rpc('reorder_habits', { ids })

  if (error) throw toAppError(error)
}

/** Brings an archived habit back into the active list. */
export async function unarchiveHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').update({ archived_at: null }).eq('id', id)

  if (error) throw toAppError(error)
}

/**
 * How many entries a habit has.
 *
 * Used by the delete confirmation so the user is told exactly how much history
 * is about to disappear, instead of a vague "are you sure?".
 *
 * @param id - Habit id.
 * @returns Row count; `0` when the habit has never been marked.
 */
export async function countHabitEntries(id: string): Promise<number> {
  const { count, error } = await supabase
    .from('entries')
    .select('id', { count: 'exact', head: true })
    .eq('habit_id', id)

  if (error) throw toAppError(error)
  return count ?? 0
}
