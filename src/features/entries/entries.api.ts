import { supabase } from '@/shared/lib/supabase'
import { toAppError } from 'rei-kit'
import { ENTRY_COLUMNS } from './entry.types'
import type { Entry, NewEntry } from './entry.types'

/**
 * Data access for entries.
 *
 * Pure async functions — no Vue, no Pinia, no vue-query, same rule as
 * `habits.api.ts`.
 */

/**
 * Every entry in a date range, for all habits at once.
 *
 * One query per screen, not one per habit: rendering twelve habits must not
 * mean twelve requests. Callers turn the flat list into a lookup map.
 *
 * @param from - First day, inclusive (`YYYY-MM-DD`).
 * @param to - Last day, inclusive.
 */
export async function listEntriesInRange(from: string, to: string): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select(ENTRY_COLUMNS)
    .gte('entry_date', from)
    .lte('entry_date', to)
    .order('entry_date', { ascending: true })

  if (error) throw toAppError(error)
  return data
}

/**
 * Marks a day, creating the row or overwriting the existing one.
 *
 * Uses `upsert` against the `entries_one_per_day` constraint, so a double tap
 * or two open tabs can never produce two rows for the same day.
 *
 * @param habitId - Habit being marked.
 * @param dateKey - Local day key from `toDateKey`.
 * @param value - 1 for build/quit, 1-5 for scale.
 * @param note - Optional per-entry note.
 * @returns The stored row, including database defaults.
 */
export async function setEntry(
  habitId: string,
  dateKey: string,
  value = 1,
  note: string | null = null,
): Promise<Entry> {
  const payload: NewEntry = { habit_id: habitId, entry_date: dateKey, value, note }

  const { data, error } = await supabase
    .from('entries')
    .upsert(payload, { onConflict: 'habit_id,entry_date' })
    .select(ENTRY_COLUMNS)
    .single()

  if (error) throw toAppError(error)
  return data
}

/**
 * Unmarks a day by deleting the row.
 *
 * There is no "not done" row by design: absence is the negative. That keeps the
 * table roughly 365x smaller and makes undo a plain DELETE.
 */
export async function clearEntry(habitId: string, dateKey: string): Promise<void> {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('habit_id', habitId)
    .eq('entry_date', dateKey)

  if (error) throw toAppError(error)
}
