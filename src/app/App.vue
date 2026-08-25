<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { computed } from 'vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { slideDirection } from '@/shared/lib/tab-transition'
import { useTheme } from '@/shared/lib/theme'

const route = useRoute()
useTheme()

const transitionName = computed(() =>
  slideDirection.value === 'none' ? '' : `slide-${slideDirection.value}`,
)

const layoutComponent = computed(() => {
  if (route.meta.layout === 'app') {
    return AppLayout
  }

  return AuthLayout
})
</script>

<template>
  <div class="screen-view">
    <div class="shell-frame mobile-screen-view">
      <component :is="layoutComponent">
        <RouterView v-slot="{ Component, route: matched }">
          <Transition :name="transitionName">
            <component :is="Component" :key="matched.path" class="page-slide" />
          </Transition>
        </RouterView>
      </component>
    </div>
  </div>

  <VueQueryDevtools />
</template>

<style>
@reference "@/assets/main.css";

.screen-view {
  @apply bg-canvas fixed inset-0 flex items-center justify-center;
}

.mobile-screen-view {
  @apply bg-surface border-hair md:rounded-shell relative m-auto flex flex-col overflow-hidden md:border md:shadow-xl;
}
</style>
