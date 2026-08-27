import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
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
