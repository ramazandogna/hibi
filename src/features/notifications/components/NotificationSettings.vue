<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { BellRing, Clock, Share, Wifi } from 'lucide-vue-next'

import { showNotification, useNotifications } from '../notifications'
import { hasPushSubscription } from '../push'
import { BaseButton, SettingsGroup, SettingsRow, needsIosInstall } from 'rei-kit'
import { pushConfigured, subscribeToPush, unsubscribeFromPush } from '../push'
import { t } from '@/shared/i18n'

const { supported, permission, isEnabled, isActive, request } = useNotifications()

/** Whether this browser is registered for pushes that survive the tab closing. */
const pushActive = ref(false)

// Asked of the browser rather than remembered from a toggle: the subscription
// outlives the session that created it, and a returning user was being told
// reminders were foreground-only when they were not.
onMounted(async () => {
  pushActive.value = await hasPushSubscription()
})

/** On iOS the ask is pointless until the app is installed. */
const iosInstallNeeded = needsIosInstall()

async function enable() {
  const result = await request()
  if (result !== 'granted') return

  isEnabled.value = true
  pushActive.value = await subscribeToPush()

  // Granting is the moment to prove it works — the alternative is a switch that
  // claims to be on and no evidence until tomorrow morning.
  await showNotification(t('notify.testTitle'), t('notify.testBody'), 'hibi-test')
}

// Turning the switch off has to reach the server too: a row left behind means
// the sender keeps pushing to someone who asked it to stop.
watch(isEnabled, async (on) => {
  if (permission.value !== 'granted') return

  pushActive.value = on ? await subscribeToPush() : false
  if (!on) await unsubscribeFromPush()
})

async function sendTest() {
  await showNotification(t('notify.testTitle'), t('notify.testBody'), 'hibi-test')
}
</script>

<template>
  <SettingsGroup :title="$t('notify.section')">
    <SettingsRow
      :label="$t('notify.toggle')"
      :description="$t('notify.sectionHint')"
      :icon="BellRing"
      stacked
    >
      <!-- Checked before support: iOS Safari in a tab may not expose the
           Notification API at all, and "unsupported browser" would hide the one
           instruction that actually fixes it. -->
      <div
        v-if="iosInstallNeeded"
        class="border-hair bg-mist/60 rounded-card flex gap-2.5 border p-3"
      >
        <Share class="text-sea mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p class="text-ink text-xs font-semibold">{{ $t('notify.iosTitle') }}</p>
          <p class="text-ink-soft mt-0.5 text-xs leading-relaxed">{{ $t('notify.iosBody') }}</p>
        </div>
      </div>

      <p v-else-if="!supported" class="text-ink-soft text-xs">{{ $t('notify.unsupported') }}</p>

      <div v-else-if="permission === 'denied'" class="flex flex-col gap-1.5">
        <p class="text-alert text-xs font-medium">{{ $t('notify.denied') }}</p>
        <p class="text-ink-soft text-xs leading-snug">{{ $t('notify.deniedHelp') }}</p>
      </div>

      <BaseButton
        v-else-if="permission !== 'granted'"
        variant="primary"
        size="sm"
        class="self-start"
        @click="enable"
      >
        {{ $t('notify.enable') }}
      </BaseButton>

      <div v-else class="flex flex-col gap-3">
        <!-- Permission and the switch are separate: someone can want reminders
             off for a week without revoking a browser permission to get it. -->
        <label class="flex cursor-pointer items-center gap-3">
          <input v-model="isEnabled" type="checkbox" class="accent-sea size-4" />
          <span class="text-ink text-sm">{{ $t('notify.enabled') }}</span>
        </label>

        <p class="text-ink-soft flex items-center gap-1.5 text-xs">
          <Clock class="size-3.5 shrink-0" aria-hidden="true" />
          {{ $t('notify.schedule') }}
        </p>

        <!-- Said plainly, because the difference is the whole feature: without
             a push subscription a reminder only arrives if a tab happens to be
             open at the time. -->
        <p class="text-ink-soft flex items-center gap-1.5 text-xs">
          <Wifi class="size-3.5 shrink-0" aria-hidden="true" />
          {{ pushActive && pushConfigured ? $t('notify.background') : $t('notify.foregroundOnly') }}
        </p>

        <BaseButton
          variant="ghost"
          size="sm"
          class="self-start"
          :disabled="!isActive"
          @click="sendTest"
        >
          {{ $t('notify.test') }}
        </BaseButton>
      </div>
    </SettingsRow>
  </SettingsGroup>
</template>
