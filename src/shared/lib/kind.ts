import type { Enums } from '@/shared/types/database.types'

/** 'build' | 'quit' | 'scale' — sourced from the habit_kind enum in Postgres. */
export type HabitKind = Enums<'habit_kind'>

/** Everything the UI needs to render a habit kind: label, colours, wording. */
export interface KindMeta {
  /** Human label for the mode picker and badges. */
  label: string
  /** Solid background for a filled cell or dot. */
  fill: string
  /** Tinted background for icon tiles and chips. */
  soft: string
  /** Foreground colour that pairs with `soft`. */
  text: string
  /** Noun that follows the streak number, e.g. "21 day streak". */
  streakLabel: string
  /** Binary kinds are toggled; `scale` asks for a 1-5 value instead. */
  isBinary: boolean
}

/**
 * Single source of truth for how each habit kind looks and reads.
 *
 * Class names are written out in full on purpose — Tailwind scans source files
 * as plain text, so a string built at runtime (`bg-${x}`) never reaches the CSS.
 *
 * @example
 * ```ts
 * const meta = KIND_META[habit.kind]
 * // <span :class="meta.fill" />
 * // {{ streak }} {{ meta.streakLabel }}
 * ```
 */
export const KIND_META: Record<HabitKind, KindMeta> = {
  build: {
    label: 'Build',
    fill: 'bg-leaf',
    soft: 'bg-leaf/15',
    text: 'text-leaf',
    streakLabel: 'day streak',
    isBinary: true,
  },
  quit: {
    label: 'Quit',
    fill: 'bg-deep',
    soft: 'bg-deep/15',
    text: 'text-deep',
    streakLabel: 'clean days',
    isBinary: true,
  },
  scale: {
    label: 'Scale',
    fill: 'bg-sea',
    soft: 'bg-sea/15',
    text: 'text-sea',
    streakLabel: 'avg this week',
    isBinary: false,
  },
}
