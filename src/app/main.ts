import '../assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '@/app/providers/query.ts'

import App from './App.vue'
import router from './router/router.ts'
import { useAuthStore } from '@/features/auth/auth.store'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(VueQueryPlugin, { queryClient })

  const auth = useAuthStore()
  await auth.init()

  app.use(router)
  await router.isReady()

  app.mount('#app')
}

bootstrap()
