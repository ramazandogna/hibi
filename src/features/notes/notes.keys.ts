/**
 * Cache keys for day notes.
 *
 * Mirrors `entryKeys`: the range is part of the key, because Today, Week and
 * Year each ask for a different window.
 *
 * @example
 * ```ts
 * noteKeys.all                                  // ['notes']
 * noteKeys.ranges()                             // ['notes', 'range']
 * noteKeys.range('2026-08-01', '2026-08-31')    // ['notes', 'range', ...]
 * ```
 */
export const noteKeys = {
  all: ['notes'] as const,
  ranges: () => [...noteKeys.all, 'range'] as const,
  range: (from: string, to: string) => [...noteKeys.ranges(), from, to] as const,
}
