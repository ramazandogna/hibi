<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppNavbar from '@/layouts/components/app/AppNavbar.vue'
import AppFooter from './components/app/AppFooter.vue'
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

function stopTracking() {
  tracking = false
}
</script>

<template>
  <div class="app-layout global-wrapper">
    <!--
    Navbar
    -->
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

    <!--
    Footer
    -->
    <AppFooter />
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.app-layout {
  display: flex;
  flex-grow: 1;
}

.page-content {
  @apply relative mt-8 w-full grow overflow-hidden;
  /* Let the browser own vertical scrolling and leave horizontal drags to us. */
  touch-action: pan-y;
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
