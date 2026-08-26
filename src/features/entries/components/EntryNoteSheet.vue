<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '@/shared/ui/BaseButton.vue'

const { habitName, initialNote = '' } = defineProps<{
  habitName: string
  initialNote?: string
}>()

const emit = defineEmits<{ save: [note: string | null]; skip: [] }>()

const note = ref(initialNote)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-ink text-sm">{{ $t('entry.notePrompt', { name: habitName }) }}</p>

    <textarea
      v-model="note"
      maxlength="280"
      rows="3"
      :placeholder="$t('entry.optional')"
      class="border-hair bg-surface text-ink rounded-card focus-visible:outline-sea border p-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
    />

    <BaseButton @click="emit('save', note.trim() || null)">{{ $t('entry.saveNote') }}</BaseButton>
    <BaseButton variant="ghost" @click="emit('skip')">{{ $t('common.skip') }}</BaseButton>
  </div>
</template>
