# P09 / W8 — Shortcuts map-driven keydown

**Date:** 2026-07-09  
**Scope:** Handler = `CANVAS_TOOL_SHORTCUTS` only. No full chrome redesign.

## Smoking gun (before)

`useWorkspaceKeyboard.ts` imported `CANVAS_TOOL_SHORTCUTS` but armed tools via a **second hard-coded table**:

| Key | Handler (lie) | Map truth |
|-----|---------------|-----------|
| D | `setTool("dimension")` | door |
| M | unbound | dimension |
| N | unbound | window |
| T | unbound | text |

`toolFromShortcutKey` already read the map (D→door, M→dimension) so pure map tests could pass while live keydown lied.

## Fix

- Invert `CANVAS_TOOL_SHORTCUTS` once → `TOOL_BY_SHORTCUT_KEY` (lowercase letter → `PlannerTool`).
- Letter arming uses that map only; hard-coded per-letter `if`s removed.
- `toolFromShortcutKey` shares the same inverted map.
- Non-tool handlers preserved: Space pan, Ctrl/Cmd+K, Tab, Escape/Enter, Delete/Backspace, undo/redo.

## Product letters (locked)

D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map.

## Tests

| File | Role |
|------|------|
| `toolShortcutTruth.test.ts` | Map + unique keys + full live keydown matrix |
| `open3dWorkspaceKeyboard.test.tsx` | D/M/N/T + full map live keydown matrix |

## Results

| Log | Outcome |
|-----|---------|
| `01-tool-shortcut-truth-red.log` | RED: D→dimension (lie proven) |
| `02-tool-shortcut-truth-green.log` | GREEN: 47/47 (truth + keyboard + donor + shell) |
| `06-final-vitest.log` | GREEN: 17/17 (truth + keyboard + donor) |

**Verdict: PASS**
