<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { computed } from 'vue'
import { Github, Mail } from 'lucide-vue-next'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { slideDirection } from '@/shared/lib/tab-transition'
import { useThemeSync } from '@/features/profile/use-theme-sync'

const route = useRoute()
useThemeSync()

const transitionName = computed(() =>
  slideDirection.value === 'none' ? '' : `slide-${slideDirection.value}`,
)

const layoutComponent = computed(() => {
  if (route.meta.layout === 'app') {
    return AppLayout
  }

  return AuthLayout
})
</script>

<template>
  <div class="screen-view">
    <!-- Desktop-only: on a phone the shell fills the screen and this would be
         hidden behind it anyway. The address is split so scrapers miss it. -->
    <aside class="credits">
      <p>© 2026 Hibi</p>
      <a class="credit-link" href="https://github.com/ramazandogna" target="_blank" rel="noopener">
        <Github class="size-3.5" />
        ramazandogna
      </a>
      <span class="credit-link">
        <Mail class="size-3.5" />
        doganrmzn40 [ at ] gmail.com
      </span>
    </aside>

    <div class="shell-frame mobile-screen-view">
      <component :is="layoutComponent">
        <RouterView v-slot="{ Component, route: matched }">
          <Transition :name="transitionName">
            <component :is="Component" :key="matched.path" class="page-slide" />
          </Transition>
        </RouterView>
      </component>
    </div>
  </div>

  <VueQueryDevtools />
</template>

<style>
@reference "@/assets/main.css";

/* A barely-there diamond lattice so the area around the shell is not a flat
   white slab. Both layers are theme colours at very low alpha, so it reads as
   texture rather than decoration and inverts with the theme for free. */
.screen-view {
  @apply bg-canvas fixed inset-0 flex items-center justify-center;
  background-image:
    repeating-linear-gradient(
      45deg,
      color-mix(in srgb, var(--color-deep) 5%, transparent) 0 1px,
      transparent 1px 56px
    ),
    repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--color-deep) 5%, transparent) 0 1px,
      transparent 1px 56px
    );
}

:global(.dark) .screen-view {
  background-image:
    repeating-linear-gradient(
      45deg,
      color-mix(in srgb, var(--color-leaf) 7%, transparent) 0 1px,
      transparent 1px 56px
    ),
    repeating-linear-gradient(
      -45deg,
      color-mix(in srgb, var(--color-leaf) 7%, transparent) 0 1px,
      transparent 1px 56px
    );
}

.credits {
  @apply text-ink-soft absolute bottom-6 left-6 hidden flex-col gap-1 text-[11px] md:flex;
}

.credit-link {
  @apply hover:text-sea flex items-center gap-1.5 transition-colors;
}

.mobile-screen-view {
  @apply bg-surface border-hair md:rounded-shell relative m-auto flex flex-col overflow-hidden md:border md:shadow-xl;
}
</style>
