import { readonly, ref } from 'vue'

import type { AppTab } from '@/shared/types/navigation.types'
import { TAB_ORDER } from './tabs'

/** Which way the screens slide during a tab change. */
export type SlideDirection = 'forward' | 'backward' | 'none'

const direction = ref<SlideDirection>('none')
let override: SlideDirection | null = null

/** Direction of the current tab change. Read by the route transition. */
export const slideDirection = readonly(direction)

/**
 * Pins the direction of the next navigation, ignoring tab order.
 *
 * Swipes need this: moving from the last tab to the first wraps around, but
 * the motion is still forward, so index comparison would give the wrong answer.
 * Consumed once, then cleared.
 *
 * @example
 * ```ts
 * forceSlideDirection('forward')
 * router.push(TAB_PATH[tabAtOffset(current, 1)])
 * ```
 */
export function forceSlideDirection(next: SlideDirection): void {
  override = next
}

/**
 * Resolves the direction for a navigation. Call once per route change.
 *
 * @param to - Tab being entered, if the route has one.
 * @param from - Tab being left, if the route had one.
 */
export function resolveSlideDirection(to: AppTab | undefined, from: AppTab | undefined): void {
  if (override) {
    direction.value = override
    override = null
    return
  }

  if (!to || !from || to === from) {
    direction.value = 'none'
    return
  }

  direction.value = TAB_ORDER.indexOf(to) > TAB_ORDER.indexOf(from) ? 'forward' : 'backward'
}
