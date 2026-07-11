# P09 — Shortcuts & blocking chrome (W8)

**Status:** OPEN / REPROVE — map-align may be landed; **fresh evidence pack still required**.

**Gate:** **W8** / CP-09 — tool **id → key → handler → visible label** same truth; fix only chrome that **hides/blocks** tools.  
**Evidence:** `results/planner/world-standard-wave/09-shortcuts-chrome/` only (never `08-shortcuts-chrome/`).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md)

**Goal:** One authority map drives keyboard + rail + palette on the **Fabric** workspace. No full chrome redesign.

---

## Live truth (re-verify 2026-07-11)

| Piece | Status |
|-------|--------|
| `CANVAS_TOOL_SHORTCUTS` | D=door · M=dimension · N=window · T=text · V/R/W/O/P/H as map |
| `useWorkspaceKeyboard` | Arms via inverted map (`TOOL_BY_SHORTCUT_KEY`) |
| Units | `toolShortcutTruth.test.ts` — **re-run** under evidence |
| Live canvas testid | `open3d-fabric-stage` (not archive `planner-2d-canvas`) |
| Archive aria strings | Ignore `_archive/` Feasibility — do not chase |
| Evidence `09-shortcuts-chrome/` | Untrusted until fresh logs |

**Historical smoking gun (fixed — re-prove, don’t re-bind Dimension→D):** old hard-coded handler vs map. Gone in code.

---

## Scope

**In:** Truth table + keyboard RTL · rail/palette regression · hide-tools only · evidence under `09-`.

**Out:** Full chrome redesign · a11y sweep unless hides tools · mesh/P03/P04/P06 thrash · Feasibility restore · archive aria chase.

---

## Touch list

| File | Role |
|------|------|
| `editor/canvasTool.ts` | Authority maps |
| `editor/useWorkspaceKeyboard.ts` | Map-only arming |
| `editor/CanvasToolRail.tsx` | Map-sourced labels |
| `lib/commands/paletteCommands.ts` | Palette = map |
| Units | `toolShortcutTruth.test.ts` + keyboard RTL |

Prefix: `site/features/planner/open3d/`.

---

## Kill order (unchecked)

- [ ] Evidence dir + re-run shortcut/keyboard vitest → `09-shortcuts-chrome/`
- [ ] NOTES: D→door, M→dimension, N/T from map (line refs)
- [ ] Rail + palette match maps
- [ ] Hide-tools chrome: minimal fix or none-found
- [ ] No archive Feasibility / no Dimension→D rebind

**CP-09 green only with fresh evidence.** Code looking right ≠ PASS.  
**Next:** [P10](./P10-evidence-handover.md).
