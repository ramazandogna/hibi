import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

import en from '../locales/en'
import ja from '../locales/ja'
import tr from '../locales/tr'
import zh from '../locales/zh'

const LOCALES = { en, tr, ja, zh }

/** Every leaf key as a dotted path, e.g. `habit.deleteWithCount`. */
function leafKeys(node: unknown, prefix = ''): string[] {
  if (typeof node === 'string') return [prefix]

  return Object.entries(node as Record<string, unknown>).flatMap(([key, value]) =>
    leafKeys(value, prefix ? `${prefix}.${key}` : key),
  )
}

const KEYS = leafKeys(en)

describe('message catalogue', () => {
  /**
   * The compiler is what turns `{name}` into a render function, and it runs the
   * first time a message is used — not at build time. A stray `@` (vue-i18n's
   * linked-message operator) or `|` (its plural separator) therefore compiles
   * clean, type-checks clean, and throws in the browser. This forces every
   * message through the compiler once.
   */
  it.each(Object.keys(LOCALES))('compiles every message in %s', (locale) => {
    const i18n = createI18n({ legacy: false, locale, messages: LOCALES })

    for (const key of KEYS) {
      expect(() => i18n.global.t(key)).not.toThrow()
    }
  })

  it.each(Object.keys(LOCALES).filter((locale) => locale !== 'en'))(
    '%s has exactly the keys en has',
    (locale) => {
      expect(leafKeys(LOCALES[locale as keyof typeof LOCALES]).sort()).toEqual([...KEYS].sort())
    },
  )
})
