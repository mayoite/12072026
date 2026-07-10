# P03 select-delete coverage — ≥90% floor

**Date:** 2026-07-10  
**Tool:** vitest + `@vitest/coverage-v8` (stmts/branch/funcs/lines)  
**Tests:** 117 passed (6 files)

## Table

| File | % Stmts | % Branch | % Funcs | % Lines | ≥90% (stmts & lines) |
|------|--------:|---------:|--------:|--------:|:--------------------:|
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | **98.75** | 97.72 | 100 | **98.48** | **PASS** |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | **100** | 100 | 100 | **100** | **PASS** |
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` | **100** | 100 | 100 | **100** | **PASS** |
| `site/features/planner/open3d/store/history.ts` | **100** | 100 | 100 | **100** | **PASS** |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | 68.79 | 64.93 | 60.24 | 70.82 | **RESIDUAL** |

## Hard-required verdict

| Target | Required | Result |
|--------|----------|--------|
| helpers | ≥90% | **PASS** |
| keyboard | ≥90% | **PASS** |
| picking | ≥90% | **PASS** |
| history (undo) | ≥90% | **PASS** |
| FeasibilityCanvas full file | document if hard | **70.82% lines residual** |

**Overall hard-required: PASS**

## Baseline → after

| File | Baseline stmts/lines | After |
|------|----------------------|-------|
| workspaceEntityHelpers.ts | 37.5 / 40.9 | 98.75 / 98.48 |
| useWorkspaceKeyboard.ts | 78.87 / 79.1 | 100 / 100 |
| canvasPicking.ts | 100 / 100 | 100 / 100 |
| history.ts | 28.57 / 36.36 (w/ domain 96.42/100) | 100 / 100 |
| FeasibilityCanvas.tsx | 68.79 / 70.82 | residual unchanged |

## Suites

- applySelectionDelete.test.ts (helpers + delete/undo/history stamp)
- canvasPicking.test.ts
- open3dWorkspaceKeyboard.test.tsx
- open3dFeasibilityCanvas.test.tsx
- toolShortcutTruth.test.ts
- domain.test.ts (history transitions)

## Artifacts

- `coverage-summary.json`
- `coverage-final.json`
- `vitest-coverage-text.txt`
- this file

## Notes

- Helpers residual line 35: defensive `!collection` after SELECTABLE_TYPES gate (typed dead branch).
- FeasibilityCanvas shell not thrashed to 90; product select-delete logic is in helpers/keyboard/picking/history.
- No production code weakened for coverage.
