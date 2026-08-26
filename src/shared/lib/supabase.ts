import { createClient } from '@supabase/supabase-js'
import type { SupportedStorage } from '@supabase/supabase-js'
import type { Database } from '@/shared/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is missing. Copy .env.example to .env.local and fill it in.')
}

if (!supabaseAnonKey) {
  throw new Error(
    'VITE_SUPABASE_ANON_KEY is missing. Copy .env.example to .env.local and fill it in.',
  )
}

const REMEMBER_KEY = 'hibi-remember'

/**
 * Records whether the next session should outlive the tab.
 *
 * Call before signing in: the SDK writes the session as soon as the request
 * succeeds, and this decides where it lands.
 */
export function setRememberMe(remember: boolean): void {
  try {
    localStorage.setItem(REMEMBER_KEY, String(remember))
  } catch {
    // Storage blocked; the session will simply not persist.
  }
}

function activeStore(): Storage {
  try {
    return localStorage.getItem(REMEMBER_KEY) === 'false' ? sessionStorage : localStorage
  } catch {
    return sessionStorage
  }
}

/**
 * Session storage that follows the "remember me" choice.
 *
 * Supabase issues a short-lived access token plus a long-lived refresh token,
 * and refreshes in the background. Where the refresh token is kept decides how
 * long a login survives: `localStorage` outlives the browser, `sessionStorage`
 * dies with the tab. On a shared machine that difference is the whole point, so
 * "remember me" switches the store rather than the token lifetime.
 *
 * Removal clears both, so signing out cannot leave a copy behind.
 */
const authStorage: SupportedStorage = {
  getItem: (key) => {
    try {
      return activeStore().getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      activeStore().setItem(key, value)
    } catch {
      // Storage blocked.
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
    } catch {
      // Storage blocked.
    }
  },
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { storage: authStorage },
})
