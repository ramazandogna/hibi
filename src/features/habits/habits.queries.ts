import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import {
  archiveHabit,
  createHabit,
  deleteHabit,
  listArchivedHabits,
  listHabits,
  reorderHabits,
  unarchiveHabit,
  updateHabit,
} from './habits.api'
import { habitKeys } from './habits.keys'
import type { Habit, HabitPatch } from './habit.types'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { getHabit } from '../stats/use-habit-stats'

/**
 * Vue bindings for the habits API.
 *
 * The API layer stays framework-free; this file is the only place that knows
 * about vue-query. Components read from here and never call the API directly.
 */

/** Active habits, cached and refetched by vue-query. */
export function useHabits() {
  return useQuery({
    queryKey: habitKeys.list('active'),
    queryFn: listHabits,
  })
}

/** Creates a habit, then refreshes every habit list. */
export function useCreateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitKeys.lists() }),
  })
}

/** Updates a habit, writing the fresh row straight into its detail cache. */
export function useUpdateHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: HabitPatch }) => updateHabit(id, patch),
    onSuccess: (habit) => {
      queryClient.setQueryData(habitKeys.detail(habit.id), habit)
      return queryClient.invalidateQueries({ queryKey: habitKeys.lists() })
    },
  })
}

/** Archives a habit so it drops out of the active list. */
export function useArchiveHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: archiveHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitKeys.lists() }),
  })
}

/** Permanently deletes a habit and drops all cached habit data. */
export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitKeys.all }),
  })
}

/** Archived habits, most recently archived first. */
export function useArchivedHabits() {
  return useQuery({
    queryKey: habitKeys.list('archived'),
    queryFn: listArchivedHabits,
  })
}

/** Restores an archived habit. */
export function useUnarchiveHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unarchiveHabit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: habitKeys.lists() }),
  })
}

/**
 * Reorders habits, moving the row in the cache before the request finishes.
 *
 * The one place in this feature that writes optimistically: an arrow tap has to
 * move the row now, and waiting a round trip would make repeated taps fight
 * each other. The snapshot in `onMutate` is restored if the call fails.
 */
export function useReorderHabits() {
  const queryClient = useQueryClient()
  const activeKey = habitKeys.list('active')

  return useMutation({
    mutationFn: reorderHabits,
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: activeKey })
      const previous = queryClient.getQueryData<Habit[]>(activeKey)

      if (previous) {
        const byId = new Map(previous.map((habit) => [habit.id, habit]))
        const next = ids
          .map((id) => byId.get(id))
          .filter((habit): habit is Habit => habit !== undefined)

        queryClient.setQueryData(activeKey, next)
      }

      return { previous }
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(activeKey, context.previous)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: habitKeys.lists() }),
  })
}

/** One habit, cached under its own detail key. */
export function useHabit(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => habitKeys.detail(toValue(id))),
    queryFn: () => getHabit(toValue(id)),
  })
}
