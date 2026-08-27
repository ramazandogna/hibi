<script setup lang="ts">
import { KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

export interface TimelineNote {
  id: string
  /** Already formatted for the active locale. */
  date: string
  body: string
}

defineProps<{ notes: readonly TimelineNote[]; kind: HabitKind }>()
</script>

<template>
  <!-- A rail rather than a stack of identical cards: these entries are a
       sequence in time, and the line is what says so. Newest first, because
       that is the one you came back to read. -->
  <ol class="relative flex flex-col gap-4 pl-6">
    <span class="bg-hair absolute top-2 bottom-3 left-[4px] w-px" aria-hidden="true" />

    <li v-for="note in notes" :key="note.id" class="relative">
      <span
        class="border-canvas absolute top-1 -left-6 size-2.5 rounded-full border-2"
        :class="KIND_META[kind].fill"
        aria-hidden="true"
      />

      <p class="text-ink-soft mb-1.5 text-xs font-medium tabular-nums">{{ note.date }}</p>

      <blockquote
        class="border-hair bg-surface rounded-card text-ink border p-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
      >
        {{ note.body }}
      </blockquote>
    </li>
  </ol>
</template>
