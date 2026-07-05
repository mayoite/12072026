# Phase 4 — i18n Copy Migration (Staged)

## Purpose

Move user-visible copy to `i18n/messages/` in **stages** — not all five locales in one step.

## Sources (all in scope)

| Source | Namespace |
|--------|-----------|
| `lib/site-data/routeCopy.ts` (~19 `*_PAGE_COPY`) | per route |
| `lib/site-data/homepage.ts` | `home` |
| `lib/site-data/routeMetadata.ts` | `metadata` — **suggested:** en + hi for Wave 1 routes; defer de/es/fr SEO (see `plans/DECISIONS.md`) |

## Stages

### 4a — English scaffold + key parity

- Migrate all keys to `en.json` namespaces
- Implement `site/scripts/check-i18n-key-parity.mjs` → `check:i18n:parity`
- Wire consumers to `getTranslations` / `useTranslations` for Batch A routes
- `routeCopy.ts` imports removed for migrated routes only

### 4b — Hindi for locale E2E

- Complete `hi.json` for namespaces used in Phase 9 locale spec (home, about, products, contact, solutions)
- SU-F9 partial proof possible after 4b

### 4c — de / es / fr

- Defer with dated `Failures.md` entry per locale (see `plans/DECISIONS.md`)
- Pack **may close** after 4a + 4b + Wave 1; 4c is follow-up unless you promote it to must-ship

## Layout / chrome

- `LanguageSwitcher` → token classes (Phase 5d may implement; tokens must match)
- Planner/offline/admin layouts: `lang` alignment in Phases 6/8

## Tests

- Extend `tests/unit/lib/i18n/*` for key parity
- Re-run `test:audit:hollow` after large i18n refactors (release-gate)
- Async page unit tests: import `@/tests/helpers/nextIntlServerEnMock`, `await Page()`, assert real `en.json` copy — see `TESTING.md`

## Acceptance Checklist

- [x] `check:i18n:parity` exits 0.
- [x] 4a: en namespaces for all marketing routes in contract.
- [x] 4b: hi complete for Phase 9 routes.
- [x] 4c: de/es/fr translated via `apply-pending-translations.mjs` + `pending-translations/*.translated.json`; key parity + wave1 hero copy differs from English; SEO metadata localized (addresses/URLs intentionally same as en).
- [x] Wave 1 consumers wired (about, news, legal, solutions, contact, products).
- [~] `homepage.ts` UI strings migrated (subset in `home` namespace; `/` consumers deferred).
- [x] Metadata strategy documented (migrated or explicit exclusion).
- [x] `test:audit:hollow` after i18n refactors — **passed 2026-06-30** (full repo).
- [x] Marketing page Vitest batch aligned to i18n async pattern — **28/28** local with `CI=true` (push pending for remote `release:gate`).
