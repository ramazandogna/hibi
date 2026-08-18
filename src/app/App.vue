<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { computed } from 'vue'

const route = useRoute()

const layoutComponent = computed(() => {
  if (route.meta.layout === 'app') {
    return AppLayout
  }

  return AuthLayout
})
</script>

<template>
  <div class="screen-view">
    <div class="mobile-screen-view">
      <component :is="layoutComponent">
        <RouterView />
      </component>
    </div>
  </div>
</template>

<style>
@reference "@/assets/main.css";

.screen-view {
  @apply bg-canvas fixed inset-0 flex items-center justify-center;
}

.mobile-screen-view {
  @apply bg-surface border-hair md:rounded-shell h-mobile-height relative m-auto flex w-full max-w-[430px] flex-col overflow-hidden md:h-[880px] md:max-h-[92vh] md:border md:shadow-xl;
}
</style>
