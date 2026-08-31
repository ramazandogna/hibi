import { supabase } from '@/shared/lib/supabase'
import { toAppError } from 'rei-kit'
import type { DayNote, NewDayNote } from './note.types'

/**
 * Data access for day notes.
 *
 * Pure async functions — no Vue, no Pinia, no vue-query, same rule as the other
 * API files.
 */

/** Notes in a date range, for the calendar's note markers. */
export async function listNotesInRange(from: string, to: string): Promise<DayNote[]> {
  const { data, error } = await supabase
    .from('day_notes')
    .select('*')
    .gte('entry_date', from)
    .lte('entry_date', to)

  if (error) throw toAppError(error)
  return data
}

/**
 * Writes the note for a day, creating or replacing it.
 *
 * `user_id` is left to the column default (`auth.uid()`), so the API layer stays
 * free of any auth dependency. `updated_at` is set explicitly: the column
 * default only applies on insert, so an edit would keep the original timestamp.
 *
 * @param dateKey - Local day key from `toDateKey`.
 * @param body - Note text, up to 500 characters.
 * @returns The stored row.
 */
export async function upsertNote(dateKey: string, body: string): Promise<DayNote> {
  const payload: NewDayNote = {
    entry_date: dateKey,
    body,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('day_notes')
    .upsert(payload, { onConflict: 'user_id,entry_date' })
    .select()
    .single()

  if (error) throw toAppError(error)
  return data
}

/** Removes a day's note. An empty note is deleted, not stored as `''`. */
export async function deleteNote(dateKey: string): Promise<void> {
  const { error } = await supabase.from('day_notes').delete().eq('entry_date', dateKey)

  if (error) throw toAppError(error)
}
