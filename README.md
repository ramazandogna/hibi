<div align="center">
  <img src="public/pwa-192.png" alt="" width="88" height="88">

  <h1>Hibi</h1>

  <p><strong>ひび — Japanese for <em>days</em>.</strong><br>
  A habit and mood tracker built around one idea: a year of small taps is
  something you can read back.</p>

  <p>
    <img alt="Vue 3" src="https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square">
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ecf8e?style=flat-square">
    <img alt="PWA" src="https://img.shields.io/badge/PWA-installable-26667F?style=flat-square">
  </p>
</div>

---

## What it does

Most trackers ask whether you did the thing. Hibi asks what kind of thing it is
first, because the answer changes what a marked day means.

| Mode      | Colour | A marked day means    | The streak counts              |
| --------- | ------ | --------------------- | ------------------------------ |
| **Build** | green  | you did it            | consecutive days you did it    |
| **Quit**  | red    | you stayed clean      | how long you have stayed clean |
| **Scale** | blue   | you rated the day 1–5 | rolling average, not a streak  |

Alongside every mark you can leave a note, and there is one general note per
day. Those are the point: a streak tells you _what_ happened, a note tells you
_why_. The Year screen is where they pay off — 365 squares, with a marker on
the days you wrote something.

Four screens: **Today** (five days plus a large button for today), **Week**
(seven columns grouped by mode, with a per-group review), **Year** (the
heatmap), and **Profile / Settings**.

Available in **English, Turkish, Japanese and Chinese**, with light and dark
themes and a configurable week start.

It installs to the Home Screen, works offline for reading, and sends a morning
and an evening reminder through Web Push — delivered by a scheduled Postgres job
calling an Edge Function, so they arrive with every tab closed.

## Screens

<!-- Drop four PNGs into docs/screens/ and delete the comment markers around the
     table below. Shoot them at 430 px wide, the width the shell is designed to,
     one in dark mode. Nothing sells a tracker like its Year screen. -->

<!--
| Today | Week | Year | Profile |
| ----- | ---- | ---- | ------- |
| <img src="docs/screens/today.png" alt="Today" width="200"> | <img src="docs/screens/week.png" alt="Week" width="200"> | <img src="docs/screens/year.png" alt="Year" width="200"> | <img src="docs/screens/profile.png" alt="Profile" width="200"> |
-->

## Running it

Requires **Node ≥ 22.18** (or ≥ 24.12) and **pnpm**.

```sh
pnpm install
cp .env.example .env.local     # then fill in the two values
pnpm dev
```

`.env.local` needs a Supabase project:

```sh
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
```

Both are public by design — the anon key ships in the bundle. What protects the
data is row-level security in Postgres, not the key. Apply the schema with the
migrations in [`supabase/migrations/`](supabase/migrations), in order.

### Commands

| Command          | What it does                                          |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Dev server                                            |
| `pnpm build`     | Type-check and build                                  |
| `pnpm check`     | Everything CI runs: format, lint, types, tests, build |
| `pnpm test:unit` | Vitest, watch mode                                    |
| `pnpm lint`      | oxlint + ESLint, with `--fix`                         |
| `pnpm types:db`  | Regenerate `database.types.ts` from the live schema   |

## How it is put together

**Feature-sliced.** `src/features/<name>/` owns its API calls, query keys,
types and components. `src/shared/` holds what more than one feature needs.
Features do not import each other — where they would need to, the view wires
them together instead (the Day panel takes its note field as a slot for exactly
this reason).

**Security lives in Postgres.** Router guards are a convenience for the user,
not a boundary. Every table has RLS enabled and every policy is scoped to
`auth.uid()`, so the anon key in the bundle can only ever read its owner's rows.

**One query per screen, never one per row.** Rendering twelve habits must not
mean twelve requests: a screen fetches a date range once and folds it into a
`Map`, so a row answers "is this day marked" in constant time. Three queries per
screen, no N+1 anywhere.

**Writes do not wait.** Marking a day patches every cached range that contains
it, keeps a snapshot, and rolls back if the request fails.

**Dates are local, always.** `toISOString()` would put a late-evening entry on
tomorrow for anyone east of UTC. Every key goes through `toDateKey`, which reads
local getters, and a shared ref re-checks the date at midnight so an app left
open overnight does not keep writing to yesterday.

**Translations are type-checked.** Each locale is typed as `typeof en`, so a
missing or misspelled key fails the build rather than rendering a raw key on
screen — and a test pushes every message through vue-i18n's compiler, because
compilation happens lazily at runtime and would otherwise reach production.

## The design system is a package, not a folder

The components, composables and tokens that are not about habits live in
[**rei-kit**](https://github.com/ramazandogna/rei-kit)
([npm](https://www.npmjs.com/package/rei-kit)), installed here like any other
dependency. Pulling them out took 79 files and about 1,600 lines out of this
repository.

The interesting part was making that safe rather than making it possible. A
package that an app depends on can break it in ways neither repository's type
checker can see, so the kit is held to three gates:

- **A consumer job.** Every change to the kit packs the real tarball, installs
  it into this app, and runs this app's own `pnpm check`. A change that would
  break Hibi fails in the kit's CI, before it is published.
- **A build-time bundle check.** Every peer dependency must be imported rather
  than inlined. A second copy of a library that works through provide/inject is
  not a spare copy — its injection key differs, so the app's provider becomes
  invisible. This shipped once, in 0.2.0, and took the navigation bar down; it
  cannot ship again, because `prepublishOnly` runs the check.
- **Seam tests, on this side.** Both halves type-check perfectly while wired to
  nothing, so this repository tests the join: that the kit's colour roles are
  defined, that its stylesheet is imported, that the navigation bar mounts
  against a real router.

Publishing runs on npm Trusted Publishing — OIDC, with provenance, and no token
stored in either repository.

## Stack

Vue 3.5 · TypeScript (strict, with `exactOptionalPropertyTypes` and
`noUncheckedIndexedAccess`) · Vite · Tailwind v4 · Pinia · Vue Router ·
TanStack Query · vee-validate + zod · vue-i18n · Supabase · Vitest

## Quality

CI runs on every push and pull request: formatting, oxlint, ESLint,
`vue-tsc`, the unit tests, and the production build — as separate steps, so a
failure names itself. A second workflow pings Supabase every three days, because
a free project pauses after seven days of silence and takes the live demo with
it.

A screen that throws is caught by an error boundary placed inside the layout,
so the shell and the tab bar survive and switching tabs stays available — the
recovery a person actually reaches for.

Bundle and interface work is tracked in two audits kept alongside the code.
Current numbers: **134 KB gzipped** on the critical path across 7 files, and 3
queries per screen. Supabase ships as an umbrella package; realtime, storage and
functions are aliased away at build time, which is 23 KB of that.

## Credits

Built by [Ramazan Doğan](https://github.com/ramazandogna).
