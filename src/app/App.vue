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
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<style></style>
