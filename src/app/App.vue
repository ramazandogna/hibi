<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import type { NavItem } from '@/shared/types/navigation.types'

const route = useRoute()
const mainNavItems: NavItem[] = [
  { label: 'Week', to: '/', tab: 'week' },
  { label: 'Year', to: '/year', tab: 'year' },
  { label: 'Today', to: '/today', tab: 'today' },
  { label: 'Profile', to: '/profile', tab: 'profile' },
]

const secondaryNavItems = [
  { label: '404', to: '/asdesc' },
  { label: 'Login', to: '/login' },
  { label: 'SignUp', to: '/signup' },
]
</script>

<template>
  <header>
    <div class="global-wrapper">
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      <HelloWorld msg="You did it!" />
      <nav>
        <RouterLink
          v-for="item in mainNavItems"
          :key="item.to"
          :to="item.to"
          :class="{ 'is-active-tab': item.tab && route.meta.tab === item.tab }"
        >
          {{ item.label }}</RouterLink
        >
        <div class="nav-right">
          <RouterLink v-for="item in secondaryNavItems" :key="item.to" :to="item.to">
            {{ item.label }}
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <main class="global-wrapper">
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

/* Tüm kapsayıcıları ve içerikleri kapsayıcı bazında ortalar */
.global-wrapper {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 2rem auto 0px auto;
  display: flex;
}

/* Aktif olan tab bağlantısı */
.is-active-tab {
  color: var(--color-text);
  font-weight: bold; /* Aktif sekmeyi kalın yapar */
}

.is-active-tab:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.nav-right {
  margin-left: auto;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
