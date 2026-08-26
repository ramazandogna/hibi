import { computed, ref } from 'vue'
import {
  BookOpenText,
  CalendarRange,
  Grid2x2Check,
  Hand,
  Layers,
  Leaf,
  ListChecks,
  PencilLine,
  Settings2,
  Sparkles,
  SquarePen,
  Sunrise,
  Waves,
} from 'lucide-vue-next'
import type { Component } from 'vue'

/** One page of the guide. Wording lives in the catalogue under `onboarding.*`. */
export interface OnboardingStep {
  key: string
  icon: Component
  /**
   * Tailwind classes for the icon tile. Written out rather than built from the
   * habit kind, because three of these pages *are* the explanation of a kind
   * and the rest are not tied to one.
   */
  tile: string
}

/**
 * Typed as a non-empty tuple, not an array: with `noUncheckedIndexedAccess`
 * that is what makes `ONBOARDING_STEPS[0]` a step rather than a maybe-step.
 */
export const ONBOARDING_STEPS: readonly [OnboardingStep, ...OnboardingStep[]] = [
  { key: 'welcome', icon: Sparkles, tile: 'bg-sea/15 text-sea' },
  { key: 'kinds', icon: Layers, tile: 'bg-mist text-ink' },
  { key: 'build', icon: Leaf, tile: 'bg-leaf/15 text-leaf' },
  { key: 'quit', icon: Hand, tile: 'bg-ember/15 text-ember' },
  { key: 'scale', icon: Waves, tile: 'bg-sea/15 text-sea' },
  { key: 'create', icon: SquarePen, tile: 'bg-mist text-ink' },
  { key: 'today', icon: Sunrise, tile: 'bg-leaf/15 text-leaf' },
  { key: 'notes', icon: PencilLine, tile: 'bg-amber/15 text-amber' },
  { key: 'detail', icon: ListChecks, tile: 'bg-sea/15 text-sea' },
  { key: 'week', icon: Grid2x2Check, tile: 'bg-mist text-ink' },
  { key: 'year', icon: CalendarRange, tile: 'bg-deep/15 text-deep' },
  { key: 'settings', icon: Settings2, tile: 'bg-mist text-ink' },
  { key: 'done', icon: BookOpenText, tile: 'bg-leaf/15 text-leaf' },
]

/**
 * Versioned on purpose: bumping it re-shows the guide to everyone, which is the
 * only sane way to introduce a screen that did not exist when they first ran it.
 */
const STORAGE_KEY = 'hibi-onboarding-v1'

function hasSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'done'
  } catch {
    // Storage blocked. Showing the guide once per session beats never.
    return false
  }
}

function markSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, 'done')
  } catch {
    // Storage blocked; it will appear again next time.
  }
}

// Module-level singleton: the layout renders the tour, Settings restarts it, and
// both have to be looking at the same state.
const isOpen = ref(false)
const index = ref(0)

/**
 * The first-run guide.
 *
 * @example
 * ```ts
 * const tour = useOnboarding()
 * tour.openIfFirstRun()  // app start
 * tour.restart()         // Settings
 * ```
 */
export function useOnboarding() {
  const step = computed(() => ONBOARDING_STEPS[index.value] ?? ONBOARDING_STEPS[0])
  const isLast = computed(() => index.value === ONBOARDING_STEPS.length - 1)

  function openIfFirstRun() {
    if (hasSeen()) return

    index.value = 0
    isOpen.value = true
  }

  function restart() {
    index.value = 0
    isOpen.value = true
  }

  /** Skipping and finishing both count as seen — nobody wants it twice. */
  function dismiss() {
    isOpen.value = false
    markSeen()
  }

  function next() {
    if (isLast.value) dismiss()
    else index.value += 1
  }

  function goTo(target: number) {
    index.value = Math.min(Math.max(target, 0), ONBOARDING_STEPS.length - 1)
  }

  return { isOpen, index, step, isLast, openIfFirstRun, restart, dismiss, next, goTo }
}
