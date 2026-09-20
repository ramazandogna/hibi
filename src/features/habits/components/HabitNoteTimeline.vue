<script setup lang="ts">
import { BaseCard, BaseTimeline } from 'rei-kit'
import { computed } from 'vue'
import { KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'

export interface TimelineNote {
  id: string
  /** Already formatted for the active locale. */
  date: string
  body: string
}

const { notes, kind } = defineProps<{ notes: readonly TimelineNote[]; kind: HabitKind }>()

/*
 * The rail is the kit's now. What stays here is the part that is Hibi's:
 * which colour a kind is, and that a note reads as a quote.
 *
 * `fill` takes a class rather than a kind, so `KIND_META` goes straight
 * across without the kit learning what a habit is.
 */
const events = computed(() =>
  notes.map((note) => ({
    key: note.id,
    time: note.date,
    fill: KIND_META[kind].fill,
    body: note.body,
  })),
)
</script>

<template>
  <!-- Newest first, because that is the one you came back to read. The kit
       sorts nothing, so the order stays ours. -->
  <BaseTimeline :events="events" :label="$t('habit.notes')">
    <template #default="{ event }">
      <BaseCard
        as="blockquote"
        padding="sm"
        class="text-ink text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
      >
        {{ event.body }}
      </BaseCard>
    </template>
  </BaseTimeline>
</template>
