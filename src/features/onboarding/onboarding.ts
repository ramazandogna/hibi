import { computed, ref } from 'vue'
import type { Component } from 'vue'

import TourCompound from './components/visuals/TourCompound.vue'
import TourCue from './components/visuals/TourCue.vue'
import TourModes from './components/visuals/TourModes.vue'
import TourNote from './components/visuals/TourNote.vue'
import TourStreak from './components/visuals/TourStreak.vue'
import TourYear from './components/visuals/TourYear.vue'

/** Ambient wash behind a slide. Written out because Tailwind scans plain text. */
export type TourAccent = 'sea' | 'leaf' | 'ember' | 'amber' | 'deep'

export interface OnboardingStep {
  /** Message key stem: `onboarding.<key>Title` / `<key>Body`. */
  key: string
  accent: TourAccent
  /** Cover and closing slides centre their copy; the rest are left-aligned. */
  variant?: 'cover' | 'default'
  /** Illustration above the copy. */
  visual?: Component
  /**
   * A headline number, for the slides that rest on a study. Rendered by
   * TourFigure; keys resolve against the catalogue.
   */
  figure?: { valueKey: string; labelKey: string; rangeKey?: string }
  /** Citation line. Present only where there is a real paper behind the claim. */
  sourceKey?: string
  /** Marks a number as an illustration rather than a finding. */
  noteKey?: string
}

/**
 * The guide, in the order it argues.
 *
 * It opens by earning the right to your attention — what habits already do to
 * your day, how long they actually take — before it explains a single button.
 * Every research slide carries its citation, and the one slide that is
 * arithmetic rather than evidence says so.
 *
 * Typed as a non-empty tuple, not an array: with `noUncheckedIndexedAccess`
 * that is what makes `ONBOARDING_STEPS[0]` a step rather than a maybe-step.
 */
export const ONBOARDING_STEPS: readonly [OnboardingStep, ...OnboardingStep[]] = [
  { key: 'cover', accent: 'sea', variant: 'cover' },
  {
    key: 'habitual',
    accent: 'deep',
    figure: { valueKey: 'onboarding.habitualValue', labelKey: 'onboarding.habitualLabel' },
    sourceKey: 'onboarding.habitualSource',
  },
  {
    key: 'sixtysix',
    accent: 'sea',
    figure: {
      valueKey: 'onboarding.sixtysixValue',
      labelKey: 'onboarding.sixtysixLabel',
      rangeKey: 'onboarding.sixtysixRange',
    },
    sourceKey: 'onboarding.sixtysixSource',
  },
  { key: 'miss', accent: 'leaf', visual: TourStreak, sourceKey: 'onboarding.missSource' },
  { key: 'compound', accent: 'leaf', visual: TourCompound, noteKey: 'onboarding.compoundNote' },
  { key: 'modes', accent: 'sea', visual: TourModes },
  { key: 'cue', accent: 'amber', visual: TourCue, sourceKey: 'onboarding.cueSource' },
  { key: 'record', accent: 'amber', visual: TourNote, sourceKey: 'onboarding.recordSource' },
  { key: 'year', accent: 'deep', visual: TourYear },
  { key: 'start', accent: 'leaf', variant: 'cover' },
]

/**
 * Versioned on purpose: bumping it re-shows the guide to everyone, which is the
 * only sane way to introduce a screen that did not exist when they first ran it.
 */
const STORAGE_KEY = 'hibi-onboarding-v2'

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

// Module-level singleton: the layout renders the tour, Settings and the empty
// state restart it, and all three have to be looking at the same state.
const isOpen = ref(false)
const index = ref(0)

/**
 * The first-run guide.
 *
 * @example
 * ```ts
 * const tour = useOnboarding()
 * tour.openIfFirstRun()  // app start
 * tour.restart()         // Settings, or the empty state
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

  function back() {
    index.value = Math.max(index.value - 1, 0)
  }

  function goTo(target: number) {
    index.value = Math.min(Math.max(target, 0), ONBOARDING_STEPS.length - 1)
  }

  return { isOpen, index, step, isLast, openIfFirstRun, restart, dismiss, next, back, goTo }
}
