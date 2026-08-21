import type { AppTab } from '@/shared/types/navigation.types'

/**
 * Tabs in the order they appear in the bottom bar.
 *
 * Single source of truth: the bar renders from this, and slide direction is
 * derived from index distance, so reordering here reorders both.
 */
export const TAB_ORDER = ['today', 'week', 'year', 'profile'] as const satisfies readonly AppTab[]

/** Route path for each tab. */
export const TAB_PATH: Record<AppTab, string> = {
  today: '/',
  week: '/week',
  year: '/year',
  profile: '/profile',
}

/** Visible label for each tab. */
export const TAB_LABEL: Record<AppTab, string> = {
  today: 'Today',
  week: 'Week',
  year: 'Year',
  profile: 'Profile',
}

/**
 * The tab `offset` steps away, wrapping around both ends.
 *
 * Used by swipe navigation, where the last tab continues into the first.
 *
 * @param tab - Tab to start from.
 * @param offset - Steps to move; negative goes left.
 * @returns The resulting tab, never out of range.
 *
 * @example
 * ```ts
 * tabAtOffset('profile', 1) // 'today'    — wraps past the end
 * tabAtOffset('today', -1)  // 'profile'  — wraps past the start
 * ```
 */
export function tabAtOffset(tab: AppTab, offset: number): AppTab {
  const index = TAB_ORDER.indexOf(tab)
  const next = (index + offset + TAB_ORDER.length) % TAB_ORDER.length

  return TAB_ORDER[next] ?? tab
}
