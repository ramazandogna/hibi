<script setup lang="ts">
import { SUPPORTED_LOCALES, useLocalePreference } from '@/shared/i18n'
import type { AppLocale } from '@/shared/i18n'

/**
 * A flat language switcher for screens that have no Settings behind them.
 *
 * Endonyms, so the option a user needs is legible even when the current
 * interface language is not one they read.
 */
const ENDONYM: Record<AppLocale, string> = {
  en: 'English',
  tr: 'Türkçe',
  ja: '日本語',
  zh: '中文',
}

const preference = useLocalePreference()
</script>

<template>
  <nav
    class="flex flex-wrap items-center justify-center gap-x-1 gap-y-1"
    :aria-label="$t('settings.language')"
  >
    <button
      v-for="locale in SUPPORTED_LOCALES"
      :key="locale"
      type="button"
      :lang="locale"
      class="rounded-full px-2.5 py-1.5 text-xs transition-colors"
      :class="
        preference === locale ? 'bg-mist text-ink font-semibold' : 'text-ink-soft hover:text-ink'
      "
      :aria-pressed="preference === locale"
      @click="preference = locale"
    >
      {{ ENDONYM[locale] }}
    </button>
  </nav>
</template>
