import { describe, expect, it } from 'vitest'

import { lastNDays } from 'rei-kit'
import {
  cleanDays,
  completionRate,
  currentStreak,
  daysThisWeek,
  longestStreak,
  rollingAverage,
  weeksOnTarget,
} from '../streak'

/** Shorthand for building the marked-day sets the functions take. */
const marked = (...keys: string[]) => new Set(keys)

describe('currentStreak', () => {
  it('is zero with no data', () => {
    expect(currentStreak(marked(), '2026-08-24')).toBe(0)
  })

  it('counts today', () => {
    expect(currentStreak(marked('2026-08-24'), '2026-08-24')).toBe(1)
  })

  it('keeps the streak when today is not marked yet', () => {
    expect(currentStreak(marked('2026-08-23'), '2026-08-24')).toBe(1)
  })

  it('breaks when yesterday is missing too', () => {
    expect(currentStreak(marked('2026-08-22'), '2026-08-24')).toBe(0)
  })

  it('counts an unbroken run', () => {
    expect(currentStreak(new Set(lastNDays(10, '2026-08-24')), '2026-08-24')).toBe(10)
  })

  it('stops at the first gap', () => {
    const days = new Set(lastNDays(10, '2026-08-24'))
    days.delete('2026-08-20')

    expect(currentStreak(days, '2026-08-24')).toBe(4)
  })

  it('crosses a month boundary', () => {
    expect(currentStreak(marked('2026-04-30', '2026-05-01'), '2026-05-01')).toBe(2)
  })

  it('crosses a year boundary', () => {
    expect(currentStreak(marked('2026-12-31', '2027-01-01'), '2027-01-01')).toBe(2)
  })

  it('crosses a leap day', () => {
    expect(currentStreak(marked('2028-02-28', '2028-02-29', '2028-03-01'), '2028-03-01')).toBe(3)
  })
})

describe('longestStreak', () => {
  it('is zero with no data', () => {
    expect(longestStreak(marked())).toBe(0)
  })

  it('is one for a single day', () => {
    expect(longestStreak(marked('2026-08-24'))).toBe(1)
  })

  it('returns the longest run, not the latest', () => {
    expect(
      longestStreak(marked('2026-01-01', '2026-01-02', '2026-01-03', '2026-01-06', '2026-01-07')),
    ).toBe(3)
  })

  it('does not join days across a gap', () => {
    expect(longestStreak(marked('2026-01-01', '2026-01-03', '2026-01-05'))).toBe(1)
  })
})

describe('cleanDays', () => {
  it('counts every day since creation when nothing was missed', () => {
    expect(cleanDays(marked(), '2026-08-24', '2026-08-20')).toBe(5)
  })

  it('is zero when today was missed', () => {
    expect(cleanDays(marked('2026-08-24'), '2026-08-24', '2026-08-20')).toBe(0)
  })

  it('counts back to the last slip', () => {
    expect(cleanDays(marked('2026-08-21'), '2026-08-24', '2026-08-20')).toBe(3)
  })
})

describe('completionRate', () => {
  it('is one when every day is marked', () => {
    expect(completionRate(new Set(lastNDays(5, '2026-08-24')), '2026-08-20', '2026-08-24')).toBe(1)
  })

  it('is zero when nothing is marked', () => {
    expect(completionRate(marked(), '2026-08-20', '2026-08-24')).toBe(0)
  })

  it('counts only days inside the range', () => {
    expect(completionRate(marked('2026-08-19', '2026-08-24'), '2026-08-20', '2026-08-24')).toBe(0.2)
  })
})

describe('rollingAverage', () => {
  it('is null with no data in the window', () => {
    expect(rollingAverage(new Map(), '2026-08-24', 7)).toBeNull()
  })

  it('averages the values present', () => {
    const values = new Map([
      ['2026-08-24', 4],
      ['2026-08-23', 2],
    ])

    expect(rollingAverage(values, '2026-08-24', 7)).toBe(3)
  })

  it('ignores days outside the window', () => {
    const values = new Map([
      ['2026-08-24', 5],
      ['2026-08-10', 1],
    ])

    expect(rollingAverage(values, '2026-08-24', 7)).toBe(5)
  })

  it('is null when the window has data only outside it', () => {
    expect(rollingAverage(new Map([['2026-08-10', 3]]), '2026-08-24', 7)).toBeNull()
  })
})

describe('daysThisWeek', () => {
  it('counts only up to today, not the rest of the week', () => {
    // Monday 2026-08-31 .. marked Mon and Tue; today is Tuesday.
    const marked = new Set(['2026-08-31', '2026-09-01', '2026-09-04'])

    expect(daysThisWeek(marked, '2026-09-01', 1)).toBe(2)
  })

  it('respects a Sunday week start', () => {
    const marked = new Set(['2026-08-30', '2026-08-31'])

    // Sunday-start week contains 30 Aug; Monday-start week does not.
    expect(daysThisWeek(marked, '2026-08-31', 0)).toBe(2)
    expect(daysThisWeek(marked, '2026-08-31', 1)).toBe(1)
  })
})

describe('weeksOnTarget', () => {
  it('excludes the week still running', () => {
    // Four full days in each of the two previous weeks, none this week.
    const marked = new Set([
      '2026-08-17',
      '2026-08-18',
      '2026-08-19',
      '2026-08-20',
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
    ])

    expect(weeksOnTarget(marked, '2026-08-31', 1, 4, 2)).toEqual({ met: 2, total: 2 })
  })

  it('counts a week short of the target as missed', () => {
    const marked = new Set(['2026-08-24', '2026-08-25'])

    expect(weeksOnTarget(marked, '2026-08-31', 1, 4, 1)).toEqual({ met: 0, total: 1 })
  })
})
