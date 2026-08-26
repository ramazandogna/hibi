import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

import { getProfile, updateProfile } from './profile.api'
import { profileKeys } from './profile.keys'
import type { WeekStart } from '@/shared/lib/date'

/**
 * Vue bindings for the profile.
 *
 * `staleTime: Infinity` because preferences only change when this app changes
 * them, and every mutation writes the fresh row straight back into the cache.
 */
export function useProfile(enabled?: MaybeRefOrGetter<boolean>) {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: getProfile,
    staleTime: Infinity,
    ...(enabled === undefined ? {} : { enabled: computed(() => toValue(enabled)) }),
  })
}

/** Saves preferences and puts the returned row in the cache — no refetch. */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => queryClient.setQueryData(profileKeys.current(), profile),
  })
}

/**
 * The user's week start, defaulting to Monday.
 *
 * The column is a `smallint`, so anything other than 0 is treated as Monday
 * rather than trusting the value blindly.
 */
export function useWeekStart() {
  const { data } = useProfile()

  return computed<WeekStart>(() => (data.value?.week_starts_on === 0 ? 0 : 1))
}
