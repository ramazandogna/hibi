import { globSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { KIND_META } from '@/shared/lib/kind'

/**
 * Text on a filled pigment, measured rather than assumed.
 *
 * Hibi's pigments are its own, so the kit's `text-white` rule cannot be
 * applied by name — `bg-sea` takes white and `bg-leaf` does not. The stylesheet
 * already says so in a comment; this reads the values instead, because a
 * comment does not fail. Hibi keeps the same fills at night, so one pass over
 * `@theme` covers both modes.
 */
const css = readFileSync('src/assets/main.css', 'utf8')

function colour(token: string): string {
  const direct = new RegExp(`--color-${token}:\\s*(#[0-9a-f]{6})`, 'i').exec(css)
  if (direct) return direct[1]!
  const alias = new RegExp(`--color-${token}:\\s*var\\(--color-([\\w-]+)\\)`).exec(css)
  if (alias) return colour(alias[1]!)
  throw new Error(`main.css defines no --color-${token}`)
}

function luminance(hex: string): number {
  const channel = (value: number) => {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  const n = Number.parseInt(hex.slice(1), 16)
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  )
}

function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

describe('text on a filled pigment', () => {
  it.each(Object.entries(KIND_META))('%s reads at AA on its own fill', (_kind, meta) => {
    const fill = colour(meta.fill.replace('bg-', ''))
    const ink = colour(meta.onFill.replace('text-', ''))
    expect(ratio(fill, ink)).toBeGreaterThanOrEqual(4.5)
  })

  it('no kind fill is painted with text-white', () => {
    const offenders = globSync('src/**/*.vue')
      .map((file) => [file, readFileSync(file, 'utf8')] as const)
      .filter(([, source]) => /\.fill,\s*'text-white'/.test(source))
      .map(([file]) => file)
    expect(offenders).toEqual([])
  })
})
