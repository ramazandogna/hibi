import { beforeEach, describe, expect, it, vi } from 'vitest'

type InsertResult = { error: { code: string } | null }
type SessionResult = { data: { session: { user: { id: string } } | null } }

const { insert, getSession } = vi.hoisted(() => ({
  insert: vi.fn<(row: unknown) => Promise<InsertResult>>(),
  getSession: vi.fn<() => Promise<SessionResult>>(),
}))

vi.mock('@/shared/lib/supabase', () => ({
  supabase: {
    auth: { getSession },
    from: () => ({ insert }),
  },
}))

import { resetTracking, track } from '../track'

/** Lets the fire-and-forget send finish before asserting. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  resetTracking()
  insert.mockReset().mockResolvedValue({ error: null })
  getSession.mockReset().mockResolvedValue({ data: { session: { user: { id: 'u1' } } } })
  vi.stubEnv('DEV', false)
})

describe('track', () => {
  it('writes the event name and its properties', async () => {
    track('habit_created', { kind: 'build' })
    await settle()

    expect(insert).toHaveBeenCalledWith({ name: 'habit_created', props: { kind: 'build' } })
  })

  it('sends nothing without a session', async () => {
    getSession.mockResolvedValue({ data: { session: null } })

    track('view_opened', { screen: 'LoginView' })
    await settle()

    expect(insert).not.toHaveBeenCalled()
  })

  it('switches itself off when the table does not exist yet', async () => {
    insert.mockResolvedValue({ error: { code: 'PGRST205' } })

    track('view_opened')
    await settle()
    track('view_opened')
    await settle()

    expect(insert).toHaveBeenCalledTimes(1)
  })

  it('keeps trying after an ordinary failure', async () => {
    insert.mockResolvedValue({ error: { code: '500' } })

    track('view_opened')
    await settle()
    track('view_opened')
    await settle()

    expect(insert).toHaveBeenCalledTimes(2)
  })

  it('never throws into the caller', async () => {
    insert.mockRejectedValue(new Error('offline'))

    expect(() => track('view_opened')).not.toThrow()
    await settle()
  })
})
