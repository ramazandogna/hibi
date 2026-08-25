<script setup lang="ts">
import { ref, watch } from 'vue'

import { useProfile, useUpdateProfile } from '../profile.queries'
import { useDebouncedCallback } from '@/shared/lib/use-debounced-callback'
import BaseInput from '@/shared/ui/BaseInput.vue'
import { isThemePreference, useTheme } from '@/shared/lib/theme'
import type { ThemePreference } from '@/shared/lib/theme'

const { data: profile } = useProfile()
const update = useUpdateProfile()

const displayName = ref('')
const theme = useTheme()

/**
 * Adopt the stored theme exactly once, when the row first arrives.
 *
 * Without the guard this watcher re-applies the database value on every refetch
 * and undoes a choice the user just made locally.
 */
let hasAdoptedStoredTheme = false

watch(
  profile,
  (next) => {
    if (hasAdoptedStoredTheme || !next) return

    hasAdoptedStoredTheme = true
    if (isThemePreference(next.theme) && next.theme !== theme.value) {
      theme.value = next.theme
    }
  },
  { immediate: true },
)

function selectTheme(preference: ThemePreference) {
  theme.value = preference
  update.mutate({ theme: preference })
}

// Seed the field once the row arrives, without fighting the user's typing.
watch(
  profile,
  (next) => {
    if (next && displayName.value === '') displayName.value = next.display_name ?? ''
  },
  { immediate: true },
)

const saveName = useDebouncedCallback((value: string) => {
  update.mutate({ display_name: value.trim() || null })
}, 800)

watch(displayName, (value) => {
  if (profile.value && value !== (profile.value.display_name ?? '')) saveName.run(value)
})

const WEEK_OPTIONS = [
  { value: 1, label: 'Monday' },
  { value: 0, label: 'Sunday' },
] as const

const THEME_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
] as const
</script>

<template>
  <section class="flex flex-col gap-4">
    <h2 class="text-ink-soft text-xs font-semibold tracking-wide uppercase">Settings</h2>

    <BaseInput v-model="displayName" label="Display name" placeholder="Your name" />

    <fieldset class="flex w-full flex-col gap-1.5">
      <legend class="text-ink text-sm font-medium">Week starts on</legend>
      <div class="bg-mist rounded-card flex gap-1 p-1">
        <button
          v-for="option in WEEK_OPTIONS"
          :key="option.value"
          type="button"
          class="flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-medium transition-colors select-none"
          :class="profile?.week_starts_on === option.value ? 'bg-sea text-white' : 'text-ink-soft'"
          :aria-pressed="profile?.week_starts_on === option.value"
          @click="update.mutate({ week_starts_on: option.value })"
        >
          {{ option.label }}
        </button>
      </div>
    </fieldset>

    <fieldset class="flex w-full flex-col gap-1.5">
      <legend class="text-ink text-sm font-medium">Theme</legend>
      <div class="bg-mist rounded-card flex gap-1 p-1">
        <button
          v-for="option in THEME_OPTIONS"
          :key="option.value"
          type="button"
          class="flex h-10 flex-1 items-center justify-center rounded-xl text-sm font-medium transition-colors select-none"
          :class="theme === option.value ? 'bg-sea text-white' : 'text-ink-soft'"
          :aria-pressed="theme === option.value"
          @click="selectTheme(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </fieldset>
  </section>
</template>
