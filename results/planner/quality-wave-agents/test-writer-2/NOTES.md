# Test Writer 2 — open3d tool rail / keyboard a11y

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026`  
**Scope:** Unit tests only for existing open3d tool rail + map-driven keyboard behavior. No product redesign.

## Sources read

- `site/features/planner/open3d/editor/canvasTool.ts` — `CANVAS_TOOL_SHORTCUTS` / `CANVAS_TOOL_LABELS` (opening=`O`, select=`V` / `Select`)
- `site/features/planner/open3d/editor/CanvasToolRail.tsx` — `aria-label={`${label} (${shortcut})`}`, nav `Canvas tools`, `aria-pressed`
- `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` — `TOOL_BY_SHORTCUT_KEY` inverted from map; letter arming

## Tests added / extended

| File | Change |
|------|--------|
| `site/tests/unit/features/planner/open3d/toolShortcutTruth.test.ts` | +2: Opening `O` map + live keydown; Select accessible-name contract `Select (V)` |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | +1: Opening `O` arms `setTool("opening")` (case-insensitive) |
| `site/tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx` | **new** +2: rail a11y Select/Opening buttons, `aria-pressed`, nav name |

## Vitest result

Command:

```text
pnpm exec vitest run \
  tests/unit/features/planner/open3d/toolShortcutTruth.test.ts \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  tests/unit/features/planner/open3d/canvasToolRail.a11y.test.tsx
```

| Metric | Count |
|--------|------:|
| Test files passed | **3** |
| Tests passed | **18** |
| Failed | **0** |
| New tests in this slice | **5** (2 + 1 + 2) |

Log: `results/planner/quality-wave-agents/test-writer-2/vitest.log`

## Why real (not hollow)

- Asserts **authority map** values (`opening`→`O`, `select`→`V` / `Select`) used by keyboard + rail.
- Asserts **live keydown** still arms Opening via map-driven hook (not a second hard-coded table).
- Asserts **DOM accessible names** (`getByRole` with `Select (V)` / `Opening (O)`), `aria-pressed`, and nav `Canvas tools` — the a11y surface of `CanvasToolRail`.
