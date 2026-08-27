import { computed, ref, watchEffect } from 'vue'
import { createI18n } from 'vue-i18n'

import en from './locales/en'

/** Languages the app ships. `en` is both the default and the fallback. */
export const SUPPORTED_LOCALES = ['en', 'tr', 'ja', 'zh'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

/** What the user picks. `system` re-reads the browser on every launch. */
export type LocalePreference = 'system' | AppLocale

export type MessageSchema = typeof en

const STORAGE_KEY = 'hibi-locale'
const FALLBACK: AppLocale = 'en'

/**
 * BCP 47 tag used for `Intl` formatting.
 *
 * Message lookup only needs the base language, but dates and numbers need a
 * region to be right — `zh` alone would leave the formatter to guess.
 */
const INTL_TAG: Record<AppLocale, string> = {
  en: 'en-GB',
  tr: 'tr-TR',
  ja: 'ja-JP',
  zh: 'zh-CN',
}

function isSupported(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

/**
 * First browser language the app can actually speak.
 *
 * `navigator.languages` is ordered by the user's own preference, so the first
 * match is the best one — not simply the first entry.
 */
function detectSystemLocale(): AppLocale {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.split('-')[0]?.toLowerCase()
    if (base && isSupported(base)) return base
  }

  return FALLBACK
}

function readStoredPreference(): LocalePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'system' || (stored && isSupported(stored))) return stored
  } catch {
    // Storage blocked; fall through to the system language.
  }

  return 'system'
}

/**
 * Module-level singleton.
 *
 * A `ref` created inside the composable would give every caller its own copy,
 * and the Settings picker would stop agreeing with the rest of the app.
 */
const preference = ref<LocalePreference>(readStoredPreference())

/** The locale actually in use, with `system` already resolved. */
export const activeLocale = computed<AppLocale>(() =>
  preference.value === 'system' ? detectSystemLocale() : preference.value,
)

/** BCP 47 tag for `Intl`, tracking `activeLocale`. */
export const intlLocale = computed(() => INTL_TAG[activeLocale.value])

/**
 * The other three catalogues, fetched only when they are the one in use.
 *
 * All four together are ~22 KB gzipped and a visitor reads one of them. `en`
 * stays eager because it is also the fallback: something has to render if a
 * dynamic import fails.
 */
const LOADERS: Record<Exclude<AppLocale, 'en'>, () => Promise<{ default: MessageSchema }>> = {
  tr: () => import('./locales/tr'),
  ja: () => import('./locales/ja'),
  zh: () => import('./locales/zh'),
}

/**
 * Only `en` is present at construction; the rest arrive through
 * `setLocaleMessage`. The assertion is what keeps the locale type as
 * `AppLocale` — inferred from the literal it would narrow to `'en'` and reject
 * every switch.
 */
const messages = { en } as Record<AppLocale, MessageSchema>

export const i18n = createI18n({
  legacy: false,
  locale: activeLocale.value,
  fallbackLocale: FALLBACK,
  messages,
})

const loaded = new Set<AppLocale>(['en'])

/**
 * Makes sure a locale's messages are in place before it becomes active.
 *
 * Awaited rather than fired and forgotten: setting the locale first would paint
 * one frame of English at every non-English user, which is exactly the kind of
 * flash a fallback is supposed to prevent, not cause.
 *
 * @example
 * ```ts
 * await ensureMessages('tr')   // main.ts, before mount
 * ```
 */
export async function ensureMessages(locale: AppLocale): Promise<void> {
  if (loaded.has(locale)) return

  try {
    const module = await LOADERS[locale as Exclude<AppLocale, 'en'>]()
    i18n.global.setLocaleMessage(locale, module.default)
    loaded.add(locale)
  } catch {
    // Offline, or a stale chunk after a deploy. `en` is already loaded and
    // fallbackLocale will carry the UI, which beats a blank screen.
  }
}

/** Loads whatever the stored preference resolves to. Call before mounting. */
export function loadActiveLocale(): Promise<void> {
  return ensureMessages(activeLocale.value)
}

/**
 * `t` for code that runs outside a component — schemas, stat helpers, error
 * mappers. Reading it inside a `computed` still tracks the locale, because the
 * Composer's locale is a ref.
 */
export const t = i18n.global.t

// Keeps vue-i18n and the document in sync with the preference. `lang` matters
// beyond tidiness: it drives hyphenation, font fallback and screen readers.
watchEffect(() => {
  i18n.global.locale.value = activeLocale.value
  document.documentElement.lang = activeLocale.value
})

/**
 * Read and write the language preference.
 *
 * @example
 * ```ts
 * const locale = useLocalePreference()
 * locale.value = 'tr'   // persisted, applied everywhere
 * ```
 */
export function useLocalePreference() {
  return computed<LocalePreference>({
    get: () => preference.value,
    set: (next) => {
      const resolved = next === 'system' ? detectSystemLocale() : next

      // Messages first, then the switch — the other order shows English for a
      // frame on the way to the language the user just picked.
      void ensureMessages(resolved).then(() => {
        preference.value = next
      })

      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Storage blocked; the choice lasts for this session only.
      }
    },
  })
}
