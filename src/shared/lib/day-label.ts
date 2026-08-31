import { t } from '@/shared/i18n'
import { addDays, fromDateKey } from './date'
import { formatDate } from './format'

/**
 * A short name for a day, relative to today.
 *
 * "Today" and "Yesterday" are worth spelling out — they are the two a user
 * actually reaches for. Anything older gets its weekday, which inside a
 * five-day window is unambiguous and, unlike a date, stays two or three
 * characters in every language the app speaks.
 *
 * @param dateKey - The day to label (`YYYY-MM-DD`).
 * @param today - Today's key, passed in so the caller controls the clock.
 *
 * @example
 * ```ts
 * relativeDayLabel('2026-08-31', '2026-08-31') // 'Today'
 * relativeDayLabel('2026-08-28', '2026-08-31') // 'Fri'
 * ```
 */
export function relativeDayLabel(dateKey: string, today: string): string {
  if (dateKey === today) return t('day.today')
  if (dateKey === addDays(today, -1)) return t('day.yesterday')

  return formatDate(fromDateKey(dateKey), { weekday: 'short' })
}

/**
 * The same label, sized for a 28px column above a day square.
 *
 * Only English needs the abbreviation — "Yesterday" is nine characters where
 * Dün, 昨日 and 昨天 are two or three — but the key exists in every locale so
 * the lookup never silently falls back to another language.
 */
export function shortDayLabel(dateKey: string, today: string): string {
  if (dateKey === today) return t('day.today')
  if (dateKey === addDays(today, -1)) return t('day.yesterdayShort')

  return formatDate(fromDateKey(dateKey), { weekday: 'short' })
}
