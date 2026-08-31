import { t } from '@/shared/i18n'
import { fromDateKey } from 'rei-kit'

export type ReminderSlot = 'morning' | 'evening'

/**
 * Picks one of `count` variants for a given day.
 *
 * Deterministic rather than random: the same day always produces the same line,
 * so a reminder dismissed and re-read does not change its wording, but two
 * consecutive mornings do not repeat either.
 */
function variant(dateKey: string, count: number): number {
  const date = fromDateKey(dateKey)
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000,
  )

  return (dayOfYear % count) + 1
}

export interface MorningFacts {
  /** Build habits not yet marked today. */
  build: number
  /** Quit habits still to stay clean from today. */
  quit: number
}

/**
 * The morning nudge: what is waiting, and one line of encouragement.
 *
 * The body is assembled from parts rather than written as one sentence per
 * case, because "2 to build · 1 to stay clean from" needs to survive a language
 * where those clauses join differently — and drop cleanly when a count is zero.
 */
export function morningMessage(dateKey: string, facts: MorningFacts) {
  const title = t(`notify.morningTitle${variant(dateKey, 3)}`)
  const parts: string[] = []

  if (facts.build > 0) parts.push(t('notify.morningBuild', { count: facts.build }))
  if (facts.quit > 0) parts.push(t('notify.morningQuit', { count: facts.quit }))

  const lead = parts.length > 0 ? `${parts.join(' · ')}.` : t('notify.morningNone')
  const push = t(`notify.morningPush${variant(dateKey, 3)}`)

  return { title, body: `${lead} ${push}` }
}

export interface EveningFacts {
  /** Habits still unmarked today. */
  open: number
  /** Habits marked today. */
  done: number
}

/**
 * The evening nudge, in three moods.
 *
 * The "nothing done" line deliberately echoes the research in the guide: a
 * single missed day barely registers. Scolding someone at 21:00 for a bad day
 * is how a tracker gets deleted.
 */
export function eveningMessage(dateKey: string, facts: EveningFacts) {
  const title = t(`notify.eveningTitle${variant(dateKey, 3)}`)

  if (facts.open === 0 && facts.done > 0) {
    return {
      title,
      body: `${t('notify.eveningAllDone')} ${t(`notify.eveningPushDone${variant(dateKey, 3)}`)}`,
    }
  }

  if (facts.done === 0) {
    return {
      title,
      body: `${t('notify.eveningNone')} ${t(`notify.eveningPushNone${variant(dateKey, 3)}`)}`,
    }
  }

  return {
    title,
    body: `${t('notify.eveningLeft', { count: facts.open })} ${t(
      `notify.eveningPushLeft${variant(dateKey, 3)}`,
    )}`,
  }
}
