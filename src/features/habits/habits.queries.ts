import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

import { archiveHabit, createHabit, deleteHabit, listHabits, updateHabit } from './habits.api'
import { habitKeys } from './habits.keys'
import type { HabitPatch } from './habit.types'

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
