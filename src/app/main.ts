import '../assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/app/providers/query.ts'

import App from './App.vue'
import router from './router/router.ts'
import { useAuthStore } from '@/features/auth/auth.store'
import { i18n, loadActiveLocale } from '@/shared/i18n'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(i18n)
  app.use(VueQueryPlugin, { queryClient })

  const auth = useAuthStore()

  // Both are needed before the first paint and neither depends on the other.
  await Promise.all([auth.init(), loadActiveLocale()])

  app.use(router)
  await router.isReady()

  app.mount('#app')
}

bootstrap()
