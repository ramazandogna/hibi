<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '@/shared/ui/BaseButton.vue'

const { initialValue = null, initialNote = '' } = defineProps<{
  initialValue?: number | null
  initialNote?: string
}>()

const emit = defineEmits<{ submit: [payload: { value: number; note: string | null }] }>()

/** Opacity carries the value, so the same scale reads in the year heatmap. */
const LEVELS = [
  { value: 1, label: 'Rough', opacity: 'opacity-20' },
  { value: 2, label: 'Low', opacity: 'opacity-40' },
  { value: 3, label: 'OK', opacity: 'opacity-60' },
  { value: 4, label: 'Good', opacity: 'opacity-80' },
  { value: 5, label: 'Great', opacity: 'opacity-100' },
] as const

const selected = ref<number | null>(initialValue)
const note = ref(initialNote)

function submit() {
  if (selected.value === null) return

  emit('submit', { value: selected.value, note: note.value.trim() || null })
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between gap-1">
      <button
        v-for="level in LEVELS"
        :key="level.value"
        type="button"
        class="flex flex-1 flex-col items-center gap-1"
        :aria-pressed="selected === level.value"
        :aria-label="`${level.value} — ${level.label}`"
        @click="selected = level.value"
      >
        <span
          class="bg-sea size-10 rounded-full transition-transform duration-100"
          :class="[
            level.opacity,
            selected === level.value ? 'ring-sea scale-110 ring-2 ring-offset-2' : '',
          ]"
        />
        <span class="text-ink-soft text-[11px]">{{ level.label }}</span>
      </button>
    </div>

    <textarea
      v-model="note"
      maxlength="280"
      rows="3"
      placeholder="Why does today feel like this?"
      class="border-hair bg-surface text-ink rounded-card border p-3 text-sm"
    />

    <BaseButton :disabled="selected === null" @click="submit">Save</BaseButton>
  </div>
</template>
