<script lang="ts" setup>
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'

/** Tooltip is click-driven, not hover: it has to work on touch too. */
const showPremiumHint = ref(false)
</script>

<template>
  <header class="flex h-20 w-full shrink-0 items-center px-1">
    <span class="w-11" aria-hidden="true" />

    <h1 class="flex flex-1 justify-center">
      <!-- The column shrinks to the hiragana, so the Latin line below can
           justify its letters across exactly that width. -->
      <span class="inline-flex flex-col items-center gap-1">
        <span
          class="from-leaf via-sea to-deep bg-gradient-to-r bg-clip-text text-[2.75rem] leading-none font-bold tracking-wide text-transparent"
          lang="ja"
          aria-hidden="true"
        >
          ひび
        </span>

        <span
          class="from-leaf via-sea to-deep flex w-full justify-between bg-gradient-to-r bg-clip-text text-sm leading-none font-semibold text-transparent"
          aria-hidden="true"
        >
          <span>h</span><span>İ</span><span>b</span><span>İ</span>
        </span>

        <span class="sr-only">Hibi</span>
      </span>
    </h1>

    <div class="relative w-11">
      <button
        type="button"
        class="text-ink-soft hover:text-sea flex size-11 items-center justify-center transition-colors"
        aria-label="Premium"
        :aria-expanded="showPremiumHint"
        @click="showPremiumHint = !showPremiumHint"
      >
        <Sparkles class="size-6" />
      </button>

      <p
        v-if="showPremiumHint"
        role="status"
        class="bg-ink text-canvas rounded-card absolute top-12 right-0 z-50 w-max px-3 py-1.5 text-xs shadow-lg"
      >
        Premium — coming soon
      </p>
    </div>
  </header>
</template>
