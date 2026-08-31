import { describe, expect, it } from 'vitest'
import { formatDate } from 'rei-kit'

import { ensureMessages, t, useLocalePreference } from '../index'

/**
 * The seam between this app and rei-kit.
 *
 * Both halves type-check on their own while being wired to nothing: the runtime
 * is what calls the package's `setFormatLocale`, and if that call were dropped
 * every date would quietly fall back to the browser's language. Nothing else in
 * the suite would notice.
 */
describe('rei-kit wiring', () => {
  it('translates through the app catalogue', () => {
    expect(t('common.close')).toBe('Close')
  })

  it('formats dates in the language the app selected', async () => {
    const march = new Date(2026, 2, 14)

    expect(formatDate(march, { month: 'long' })).toBe('March')

    const preference = useLocalePreference()
    preference.value = 'tr'
    await ensureMessages('tr')
    await Promise.resolve()

    expect(t('common.close')).toBe('Kapat')
    expect(formatDate(march, { month: 'long' })).toBe('Mart')
  })
})
