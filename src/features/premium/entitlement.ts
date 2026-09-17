import type { Tables } from '@/shared/types/database.types'

export type Entitlement = Tables<'entitlements'>

/** Statuses under which Plus is on. `past_due` keeps it until the provider gives up. */
const ACTIVE_STATUSES: readonly string[] = ['active', 'trialing', 'past_due']

/**
 * Whether an entitlement row grants Plus right now.
 *
 * This decides what the interface shows, never what a user may do: the same
 * rule lives in `public.has_plus()`, and anything worth protecting asks the
 * database.
 *
 * @param entitlement The user's row, or null when there is none.
 * @param now The moment to judge against.
 *
 * @example
 * ```ts
 * isPlusActive({ status: 'active', current_period_end: null, … }, new Date()) // true — lifetime
 * isPlusActive(null, new Date()) // false
 * ```
 */
export function isPlusActive(
  entitlement: Pick<Entitlement, 'status' | 'current_period_end'> | null,
  now: Date,
): boolean {
  if (!entitlement || !ACTIVE_STATUSES.includes(entitlement.status)) return false
  if (entitlement.current_period_end === null) return true

  return new Date(entitlement.current_period_end).getTime() > now.getTime()
}
