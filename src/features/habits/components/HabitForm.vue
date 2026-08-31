<script setup lang="ts">
import { computed, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import { BaseButton, BaseInput, toAppError } from 'rei-kit'
import KindPicker from './KindPicker.vue'
import { createHabitSchema } from '../habit.schema'
import { useCreateHabit, useUpdateHabit } from '../habits.queries'
import type { Habit } from '../habit.types'

const { habit = undefined } = defineProps<{ habit?: Habit | undefined }>()
const emit = defineEmits<{ saved: [] }>()

const createHabit = useCreateHabit()
const updateHabit = useUpdateHabit()

const serverError = ref('')
const isEdit = computed(() => Boolean(habit))

const { defineField, errors, handleSubmit, isSubmitting, values } = useForm({
  validationSchema: toTypedSchema(createHabitSchema()),
  initialValues: {
    name: habit?.name ?? '',
    kind: habit?.kind ?? 'build',
    icon: habit?.icon ?? 'circle',
    target_per_week: habit?.target_per_week ?? 7,
  },
})

const [name, nameAttrs] = defineField('name', { validateOnModelUpdate: false })
const [kind] = defineField('kind')
const [targetPerWeek] = defineField('target_per_week')

const onSubmit = handleSubmit(async (formValues) => {
  serverError.value = ''
  try {
    if (habit) {
      await updateHabit.mutateAsync({
        id: habit.id,
        patch: {
          name: formValues.name,
          icon: formValues.icon,
          target_per_week: formValues.target_per_week,
        },
      })
    } else {
      await createHabit.mutateAsync(formValues)
    }
    emit('saved')
  } catch (error) {
    serverError.value = toAppError(error).message
  }
})
</script>

<template>
  <form novalidate class="flex flex-col gap-4" @submit="onSubmit">
    <BaseInput
      v-model="name"
      v-bind="nameAttrs"
      :label="$t('habit.name')"
      :error="errors.name"
      :placeholder="$t('habit.namePlaceholder')"
      autocomplete="off"
    />

    <KindPicker v-model="kind" :disabled="isEdit" :hint="isEdit ? $t('habit.modeLocked') : ''" />

    <fieldset v-if="values.kind === 'build'" class="flex w-full flex-col gap-1.5">
      <legend class="text-ink text-sm font-medium">{{ $t('habit.weeklyTarget') }}</legend>
      <div class="bg-mist rounded-card flex gap-1 p-1">
        <button
          v-for="day in 7"
          :key="day"
          type="button"
          class="flex h-11 flex-1 items-center justify-center rounded-xl text-sm font-medium transition-colors select-none"
          :class="targetPerWeek === day ? 'bg-sea text-white' : 'text-ink-soft'"
          @click="targetPerWeek = day"
        >
          {{ day }}
        </button>
      </div>
      <p class="text-ink-soft text-xs leading-snug">{{ $t('habit.weeklyTargetHint') }}</p>
    </fieldset>

    <p v-if="serverError" role="alert" class="text-alert text-sm">{{ serverError }}</p>

    <BaseButton type="submit" :loading="isSubmitting">
      {{ isEdit ? $t('habit.saveChanges') : $t('habit.create') }}
    </BaseButton>
  </form>
</template>
