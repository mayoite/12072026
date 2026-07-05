# Testing (locked copy)

Frozen reference snapshot. Live file: repo-root `TESTING.md`. Edit the live file; update this copy only when intentionally locking a version.
Evidence policy: `testing-handbook.md`. Locked policy: `docs/Lockedfiles/TestingHandbookLocked.md`.

**Open for test paths and layout** · commands `START.md` · conduct `AGENTS.md` · gate policy `Failures.md`

Layout, artifact paths, conventions. Playwright and `release:gate` → `AGENTS.md` (Gates) + `Failures.md`.

## Output paths

All active test and audit artifacts live under repo-root `results/`.

- Vitest JSON → `results/tests/vitest-results.json`
- Vitest site JSON → `results/tests/vitest-site-results.json`
- Vitest console output → `results/tests/vitest-console.json`
- Vitest site console output → `results/tests/vitest-site-console.json`
- Vitest CSV/HTML → `results/tests/vitest-results.{csv,html}`
- Vitest coverage (planner) → `results/coverage/`
- Vitest coverage (site) → `results/coverage-site/`
- Coverage reports (planner) → `results/coverage-reports/planner/coverage-report.{csv,html,json}`
- Coverage reports (site) → `results/coverage-reports/site/coverage-report.{csv,html,json}`
- Playwright traces → `results/test-results/`
- Playwright HTML → `results/playwright-report/`
- Playwright JSON → `results/audits/raw-playwright.json`
- App pages inventory → `results/app-pages-inventory.csv`
- Scripts inventory → `results/scripts-inventory.csv`
- R2 object count → `results/audits/r2-object-count.json`
- Planner screenshot → `results/screenshots/planner-guest-left-panel.png`
- Results hub → `/results`

Enforced by `vitest.shared.ts`, `vitest.config.ts`, `vitest.site.config.ts`, `config/build/playwright.config.ts`, `tests/root-configs.test.ts`.

## Stale root artifacts

`pnpm --filter oando-site run test:clean` (also `pretest`) removes wrong-cwd dumps at repo root: `tsc-errors.txt`, `errors.txt`, `lint-results.json`, `test-results.json`, `scratch_*`, `test-results/`, `playwright-report/`, `coverage/`. `.gitignore` covers the same.

## Layout

- Tests under `site/tests/` (`unit/`, `integration/`, `e2e/`, `fixtures/`).
- No co-located `*.test.*` under `app/`, `features/`, etc. — `pnpm --filter oando-site run test:layout:check`.
