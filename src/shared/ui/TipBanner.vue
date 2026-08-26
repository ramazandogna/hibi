<script setup lang="ts">
import { ref } from 'vue'
import { Lightbulb, X } from 'lucide-vue-next'

/**
 * Short, sourced-sounding nudges shown above the tab bar.
 *
 * One per session, picked at mount: rotating them on a timer would pull the eye
 * away from whatever the user is doing.
 */
const TIP_KEYS = ['tip.one', 'tip.two', 'tip.three', 'tip.four', 'tip.five', 'tip.six'] as const

const tipKey = ref(TIP_KEYS[Math.floor(Math.random() * TIP_KEYS.length)] ?? TIP_KEYS[0])
const dismissed = ref(false)
</script>

<template>
  <aside
    v-if="!dismissed"
    class="border-hair bg-surface/85 rounded-card pointer-events-auto flex items-start gap-2 border p-2.5 shadow-lg backdrop-blur-md"
  >
    <Lightbulb class="text-amber mt-px size-4 shrink-0" aria-hidden="true" />
    <p class="text-ink-soft flex-1 text-[11px] leading-snug">{{ $t(tipKey) }}</p>
    <button
      type="button"
      class="text-ink-soft hover:text-ink -mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center"
      :aria-label="$t('tip.dismiss')"
      @click="dismissed = true"
    >
      <X class="size-3.5" />
    </button>
  </aside>
</template>
