<script lang="ts" setup>
import { ref } from 'vue'
import { Crown, Settings } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import BrandMark from '@/shared/ui/BrandMark.vue'

/** Tooltip is click-driven, not hover: it has to work on touch too. */
const showPremiumHint = ref(false)
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
        class="text-ink-soft hover:bg-mist hover:text-sea rounded-card flex size-9 items-center justify-center transition-colors"
        aria-label="Settings"
      >
        <Settings class="size-[18px]" />
      </RouterLink>

      <div class="relative">
        <button
          type="button"
          class="text-ink-soft hover:bg-mist hover:text-amber rounded-card flex size-9 items-center justify-center transition-colors"
          aria-label="Premium"
          :aria-expanded="showPremiumHint"
          @click="showPremiumHint = !showPremiumHint"
        >
          <Crown class="size-[18px]" />
        </button>

        <p
          v-if="showPremiumHint"
          role="status"
          class="bg-ink text-canvas rounded-card absolute top-10 right-0 z-50 w-max px-3 py-1.5 text-xs shadow-lg"
        >
          Premium — coming soon
        </p>
      </div>
    </div>
  </header>
</template>
