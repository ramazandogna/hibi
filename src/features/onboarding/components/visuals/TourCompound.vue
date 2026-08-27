<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const up = t('onboarding.compoundUp')
const down = t('onboarding.compoundDown')

const W = 320
const H = 150
const DAYS = 365
/** 1.01^365 ≈ 37.78. Everything is scaled against it. */
const PEAK = Math.pow(1.01, DAYS)

function path(rate: number): string {
  const points: string[] = []

  for (let day = 0; day <= DAYS; day += 5) {
    const x = (day / DAYS) * W
    const y = H - (Math.pow(rate, day) / PEAK) * H
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  return `M${points.join('L')}`
}

const gain = computed(() => path(1.01))
const loss = computed(() => path(0.99))

/** Where 1× sits — both curves start here, which is the point of the picture. */
const baseline = H - (1 / PEAK) * H
</script>

<template>
  <svg
    :viewBox="`0 0 ${W} ${H + 18}`"
    class="h-auto w-full max-w-[22rem] overflow-visible"
    role="img"
    :aria-label="`${up} vs ${down}`"
  >
    <line
      x1="0"
      :y1="baseline"
      :x2="W"
      :y2="baseline"
      stroke="currentColor"
      stroke-width="1"
      stroke-dasharray="2 4"
      class="text-hair"
    />

    <path :d="loss" fill="none" stroke="var(--color-ember)" stroke-width="2.5" class="curve loss" />
    <path :d="gain" fill="none" stroke="var(--color-leaf)" stroke-width="3" class="curve gain" />

    <circle :cx="W" cy="0" r="4" fill="var(--color-leaf)" class="dot" />

    <text :x="W - 6" y="20" text-anchor="end" class="fill-leaf text-[15px] font-bold tabular-nums">
      {{ up }}
    </text>
    <text
      :x="W - 6"
      :y="baseline + 16"
      text-anchor="end"
      class="fill-ember text-[13px] font-semibold tabular-nums"
    >
      {{ down }}
    </text>
  </svg>
</template>

<style scoped>
/* Drawn rather than faded in: the shape of the curve is the argument, and
   watching it leave the baseline is what makes the point land. */
.curve {
  stroke-linecap: round;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.loss {
  animation-delay: 0.15s;
}

.dot {
  opacity: 0;
  animation: pop 0.4s ease-out 1.2s forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes pop {
  from {
    opacity: 0;
    r: 0;
  }
  to {
    opacity: 1;
    r: 4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .curve {
    stroke-dashoffset: 0;
    animation: none;
  }
  .dot {
    opacity: 1;
    animation: none;
  }
}
</style>
