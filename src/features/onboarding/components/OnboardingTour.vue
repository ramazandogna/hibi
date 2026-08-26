<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'

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

const dialog = ref<HTMLElement | null>(null)

/**
 * Same trick the sheets use: `inert` takes the app behind the guide out of tab
 * order and pointer events, so Tab cannot walk into a screen the user cannot
 * see. Focusing the dialog is what makes the arrow keys work at all.
 */
watch(tour.isOpen, async (open) => {
  document.getElementById('app')?.toggleAttribute('inert', open)
  if (!open) return

  await nextTick()
  dialog.value?.focus()
})

onUnmounted(() => document.getElementById('app')?.removeAttribute('inert'))

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
        ref="dialog"
        class="fixed inset-0 z-[60] flex items-center justify-center outline-none"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('settings.guide')"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <div class="shell-frame md:rounded-shell bg-canvas relative flex flex-col overflow-hidden">
          <header class="flex shrink-0 items-center justify-between px-6 pt-6 pb-1">
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
          <div class="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-8">
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

          <footer
            class="flex shrink-0 flex-col gap-5 px-6 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]"
          >
            <!-- Dots double as navigation: on a thirteen-page guide, being able
                 to jump back to the mode you half-read matters. -->
            <div
              class="-my-2 flex items-center justify-center gap-1"
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
                class="group flex items-center px-0.5 py-2.5"
                @click="tour.goTo(position)"
              >
                <!-- The bar stays 6px; the button around it is 26px tall, which
                     is what the finger has to find among thirteen of them. -->
                <span
                  class="h-1.5 rounded-full transition-all duration-200"
                  :class="
                    position === tour.index.value
                      ? 'bg-sea w-5'
                      : 'bg-hair group-hover:bg-ink-soft w-1.5'
                  "
                />
              </button>
            </div>

            <!-- Thirteen pages of one-way Next is a guide you cannot re-read.
                 Back appears from the second page, where it has somewhere to go. -->
            <div class="flex gap-2">
              <BaseButton
                v-if="tour.index.value > 0"
                variant="ghost"
                class="shrink-0 px-5"
                @click="tour.goTo(tour.index.value - 1)"
              >
                {{ $t('common.back') }}
              </BaseButton>

              <BaseButton class="flex-1" @click="tour.next()">
                {{ tour.isLast.value ? $t('onboarding.start') : $t('onboarding.next') }}
              </BaseButton>
            </div>
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
