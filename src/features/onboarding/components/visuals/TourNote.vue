<script setup lang="ts">
import { Quote } from 'lucide-vue-next'
</script>

<template>
  <figure
    class="border-hair bg-surface rounded-card relative w-full max-w-[20rem] border p-4 shadow-sm"
  >
    <Quote class="text-amber/40 absolute -top-2 -left-1 size-6 rotate-180" aria-hidden="true" />

    <figcaption class="text-ink-soft mb-1.5 text-[11px] font-medium tabular-nums">
      {{ $t('onboarding.recordNoteDate') }}
    </figcaption>

    <blockquote class="text-ink text-sm leading-relaxed">
      {{ $t('onboarding.recordNoteBody') }}
    </blockquote>
  </figure>
</template>
