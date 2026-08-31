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
