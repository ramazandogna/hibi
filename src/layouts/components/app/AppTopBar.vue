<script lang="ts" setup>
import { Crown, Settings } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { BaseButton } from 'rei-kit'
import { usePlusSheet } from '@/features/premium/plus-sheet'
import BrandMark from '@/shared/ui/BrandMark.vue'

const { openPlus } = usePlusSheet()
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

      <BaseButton
        variant="quiet"
        icon
        size="sm"
        class="text-amber/70 hover:bg-amber/10 hover:text-amber"
        :aria-label="$t('topbar.premium')"
        @click="openPlus('topbar')"
      >
        <Crown class="size-[18px]" />
      </BaseButton>
    </div>
  </header>
</template>
