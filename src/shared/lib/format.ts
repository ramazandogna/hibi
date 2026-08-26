import { intlLocale } from '@/shared/i18n'

/**
 * `Intl.DateTimeFormat` is expensive to construct, so instances are cached per
 * locale and option set. The key includes the locale, which is what lets the
 * cache survive a language change instead of returning stale formatters.
 */
const cache = new Map<string, Intl.DateTimeFormat>()

/**
 * Formats a date in the active language.
 *
 * Reading `intlLocale` here is deliberate: called from a `computed`, the result
 * re-evaluates when the user switches language.
 *
 * @param date - Date to format.
 * @param options - Passed straight to `Intl.DateTimeFormat`.
 *
 * @example
 * ```ts
 * formatDate(fromDateKey('2026-08-25'), { weekday: 'narrow' }) // 'T'
 * ```
 */
export function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  const locale = intlLocale.value
  const key = `${locale}:${JSON.stringify(options)}`

  let formatter = cache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, options)
    cache.set(key, formatter)
  }

  return formatter.format(date)
}
