import { ref, watch } from 'vue'

/** What the user asked for; `system` follows the OS. */
export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'hibi-theme'

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

/** Reads the stored preference, falling back to `system`. */
export function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    return isThemePreference(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function storeTheme(preference: ThemePreference): void {
  try {
    localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Private mode or blocked storage: the choice just will not persist.
  }
}

/** Adds or removes `.dark` on `<html>`, resolving `system` against the OS. */
export function applyTheme(preference: ThemePreference): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = preference === 'dark' || (preference === 'system' && prefersDark)

  document.documentElement.classList.toggle('dark', isDark)
}

/**
 * The live theme preference, shared by every caller.
 *
 * Module level on purpose: a per-call ref would let the settings screen and the
 * app root drift apart. `localStorage` is the source read at boot, because the
 * inline script in index.html needs an answer before any bundle loads; the
 * database copy only carries the choice between devices.
 */
const preference = ref<ThemePreference>(readStoredTheme())

watch(
  preference,
  (next) => {
    storeTheme(next)
    applyTheme(next)
  },
  { immediate: true },
)

// While on `system`, follow the OS if the user flips it at night.
const media = window.matchMedia('(prefers-color-scheme: dark)')

media.addEventListener('change', () => {
  if (preference.value === 'system') applyTheme('system')
})

/** @returns The shared preference ref; assigning to it stores and applies it. */
export function useTheme() {
  return preference
}
