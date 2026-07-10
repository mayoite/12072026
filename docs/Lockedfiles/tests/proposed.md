# Tests — proposed (locked)

**Baseline:** 2026-07-05  
**Cross-links:** [`docs/architecture/README.md`](../../architecture/README.md) · [`MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) · [`ui-execution/proposed.md`](../ui-execution/proposed.md)

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Layout | **No** co-located `*.test.*` under `features/` or `app/` | `site/tests/` | `TESTING.md`, `test:layout:check` |
| Vitest | Default `pnpm run test`; planner filter `test:planner` | `vitest.config.ts` | `START.md` |
| Site coverage | `test:coverage:site` via `vitest.site.config.ts` | `vitest.site.config.ts` | `TESTING.md` |
| Playwright | Read `Failures.md` before E2E; browser + env required | `playwright.config.ts` | `AGENTS.md` § Gates |
| Evidence | **INCOMPLETE** if exit code, stdout/stderr, or artifacts missing; capture under `results/<module>/<phase>/<cmd>/` | `results/` | `TestingHandbookLocked.md` |
| Coverage | **90% hard floor**, 95% target on handwritten production | coverage reports in `results/` | `quality-gates.md` |
| Release gate | `release:gate` = lint + typecheck + test + build + a11y + planner-catalog E2E + coverage ×2 | `package.json` | `Failures.md` |
| UI contract | `lint:ui` now (warn); `lint:ui:strict` in `release:gate:fast` after UI-1 shell | `lint-ui-contract.mjs` | `08-TEST-PLAN.md` |
| Command catalog | Keep `phase1CommandCatalog.test.ts`; add `plannerCommandWiring.test.ts` when P0 wire lands | `site/tests/unit/features/planner/open3d/` | `ayushdocs/SESSION-RECAP.md` |
| Icon policy | Add `open3dIconPolicy.test.ts` (TEST-1) — Phosphor-only, no Lucide/emoji in open3d chrome | `site/tests/unit/features/planner/open3d/` | `MODULE-UI-CONTRACT.md` |
| SVG gates | Boundary, determinism, malicious fixtures before publish claims | `tests/unit/admin/svg-editor/` | `archive/Plans/phases/` §12 |
| Inventory | Refresh via `pnpm run docs:sync` — INVENTORY must match disk | `INVENTORY.md` | `tests/CONTENTS.md` |

## Packages (proposed per plan)

**Authority:** `Plans/global-standard-revision/README.md` + `quality-gates.md`

| Package | Phase | Policy |
|---------|-------|--------|
| `vitest`, `@vitest/coverage-v8` | 1A/1B | Default + planner filter; 90% floor proof |
| `@playwright/test`, `@axe-core/playwright` | 1A | E2E + a11y before ship claims |
| — | 1B | Add bundle-boundary test job for open3d chunks |
| — | 1B | SVG malicious fixture suite required for publish sign-off |

No new test runners. Refresh `INVENTORY.md` via `docs:sync` after major test adds.

## TEST-1 gates (planned alongside 1A P0)

| Test | Status | Purpose |
|------|--------|---------|
| `phase1CommandCatalog.test.ts` | On disk | Command executor contract |
| `plannerCommandWiring.test.ts` | Planned | UI routes mutations through `executePlannerCommand` |
| `open3dIconPolicy.test.ts` | Planned | Icon surface policy for open3d chrome |
| `plannerCommandBoundary.test.ts` | Referenced in UI contract | Command permission boundary |
