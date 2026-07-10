# P03 select-delete coverage — ≥90% floor

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only  
**Tool:** vitest + `@vitest/coverage-v8` (stmts / branch / funcs / lines)  
**Residual pack:** **110 tests / 6 files / exit 0**  
**Command (from `site/`):**

```text
pnpm exec vitest run --coverage \
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts \
  tests/unit/features/planner/open3d/geometry/canvasPicking.quality.test.ts \
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx \
  tests/unit/features/planner/open3d/open3dHistory.w3.test.ts \
  --coverage.include=features/planner/open3d/editor/workspaceEntityHelpers.ts \
  --coverage.include=features/planner/open3d/editor/useWorkspaceKeyboard.ts \
  --coverage.include=features/planner/open3d/lib/geometry/canvasPicking.ts \
  --coverage.include=features/planner/open3d/store/history.ts \
  --coverage.include=features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx
```

**Raw dump:** `results/planner/world-standard-wave/03-select-delete/coverage/final/`  
**JSON summary:** `coverage-summary.json` (repo copy next to this file)

---

## Per-file coverage (final residual pack)

| File | % Stmts | % Branch | % Funcs | % Lines | ≥90% (stmts & lines) |
|------|--------:|---------:|--------:|--------:|:--------------------:|
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | **98.75** | 97.72 | **100** | **98.48** | **PASS** |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | **100** | **100** | **100** | **100** | **PASS** |
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` | **100** | **100** | **100** | **100** | **PASS** |
| `site/features/planner/open3d/store/history.ts` | **100** | **100** | **100** | **100** | **PASS** |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | 74.63 | 68.50 | 63.85 | **76.86** | **RESIDUAL** (report + select push) |

**Overall hard-required (helpers / keyboard / picking / history): PASS**

---

## Baseline → after

| File | Baseline stmts / lines | After |
|------|------------------------:|------:|
| workspaceEntityHelpers.ts | 37.5 / 40.9 | **98.75 / 98.48** |
| useWorkspaceKeyboard.ts | 78.87 / 79.1 | **100 / 100** |
| canvasPicking.ts | 100 / 100 | **100 / 100** |
| history.ts | 28.57 / 36.36 (pack alone); 96.42 / 100 w/ domain | **100 / 100** (residual pack alone via `open3dHistory.w3.test.ts` + delete suite) |
| FeasibilityCanvas.tsx | 68.79 / 70.82 | **74.63 / 76.86** (meaningful select push; full-file 90 not forced) |

---

## Quality checklist (owner law)

| Check | Result |
|-------|--------|
| Proper product behavior asserts (select / delete / undo / pick / keyboard) | **PASS** — id, pose, preventDefault, same-ref no-ops |
| `it.skip` / `describe.skip` / `test.skip` / `xit` / `xdescribe` / pending | **0** |
| `any` in residual unit suites | **0** |
| Unused locals / `_omit` junk | **0** (optional handlers via `makeRequiredHandlers`) |
| Magic product dims as named consts | **PASS** (e.g. `DEFAULT_FOOTPRINT_MM`, `WALL_LENGTH_MM`, `ROOM_SIZE_MM`, `STAMP_NOW`) |
| Coverage theater (empty expects) | **NONE** |
| Production code weakened for % | **NONE** |

---

## FeasibilityCanvas honesty

- Full-file **76.86% lines** after select-path expansion (furniture / empty / wall / door / window / room pointer → `setSelection` with real ids).
- Residual uncovered mass is **proof-variant shell** (command search input, diagnostics strip, proof-catalog image fallback ~L1087–1131) — not W3 select/delete product path.
- **90% full-file not forced** with theater paint/search tests. Select product path is proven; pure delete / pick / keyboard / history carry the hard 90 bar.

---

## Suites owner should read

1. `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` — pure delete, locked, wall cascade, `updateOpen3dProject` undo id+pose, resolve/update/delete helpers  
2. `site/tests/unit/features/planner/open3d/open3dHistory.w3.test.ts` — history API residual pack (update / undo / redo / drag / dispatch)  
3. `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` — Delete/Backspace preventDefault, editable guards, Space pan, Tab/Enter, tool map  
4. `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` — `pickFurnitureAtPoint` (+ openings/walls)  
5. `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` — select pointer → selection ids (furniture / wall / door / window / room)

---

## Notes

- Helpers residual **line 35**: defensive `!collection` after `SELECTABLE_TYPES` gate (typed dead branch; not deleted).
- Residual pack does **not** need `domain.test.ts` for history ≥90% (`open3dHistory.w3.test.ts` covers it).
- **Unit alone ≠ W3 browser close.** This seat is unit coverage quality only.
