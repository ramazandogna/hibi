<script setup lang="ts">
const { habitName } = defineProps<{ habitName: string }>()

const emit = defineEmits<{ select: [value: number] }>()

/** Same 20-100% ramp as the picker and the heatmap. */
const LEVELS = [
  { value: 1, label: 'Rough', opacity: 'opacity-20' },
  { value: 2, label: 'Low', opacity: 'opacity-40' },
  { value: 3, label: 'OK', opacity: 'opacity-60' },
  { value: 4, label: 'Good', opacity: 'opacity-80' },
  { value: 5, label: 'Great', opacity: 'opacity-100' },
] as const
</script>

<template>
  <section class="border-hair rounded-card flex flex-col gap-3 border p-3">
    <div class="flex flex-col gap-0.5">
      <p class="text-ink text-sm font-medium">How's your {{ habitName.toLowerCase() }} today?</p>
      <p class="text-ink-soft text-xs">Pick a level, then write a line about why.</p>
    </div>

    <div class="flex justify-between gap-1">
      <button
        v-for="level in LEVELS"
        :key="level.value"
        type="button"
        class="flex flex-1 flex-col items-center gap-1"
        :aria-label="`${level.value} — ${level.label}`"
        @click="emit('select', level.value)"
      >
        <span
          class="bg-sea size-8 rounded-full transition-transform duration-100 active:scale-90"
          :class="level.opacity"
        />
        <span class="text-ink-soft text-[10px]">{{ level.label }}</span>
      </button>
    </div>
  </section>
</template>
