<script setup lang="ts">
import { ref } from 'vue'

import { BaseButton, BaseTextarea } from 'rei-kit'

const { habitName, initialNote = '' } = defineProps<{
  habitName: string
  initialNote?: string
}>()

const emit = defineEmits<{ save: [note: string | null]; remove: [] }>()

const note = ref(initialNote)
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-ink text-sm">{{ $t('entry.markedDay', { name: habitName }) }}</p>

    <!-- `unstyled` keeps this sheet's field exactly as it was, minus the
         `text-sm`: 14px in a textarea makes iOS zoom the page on focus and
         never zoom back, which is what the base layer's 16px was for and
         what this class was quietly overriding.

         The label is hidden because the sentence above already names the
         field — dropped entirely it would have no accessible name, which is
         what it had. -->
    <BaseTextarea
      v-model="note"
      variant="unstyled"
      label-hidden
      :label="$t('entry.standOut')"
      :rows="3"
      maxlength="280"
      :placeholder="$t('entry.standOut')"
      class="border-hair bg-surface text-ink rounded-card focus-visible:outline-sea border p-3 focus-visible:outline-2 focus-visible:outline-offset-1"
    />

    <BaseButton @click="emit('save', note.trim() || null)">{{ $t('entry.saveNote') }}</BaseButton>

    <BaseButton
      variant="link"
      size="xs"
      class="text-ink-soft hover:text-alert self-center"
      @click="emit('remove')"
    >
      {{ $t('entry.removeMark') }}
    </BaseButton>
  </div>
</template>
