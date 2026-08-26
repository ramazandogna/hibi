<script setup lang="ts">
import BrandMark from '@/shared/ui/BrandMark.vue'
import LocaleLinks from '@/shared/ui/LocaleLinks.vue'
</script>

<template>
  <div
    class="flex min-h-0 w-full flex-1 flex-col items-center gap-8 overflow-y-auto px-6 pt-10 pb-10"
  >
    <BrandMark size="lg" />

    <main class="w-full max-w-[22rem]">
      <slot />
    </main>

    <!-- Sign-in is the first screen a new user sees, and Settings is behind it.
         Without this, someone who does not read the browser's language has no
         way to switch before creating an account. -->
    <LocaleLinks class="mt-auto" />
  </div>
</template>
