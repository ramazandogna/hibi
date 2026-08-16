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
</template>

<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'
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

<style>
header {
  margin-top: 2rem;
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  text-align: center;
  margin: 2rem auto 0px auto;
  display: flex;
}

.is-active-tab {
  color: var(--color-text);
  font-weight: bold;
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
</style>
