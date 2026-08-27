<script setup lang="ts">
import { ref } from 'vue'

import { KIND_META, KIND_ORDER } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

/**
 * The three modes, as three things you can actually press.
 *
 * This is the one thing a new user cannot infer from the interface, and reading
 * three paragraphs about colour does not teach it. Choosing does.
 */
const selected = ref<HabitKind>('build')
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="kind in KIND_ORDER"
        :key="kind"
        type="button"
        class="rounded-card flex flex-col items-center gap-2 border px-2 py-3 transition-all duration-200"
        :class="
          selected === kind
            ? [KIND_META[kind].card, 'scale-[1.03]']
            : 'border-hair bg-surface opacity-60'
        "
        :aria-pressed="selected === kind"
        @click="selected = kind"
      >
        <span class="size-6 rounded-md transition-transform" :class="KIND_META[kind].fill" />
        <span class="text-xs font-semibold" :class="KIND_META[kind].text">
          {{ $t(`kind.${kind}.label`) }}
        </span>
      </button>
    </div>

    <div class="rounded-card border p-4" :class="KIND_META[selected].card">
      <p class="text-xs font-semibold tracking-wide uppercase" :class="KIND_META[selected].text">
        {{ $t(`kind.${selected}.group`) }}
      </p>
      <p class="text-ink mt-1.5 text-sm leading-relaxed">{{ $t(`kind.${selected}.hint`) }}</p>
    </div>
  </div>
</template>
