<template>
  <header class="app-header">
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

const route = useRoute()

const mainNavItems = [
  { label: 'Today', to: '/', tab: 'today', icon: CheckCheck },
  { label: 'Week', to: '/week', tab: 'week', icon: Brackets },
  { label: 'Year', to: '/year', tab: 'year', icon: Calendar1 },
  { label: 'Profile', to: '/profile', tab: 'profile', icon: UserStar },
]
</script>

<style scoped>
@reference "@/assets/main.css";

.app-header {
  @apply absolute bottom-8 left-1/2 z-50 -translate-x-1/2;
}

/* Wrapper */
.global-wrapper {
  @apply flex w-full justify-center;
}

.app-nav {
  @apply border-hair bg-surface flex items-center justify-center gap-2 rounded-(--radius-shell) border px-4 py-3 shadow-lg;
}

.nav-link {
  @apply rounded-card text-ink-, relative flex cursor-pointer items-center justify-center p-3 transition-all duration-300;
}

.nav-link:hover {
  @apply bg-canvas text-ink;
}

/* Aktif Sekme Stili */
.is-active-tab {
  @apply bg-mist text-sea;
}

.nav-icon {
  @apply h-6 w-6 stroke-2;
}

.is-active-tab .nav-icon {
  @apply stroke-[2.5px];
}

.nav-tooltip {
  @apply rounded-cell bg--ink text-can, pointer-events-none invisible absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap opacity-0 shadow-md transition-all duration-300;
}

/* Linkin üzerine gelindiğinde Tooltip'in görünür olması (CSS Hover State) */
.nav-link:hover .nav-tooltip {
  @apply visible -top-12 opacity-100;
}
</style>
