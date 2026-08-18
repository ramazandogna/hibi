<template>
  <footer class="app-footer">
    <div class="footer-title">HIBI</div>
    <div class="footer-right">
      <span class="global-icon"><Bolt class="nav-icon" /></span>
      <span class="global-icon"><LayersPlus class="nav-icon" /></span>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { Bolt, LayersPlus } from 'lucide-vue-next'
</script>

<style>
@reference "@/assets/main.css";

.app-footer {
  @apply flex h-[54px] w-full items-center justify-between;
}

.footer-title {
  @apply text-2xl uppercase;
}

.footer-right {
  @apply flex items-center justify-center;
}

.global-icon {
  @apply text-ink-soft active:text-ink flex cursor-pointer items-center justify-center p-2 transition-transform duration-150 active:scale-90;
}

.nav-icon {
  @apply h-5 w-5 stroke-2;
}
</style>
