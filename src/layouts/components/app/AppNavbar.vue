<template>
  <header class="app-navbar">
    <nav class="app-nav" aria-label="Main">
      <RouterLink
        v-for="item in mainNavItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ 'is-active-tab': route.meta.tab === item.tab }"
        :aria-current="route.meta.tab === item.tab ? 'page' : undefined"
      >
        <component :is="item.icon" class="nav-icon" />
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'
import { CheckCheck, Brackets, Calendar1, UserStar } from 'lucide-vue-next'
import type { Component } from 'vue'

import type { AppTab } from '@/shared/types/navigation.types'
import { TAB_LABEL, TAB_ORDER, TAB_PATH } from '@/shared/lib/tabs'

const route = useRoute()

const ICONS: Record<AppTab, Component> = {
  today: CheckCheck,
  week: Brackets,
  year: Calendar1,
  profile: UserStar,
}

// Order, paths and labels come from TAB_ORDER so the bar and the slide
// direction can never disagree.
const mainNavItems = TAB_ORDER.map((tab) => ({
  tab,
  to: TAB_PATH[tab],
  label: TAB_LABEL[tab],
  icon: ICONS[tab],
}))
</script>

<style scoped>
@reference "@/assets/main.css";

/* absolute, not fixed: the bar must hang inside the phone shell, otherwise on
   desktop it sticks to the bottom of the browser window instead. */
.app-navbar {
  @apply absolute left-1/2 z-40 w-full max-w-[360px] -translate-x-1/2 px-4;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
}

.app-nav {
  @apply border-hair bg-surface/85 flex items-center justify-between gap-1 border p-1.5 shadow-lg backdrop-blur-md;
  border-radius: var(--radius-shell);
}

.nav-link {
  @apply text-ink-soft flex min-h-[44px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 py-1.5 transition-colors duration-200;
  border-radius: calc(var(--radius-shell) - 6px);
}

.nav-link:hover {
  @apply text-ink;
}

.is-active-tab {
  @apply bg-mist text-sea;
}

.nav-icon {
  @apply size-5 stroke-2;
}

.is-active-tab .nav-icon {
  @apply stroke-[2.5px];
}

.nav-label {
  @apply text-[10px] leading-none font-medium;
}
</style>
