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
  /** Heading for the group this kind forms in a habit list. */
  groupLabel: string
  /** Tinted card surface: background, border and shadow in the kind's colour. */
  card: string
  /** Unmarked cell: the fill at low opacity, so a card reads as one colour. */
  empty: string
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
    groupLabel: 'Habits to build',
    card: 'bg-leaf/5 border-leaf/25 shadow-sm shadow-leaf/20',
    empty: 'bg-leaf/15',
    isBinary: true,
  },
  quit: {
    label: 'Quit',
    fill: 'bg-ember',
    soft: 'bg-ember/15',
    text: 'text-ember',
    streakLabel: 'clean days',
    groupLabel: 'Things to quit',
    card: 'bg-ember/5 border-ember/25 shadow-sm shadow-ember/20',
    empty: 'bg-ember/15',
    isBinary: true,
  },
  scale: {
    label: 'Scale',
    fill: 'bg-sea',
    soft: 'bg-sea/15',
    text: 'text-sea',
    streakLabel: 'avg this week',
    groupLabel: 'How you feel',
    card: 'bg-sea/5 border-sea/25 shadow-sm shadow-sea/20',
    empty: 'bg-sea/15',
    isBinary: false,
  },
}

const SCALE_OPACITY = ['opacity-20', 'opacity-40', 'opacity-60', 'opacity-80', 'opacity-100']

/**
 * Tailwind classes for one day cell.
 *
 * Single source for cell colour: the habit row, the year heatmap and the week
 * grid all call this, so changing how a marked day looks is one edit.
 *
 * @param options.kind - Habit mode, decides the fill colour.
 * @param options.isMarked - Whether the day has an entry.
 * @param options.value - 1-5 value for `scale` habits; drives opacity.
 * @param options.isFuture - Future days render as an empty outline.
 *
 * @example
 * ```ts
 * dayCellClass({ kind: 'build', isMarked: true })            // 'bg-leaf'
 * dayCellClass({ kind: 'scale', isMarked: true, value: 3 })  // 'bg-sea opacity-60'
 * dayCellClass({ kind: 'quit', isMarked: false })            // 'bg-mist'
 * ```
 */
export function dayCellClass(options: {
  kind: HabitKind
  isMarked: boolean
  value?: number | null | undefined
  isFuture?: boolean | undefined
}): string {
  const { kind, isMarked, value = null, isFuture = false } = options

  const meta = KIND_META[kind]

  if (isFuture) return 'border-hair border bg-transparent'
  if (!isMarked) return meta.empty

  if (kind !== 'scale') return meta.fill

  return `${meta.fill} ${SCALE_OPACITY[(value ?? 1) - 1] ?? 'opacity-100'}`
}

/**
 * Splits habits into one group per kind, in `KIND_ORDER`.
 *
 * Grouping is a reading aid: a screen of twelve mixed rows is noise, three
 * labelled blocks is a summary. Empty kinds are dropped so a user who only
 * builds habits never sees an empty "Things to quit" heading.
 *
 * @example
 * ```ts
 * groupByKind(habits, (habit) => habit.kind)
 * // [{ kind: 'build', label: 'Habits to build', items: [...] }, ...]
 * ```
 */
export const KIND_ORDER = ['build', 'quit', 'scale'] as const satisfies readonly HabitKind[]

export function groupByKind<T>(
  items: readonly T[],
  getKind: (item: T) => HabitKind,
): { kind: HabitKind; label: string; items: T[] }[] {
  return KIND_ORDER.map((kind) => ({
    kind,
    label: KIND_META[kind].groupLabel,
    items: items.filter((item) => getKind(item) === kind),
  })).filter((group) => group.items.length > 0)
}
