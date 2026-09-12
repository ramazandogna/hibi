<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref, watch } from 'vue'

import { Plus } from 'lucide-vue-next'

import { useOnboarding } from '@/features/onboarding/onboarding'
import { useReminders } from '@/features/notifications/use-reminders'
import { BaseSheet } from 'rei-kit'
import { FabButton, OfflineBanner } from 'rei-kit/app'
import AppNavbar from '@/layouts/components/app/AppNavbar.vue'
import AppTopBar from '@/layouts/components/app/AppTopBar.vue'

/**
 * Loaded on demand, not with the app.
 *
 * Importing these at the top of the layout put them on the critical path:
 * HabitForm pulls in vee-validate and zod (24 KB gzipped) for a sheet most
 * visitors never open, and the guide is a screen shown once, ever. The sheet
 * animates for ~280ms, which is longer than either chunk takes to arrive on a
 * connection that already loaded the app.
 */
const HabitForm = defineAsyncComponent(() => import('@/features/habits/components/HabitForm.vue'))

const OnboardingTour = defineAsyncComponent(
  () => import('@/features/onboarding/components/OnboardingTour.vue'),
)

useReminders()

// First run only. Mounted here rather than in a view so it survives tab
// switches and covers the chrome as well as the page.
const tour = useOnboarding()
onMounted(tour.openIfFirstRun)

/**
 * Latches on first open and never lets go.
 *
 * Gating the component on `isOpen` directly would tear it out of the DOM the
 * instant it closes, so its leave transition would never play. This defers the
 * chunk for a returning user without costing the animation.
 */
const tourMounted = ref(false)
watch(tour.isOpen, (open) => {
  if (open) tourMounted.value = true
})

/** Creating a habit is reachable from every screen, not just Profile. */
const createOpen = ref(false)
</script>

<template>
  <div class="app-layout global-wrapper">
    <AppTopBar />

    <AppNavbar />

    <OfflineBanner :label="$t('offline')" />

    <!--
    Content
    -->
    <main class="page-content">
      <slot />
    </main>

    <FabButton :label="$t('habit.new')" @click="createOpen = true">
      <Plus />
    </FabButton>

    <OnboardingTour v-if="tourMounted" />

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
  /* No touch-action override any more. The swipe gesture it protected is gone,
     so the browser owns panning in both directions again — which is also what
     lets the year heatmap scroll horizontally by finger without help. */
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
