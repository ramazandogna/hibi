<script setup lang="ts">
import { computed } from 'vue'

/**
 * A year at a glance, built the way the real heatmap is: seven rows, one
 * column per week.
 *
 * The density is deterministic rather than random — a hash of the index — so
 * the picture is the same every time the guide is replayed, and it ramps up
 * across the year because that is what a habit taking hold actually looks like.
 */
const WEEKS = 30
const ROWS = 7

const cells = computed(() =>
  Array.from({ length: WEEKS * ROWS }, (_, index) => {
    const week = Math.floor(index / ROWS)
    const noise = ((index * 2654435761) % 1000) / 1000
    const density = 0.15 + (week / WEEKS) * 0.75

    return { index, filled: noise < density, week }
  }),
)
</script>

<template>
  <div
    class="grid w-full grid-flow-col grid-rows-7 gap-[3px]"
    :style="{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }"
    aria-hidden="true"
  >
    <span
      v-for="cell in cells"
      :key="cell.index"
      class="cell aspect-square rounded-[2px]"
      :class="cell.filled ? 'bg-sea' : 'bg-sea/10'"
      :style="{ animationDelay: `${cell.week * 28}ms` }"
    />
  </div>
</template>

<style scoped>
/* Column by column, left to right — the year filling in as it is lived. */
.cell {
  opacity: 0;
  animation: appear 0.5s ease-out forwards;
}

@keyframes appear {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cell {
    opacity: 1;
    animation: none;
  }
}
</style>
