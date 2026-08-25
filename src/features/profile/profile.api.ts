import { supabase } from '@/shared/lib/supabase'
import { toAppError } from '@/shared/lib/app-error'
import type { Profile, ProfilePatch } from './profile.types'

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
  const { data, error } = await supabase.from('profiles').update(patch).select().single()

  if (error) throw toAppError(error)
  return data
}
