/**
 * The 1-5 scale, shared by the check-in card, the picker and the heatmap.
 *
 * Opacity is the whole encoding: the same ramp appears in `dayCellClass`, so a
 * "4" in the picker is the exact shade the year grid will show.
 *
 * Labels are looked up as `level.<value>` rather than stored here — the ramp is
 * a design decision, the wording is a translation.
 */
export const LEVELS = [
  { value: 1, opacity: 'opacity-20' },
  { value: 2, opacity: 'opacity-40' },
  { value: 3, opacity: 'opacity-60' },
  { value: 4, opacity: 'opacity-80' },
  { value: 5, opacity: 'opacity-100' },
] as const
