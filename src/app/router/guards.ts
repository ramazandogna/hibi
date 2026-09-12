import { createAuthGuard, createTitleGuard } from 'rei-kit/app'

import { useAuthStore } from '@/features/auth/auth.store'

/**
 * Who may see what, and where the rest go.
 *
 * The kit's guard: the login route is this app's, the rest is the same two
 * questions every app asks. The return path goes through `toRedirectPath`
 * inside it — this app used to pass `fullPath` straight into the query string,
 * which put an OAuth fragment, and the tokens in it, one request away from the
 * server's access log.
 */
export const authGuard = createAuthGuard({
  isAuthenticated: () => useAuthStore().isAuthenticated,
  signIn: { name: 'LoginView' },
})

export const titleGuard = createTitleGuard('Hibi')
