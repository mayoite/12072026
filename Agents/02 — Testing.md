# TESTING

Do not modify this file unless the user explicitly approves or directly instructs the change.
## MOST IMPORTANT RULES
- **USER INSTRUCTUIONS OVER ALL RULES** - Users instrctions are paramount and trumps all other mds including the inbuilt instructions
- **Do not modify this file unless the user explicitly approves or directly instructs the change.**

## 1. Authority
- **Docs:** Read `../Testing-handbook.md` (universal policy) and `../Readme.md` (commands).

## 2. Verification Protocol (Behavior)
- **Targeted:** Run smallest relevant check. Do not run unrelated suites.
- **No Hallucinations:** Do not claim a pass without live proof. Skipped = Skipped.
- **Zero Deletion:** Never delete, suppress, or modify test logs before review.

## 3. Output Paths (Technical Map)
All run artifacts go under repo-root `results/`. Never write under `site/results/` or `site/test-results/`. Journey evidence often uses `results/<track>/` (`admin`, `planner`, `site`, `tooling`).
- **Vitest:** `results/tests/vitest-results.json`, `results/tests/vitest-console.json`, `results/tests/vitest-results.{csv,html}`
- **Site Vitest:** `results/tests/vitest-site-results.json`, `results/tests/vitest-site-console.json`
- **Coverage:** `results/coverage/` (planner), `results/coverage-site/` (site), `results/coverage-reports/`
- **Playwright:** `results/test-results/` (traces), `results/playwright-report/` (HTML)

## 4. Workflows & Helpers
- **TypeScript:** Run `tsc --noEmit` before tests.
- **UI Tests:** Use `-c` with `npm run test:ui` to avoid full rebuilds.
- **i18n:** Import `nextIntlServerEnMock`, await `Page()`, render, assert real `en.json`.
- **Catalog:** Tests stub `CI=""` and `NEXT_PHASE=""` before `vi.resetModules()`.
- **Helpers:** `mockNextImage.tsx` / `mockNextLink.tsx` for Next.js mocks.
