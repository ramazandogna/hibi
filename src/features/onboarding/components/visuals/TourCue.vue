<script setup lang="ts">
import { ArrowRight, Coffee } from 'lucide-vue-next'
</script>

<template>
  <!-- The claim is that naming the cue is what makes the plan work, so the
       visual is the sentence itself rather than a picture of one. -->
  <div class="flex w-full flex-wrap items-center gap-2" aria-hidden="true">
    <span
      class="bg-mist text-ink rounded-card flex items-center gap-2 px-3 py-2.5 text-sm font-medium"
    >
      <Coffee class="text-ink-soft size-4" />
      {{ $t('onboarding.cueTrigger') }}
    </span>

    <ArrowRight class="text-ink-soft size-4 shrink-0" />

    <span
      class="bg-leaf/12 border-leaf/30 text-ink rounded-card flex items-center gap-2 border px-3 py-2.5 text-sm font-medium"
    >
      <span class="bg-leaf size-3 rounded-[3px]" />
      {{ $t('onboarding.cueAction') }}
    </span>
  </div>
</template>
