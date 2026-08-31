<script setup lang="ts">
import { ref } from 'vue'

import { LEVELS } from '../levels'
import { BaseButton } from 'rei-kit'

const { initialValue = null, initialNote = '' } = defineProps<{
  initialValue?: number | null
  initialNote?: string
}>()

const emit = defineEmits<{
  submit: [payload: { value: number; note: string | null }]
  remove: []
}>()

const selected = ref<number | null>(initialValue)
const note = ref(initialNote)

function submit() {
  if (selected.value === null) return

  emit('submit', { value: selected.value, note: note.value.trim() || null })
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex justify-between gap-1">
      <button
        v-for="level in LEVELS"
        :key="level.value"
        type="button"
        class="flex flex-1 flex-col items-center gap-2 py-1"
        :aria-pressed="selected === level.value"
        :aria-label="
          $t('entry.levelLabel', { value: level.value, label: $t(`level.${level.value}`) })
        "
        @click="selected = level.value"
      >
        <span
          class="bg-sea flex size-12 items-center justify-center rounded-full text-base font-semibold text-white transition-transform duration-150"
          :class="[
            level.opacity,
            selected === level.value ? 'ring-sea scale-110 ring-2 ring-offset-2' : '',
          ]"
        >
          {{ level.value }}
        </span>
        <span
          class="text-[11px] leading-none"
          :class="selected === level.value ? 'text-sea font-semibold' : 'text-ink-soft'"
        >
          {{ $t(`level.${level.value}`) }}
        </span>
      </button>
    </div>

    <textarea
      v-model="note"
      maxlength="280"
      rows="4"
      :placeholder="$t('entry.feelToday')"
      class="border-hair bg-surface text-ink rounded-card focus-visible:outline-sea border p-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
    />

    <BaseButton :disabled="selected === null" @click="submit">{{ $t('common.save') }}</BaseButton>

    <button
      v-if="initialValue !== null"
      type="button"
      class="text-ink-soft hover:text-alert self-center text-xs underline underline-offset-2 transition-colors"
      @click="emit('remove')"
    >
      {{ $t('entry.removeEntry') }}
    </button>
  </div>
</template>
