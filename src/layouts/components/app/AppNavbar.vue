<template>
  <header class="app-navbar">
    <div class="global-wrapper">
      <nav class="app-nav">
        <RouterLink
          v-for="item in mainNavItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'is-active-tab': item.tab && route.meta.tab === item.tab }"
        >
          <component :is="item.icon" class="nav-icon" />

          <span class="nav-tooltip">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
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
  @apply absolute left-1/2 z-40 -translate-x-1/2;
  bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
}

.global-wrapper {
  @apply flex w-full justify-center;
}

.app-nav {
  @apply border-hair bg-surface flex h-[48px] items-center justify-center gap-1 border px-3 shadow-lg;
  border-radius: var(--radius-shell);
}

.nav-link {
  @apply text-ink-soft relative flex cursor-pointer items-center justify-center p-2 transition-all duration-300;
  border-radius: var(--radius-card);
}

.nav-link:hover {
  @apply bg-canvas text-ink;
}

.is-active-tab {
  @apply bg-mist text-sea;
}

.nav-icon {
  @apply h-5 w-5 stroke-2;
}

.is-active-tab .nav-icon {
  @apply stroke-[2.5px];
}

.nav-tooltip {
  @apply bg-ink text-canvas pointer-events-none invisible absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 shadow-md transition-all duration-300;
  border-radius: var(--radius-cell);
}

.nav-link:hover .nav-tooltip {
  @apply visible -top-10 opacity-100;
}
</style>
