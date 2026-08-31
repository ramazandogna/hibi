<script setup lang="ts">
import { computed } from 'vue'
import { CalendarDays, GraduationCap, Palette } from 'lucide-vue-next'

import LanguagePicker from './LanguagePicker.vue'
import { useProfile, useUpdateProfile } from '../profile.queries'
import { useOnboarding } from '@/features/onboarding/onboarding'
import { BaseButton, SegmentedControl, SettingsGroup, SettingsRow, useTheme } from 'rei-kit'
import type { ThemePreference } from 'rei-kit'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: profile } = useProfile()
const update = useUpdateProfile()
const theme = useTheme()
const tour = useOnboarding()

const THEME_OPTIONS = computed(() => [
  { value: 'system' as ThemePreference, label: t('settings.themeSystem') },
  { value: 'light' as ThemePreference, label: t('settings.themeLight') },
  { value: 'dark' as ThemePreference, label: t('settings.themeDark') },
])

const WEEK_OPTIONS = computed(() => [
  { value: 1, label: t('settings.monday') },
  { value: 0, label: t('settings.sunday') },
])

/**
 * The theme is written to two places: the local singleton so the change is
 * instant, and the profile row so the next device agrees.
 */
const themeModel = computed<ThemePreference>({
  get: () => theme.value,
  set: (next) => {
    theme.value = next
    update.mutate({ theme: next })
  },
})

// `?? 1` rather than a blank control: the row may still be loading, and an
// unselected segmented control looks broken.
const weekModel = computed<number>({
  get: () => profile.value?.week_starts_on ?? 1,
  set: (next) => update.mutate({ week_starts_on: next }),
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <SettingsGroup :title="$t('settings.appearance')">
      <SettingsRow :label="$t('settings.theme')" :icon="Palette" stacked>
        <SegmentedControl v-model="themeModel" :options="THEME_OPTIONS" />
      </SettingsRow>
    </SettingsGroup>

    <SettingsGroup :title="$t('settings.calendar')">
      <SettingsRow :label="$t('settings.weekStart')" :icon="CalendarDays" stacked>
        <SegmentedControl v-model="weekModel" :options="WEEK_OPTIONS" />
      </SettingsRow>
    </SettingsGroup>

    <SettingsGroup :title="$t('settings.language')">
      <LanguagePicker />
    </SettingsGroup>

    <SettingsGroup :title="$t('settings.help')">
      <SettingsRow
        :label="$t('settings.guide')"
        :description="$t('settings.guideHint')"
        :icon="GraduationCap"
        stacked
      >
        <BaseButton variant="ghost" size="sm" class="self-start" @click="tour.restart()">
          {{ $t('settings.replayGuide') }}
        </BaseButton>
      </SettingsRow>
    </SettingsGroup>
  </div>
</template>
