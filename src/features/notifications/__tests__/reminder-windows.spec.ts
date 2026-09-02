import { describe, expect, it } from 'vitest'

import { slotForNow } from '../reminder-windows'

/**
 * The windows exist to keep a reminder inside the day it is about.
 *
 * The evening nudge asks how today went; arriving after midnight it is asking
 * about a day that is already over. That is what a user reported, so the
 * boundaries are pinned here rather than left to be re-derived by reading.
 */

const at = (hour: number, minute = 0) => slotForNow(new Date(2026, 0, 15, hour, minute))

describe('slotForNow', () => {
  it.each([
    ['just before the morning window', 8, 29, null],
    ['when the morning window opens', 8, 30, 'morning'],
    ['late morning', 11, 59, 'morning'],
    ['when the morning window closes', 12, 0, null],
    ['the afternoon', 17, 0, null],
    ['when the evening window opens', 21, 0, 'evening'],
    ['late evening', 22, 59, 'evening'],
    ['when the evening window closes', 23, 0, null],
  ])('is %s', (_label, hour, minute, expected) => {
    expect(at(hour as number, minute as number)).toBe(expected)
  })

  it('is silent through the night, so nothing can arrive after midnight', () => {
    const overnight = [23, 0, 1, 2, 3, 4, 5, 6, 7].map((hour) => at(hour))

    expect(overnight.every((slot) => slot === null)).toBe(true)
  })
})
