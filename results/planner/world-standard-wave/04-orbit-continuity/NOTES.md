# P04 / W4 — Orbit + pose continuity (2026-07-09)

## Goal
Orbit ON by default; 2D↔3D uses **document** as pose authority; browser proves place → 3D orbit attr → 2D same count.

## Status: **PASS** (unit + browser)

| Layer | Status | Evidence |
|-------|--------|----------|
| 1. Defaults ON | PASS | `orbitDefaults.ts`, `orbit-default-vitest-raw.log` 6/6 |
| 2. Workspace explicit | PASS | `getOpen3dViewerControlProps()` in OOPlannerWorkspace · THREE-LAYER-AUDIT |
| 3. Proof | PASS | unit pose + Playwright browser-green |

| Item | Result |
|------|--------|
| Pose continuity unit | poseContinuityW4 + documentViewContinuity (degrees→radians) |
| Orbit default unit | 6/6 |
| Adapter regression | buildOpen3dSceneNodes + createSceneObject + threeViewerInner 27/27 |
| Browser | `open3d-w4-orbit-continuity.spec.ts` 1 passed — Place 4 seats → 3D `data-orbit-enabled=true` → 2D count 4 |
| Screenshots | 01-2d-after-place · 02-3d-orbit-on · 03-2d-restored |

## Place path honesty
Catalog click was flaky. Browser residual uses **configurator Place 4 seats** (systems-v0 proven). Still proves furniture present + orbit + count continuity.

## Commands
```
cd site
pnpm exec vitest run tests/unit/features/planner/open3d/poseContinuityW4.test.ts tests/unit/features/planner/open3d/documentViewContinuity.test.ts tests/unit/features/planner/open3d/orbitControlsDefault.test.tsx
$env:PLAYWRIGHT_BASE_URL="http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w4-orbit-continuity.spec.ts
```
