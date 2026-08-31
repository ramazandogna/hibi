<script setup lang="ts">
import { computed, ref } from 'vue'
import { BellRing, Share } from 'lucide-vue-next'

import { useNotifications } from '../notifications'
import { needsIosInstall } from '@/shared/lib/platform'
import { todayKey } from '@/shared/lib/date'
import { addDays } from '@/shared/lib/date'

/**
 * The occasional ask for notification permission.
 *
 * Never shown when the answer is already 'denied': the browser will not
 * re-prompt, so the card could only nag about something the user cannot grant
 * from here. Settings explains that case instead.
 */
const { supported, permission, request } = useNotifications()

const SNOOZE_KEY = 'hibi-notify-nudge'
const SNOOZE_DAYS = 4

function snoozedUntil(): string {
  try {
    return localStorage.getItem(SNOOZE_KEY) ?? ''
  } catch {
    return ''
  }
}

const snoozed = ref(snoozedUntil())

/** iOS cannot grant this from a tab, so the card teaches instead of asking. */
const iosInstallNeeded = needsIosInstall()

const visible = computed(() => {
  if (todayKey() < snoozed.value) return false

  // Nothing here on iOS: the install card above already says that adding Hibi
  // to the Home Screen is what makes notifications possible, and two cards
  // making the same point is one too many.
  if (iosInstallNeeded) return false

  return supported && permission.value === 'default'
})

function snooze() {
  const until = addDays(todayKey(), SNOOZE_DAYS)
  snoozed.value = until

  try {
    localStorage.setItem(SNOOZE_KEY, until)
  } catch {
    // Storage blocked; it will reappear next session rather than never.
  }
}

async function allow() {
  await request()

  // Whatever they chose, stop asking for a while — the prompt itself is the
  // thing that gets tiring, not the answer.
  snooze()
}
</script>

<template>
  <Transition name="nudge">
    <section v-if="visible" class="border-sea/25 bg-sea/5 rounded-card flex gap-3 border p-3.5">
      <span
        class="bg-sea/15 text-sea flex size-10 shrink-0 items-center justify-center rounded-xl"
        aria-hidden="true"
      >
        <component :is="iosInstallNeeded ? Share : BellRing" class="size-5" />
      </span>

      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <p class="text-ink text-sm font-semibold">
            {{ iosInstallNeeded ? $t('notify.iosTitle') : $t('notify.nudgeTitle') }}
          </p>
          <p class="text-ink-soft mt-0.5 text-xs leading-relaxed">
            {{ iosInstallNeeded ? $t('notify.iosBody') : $t('notify.nudgeBody') }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="!iosInstallNeeded"
            type="button"
            class="bg-sea rounded-full px-3.5 py-2 text-xs font-semibold text-white transition-transform duration-100 active:scale-95"
            @click="allow"
          >
            {{ $t('notify.nudgeAction') }}
          </button>

          <button
            type="button"
            class="text-ink-soft hover:text-ink rounded-full px-3 py-2 text-xs font-medium transition-colors"
            @click="snooze"
          >
            {{ $t('notify.nudgeLater') }}
          </button>
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.nudge-enter-active,
.nudge-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.nudge-enter-from,
.nudge-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .nudge-enter-from,
  .nudge-leave-to {
    transform: none;
  }
}
</style>
