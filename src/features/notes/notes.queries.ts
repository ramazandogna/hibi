import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { deleteNote, listNotesInRange, upsertNote } from './notes.api'
import { noteKeys } from './notes.keys'

/**
 * Vue bindings for day notes.
 *
 * The API layer stays framework-free; this file is the only place that knows
 * about vue-query.
 */

/** Notes for a date range, refetching when the range changes. */
export function useNotesInRange(from: MaybeRefOrGetter<string>, to: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(() => noteKeys.range(toValue(from), toValue(to))),
    queryFn: () => listNotesInRange(toValue(from), toValue(to)),
  })
}

/**
 * Saves a day's note, or removes it when the text is blank.
 *
 * One mutation covers both because "no note" and "empty note" are the same
 * thing; storing `''` would leave a row that shows a marker on the calendar.
 */
export function useSaveNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ dateKey, body }: { dateKey: string; body: string }) => {
      const trimmed = body.trim()

      return trimmed ? upsertNote(dateKey, trimmed).then(() => undefined) : deleteNote(dateKey)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  })
}
