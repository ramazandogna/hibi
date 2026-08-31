<script setup lang="ts">
import { ref } from 'vue'
import { Hand } from 'lucide-vue-next'

import { KIND_META, KIND_ORDER } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

/**
 * The three modes, as three things you can actually press.
 *
 * This is the one thing a new user cannot infer from the interface, and reading
 * three paragraphs about colour does not teach it. Choosing does.
 */
const selected = ref<HabitKind>('build')

/**
 * Whether the reader has worked out that these are buttons.
 *
 * Until they have, the unpicked cards breathe and a hint sits underneath. Both
 * stop on the first tap — an affordance that keeps insisting after it has been
 * understood is just noise.
 */
const touched = ref(false)

function choose(kind: HabitKind) {
  selected.value = kind
  touched.value = true
}
</script>

<template>
  <div class="flex w-full flex-col gap-3">
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="kind in KIND_ORDER"
        :key="kind"
        type="button"
        class="rounded-card flex cursor-pointer flex-col items-center gap-2 border px-2 py-3 transition-all duration-200"
        :class="[
          selected === kind
            ? [KIND_META[kind].card, 'scale-[1.03]']
            : 'border-hair bg-surface opacity-70 hover:opacity-100',
          !touched && selected !== kind ? 'invite' : '',
        ]"
        :aria-pressed="selected === kind"
        @click="choose(kind)"
      >
        <span class="size-6 rounded-md transition-transform" :class="KIND_META[kind].fill" />
        <span class="text-xs font-semibold" :class="KIND_META[kind].text">
          {{ $t(`kind.${kind}.label`) }}
        </span>
      </button>
    </div>

    <Transition name="hint">
      <p v-if="!touched" class="text-ink-soft flex items-center justify-center gap-1.5 text-[11px]">
        <Hand class="size-3.5 shrink-0" aria-hidden="true" />
        {{ $t('onboarding.tapHint') }}
      </p>
    </Transition>

    <div class="rounded-card border p-4" :class="KIND_META[selected].card">
      <p class="text-xs font-semibold tracking-wide uppercase" :class="KIND_META[selected].text">
        {{ $t(`kind.${selected}.group`) }}
      </p>
      <p class="text-ink mt-1.5 text-sm leading-relaxed">{{ $t(`kind.${selected}.hint`) }}</p>
    </div>
  </div>
</template>

<style scoped>
/* A slow lift, not a pulse: enough to read as "these move when you touch them"
   without turning the slide into a carnival. Staggered so they do not beat in
   unison, which looks mechanical. */
.invite {
  animation: invite 2.4s ease-in-out infinite;
}
.invite:nth-of-type(2) {
  animation-delay: 0.3s;
}
.invite:nth-of-type(3) {
  animation-delay: 0.6s;
}

@keyframes invite {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 200ms ease;
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .invite {
    animation: none;
  }
}
</style>
