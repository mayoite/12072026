# Tests — current (locked)

**Baseline:** 2026-07-05  
**Cross-links:** [`docs/architecture/README.md`](../../architecture/README.md) · [`MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) · [`MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md)

| Topic | On disk today | Paths | Docs |
|--------|---------------|-------|------|
| Layout | `site/tests/` — `unit/`, `integration/`, `e2e/`, `fixtures/`, `helpers/` | `site/tests/` | `TESTING.md` |
| Vitest (full) | ~468 `*.test.ts` + ~346 `*.test.tsx` | `vitest.config.ts`, `vitest.shared.ts` | `START.md` |
| Vitest (site) | `vitest.site.config.ts` — narrower scope | `vitest.site.config.ts` | `TESTING.md` |
| Playwright | 23 `*.spec.ts` | `config/build/playwright.config.ts` | `START.md` |
| Tech-stack | Package tests in `tech-stack-generator/` | `site/tech-stack-generator/` | `START.md` |
| Evidence | Output under `results/<module>/<phase>/<cmd>/` as `<cmd>-run.json` + `<cmd>-raw.log` | `results/` | `testing-handbook.md`, `AGENTS.md` |
| UI lint | `lint:ui` (warn); `lint:ui:strict` exists; **not** in `release:gate:fast` yet | `site/scripts/lint-ui-contract.mjs` | `MODULE-UI-CONTRACT.md` |
| Command catalog | `phase1CommandCatalog.test.ts` — unit-tests `executePlannerCommand`; **does not** prove UI wiring | `site/tests/unit/features/planner/open3d/` | `plann/04-HANDOVER.md` |
| Icon policy | `open3dIconPolicy.test.ts` — **not on disk** (planned TEST-1) | — | `plann/08-TEST-PLAN.md` |
| Coverage | PLAN-FAIL-0408 **open** — no fresh full % proof | `coverageGap.test.ts` | `Failures.md` |
| Fabric aliases | Vitest maps `editor` / `canvas-fabric` → `_archive/fabric/` | `vitest.config.ts` | — |
| SVG tests | boundaries, phase1 completion, persist, puck registry, API routes | `tests/unit/admin/svg-editor/` | — |
| Stale inventory | `site/tests/INVENTORY.md` shows **5 files** (2026-06-29) | `generate-docs.mjs` | **Do not trust** |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `vitest` | `^4.1.9` | Unit + integration |
| `@vitest/coverage-v8` | `^4.1.9` | Coverage |
| `@playwright/test` | `^1.61.0` | E2E + a11y |
| `@axe-core/playwright` | `^4.11.3` | Accessibility specs |
| `happy-dom` / `jsdom` | `^20.10.6` / `^29.1.1` | Vitest environments |
| `@testing-library/react` | `^16.3.2` | Component tests |
| `fast-check` | `^4.8.0` | Property tests (where used) |

Tests **assert** package boundaries (`svgPackageBoundaries.test.ts`) — not a separate dep domain.

---

## Summary

Testing is a major repo asset: hundreds of Vitest files, Playwright suites for planner and site, SVG boundary/determinism tests, and a strict evidence handbook. Layout policy keeps tests out of feature folders. The weak spot is governance evidence — coverage floor unproven (PLAN-FAIL-0408), stale auto-inventory, command-layer tests that do not prove production UI wiring, and release gate heaviness that may be skipped locally.

## Strengths

Enormous Vitest surface especially for planner/open3d and admin svg-editor. `phase1CommandCatalog.test.ts` validates the command executor in isolation. Fabric vitest aliases correctly target archive paths for production guest/canvas. Structured `results/<module>/<phase>/<cmd>/` output policy prevents silent green tests. Dedicated SVG security and package boundary tests. Playwright covers planner guest, catalog, chrome, and admin smoke.

## Weaknesses

Coverage % not freshly proven — ship claims must not rely on stale numbers. `INVENTORY.md` wildly out of date undermines doc sync trust. `PlannerCommand` unit tests pass but UI still bypasses executor in places — wiring test (`plannerCommandWiring.test.ts`) not yet on disk. `open3dIconPolicy.test.ts` planned but missing. Full `release:gate` is expensive; agents often run subsets. E2E requires env/browser and has deferred items in Failures.md.
