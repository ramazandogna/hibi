import { ref } from 'vue'

import { track } from '@/shared/lib/track'

/** Where the sheet was opened from, so the paywall's reach can be measured. */
export type PlusEntryPoint = 'topbar' | 'insights'

const isOpen = ref(false)

/**
 * The single Plus sheet, opened from anywhere.
 *
 * Module state rather than a store: one boolean shared by a top-bar button, a
 * locked card and the sheet itself does not need Pinia.
 */
export function usePlusSheet() {
  function openPlus(from: PlusEntryPoint) {
    track('plus_opened', { from })
    isOpen.value = true
  }

  return { isOpen, openPlus }
}
