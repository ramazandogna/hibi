<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Plus } from 'lucide-vue-next'

import HabitForm from '@/features/habits/components/HabitForm.vue'
import OnboardingTour from '@/features/onboarding/components/OnboardingTour.vue'
import { useOnboarding } from '@/features/onboarding/onboarding'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import TipBanner from '@/shared/ui/TipBanner.vue'
import AppNavbar from '@/layouts/components/app/AppNavbar.vue'
import AppTopBar from '@/layouts/components/app/AppTopBar.vue'
import { TAB_PATH, tabAtOffset } from '@/shared/lib/tabs'
import { forceSlideDirection } from '@/shared/lib/tab-transition'
import { tapFeedback } from '@/shared/lib/haptics'
import { useOnline } from '@/shared/lib/use-online.ts'

const route = useRoute()
const router = useRouter()

const currentTab = computed(() => route.meta.tab)

/** Minimum horizontal travel before a drag counts as a swipe. */
const SWIPE_MIN_PX = 44
/** A flick this short in time counts on half the distance. */
const FLICK_MS = 250
const FLICK_MIN_PX = 24
/** How much more horizontal than vertical the drag must be, so scrolling wins. */
const HORIZONTAL_RATIO = 1.2

let startX = 0
let startY = 0
let startTime = 0
let tracking = false

function onPointerDown(event: PointerEvent) {
  // Desktop has the tab bar; dragging with a mouse usually means selecting text.
  if (event.pointerType === 'mouse') return

  // Inside a horizontally scrolling area the drag belongs to that area, not to
  // tab navigation — otherwise scrolling the year grid changes the screen.
  if (event.target instanceof Element && event.target.closest('[data-hscroll]')) return

  startX = event.clientX
  startY = event.clientY
  startTime = event.timeStamp
  tracking = true
}

function onPointerUp(event: PointerEvent) {
  if (!tracking) return
  tracking = false

  const tab = currentTab.value
  if (!tab) return

  const dx = event.clientX - startX
  const dy = event.clientY - startY
  const elapsed = event.timeStamp - startTime

  // A quick flick and a long deliberate drag are both swipes; only a slow,
  // short movement is ambiguous enough to ignore.
  const threshold = elapsed < FLICK_MS ? FLICK_MIN_PX : SWIPE_MIN_PX

  if (Math.abs(dx) < threshold) return
  if (Math.abs(dx) < Math.abs(dy) * HORIZONTAL_RATIO) return

  const offset = dx < 0 ? 1 : -1
  forceSlideDirection(offset > 0 ? 'forward' : 'backward')
  void router.push(TAB_PATH[tabAtOffset(tab, offset)])
}

const isOnline = useOnline()

// First run only. Mounted here rather than in a view so it survives tab
// switches and covers the chrome as well as the page.
const tour = useOnboarding()
onMounted(tour.openIfFirstRun)

/** Creating a habit is reachable from every screen, not just Profile. */
const createOpen = ref(false)

function openCreate() {
  tapFeedback()
  createOpen.value = true
}

function stopTracking() {
  tracking = false
}
</script>

<template>
  <div class="app-layout global-wrapper">
    <AppTopBar />

    <div class="tip-slot">
      <TipBanner />
    </div>

    <AppNavbar />

    <!--
    isOnline?
    -->
    <p
      v-if="!isOnline"
      role="status"
      class="bg-amber/20 text-ink rounded-card w-full px-3 py-2 text-center text-xs"
    >
      {{ $t('offline') }}
    </p>

    <!--
    Content
    -->
    <main
      class="page-content"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="stopTracking"
    >
      <slot />
    </main>

    <div class="fab-slot">
      <button type="button" class="fab" @click="openCreate">
        <Plus class="fab-icon" aria-hidden="true" />
        <span class="fab-label">{{ $t('habit.new') }}</span>
      </button>
    </div>

    <OnboardingTour />

    <BaseSheet v-model="createOpen" :title="$t('habit.new')" :subtitle="$t('habit.newSubtitle')">
      <HabitForm @saved="createOpen = false" />
    </BaseSheet>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

/* min-height: 0 lets these flex items shrink below their content, which is
   what allows .page-slide's own overflow-y-auto to take over. Without it the
   default min-height: auto pushes the layout past the shell and nothing
   scrolls. */
.app-layout {
  display: flex;
  flex-grow: 1;
  min-height: 0;
}

.page-content {
  @apply relative mt-2 min-h-0 w-full grow overflow-hidden;
  /* Vertical panning belongs to the browser; horizontal belongs to the swipe
     gesture. This is not only about who scrolls: with `auto`, the browser
     claims a diagonal drag and fires pointercancel, which killed the swipe
     anywhere there was content to scroll. The one element that genuinely needs
     horizontal panning — the year heatmap — drives its own scrolling instead,
     since a descendant cannot re-enable a direction an ancestor removed. */
  touch-action: pan-y;
}

/* Floats just above the tab bar, inside the shell, and lets clicks through
   everywhere the banner itself is not. */
.tip-slot {
  @apply pointer-events-none absolute left-1/2 z-30 w-full max-w-[360px] -translate-x-1/2 px-4;
  bottom: calc(5.25rem + env(safe-area-inset-bottom, 0px));
}

/* Shares the tab bar's column so the button lines up with the bar's right edge
   at every width. Anchoring it to the layout instead put it 400px away from the
   shell on a desktop screen. */
.fab-slot {
  @apply pointer-events-none absolute left-1/2 z-40 flex w-full max-w-[360px] -translate-x-1/2 justify-end px-4;
  bottom: calc(9.25rem + env(safe-area-inset-bottom, 0px));
}

/* An extended FAB: a bare "+" says nothing about what it adds, and this is the
   one action the whole app is built around. */
.fab {
  @apply bg-sea pointer-events-auto flex h-12 items-center gap-1.5 rounded-full pr-5 pl-4 text-white shadow-lg transition-transform duration-150 active:scale-95;
  /* A ring in the canvas colour separates it from whatever scrolls behind. */
  box-shadow:
    0 0 0 4px var(--color-canvas),
    0 10px 24px -8px color-mix(in srgb, var(--color-sea) 60%, transparent);
}

.fab-icon {
  @apply size-5 shrink-0 stroke-[2.5px];
}

.fab-label {
  @apply text-sm font-semibold whitespace-nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .fab {
    transition: none;
  }
}

.global-wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
