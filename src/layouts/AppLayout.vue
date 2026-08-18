<script setup lang="ts">
import AppNavbar from '@/layouts/components/app/AppNavbar.vue'
import AppFooter from './components/app/AppFooter.vue'
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

    <!--
    Footer
    -->
    <AppFooter />
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.app-layout {
  display: flex;
  flex-grow: 1;
}

.page-content {
  @apply mt-8 flex grow;
}

.global-wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
