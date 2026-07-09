# Expert pass — UI chrome / shortcuts (W8 only)

**Date:** 2026-07-09  
**Role:** UI chrome / shortcuts (light)  
**Scope:** W8 truth (id → key → handler → label). No product code.  
**Phase:** [P09-shortcuts-chrome.md](../../phases/P09-shortcuts-chrome.md) · **CP-09**  
**Evidence (canonical):** `results/planner/world-standard-wave/09-shortcuts-chrome/`  
**Live read:** `canvasTool.ts`, `useWorkspaceKeyboard.ts`, `CanvasToolRail.tsx`

---

## Verdict: **FIX**

W8 is **not shippable** today: authority maps and live keydown disagree. Path is clear (map-driven arming + truth table tests). Not **BLOCK** — no architecture hole, no missing product rule. Not **SHIP** until D/M/N/T handlers match `CANVAS_TOOL_SHORTCUTS` and evidence lands under **09-**.

---

## Must-fix P0

1. **Handler = map (smoking gun)** — `useWorkspaceKeyboard` imports `CANVAS_TOOL_SHORTCUTS` but arms tools via a **second hard-coded** letter table. Live: **D → dimension** (map = door), **M unbound** (map = dimension), **N/T unbound**. Invert map once; delete per-letter tool `if`s. Forbidden “fix”: rebind Dimension → **D**.
2. **Product letters (locked)** — D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map. All map letters must `setTool(id)` on keydown.
3. **Live keydown matrix** — new `toolShortcutTruth.test.ts` + D/M (prefer full map) in `open3dWorkspaceKeyboard.test.tsx`. `toolFromShortcutKey` alone is **insufficient** (map-true, handler-false today).
4. **`aria-keyshortcuts` honesty** — `FeasibilityCanvas` string `V W D T H…` is stale (omits R/O/M/P; donor-shaped). Derive from map + only **wired** non-tool keys. Prefer pure helper next to `canvasTool.ts`.

---

## Should-fix P1

1. **Rail regression only** — `CanvasToolRail` already uses `CANVAS_TOOL_LABELS` + `CANVAS_TOOL_SHORTCUTS` for aria/title/badge (`Dimension (M)` correct). Guard with RTL; do not rewrite rail UX.
2. **Palette subset** — `paletteCommands` already map-sourced for `CanvasTool` list; assert shortcut fields; do **not** expand palette to full `PlannerTool`.
3. **Hide-tools inventory** — Task 05 proof-first in NOTES; CSS only if rail truly unreachable. Horizontal reflow ≠ hide.
4. **Dual keyboard fence** — `delegateKeyboard` on open3d owns tool arming via workspace hook; log canvas-local conflicts; no dual-surface redesign.

---

## Scope creep risks (full redesign)

| Creep | Why reject |
|-------|------------|
| Full Phase 2A / Approach C polish | P09 = blockers that **hide tools** only |
| A11y A1–A8 sweep | Nested main / landmarks out unless rail disappears |
| Fabric cutover, mesh, orbit, save | Other phases own those |
| Redesign which tools sit on rail | Keep current product set |
| Competitor keymap philosophy | Our map + tests own truth |
| “Fix” by renaming Dimension to D | Makes rail/tests lie harder |

---

## Path truth

| What | Path |
|------|------|
| Authority maps | `site/features/planner/open3d/editor/canvasTool.ts` |
| Keyboard (lie) | `…/editor/useWorkspaceKeyboard.ts` (`d`→dimension; m/n/t missing) |
| Rail (OK strings) | `…/editor/CanvasToolRail.tsx` |
| Stale a11y | `…/canvas-feasibility/FeasibilityCanvas.tsx` ~L901 |
| Palette | `…/lib/commands/paletteCommands.ts` |
| Evidence | **`09-shortcuts-chrome/`** only (not legacy `08-shortcuts-chrome/`; mesh owns `08-mesh-quality/`) |
| Gate | W8 · CP-09 · P09 tasks 00→06 |

**One-line fix contract:** one map drives keyboard, rail, palette, aria; unit matrix proves every letter; chrome only if tools are unreachable.
