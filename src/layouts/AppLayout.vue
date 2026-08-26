<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Plus } from 'lucide-vue-next'

import HabitForm from '@/features/habits/components/HabitForm.vue'
import BaseSheet from '@/shared/ui/BaseSheet.vue'
import TipBanner from '@/shared/ui/TipBanner.vue'
import AppNavbar from '@/layouts/components/app/AppNavbar.vue'
import AppTopBar from '@/layouts/components/app/AppTopBar.vue'
import { TAB_PATH, tabAtOffset } from '@/shared/lib/tabs'
import { forceSlideDirection } from '@/shared/lib/tab-transition'
import { useOnline } from '@/shared/lib/use-online.ts'

const route = useRoute()
const router = useRouter()

const currentTab = computed(() => route.meta.tab)

/** Minimum horizontal travel before a drag counts as a swipe. */
const SWIPE_MIN_PX = 60
/** How much more horizontal than vertical the drag must be, so scrolling wins. */
const HORIZONTAL_RATIO = 1.5

let startX = 0
let startY = 0
let tracking = false

function onPointerDown(event: PointerEvent) {
  // Desktop has the tab bar; dragging with a mouse usually means selecting text.
  if (event.pointerType === 'mouse') return

  startX = event.clientX
  startY = event.clientY
  tracking = true
}

function onPointerUp(event: PointerEvent) {
  if (!tracking) return
  tracking = false

  const tab = currentTab.value
  if (!tab) return

  const dx = event.clientX - startX
  const dy = event.clientY - startY

  if (Math.abs(dx) < SWIPE_MIN_PX) return
  if (Math.abs(dx) < Math.abs(dy) * HORIZONTAL_RATIO) return

  const offset = dx < 0 ? 1 : -1
  forceSlideDirection(offset > 0 ? 'forward' : 'backward')
  void router.push(TAB_PATH[tabAtOffset(tab, offset)])
}

const isOnline = useOnline()

/** Creating a habit is reachable from every screen, not just Profile. */
const createOpen = ref(false)

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
      You're offline - changes won't be saved.
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

    <button type="button" class="fab" aria-label="New habit" @click="createOpen = true">
      <Plus class="size-6" />
    </button>

    <BaseSheet v-model="createOpen" title="New habit">
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
  /* Let the browser own vertical scrolling and leave horizontal drags to us. */
  touch-action: pan-y;
}

/* Floats just above the tab bar, inside the shell, and lets clicks through
   everywhere the banner itself is not. */
.tip-slot {
  @apply pointer-events-none absolute left-1/2 z-30 w-full max-w-[360px] -translate-x-1/2 px-4;
  bottom: calc(5.25rem + env(safe-area-inset-bottom, 0px));
}

/* Sits just above the tab bar, on the shell's right edge — thumb reach on a
   phone, and clear of the centred navigation. */
.fab {
  @apply bg-sea absolute right-4 z-40 flex size-14 items-center justify-center text-white shadow-lg transition-transform duration-100 active:scale-95;
  border-radius: var(--radius-card);
  bottom: calc(9.5rem + env(safe-area-inset-bottom, 0px));
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
