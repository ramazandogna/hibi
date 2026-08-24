<script setup lang="ts">
import { ref, watch } from 'vue'

import { useSaveNote } from '../notes.queries'
import { useDebouncedCallback } from '@/shared/lib/use-debounced-callback'

const { dateKey, initialBody = '' } = defineProps<{
  dateKey: string
  initialBody?: string
}>()

const body = ref(initialBody)
const save = useSaveNote()

/**
 * Autosave 800ms after typing stops.
 *
 * `useDebouncedCallback` flushes on scope dispose, so closing the sheet mid
 * sentence still saves.
 */
const debounced = useDebouncedCallback((next: string) => {
  save.mutate({ dateKey, body: next })
}, 800)

watch(body, (next) => debounced.run(next))
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="`note-${dateKey}`" class="text-ink-soft text-xs">Note</label>

    <textarea
      :id="`note-${dateKey}`"
      v-model="body"
      maxlength="500"
      rows="3"
      placeholder="What happened today?"
      class="border-hair bg-surface text-ink rounded-card focus-visible:outline-sea border p-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-1"
    />

    <p class="text-ink-soft h-3 text-right text-[10px]" aria-live="polite">
      <span v-if="save.isPending.value">Saving…</span>
      <span v-else-if="save.isSuccess.value">Saved</span>
    </p>
  </div>
</template>
