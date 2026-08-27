import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    VitePWA({
      // 'prompt', not 'autoUpdate': swapping the app out from under someone
      // mid-entry is how you lose the note they were writing.
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Hibi — habit & mood tracker',
        short_name: 'Hibi',
        description: 'Build habits, quit what drains you, and notice how you feel.',
        lang: 'en',
        theme_color: '#26667F',
        background_color: '#F4FAF8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Every route is client-side, so a cold navigation to /week must be
        // answered with the shell — the same rule vercel.json applies on the
        // server, restated for the service worker.
        navigateFallback: 'index.html',
        // Supabase responses are per-user and change constantly. Caching them
        // would show one account's data to the next person on a shared device.
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [],
      },
      devOptions: {
        // Off by default: a service worker in dev caches the very files you are
        // editing. Flip it on deliberately when testing install behaviour.
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  /**
   * vue-i18n ships its esm-bundler build expecting the host to resolve these.
   * Undefined, the bundler keeps the legacy Options API, the full install path
   * and the devtools hooks — none of which this app uses, all of which it was
   * paying for.
   */
  define: {
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  build: {
    rollupOptions: {
      output: {
        /**
         * Split the vendors by package family.
         *
         * Without this Rollup merged supabase-js, Vue and vue-i18n into one
         * 100 KB file named after whichever module it happened to pick first,
         * so changing a Turkish string invalidated the same cache entry as the
         * Supabase SDK. This does not make the first load smaller; it makes the
         * second one only re-fetch what actually changed.
         *
         * vee-validate and zod are deliberately absent: forcing them into a
         * named chunk made the whole family a static dependency of the entry
         * again, undoing the async HabitForm. Rollup's own splitting keeps them
         * off the critical path, so it keeps them.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          if (id.includes('@supabase')) return 'vendor-supabase'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (id.includes('vue-i18n') || id.includes('@intlify')) return 'vendor-i18n'
          if (id.includes('/vue/') || id.includes('vue-router') || id.includes('/pinia/')) {
            return 'vendor-vue'
          }

          return undefined
        },
      },
    },
  },
})
