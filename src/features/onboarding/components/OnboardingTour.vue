<script setup lang="ts">
import { ref, watch } from 'vue'

import { ONBOARDING_STEPS, useOnboarding } from '../onboarding'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BrandMark from '@/shared/ui/BrandMark.vue'

const tour = useOnboarding()

const total = ONBOARDING_STEPS.length

/**
 * Slide direction, derived from which way the index moved.
 *
 * The dots allow jumping backwards, so a fixed direction would animate a jump
 * to step 2 as if it were progress.
 */
const transitionName = ref('tour-forward')

watch(tour.index, (next, previous) => {
  transitionName.value = next >= previous ? 'tour-forward' : 'tour-backward'
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowRight') tour.next()
  if (event.key === 'ArrowLeft') tour.goTo(tour.index.value - 1)
}
</script>

<template>
  <!-- Teleported for the same reason sheets are: the shell clips its children,
       and the guide has to cover the tab bar and the header alike. -->
  <Teleport to="#sheet-root">
    <Transition name="tour">
      <div
        v-if="tour.isOpen.value"
        class="fixed inset-0 z-[60] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('settings.guide')"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <div class="shell-frame md:rounded-shell bg-canvas relative flex flex-col overflow-hidden">
          <header class="flex shrink-0 items-center justify-between px-5 pt-5">
            <BrandMark size="sm" />

            <button
              type="button"
              class="text-ink-soft hover:text-ink rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
              @click="tour.dismiss()"
            >
              {{ $t('onboarding.skip') }}
            </button>
          </header>

          <!-- min-h-0 keeps the body inside the shell so long pages scroll here
               rather than pushing the buttons off the bottom. -->
          <div class="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-7 py-6">
            <Transition :name="transitionName" mode="out-in">
              <div :key="tour.step.value.key" class="flex flex-col items-start gap-5">
                <span
                  class="rounded-card flex size-16 items-center justify-center"
                  :class="tour.step.value.tile"
                  aria-hidden="true"
                >
                  <component :is="tour.step.value.icon" class="size-8" />
                </span>

                <h2 class="text-ink text-2xl leading-tight font-semibold text-balance">
                  {{ $t(`onboarding.${tour.step.value.key}Title`) }}
                </h2>

                <p class="text-ink-soft text-[15px] leading-relaxed">
                  {{ $t(`onboarding.${tour.step.value.key}Body`) }}
                </p>
              </div>
            </Transition>
          </div>

          <footer class="safe-b flex shrink-0 flex-col gap-4 px-7 pt-2 pb-7">
            <!-- Dots double as navigation: on a thirteen-page guide, being able
                 to jump back to the mode you half-read matters. -->
            <div
              class="flex items-center justify-center gap-1.5"
              role="tablist"
              :aria-label="$t('onboarding.progress', { current: tour.index.value + 1, total })"
            >
              <button
                v-for="(item, position) in ONBOARDING_STEPS"
                :key="item.key"
                type="button"
                role="tab"
                :aria-selected="position === tour.index.value"
                :aria-label="$t('onboarding.progress', { current: position + 1, total })"
                class="h-1.5 rounded-full transition-all duration-200"
                :class="
                  position === tour.index.value ? 'bg-sea w-5' : 'bg-hair hover:bg-ink-soft w-1.5'
                "
                @click="tour.goTo(position)"
              />
            </div>

            <BaseButton class="w-full" @click="tour.next()">
              {{ tour.isLast.value ? $t('onboarding.start') : $t('onboarding.next') }}
            </BaseButton>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tour-enter-active,
.tour-leave-active {
  transition: opacity 220ms ease;
}
.tour-enter-from,
.tour-leave-to {
  opacity: 0;
}

.tour-forward-enter-active,
.tour-forward-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
}
.tour-forward-enter-from {
  opacity: 0;
  transform: translateX(18px);
}
.tour-forward-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}

.tour-backward-enter-active,
.tour-backward-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms cubic-bezier(0.32, 0.72, 0, 1);
}
.tour-backward-enter-from {
  opacity: 0;
  transform: translateX(-18px);
}
.tour-backward-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

@media (prefers-reduced-motion: reduce) {
  .tour-forward-enter-from,
  .tour-forward-leave-to,
  .tour-backward-enter-from,
  .tour-backward-leave-to {
    transform: none;
  }
}
</style>
