<script setup lang="ts">
import { ref } from 'vue'
import { Lightbulb, X } from 'lucide-vue-next'

/**
 * Short, sourced-sounding nudges shown above the tab bar.
 *
 * One per session, picked at mount: rotating them on a timer would pull the eye
 * away from whatever the user is doing.
 */
const TIPS = [
  'Missing one day rarely breaks a habit. Missing two starts to.',
  'Habits stick faster when they follow something you already do every day.',
  'Writing down why you slipped is what turns a streak into a story.',
  'Small targets beat ambitious ones: four days a week you keep beats seven you drop.',
  'Rating how you feel takes five seconds and gives next month a shape.',
  'Quitting is a streak too — every clean day counts as progress.',
] as const

const tip = ref(TIPS[Math.floor(Math.random() * TIPS.length)] ?? TIPS[0])
const dismissed = ref(false)
</script>

<template>
  <aside
    v-if="!dismissed"
    class="border-hair bg-surface/85 rounded-card pointer-events-auto flex items-start gap-2 border p-2.5 shadow-lg backdrop-blur-md"
  >
    <Lightbulb class="text-amber mt-px size-4 shrink-0" aria-hidden="true" />
    <p class="text-ink-soft flex-1 text-[11px] leading-snug">{{ tip }}</p>
    <button
      type="button"
      class="text-ink-soft hover:text-ink -mt-1 -mr-1 flex size-7 shrink-0 items-center justify-center"
      aria-label="Dismiss tip"
      @click="dismissed = true"
    >
      <X class="size-3.5" />
    </button>
  </aside>
</template>
