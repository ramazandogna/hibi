<script setup lang="ts">
import { useId } from 'vue'

import { KIND_META } from '@/shared/lib/kind'
import type { HabitKind } from '@/shared/lib/kind'
import { Constants } from '@/shared/types/database.types'

const { disabled = false, hint = '' } = defineProps<{
  disabled?: boolean
  hint?: string
}>()

const model = defineModel<HabitKind | undefined>()

const kinds = Constants.public.Enums.habit_kind
const name = useId()
</script>

<template>
  <fieldset class="flex w-full flex-col gap-1.5" :disabled="disabled">
    <legend class="text-ink text-sm font-medium">{{ $t('habit.mode') }}</legend>

    <div class="bg-mist rounded-card flex gap-1 p-1" :class="disabled ? 'opacity-60' : ''">
      <label v-for="kind in kinds" :key="kind" class="flex-1 cursor-pointer">
        <input v-model="model" type="radio" :value="kind" :name="name" class="sr-only" />
        <span
          class="flex h-11 items-center justify-center rounded-xl text-sm font-medium transition-colors select-none"
          :class="model === kind ? [KIND_META[kind].fill, 'text-white'] : 'text-ink-soft'"
        >
          {{ $t(`kind.${kind}.label`) }}
        </span>
      </label>
    </div>

    <!-- The mode is the one decision a user cannot undo later, so the sheet has
         to say what each one means rather than assume the words are obvious. -->
    <p v-if="model" class="text-ink-soft text-xs leading-snug">
      {{ $t(`kind.${model}.hint`) }}
    </p>

    <p v-if="hint" class="text-amber text-xs leading-snug">{{ hint }}</p>
  </fieldset>
</template>
