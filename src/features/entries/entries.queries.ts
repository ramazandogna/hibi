import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { QueryClient } from '@tanstack/vue-query'
import { keepPreviousData } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { clearEntry, listEntriesInRange, setEntry } from './entries.api'
import { entryKeys } from './entries.keys'
import type { Entry } from './entry.types'

/** A cached range plus the data it held, so a failed mutation can restore it. */
type EntrySnapshot = { queryKey: readonly unknown[]; data: Entry[] }

/**
 * Every cached range query whose window contains `dateKey`.
 *
 * Several ranges can be cached at once — Today asks for five days, Year for a
 * whole year — and a single toggle has to update all of them.
 */
function affectedRanges(queryClient: QueryClient, dateKey: string) {
  return queryClient
    .getQueryCache()
    .findAll({ queryKey: entryKeys.ranges() })
    .filter((query) => {
      const from = query.queryKey[2]
      const to = query.queryKey[3]

      return typeof from === 'string' && typeof to === 'string' && from <= dateKey && dateKey <= to
    })
}

/**
 * Applies `apply` to every cached range containing `dateKey`.
 *
 * @returns Snapshots taken before the write, for rollback.
 */
function patchRanges(
  queryClient: QueryClient,
  dateKey: string,
  apply: (entries: Entry[]) => Entry[],
): EntrySnapshot[] {
  const snapshots: EntrySnapshot[] = []

  for (const query of affectedRanges(queryClient, dateKey)) {
    const data = queryClient.getQueryData<Entry[]>(query.queryKey)
    if (!data) continue

    snapshots.push({ queryKey: query.queryKey, data })
    queryClient.setQueryData(query.queryKey, apply(data))
  }

  return snapshots
}

/** Entries for a date range, refetching when the range changes. */
export function useEntriesInRange(
  from: MaybeRefOrGetter<string>,
  to: MaybeRefOrGetter<string>,
  options: { keepPrevious?: boolean } = {},
) {
  return useQuery({
    queryKey: computed(() => entryKeys.range(toValue(from), toValue(to))),
    queryFn: () => listEntriesInRange(toValue(from), toValue(to)),
    ...(options.keepPrevious ? { placeholderData: keepPreviousData } : {}),
  })
}

/** Variables shared by both entry mutations. */
type EntryTarget = { habitId: string; dateKey: string }

/**
 * Marks a day, writing to every cached range before the request finishes.
 *
 * Four phases: cancel in-flight refetches, snapshot, write, restore on error
 * and revalidate on settle.
 */
export function useSetEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vars: EntryTarget & { value?: number; note?: string | null }) =>
      setEntry(vars.habitId, vars.dateKey, vars.value ?? 1, vars.note ?? null),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: entryKeys.ranges() })

      // A stand-in row. Its id and user_id never reach the server; onSettled
      // replaces the whole range with the real rows.
      const optimistic: Entry = {
        id: `optimistic-${vars.habitId}-${vars.dateKey}`,
        habit_id: vars.habitId,
        user_id: '',
        entry_date: vars.dateKey,
        value: vars.value ?? 1,
        note: vars.note ?? null,
        created_at: new Date().toISOString(),
      }

      const snapshots = patchRanges(queryClient, vars.dateKey, (entries) => [
        ...entries.filter(
          (entry) => !(entry.habit_id === vars.habitId && entry.entry_date === vars.dateKey),
        ),
        optimistic,
      ])

      return { snapshots }
    },

    onError: (_error, _vars, context) => {
      for (const snapshot of context?.snapshots ?? []) {
        queryClient.setQueryData(snapshot.queryKey, snapshot.data)
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: entryKeys.all }),
  })
}

/** Unmarks a day, removing it from every cached range first. */
export function useClearEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (vars: EntryTarget) => clearEntry(vars.habitId, vars.dateKey),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: entryKeys.ranges() })

      const snapshots = patchRanges(queryClient, vars.dateKey, (entries) =>
        entries.filter(
          (entry) => !(entry.habit_id === vars.habitId && entry.entry_date === vars.dateKey),
        ),
      )

      return { snapshots }
    },

    onError: (_error, _vars, context) => {
      for (const snapshot of context?.snapshots ?? []) {
        queryClient.setQueryData(snapshot.queryKey, snapshot.data)
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: entryKeys.all }),
  })
}

/**
 * Marks or unmarks a day depending on what is already there.
 *
 * Both underlying mutations share the same optimistic helper, so the UI only
 * needs one call and one pending flag.
 */
export function useToggleEntry() {
  const setMutation = useSetEntry()
  const clearMutation = useClearEntry()

  function toggle(target: EntryTarget, isMarked: boolean) {
    if (isMarked) {
      clearMutation.mutate(target)
    } else {
      setMutation.mutate(target)
    }
  }

  const isPending = computed(() => setMutation.isPending.value || clearMutation.isPending.value)

  return { toggle, isPending }
}
