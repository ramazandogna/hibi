import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

import { isPlusActive } from './entitlement'
import { getEntitlement } from './premium.api'

export const entitlementKey = ['entitlement'] as const

/**
 * Whether the user has Plus, for deciding what to show.
 *
 * Any failure reads as "no Plus" and is not retried: the free experience is the
 * complete one, so a missing table or a dropped request costs nothing visible.
 */
export function usePlus() {
  const query = useQuery({
    queryKey: entitlementKey,
    queryFn: getEntitlement,
    staleTime: 10 * 60_000,
    retry: false,
  })

  const hasPlus = computed(() => isPlusActive(query.data.value ?? null, new Date()))

  return { hasPlus }
}
