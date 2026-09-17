import { describe, expect, it } from 'vitest'

import { isPlusActive } from '../entitlement'

const NOW = new Date('2026-09-17T12:00:00Z')

describe('isPlusActive', () => {
  it('is off without a row', () => {
    expect(isPlusActive(null, NOW)).toBe(false)
  })

  it('is on for a running subscription', () => {
    expect(
      isPlusActive({ status: 'active', current_period_end: '2026-10-17T12:00:00Z' }, NOW),
    ).toBe(true)
  })

  it('is on for a lifetime purchase, which has no end', () => {
    expect(isPlusActive({ status: 'active', current_period_end: null }, NOW)).toBe(true)
  })

  it('is off once the period has ended, whatever the status says', () => {
    expect(
      isPlusActive({ status: 'active', current_period_end: '2026-09-17T11:59:59Z' }, NOW),
    ).toBe(false)
  })

  it('is off when cancelled or expired', () => {
    for (const status of ['cancelled', 'expired']) {
      expect(isPlusActive({ status, current_period_end: '2027-01-01T00:00:00Z' }, NOW)).toBe(false)
    }
  })
})
