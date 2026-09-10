<script setup lang="ts">
import { BaseCard } from 'rei-kit'
import { Quote } from 'lucide-vue-next'
</script>

<template>
  <BaseCard as="figure" padding="md" class="relative w-full max-w-[20rem] shadow-sm">
    <Quote class="text-amber/40 absolute -top-2 -left-1 size-6 rotate-180" aria-hidden="true" />

    <figcaption class="text-ink-soft mb-1.5 text-[11px] font-medium tabular-nums">
      {{ $t('onboarding.recordNoteDate') }}
    </figcaption>

    <blockquote class="text-ink text-sm leading-relaxed">
      {{ $t('onboarding.recordNoteBody') }}
    </blockquote>
  </BaseCard>
</template>
