<script lang="ts" setup>
import { ref } from 'vue'
import { BellRing, Crown, Settings, Sparkles, TrendingUp } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import BaseSheet from '@/shared/ui/BaseSheet.vue'
import BrandMark from '@/shared/ui/BrandMark.vue'

/**
 * A sheet, not a tooltip: a floating card anchored to a 36px icon has nowhere
 * to go on a narrow screen, and there is no hover on touch to dismiss it.
 */
const premiumOpen = ref(false)

const PERKS = [
  { icon: BellRing, key: 'premium.reminders' },
  { icon: TrendingUp, key: 'premium.recaps' },
  { icon: Sparkles, key: 'premium.insights' },
] as const
</script>

<template>
  <header class="flex h-20 w-full shrink-0 items-center justify-between px-2">
    <!-- Both sides reserve the same width so the wordmark stays centred. -->
    <span class="w-11" aria-hidden="true" />

    <h1 class="flex flex-1 justify-center">
      <BrandMark />
    </h1>

    <div class="flex w-11 flex-col items-center gap-1">
      <RouterLink
        to="/settings"
        class="text-ink-soft hover:bg-mist hover:text-sea rounded-card flex size-9 items-center justify-center transition-colors active:scale-90"
        :aria-label="$t('topbar.settings')"
      >
        <Settings class="size-[18px]" />
      </RouterLink>

      <button
        type="button"
        class="text-amber/70 hover:bg-amber/10 hover:text-amber rounded-card flex size-9 items-center justify-center transition-colors active:scale-90"
        :aria-label="$t('topbar.premium')"
        @click="premiumOpen = true"
      >
        <Crown class="size-[18px]" />
      </button>
    </div>
  </header>

  <BaseSheet
    v-model="premiumOpen"
    :title="$t('premium.title')"
    :subtitle="$t('premium.subtitle')"
  >
    <ul class="flex flex-col gap-3">
      <li v-for="perk in PERKS" :key="perk.key" class="flex items-center gap-3">
        <span
          class="bg-amber/15 text-amber flex size-10 shrink-0 items-center justify-center rounded-xl"
          aria-hidden="true"
        >
          <component :is="perk.icon" class="size-5" />
        </span>
        <span class="text-ink text-sm">{{ $t(perk.key) }}</span>
      </li>
    </ul>

    <p
      class="bg-mist text-ink-soft rounded-card mt-6 px-3 py-2 text-center text-xs font-medium"
      role="status"
    >
      {{ $t('premium.soon') }}
    </p>
  </BaseSheet>
</template>
