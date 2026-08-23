/**
 * Cache keys for entry queries.
 *
 * The date range is part of the key on purpose: Today asks for five days, Week
 * for seven, Year for 365. If they shared one key, opening Year would overwrite
 * the cache Today is reading and the screens would fight each other.
 *
 * @example
 * ```ts
 * entryKeys.all                        // ['entries']
 * entryKeys.ranges()                   // ['entries', 'range']
 * entryKeys.range('2026-08-19', '2026-08-23')
 * //                                   → ['entries', 'range', '2026-08-19', '2026-08-23']
 * ```
 */
export const entryKeys = {
  all: ['entries'] as const,
  ranges: () => [...entryKeys.all, 'range'] as const,
  range: (from: string, to: string) => [...entryKeys.ranges(), from, to] as const,
}
