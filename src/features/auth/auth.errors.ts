import { isAuthError } from '@supabase/supabase-js'

const MESSAGES: Record<string, string> = {
  invalid_credentials: 'Email or password is incorrect.',
  email_not_confirmed: 'Please confirm your email address, then sign in.',
  user_already_exists: 'An account with this email already exists.',
  email_exists: 'An account with this email already exists.',
  weak_password: 'Please choose a stronger password.',
  over_request_rate_limit: 'Too many attempts. Please wait a moment and try again.',
  over_email_send_rate_limit: 'Too many attempts. Please wait a moment and try again.',
  signup_disabled: 'New sign-ups are currently disabled.',
  user_banned: 'This account has been suspended.',
}

export function toAuthMessage(error: unknown): string {
  if (isAuthError(error) && error.code) {
    const known = MESSAGES[error.code]
    if (known) return known
  }

  return 'Something went wrong. Please try again.'
}
