<script setup lang="ts">
import BrandMark from '@/shared/ui/BrandMark.vue'
</script>

<template>
  <div class="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-8 px-6 py-10">
    <BrandMark size="lg" />

    <main class="w-full max-w-[22rem]">
      <slot />
    </main>
  </div>
</template>
