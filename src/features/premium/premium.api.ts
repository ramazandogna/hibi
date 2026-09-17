import { supabase } from '@/shared/lib/supabase'
import { toAppError } from 'rei-kit'
import type { Entitlement } from './entitlement'

/**
 * The signed-in user's entitlement row, or null when there is none.
 *
 * No filter: the table's only policy is "read your own row", so the single row
 * this can see is always the right one.
 */
export async function getEntitlement(): Promise<Entitlement | null> {
  const { data, error } = await supabase.from('entitlements').select('*').maybeSingle()

  if (error) throw toAppError(error)
  return data
}
