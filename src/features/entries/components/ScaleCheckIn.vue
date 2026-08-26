<script setup lang="ts">
import { LEVELS } from '../levels'

const { habitName } = defineProps<{ habitName: string }>()

const emit = defineEmits<{ select: [value: number] }>()
</script>

<template>
  <section class="bg-sea/5 border-sea/25 rounded-card flex flex-col gap-3 border p-4">
    <div class="flex flex-col gap-0.5">
      <p class="text-ink text-sm font-medium">
        {{ $t('entry.checkInTitle', { name: habitName }) }}
      </p>
      <p class="text-ink-soft text-xs">{{ $t('entry.checkInHint') }}</p>
    </div>

    <div class="flex justify-between gap-1">
      <button
        v-for="level in LEVELS"
        :key="level.value"
        type="button"
        class="flex flex-1 flex-col items-center gap-1.5 py-1"
        :aria-label="
          $t('entry.levelLabel', { value: level.value, label: $t(`level.${level.value}`) })
        "
        @click="emit('select', level.value)"
      >
        <span
          class="bg-sea flex size-10 items-center justify-center rounded-full text-sm font-semibold text-white transition-transform duration-100 active:scale-90"
          :class="level.opacity"
        >
          {{ level.value }}
        </span>
        <span class="text-ink-soft text-[10px] leading-none">{{ $t(`level.${level.value}`) }}</span>
      </button>
    </div>
  </section>
</template>
