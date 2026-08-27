<script setup lang="ts">
/**
 * Three weeks of days with one gap in them.
 *
 * The slide's claim is that a single miss barely registers; showing it as one
 * pale square in a wall of colour is more convincing than saying so.
 */
const DAYS = 21
const MISSED = 9
</script>

<template>
  <div class="flex flex-wrap gap-1.5" aria-hidden="true">
    <span
      v-for="day in DAYS"
      :key="day"
      class="cell size-6 rounded-[5px]"
      :class="day === MISSED ? 'bg-leaf/15' : 'bg-leaf'"
      :style="{ animationDelay: `${day * 45}ms` }"
    />
  </div>
</template>

<style scoped>
.cell {
  opacity: 0;
  animation: fill 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fill {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cell {
    opacity: 1;
    animation: none;
  }
}
</style>
