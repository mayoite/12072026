# Testing

Locked reference: **`docs/Lockedfiles/TestingLocked.md`**.
Evidence policy: **`testing-handbook.md`**. Locked policy: **`docs/Lockedfiles/TestingHandbookLocked.md`**.

**Open for test paths and layout** · commands `START.md` · conduct `AGENTS.md` · gate policy `Failures.md`

Layout, artifact paths, conventions. Playwright and `release:gate` → `AGENTS.md` (Gates) + `Failures.md`.

## Output paths

All active test, lint, typecheck, build, Playwright, accessibility, coverage, and audit runs are captured under repo-root `results/<module>/<phase>/<cmd>/` in the standardized `<cmd>-run.json` + `<cmd>-raw.log` format (never to the repo root, `E:`, or any other drive path).

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

## Agent output (not gate evidence)

Do not put agent reports or review markdown in `results/`.

| Output | Location |
|--------|----------|
| Workflow phase reports | `Plans/<workflow-slug>/01-repair-agent/` … `05-planner/` |
| Independent reviews | `archive/1b-5phase-agent-workflow/reviews/` |
| Legacy benchmark narrative | `results/planner/benchmark/phase-02-03-benchmark.md` |

Gate runs only: `results/<module>/<phase>/<cmd>/`.

## Stale root artifacts

`pnpm --filter oando-site run test:clean` (also `pretest`) removes wrong-cwd dumps at repo root: `tsc-errors.txt`, `errors.txt`, `lint-results.json`, `test-results.json`, `scratch_*`, `test-results/`, `playwright-report/`, `coverage/`. `.gitignore` covers the same.

## Layout

- Tests under `site/tests/` (`unit/`, `integration/`, `e2e/`, `fixtures/`).
- No co-located `*.test.*` under `app/`, `features/`, etc. — `pnpm --filter oando-site run test:layout:check`.
- **E2E proper-fix checklist** (planner contracts, grep habits, pre-ship bar, skips policy, tired/backlog workflow) → `site/tests/e2e/README.md`.

## Shared helpers (`site/tests/helpers/`)

| Module | Use |
|--------|-----|
| `mockNextImage.tsx` | Global `next/image` mock (via `tests/setup.ts`) |
| `mockNextLink.tsx` | Global `next/link` mock (via `tests/setup.ts`) |
| `nextIntlServerEnMock.ts` | Side-effect import for async App Router pages using `getTranslations` from `next-intl/server` |

### Async marketing page tests (i18n)

Server pages under `app/(site)/` are async and call `getTranslations`. Unit tests must:

1. Import the shared mock first: `import "@/tests/helpers/nextIntlServerEnMock";`
2. Await the page: `const jsx = await Page();`
3. `render(jsx)` and assert on real `en.json` copy (not raw key paths).

Reference: `tests/unit/app/(site)/about/page.test.tsx`.

`tests/setup.ts` also mocks `next-intl/server`, but per-file imports of `nextIntlServerEnMock.ts` override with nested key resolution from `en.json` — use the helper for legal/products/workspace routes.

### Catalog integration tests and `CI`

`lib/catalog/catalogTree.ts` reads `CATALOG_FETCH_RETRIES` at module load (`1` when `CI=true`, else `3`). Tests in `catalog-catalogTree.test.ts` stub `CI` and `NEXT_PHASE` to `""` in `beforeEach` before `vi.resetModules()` so retry/fallback behavior matches production dev runs.

### Portfolio filesystem paths

Assert `readdir` paths with separator normalization (`path.replaceAll("\\", "/")`) — Linux CI uses POSIX paths; Windows local uses backslashes.

### Site UI E2E (`test:site-ui`)

- Script: `playwright test site-locale-switch site-visual-regression`
- Helpers: `tests/e2e/site-ui-helpers.ts`
- Wave 1 snapshots: `tests/e2e/site-visual-regression.spec.ts-snapshots/`
- Stabilization (reduced motion, font ready, hide marquee/bot) — see `plans/site-ui-uniformity-10-file-plan/09-visual-locale-e2e.md`
- CI job: `.github/workflows/site-ui.yml` (separate from `release-gate.yml`)
