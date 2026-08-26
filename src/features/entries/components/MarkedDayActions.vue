<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '@/shared/ui/BaseButton.vue'

const { habitName, initialNote = '' } = defineProps<{
  habitName: string
  initialNote?: string
}>()

const emit = defineEmits<{ save: [note: string | null]; remove: [] }>()

const note = ref(initialNote)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-ink text-sm">
      {{ habitName }} is marked for this day. Edit the note, or remove the mark.
    </p>

    <textarea
      v-model="note"
      maxlength="280"
      rows="3"
      placeholder="Why does this day stand out?"
      class="border-hair bg-surface text-ink rounded-card focus-visible:outline-sea border p-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
    />

    <BaseButton @click="emit('save', note.trim() || null)">Save note</BaseButton>

    <button
      type="button"
      class="text-ink-soft hover:text-alert self-center text-xs underline underline-offset-2 transition-colors"
      @click="emit('remove')"
    >
      Remove mark
    </button>
  </div>
</template>
