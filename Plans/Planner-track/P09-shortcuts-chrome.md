# P09 — Shortcuts & blocking chrome (W8)

**Status:** OPEN / REPROVE — not complete. Old `09-shortcuts-chrome/` packs are clues only.

**Gate:** **W8** / CP-09 — tool **id → key → handler → visible label** same truth; fix only chrome that **hides/blocks** tools.  
**Evidence:** `results/planner/world-standard-wave/09-shortcuts-chrome/` only (never `08-shortcuts-chrome/`).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md)

**Goal:** One authority map drives keyboard + rail + palette + `aria-keyshortcuts`. No full chrome redesign.

---

## Smoking gun (re-verify)

`canvasTool.ts` maps vs `useWorkspaceKeyboard` hard-coded letters:

| Key | Map | Handler today | Verdict |
|-----|-----|---------------|---------|
| D | door | dimension | **LIE** |
| M | dimension | unbound | **LIE** |
| N | window | unbound | **GAP** |
| T | text | unbound | **GAP** |
| V/R/W/O/P/H | as map | OK (re-check) | — |

**Fix:** invert `CANVAS_TOOL_SHORTCUTS` once for tool arming; delete second letter table.  
**Forbidden “fix”:** rebind Dimension → D to match the bad handler.

Rail is already map-sourced — keep it; don’t invent hard-codes.  
`FeasibilityCanvas` `aria-keyshortcuts` often stale — derive from map + **wired** non-tool keys only.

**Product letters locked:** D=door · M=dimension · O=opening · N=window · T=text · V/R/W/P/H as map.

---

## Scope

**In:** W8 truth table · fix D/M/N/T · handler = map · rail regression · aria/palette parity · 2A hide-tools only (proof-first in NOTES).

**Out:** Full 2A polish / mobile redesign · full a11y sweep unless hides tools · Fabric · mesh · P03/P04/P06 behavior · redesign which tools exist · competitor shortcut philosophy · dual Feasibility local-keydown redesign (log only unless W8 broken).

---

## Touch list

| File | Role |
|------|------|
| `editor/canvasTool.ts` | Authority maps + optional aria helper |
| `editor/useWorkspaceKeyboard.ts` | Arm from map only |
| `editor/CanvasToolRail.tsx` | Map-sourced labels (regression) |
| `canvas-feasibility/FeasibilityCanvas.tsx` | `aria-keyshortcuts` only |
| `lib/commands/paletteCommands.ts` | Palette shortcuts = map |
| Units | `toolShortcutTruth.test.ts` + keyboard RTL (live keydown, not map-only) |

---

## Kill order (unchecked)

- [ ] Evidence dir + baseline vitest log + NOTES (D/M lie + N/T gaps with line refs)
- [ ] RED unit: tool id → key → `setTool(id)` for all map tools (incl. D/M/N/T); unique letters
- [ ] GREEN: handlers from map only; no second letter table
- [ ] Rail regression: Label (Key) from maps
- [ ] `aria-keyshortcuts` + palette match maps
- [ ] Hide-tools chrome: minimal fix or documented none-found
- [ ] Final vitest under `09-shortcuts-chrome/`; commits on `.` only

**CP-09 green only if** truth table + no divergent handler table + rail/aria/palette honest + evidence paths real.  
**Next:** [P10](./P10-evidence-handover.md) — pack ≠ product ship.
