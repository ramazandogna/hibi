<template>
  <header class="app-navbar">
    <nav class="app-nav" :aria-label="$t('nav.main')">
      <RouterLink
        v-for="item in mainNavItems"
        :key="item.to"
        :to="item.to"
        class="nav-link"
        :class="{ 'is-active-tab': route.meta.tab === item.tab }"
        :aria-current="route.meta.tab === item.tab ? 'page' : undefined"
        @click="tapFeedback()"
      >
        <span class="nav-icon-slot">
          <component :is="item.icon" class="nav-icon" />
        </span>
        <span class="nav-label">{{ $t(`nav.${item.tab}`) }}</span>
      </RouterLink>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router'
import { CheckCheck, Brackets, Calendar1, UserStar } from 'lucide-vue-next'
import type { Component } from 'vue'

import type { AppTab } from '@/shared/types/navigation.types'
import { tapFeedback } from 'rei-kit'
import { TAB_ORDER, TAB_PATH } from '@/shared/lib/tabs'

const route = useRoute()

const ICONS: Record<AppTab, Component> = {
  today: CheckCheck,
  week: Brackets,
  year: Calendar1,
  profile: UserStar,
}

// Order and paths come from TAB_ORDER so the bar and the slide direction can
// never disagree; the label is looked up per render so it follows the language.
const mainNavItems = TAB_ORDER.map((tab) => ({
  tab,
  to: TAB_PATH[tab],
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
  @apply text-ink-soft flex min-h-[52px] flex-1 cursor-pointer flex-col items-center justify-center gap-1 py-1.5;
  border-radius: calc(var(--radius-shell) - 6px);
  /* Only the icon reacts to a press. Scaling the whole link would drag the
     label and the pill with it, which reads as the bar wobbling. */
  transition: color 200ms ease;
}

.nav-link:hover {
  @apply text-ink;
}

/* The pill is a background on the icon rather than the link, so the active tab
   grows a marker instead of the row changing shape. */
.nav-icon-slot {
  @apply flex h-7 w-12 items-center justify-center rounded-full transition-all duration-200 ease-out;
}

.nav-link:active .nav-icon-slot {
  transform: scale(0.88);
}

.is-active-tab {
  @apply text-sea;
}

.is-active-tab .nav-icon-slot {
  @apply bg-mist;
}

.nav-icon {
  @apply size-[18px] stroke-2 transition-transform duration-200;
}

.is-active-tab .nav-icon {
  @apply scale-110 stroke-[2.5px];
}

.nav-label {
  @apply text-[10px] leading-none font-medium;
}

.is-active-tab .nav-label {
  @apply font-semibold;
}

@media (prefers-reduced-motion: reduce) {
  .nav-icon-slot,
  .nav-icon {
    transition: none;
  }
  .nav-link:active .nav-icon-slot {
    transform: none;
  }
}
</style>
