import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import HabitNoteTimeline from '../components/HabitNoteTimeline.vue'
import { i18n } from '@/shared/i18n'
import { KIND_META } from '@/shared/lib/kind'

/**
 * The rail moved to `BaseTimeline` in the kit, and this pins what the move
 * had to preserve.
 *
 * Structure is the point, not pixels. Three things can break without a
 * type error: the notes could arrive in a different order than they were
 * given (the kit sorts nothing, so the order is this app's to keep), the
 * kind's colour could stop reaching the marker (`fill` is a class, and a
 * wrong class is still a valid string), and the list could lose the
 * accessible name the hand-written `<ol>` never had in the first place.
 */
const NOTES = [
  { id: 'b', date: '12 September', body: 'Second, and newest.' },
  { id: 'a', date: '09 September', body: 'First, and older.' },
] as const

const mountRail = () =>
  mount(HabitNoteTimeline, {
    props: { notes: NOTES, kind: 'build' },
    global: { plugins: [i18n] },
  })

describe('HabitNoteTimeline', () => {
  it('keeps the order it was given', () => {
    const bodies = mountRail()
      .findAll('blockquote')
      .map((one) => one.text())

    expect(bodies).toEqual(['Second, and newest.', 'First, and older.'])
  })

  it('names the list, which the hand-written rail did not', () => {
    const list = mountRail().get('ol')

    expect(list.attributes('aria-label')).toBe(i18n.global.t('habit.notes'))
  })

  it("carries the kind's own colour onto the marker", () => {
    expect(mountRail().html()).toContain(KIND_META.build.fill)
  })
})
