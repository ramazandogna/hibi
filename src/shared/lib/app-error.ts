import { PostgrestError } from '@supabase/supabase-js'

/** Error categories the UI can branch on, independent of Postgres or Supabase. */
export type AppErrorKind = 'conflict' | 'not-found' | 'network' | 'unknown'

/**
 * A normalised error thrown by the data layer.
 *
 * Extends `Error` so it can be thrown, caught and logged like any other error,
 * and keeps the original in `cause` for debugging.
 *
 * @example
 * ```ts
 * try {
 *   await createHabit(input)
 * } catch (e) {
 *   const err = toAppError(e)
 *   if (err.kind === 'conflict') return // already exists, not a real failure
 *   showToast(err.message)
 * }
 * ```
 */
export class AppError extends Error {
  readonly kind: AppErrorKind

  constructor(kind: AppErrorKind, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'AppError'
    this.kind = kind
  }
}

/**
 * Normalises anything thrown by Supabase into an {@link AppError}.
 *
 * Idempotent: an `AppError` is returned as-is, so wrapping twice is safe.
 *
 * @param error - Anything caught from the data layer.
 * @returns An `AppError` with a user-facing message and a `kind` to branch on.
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (error instanceof PostgrestError) {
    switch (error.code) {
      case '23505':
        return new AppError('conflict', 'That record already exists.', { cause: error })
      case 'PGRST116':
        return new AppError('not-found', 'That record no longer exists.', { cause: error })
      case '':
        return new AppError('network', 'Could not reach the server.', { cause: error })
      default:
        return new AppError('unknown', 'Something went wrong.', { cause: error })
    }
  }

  if (error instanceof TypeError) {
    return new AppError('network', 'Could not reach the server.', { cause: error })
  }

  return new AppError('unknown', 'Something went wrong.', { cause: error })
}
