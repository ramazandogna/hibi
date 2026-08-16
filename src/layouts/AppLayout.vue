<script setup lang="ts">
import AppNavbar from '@/layouts/components/app/AppNavbar.vue'
</script>

<template>
  <div class="app-layout global-wrapper">
    <!--
    Navbar
    -->
    <AppNavbar />

    <!--
    Content
    -->
    <main class="page-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.page-content {
  margin-top: 2rem;
}

.global-wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
