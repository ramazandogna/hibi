import { defineStore } from 'pinia'
import { computed, shallowRef, ref } from 'vue'

import { supabase } from '@/shared/lib/supabase'

import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = shallowRef<User | null>(null)
  const isReady = ref(false)
  const isAuthenticated = computed(() => user.value !== null)

  let initialized = false

  async function init() {
    if (initialized) return
    initialized = true

    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      user.value = data.session?.user ?? null

      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
    } finally {
      isReady.value = true
    }
  }

  async function signUp(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    // TODO (phase 18): queryClient.clear()
  }

  return { user, isReady, isAuthenticated, init, signUp, signIn, signOut }
})
