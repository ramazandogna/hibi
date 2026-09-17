import { describe, expect, it } from 'vitest'
import { addDays } from 'rei-kit'

import { findMoodPatterns } from '../mood-patterns'
import type { PatternEntry, PatternHabit } from '../mood-patterns'

const START = '2026-03-01'
const RANGE = { from: START, to: '2026-12-31' }

const habit = (id: string, kind: PatternHabit['kind'], since = START): PatternHabit => ({
  id,
  kind,
  since,
})

/** `days` consecutive days from START, one entry each, value from `valueOf`. */
function series(habitId: string, days: number, valueOf: (index: number) => number = () => 1) {
  return Array.from({ length: days }, (_, index): PatternEntry => ({
    habit_id: habitId,
    entry_date: addDays(START, index),
    value: valueOf(index),
  }))
}

describe('findMoodPatterns', () => {
  it('reports the gap between marked and unmarked days', () => {
    // Mood is 4 on even days and 2 on odd days; the run is marked on even days.
    const entries = [
      ...series('mood', 20, (index) => (index % 2 === 0 ? 4 : 2)),
      ...series('run', 20).filter((_, index) => index % 2 === 0),
    ]

    const [pattern] = findMoodPatterns(
      [habit('mood', 'scale'), habit('run', 'build')],
      entries,
      RANGE,
    )

    expect(pattern).toMatchObject({
      ratingHabitId: 'mood',
      habitId: 'run',
      habitKind: 'build',
      markedAverage: 4,
      unmarkedAverage: 2,
      markedDays: 10,
      unmarkedDays: 10,
      difference: 2,
    })
  })

  it('stays silent until both sides have enough rated days', () => {
    const entries = [...series('mood', 8, (index) => (index < 4 ? 5 : 1)), ...series('run', 4)]

    expect(
      findMoodPatterns([habit('mood', 'scale'), habit('run', 'build')], entries, RANGE),
    ).toEqual([])
  })

  it('ignores gaps too small to mean anything', () => {
    const entries = [
      ...series('mood', 20, (index) => (index % 2 === 0 ? 3 : 3)),
      ...series('run', 20).filter((_, index) => index % 2 === 0),
    ]

    expect(
      findMoodPatterns([habit('mood', 'scale'), habit('run', 'build')], entries, RANGE),
    ).toEqual([])
  })

  it('does not count the days before a habit existed as missed', () => {
    // Ten rated days before the run was created would otherwise all read as
    // "not done" and invent a pattern.
    const created = addDays(START, 10)
    const entries = [
      ...series('mood', 20, (index) => (index < 10 ? 1 : 4)),
      ...series('run', 20).filter((_, index) => index >= 10),
    ]

    expect(
      findMoodPatterns([habit('mood', 'scale'), habit('run', 'build', created)], entries, RANGE),
    ).toEqual([])
  })

  it('only looks inside the range', () => {
    const entries = [
      ...series('mood', 20, (index) => (index % 2 === 0 ? 5 : 1)),
      ...series('run', 20).filter((_, index) => index % 2 === 0),
    ]

    expect(
      findMoodPatterns([habit('mood', 'scale'), habit('run', 'build')], entries, {
        from: '2027-01-01',
        to: '2027-12-31',
      }),
    ).toEqual([])
  })

  it('sorts the strongest pattern first, whichever way it points', () => {
    const entries = [
      ...series('mood', 20, (index) => (index % 2 === 0 ? 4 : 3)),
      ...series('read', 20).filter((_, index) => index % 2 === 0),
      ...series('smoke', 20).filter((_, index) => index % 2 === 1),
    ]

    const patterns = findMoodPatterns(
      [habit('mood', 'scale'), habit('read', 'build'), habit('smoke', 'quit')],
      entries,
      RANGE,
    )

    expect(patterns.map((pattern) => [pattern.habitId, pattern.difference])).toEqual([
      ['read', 1],
      ['smoke', -1],
    ])
  })

  it('never compares a rating habit with another rating habit', () => {
    const entries = [...series('mood', 20, () => 4), ...series('energy', 20, () => 2)]

    expect(
      findMoodPatterns([habit('mood', 'scale'), habit('energy', 'scale')], entries, RANGE),
    ).toEqual([])
  })
})
