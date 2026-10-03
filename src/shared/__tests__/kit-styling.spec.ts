import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { checkStyling } from 'rei-kit/check'

/**
 * The seam that type-checking cannot see.
 *
 * rei-kit ships compiled components that reference colour roles by name and
 * carry their own scoped stylesheet. Neither is visible to `vue-tsc` or to a
 * component test: a missing token or a missing import produces markup that is
 * still valid, still renders, and is simply unstyled. That is exactly how a
 * release once reached production with the tab bar invisible.
 *
 * This file used to assert all of that by hand. Kakei had written the same
 * checks, independently, three of them under the same names — so the kit took
 * them over in 3.5.0 and the list is the kit's to keep in step now. Its
 * version also knows two things this one did not: that the preset answers
 * several of these at once, and that `@theme` lands in `:root` while the
 * kit's `.dark` comes after it, which is how a rebranded role quietly
 * reverts after dark.
 */
const read = (path: string) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')

describe('rei-kit styling contract', () => {
  it('is wired to the kit', () => {
    const problems = checkStyling({
      css: read('../../assets/main.css'),
      tokens: read('../../../node_modules/rei-kit/dist/tokens.css'),
    })

    expect(problems.map((problem) => `${problem.message} — ${problem.fix ?? ''}`)).toEqual([])
  })

  it("imports the kit's tokens rather than restating them", () => {
    /* Not the kit's to check: Hibi kept its own copy of the roles, the dark
       variant and the whole phone shell -- byte-for-byte the kit's, because
       the kit was extracted from here. Two copies of one decision means a
       change to the shell in the kit cannot reach the app it came from. */
    expect(read('../../assets/main.css')).toMatch(/@import\s+['"]rei-kit\/tokens\.css['"]/)
  })
})
