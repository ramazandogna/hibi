<script setup lang="ts">
/**
 * A headline number with its unit, used by the slides that carry research.
 *
 * The number is the argument on those slides, so it is set at display size in
 * the brand gradient and everything else defers to it.
 */
const {
  value,
  label,
  range = '',
} = defineProps<{
  value: string
  label: string
  /** Optional spread, drawn as a bar — a median without one oversells it. */
  range?: string
}>()
</script>

<template>
  <div class="flex flex-col items-start gap-1">
    <span
      class="brand-gradient bg-clip-text text-[5.5rem] leading-[0.85] font-bold tracking-tight text-transparent tabular-nums"
    >
      {{ value }}
    </span>

    <span class="text-ink-soft text-sm font-medium tracking-wide">{{ label }}</span>

    <div v-if="range" class="mt-3 flex w-full max-w-[16rem] flex-col gap-1.5">
      <div class="bg-hair relative h-1.5 w-full overflow-hidden rounded-full">
        <!-- The median sits well left of centre in the real data, and the bar
             says so rather than implying a tidy midpoint. -->
        <span class="bg-sea/40 absolute inset-y-0 left-0 w-full rounded-full" />
        <span class="bg-sea absolute inset-y-0 left-[20%] w-1.5 rounded-full" />
      </div>
      <span class="text-ink-soft text-xs tabular-nums">{{ range }}</span>
    </div>
  </div>
</template>
