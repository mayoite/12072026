# P09 Suggestions — Shortcuts & Blocking Chrome (W8)

**Date:** 2026-07-09  
**Role:** Planning expert (trust-data)  
**Plan:** `Plans/trustdata/phases/P09-shortcuts-chrome.md`  
**Constraints:** **W8 only** + chrome that **hides tools**. No full 2A redesign. Superpowers required at execution. **No product code in this review.**  
**Process:** read plan → verify `canvasTool` vs `useWorkspaceKeyboard` → suggestions → revise plan in place → Expert revision note.

---

## Live verification (repo data, 2026-07-09)

### Authority maps — `site/features/planner/open3d/editor/canvasTool.ts`

| Tool id | `CANVAS_TOOL_SHORTCUTS` | `CANVAS_TOOL_LABELS` |
|---------|-------------------------|----------------------|
| select | V | Select |
| room | R | Room |
| wall | W | Wall |
| opening | O | Opening |
| **dimension** | **M** | Dimension |
| placement | P | Place |
| **door** | **D** | Door |
| window | N | Window |
| text | T | Text |
| pan | H | Pan |

### Handler — `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`

| Key (no mod) | Handler does | Map claim | Verdict |
|--------------|--------------|-----------|---------|
| v | `setTool("select")` | select | OK |
| r | `setTool("room")` | room | OK |
| w | `setTool("wall")` | wall | OK |
| o | `setTool("opening")` | opening | OK |
| **d** | **`setTool("dimension")`** | **door** | **LIE** |
| **m** | **unbound** | **dimension** | **LIE** |
| p | `setTool("placement")` | placement | OK |
| h | `setTool("pan")` | pan | OK |
| **n** | **unbound** | **window** | **GAP** (same class as M) |
| **t** | **unbound** | **text** | **GAP** (same class as M) |

**Smoking gun:** file imports `CANVAS_TOOL_SHORTCUTS` but letter arming is a **second hard-coded table**. Only `toolFromShortcutKey` reads the map (D→door, M→dimension) — so pure map tests can pass while live keydown still lies.

**Rail:** `CanvasToolRail.tsx` already uses `CANVAS_TOOL_LABELS` + `CANVAS_TOOL_SHORTCUTS` for `aria-label` / `title` / badge. Dimension shows **(M)** correctly; the lie is **keydown**, not rail chrome strings.

**Stale canvas a11y:** `FeasibilityCanvas.tsx` `aria-keyshortcuts="V W D T H Tab Escape Control+Z Control+Shift+Z Control+Y 0 + -"` — omits R/O/M/P; zoom `0 + -` live on canvas local keydown when `delegateKeyboard` is false (not on `useWorkspaceKeyboard`).

**Tests today:**

- `workspaceShell.test.tsx` / `donorParity.test.ts` — `toolFromShortcutKey` only (map-true, not live keydown).
- `open3dWorkspaceKeyboard.test.tsx` — palette / undo / editable / disabled only; **no tool letter matrix**.

**Evidence path conflict:** plan says `09-shortcuts-chrome/`; canonical is **`08-shortcuts-chrome/`** (`RESULTS-MAP.md`, `CHECKPOINTS.md`, `MASTER-CHECKLIST.md`, P10).

---

## Suggestions (apply into plan)

### S1 — Canonical evidence path (must)

Replace every `09-shortcuts-chrome` with **`08-shortcuts-chrome`** so CP-09 / W8 artifacts land where RESULTS-MAP and P10 expect. Optional one-line NOTES pointer if anything ever used the wrong name.

### S2 — Full handler gap inventory (must)

Keep D/M as the headline lie, but Task 01/02 must treat **all** map letters as the contract: after map-driven arming, **N→window** and **T→text** also bind (today unbound). Do not leave partial “fix only D/M” that re-creates a second table.

### S3 — Reframe Task 03 rail (must)

Rail is already authority-driven. Task 03 = **regression guard** (no hard-coded badge/aria; accessible name `Dimension (M)` etc.), not a narrative that rail labels themselves lie. User-visible lie today: press D while rail says Dimension (M).

### S4 — Single source for letter tools (must)

Task 02: invert `CANVAS_TOOL_SHORTCUTS` once; delete per-letter tool `if`s. Forbidden “fix”: rebinding labels/map so Dimension becomes D to match the bad handler. Product truth remains Failures / tests: **D→door, M→dimension**.

### S5 — `aria-keyshortcuts` honesty (must)

Helper must:

1. Include every unique letter from `CANVAS_TOOL_SHORTCUTS` (incl. M, D, O, R, P, N, T).
2. Document non-tool keys that are **actually wired** (workspace: Tab, Escape, Space pan, Ctrl/Cmd+K/Z/Y; canvas zoom `0 + -` when applicable).
3. Not claim keys that no handler owns. Do not expand into full a11y redesign.

### S6 — Test ownership (should)

- Preferred contract: NEW `toolShortcutTruth.test.ts` (map + unique keys + live keydown matrix).
- Also add D/M (and preferably full letter matrix) assertions to `open3dWorkspaceKeyboard.test.tsx` so the hook file cannot regress without that suite noticing.
- Keep `workspaceShell` / `donorParity` map checks; do not weaken them.

### S7 — Dual keyboard surface (should / scope fence)

`FeasibilityCanvas` still has local keydown (`w` draw-wall, Escape, undo, zoom) gated by `delegateKeyboard`. P09 must **not** redesign dual keyboard — only ensure workspace path used on `/planner/open3d` arms tools from the map. Note in plan risk table: if both handlers fire, log in NOTES; fix only if it breaks W8 truth.

### S8 — Task 05 hide-tools discipline (should)

No CSS/layout edit without a NOTES row proving hide/block (missing rail, zero size at interactive viewport, overlay steal, focus trap). Print-only hide OK. Horizontal reflow at `<48rem` is **not** hide. Zero defects → `chrome-hide-tools: none` — no invented churn.

### S9 — Palette subset honesty (should)

Palette `TOOL_IDS` is `CanvasTool` subset only (select/wall/door/window/text/pan) — already map-sourced shortcuts. Do **not** rebuild palette to list opening/dimension/room unless owner expands product. Assert `tool-*` shortcuts match map for that subset; `runPaletteCommand("tool-door")` → door remains.

### S10 — Scope freeze (must)

Out remains: full Approach C / Phase 2A, A1–A8 a11y sweep, Fabric, mesh, select/delete product (P03), orbit (P04), save (P06), rail tool-set redesign, competitor shortcut philosophy.

---

## Priority for plan revise (top 5)

1. **S1** — evidence path `08-shortcuts-chrome/`
2. **S2** — full letter gap (D wrong; M/N/T unbound)
3. **S4** — map-driven arming only; forbid label-to-match-handler
4. **S3** — Task 03 = rail regression, not “lying rail strings”
5. **S5** — aria helper honesty + dual-source note for zoom keys

Also fold: S6 test ownership, S7 dual-keyboard fence, S8 hide-tools proof-first, S9 palette subset, S10 scope freeze reinforcement.

---

## Expert action after this file

Revise `phases/P09-shortcuts-chrome.md` **in place**. Append **Expert revision note 2026-07-09** listing applied suggestion IDs. No product code.
