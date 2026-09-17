<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { BaseButton, BaseSheet, PriceCard } from 'rei-kit'

import { t } from '@/shared/i18n'
import { usePlusSheet } from '../plus-sheet'

const { isOpen } = usePlusSheet()

const plusFeatures = computed(() => [
  t('premium.featureInsights'),
  t('premium.featureRecap'),
  t('premium.featureSearch'),
  t('premium.featureReminders'),
])

/**
 * Said out loud because it is the promise that makes a paid tier acceptable in
 * a habit app: nothing a person already relies on will be taken back.
 */
const alwaysFree = computed(() => [
  t('premium.freeHabits'),
  t('premium.freeNotes'),
  t('premium.freeViews'),
  t('premium.freeReminders'),
  t('premium.freeExport'),
])
</script>

<template>
  <BaseSheet
    v-model="isOpen"
    :title="$t('premium.title')"
    :subtitle="$t('premium.subtitle')"
    :close-label="$t('common.close')"
  >
    <div class="flex flex-col gap-6">
      <PriceCard
        :name="$t('premium.name')"
        :lead="$t('premium.lead')"
        :price="$t('premium.price')"
        :note="$t('premium.note')"
        :features="plusFeatures"
        tone="warm"
      >
        <template #action>
          <BaseButton block disabled>{{ $t('premium.cta') }}</BaseButton>
        </template>
      </PriceCard>

      <section class="flex flex-col gap-2" aria-labelledby="plus-always-free">
        <h3
          id="plus-always-free"
          class="text-ink-soft px-1 text-xs font-semibold tracking-wide uppercase"
        >
          {{ $t('premium.freeTitle') }}
        </h3>

        <ul class="flex flex-col gap-2 px-1">
          <li
            v-for="item in alwaysFree"
            :key="item"
            class="text-ink flex items-center gap-2 text-sm"
          >
            <Check class="text-leaf size-4 shrink-0" aria-hidden="true" />
            {{ item }}
          </li>
        </ul>
      </section>
    </div>
  </BaseSheet>
</template>
