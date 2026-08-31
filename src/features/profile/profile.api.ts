import { supabase } from '@/shared/lib/supabase'
import { toAppError } from 'rei-kit'
import type { Profile, ProfilePatch } from './profile.types'
import type { Tables } from '@/shared/types/database.types'

/**
 * Data access for the signed-in user's profile.
 *
 * No id is passed anywhere: RLS restricts both statements to `auth.uid() = id`,
 * so "the only row I can see" is always the right one.
 */

/** The current user's profile row. */
export async function getProfile(): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').single()

  if (error) throw toAppError(error)
  return data
}

/** Applies a partial update and returns the stored row. */
export async function updateProfile(patch: ProfilePatch): Promise<Profile> {
  // PostgREST rejects an UPDATE with no filter, so match every row the policy
  // lets us see — which RLS has already narrowed to this user's single row.
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .not('id', 'is', null)
    .select()
    .single()

  if (error) throw toAppError(error)
  return data
}

/** Everything one account owns, as a single JSON-friendly object. */
export type ExportBundle = {
  exportedAt: string
  profile: Tables<'profiles'> | null
  habits: Tables<'habits'>[]
  entries: Tables<'entries'>[]
  dayNotes: Tables<'day_notes'>[]
}

/**
 * Reads every table the user owns, in parallel.
 *
 * No filters are needed: RLS already scopes each query to the signed-in user.
 */
export async function exportEverything(): Promise<ExportBundle> {
  const [profile, habits, entries, dayNotes] = await Promise.all([
    supabase.from('profiles').select('*').single(),
    supabase.from('habits').select('*').order('sort_order'),
    supabase.from('entries').select('*').order('entry_date'),
    supabase.from('day_notes').select('*').order('entry_date'),
  ])

  const failed = [profile, habits, entries, dayNotes].find((result) => result.error)
  if (failed?.error) throw toAppError(failed.error)

  return {
    exportedAt: new Date().toISOString(),
    profile: profile.data,
    habits: habits.data ?? [],
    entries: entries.data ?? [],
    dayNotes: dayNotes.data ?? [],
  }
}

/**
 * Deletes the user's data, keeping the account itself.
 *
 * Supabase does not let a client delete its own auth user — that needs the
 * service role, which must never reach the browser. Removing the data and
 * saying so plainly is the honest v1 answer; an Edge Function can finish the
 * job later.
 *
 * Entries go with the habits through `on delete cascade`.
 */
export async function deleteAllData(): Promise<void> {
  const notes = await supabase.from('day_notes').delete().not('id', 'is', null)
  if (notes.error) throw toAppError(notes.error)

  const habits = await supabase.from('habits').delete().not('id', 'is', null)
  if (habits.error) throw toAppError(habits.error)
}
