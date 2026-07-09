# Agents/Agents-testing.md

## 1. Authority
- **Docs:** Read `../testing-handbook.md` (universal policy) and `../Readme.md` (commands).

## 2. Verification Protocol (Behavior)
- **Targeted:** Run smallest relevant check. Do not run unrelated suites.
- **No Hallucinations:** Do not claim a pass without live proof. Skipped = Skipped.
- **Zero Deletion:** Never delete, suppress, or modify test logs before review.
- **Screenshots:** When testing planner or any site page in a browser, save **a couple of PNGs** under the evidence folder (see `testing-handbook.md` visual screenshots).

## 3. Output Paths (Technical Map)
All run artifacts MUST go under **repo-root** `results/<module>/<phase>/<cmd>/` only (`AGENTS.md` layout).  
**Never** `site/results/`, **never** `site/test-results/`.
- **Vitest:** `results/tests/vitest-results.json`, console, csv/html
- **Site Vitest:** `results/tests/vitest-site-results.json`, …
- **Coverage:** `results/coverage/`, `results/coverage-site/`, `results/coverage-reports/`
- **Playwright:** `results/test-results/` (traces), `results/playwright-report/` (HTML)

## 4. Workflows & Helpers
- **TypeScript:** Run `tsc --noEmit` before tests.
- **UI Tests:** Use `-c` with `npm run test:ui` to avoid full rebuilds.
- **i18n:** Import `nextIntlServerEnMock`, await `Page()`, render, assert real `en.json`.
- **Catalog:** Tests stub `CI=""` and `NEXT_PHASE=""` before `vi.resetModules()`.
- **Helpers:** `mockNextImage.tsx` / `mockNextLink.tsx` for Next.js mocks.

## 5. Escalation
- **Environment Broken = Stop:** If tools fail to initialize or scope expands, STOP and ask.