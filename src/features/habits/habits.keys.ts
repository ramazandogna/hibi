/** Which slice of habits a list query is showing. */
export type HabitListScope = 'active' | 'archived'

/**
 * Cache keys for habit queries, built as a hierarchy.
 *
 * Every key starts with the parent's key, so vue-query's prefix matching lets
 * you invalidate a whole branch at once instead of listing keys by hand.
 *
 * @example
 * ```ts
 * habitKeys.all            // ['habits']
 * habitKeys.lists()        // ['habits', 'list']
 * habitKeys.list('active') // ['habits', 'list', 'active']
 * habitKeys.detail(id)     // ['habits', 'detail', '<id>']
 * ```
 *
 * @example
 * ```ts
 * // after creating a habit: refresh every list, leave details alone
 * queryClient.invalidateQueries({ queryKey: habitKeys.lists() })
 *
 * // after deleting: nuke everything habit-related
 * queryClient.invalidateQueries({ queryKey: habitKeys.all })
 * ```
 */
export const habitKeys = {
  all: ['habits'] as const,
  lists: () => [...habitKeys.all, 'list'] as const,
  list: (scope: HabitListScope) => [...habitKeys.lists(), scope] as const,
  details: () => [...habitKeys.all, 'detail'] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
}
