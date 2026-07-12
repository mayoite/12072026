# P09 — Shortcuts & blocking chrome (W8)

**Status:** PASS (unit honesty) — live vs deferred tiers held; fresh vitest 23/23 under `09-shortcuts-chrome/`. Optional browser residual only.

**Gate:** **W8** / CP-09 — for **live** tools only: **id → key → handler → visible label** same truth; fix chrome that hides/blocks live tools.  
**Evidence:** `results/planner/world-standard-wave/09-shortcuts-chrome/` only (never `08-shortcuts-chrome/`).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md)

**Goal:** One authority map drives keyboard + rail + palette on the **Fabric** workspace. No full chrome redesign. **Do not require deferred tools to draw geometry.**

---

## Toolbar stack (owner lock)

| Decision | Law |
|----------|-----|
| **UI kit for canvas toolbar** | **`react-aria-components@1.19.0`** (RAC) |
| **Icons** | `@phosphor-icons/react` only — **no `lucide-react`** |
| **Authority** | `editor/canvasTool.ts` — maps + **requirement tiers** |
| **Live rail** | `CanvasToolRail.tsx` — RAC upgrade: groups + tooltips + deferred name honesty + `Button` zoom · `data-rac-toolbar` |
| **Forbidden** | Lucide · second rail · archive toolbar as W8 proof · claiming deferred tools are W1 green |

---

## Require differently — tool tiers

Source: `CANVAS_TOOL_REQUIREMENT` in `canvasTool.ts`.

| Tier | Tools | W8 / W1 requirement |
|------|-------|---------------------|
| **live** | select · pan · wall · opening · placement · door · window | **Required:** shortcut + rail/palette label + Fabric handler works |
| **deferred** | room · dimension · text | **Required only:** arm + honest guidance; **not** full geometry until a later card raises them |

| Live geometry (restore) | Handler |
|-------------------------|---------|
| Wall | `addPlannerWall` |
| Opening / Door | `addPlannerDoor` |
| Window (N) | `addPlannerWindow` — **restored** (was always door) |
| Place | catalog place path |
| Select / Pan | Fabric select / pan |

| Deferred (honest) | Until |
|-------------------|--------|
| Room (R) | Full corner-room draw — guidance says starter room / walls |
| Dimension (M) | Annotation tool — properties for now |
| Text (T) | Annotation tool |

**Palette** = rail tools + door/window/text extras (`PALETTE_TOOLS`). Same labels/shortcuts as maps.

---

## Live truth (re-verify)

| Piece | Status |
|-------|--------|
| Maps + tiers | `canvasTool.ts` |
| Keyboard | `useWorkspaceKeyboard` map-only |
| RAC rail | `RAIL_NAV_TOOLS` + `RAIL_DRAW_TOOLS` |
| Units | `toolShortcutTruth` + `canvasToolRail.a11y` + `canvasToolPaletteAuthority` — **23/23 green** |
| Host testid | `planner-fabric-stage` + `role="application"` |
| Evidence `09-` | Fresh dump + agents-work NOTES (HEAD `0bc58eb`) |

---

## Scope

**In:** Truth table · keyboard RTL · RAC rail · palette = maps · live geometry restore · evidence under `09-`.

**Out:** Full chrome redesign · implement deferred room/dim/text geometry in this card · mesh/P03 thrash · second host · drop RAC.

---

## Touch list

| File | Role |
|------|------|
| `editor/canvasTool.ts` | Authority + tiers |
| `editor/useWorkspaceKeyboard.ts` | Map arming |
| `editor/CanvasToolRail.tsx` | RAC toolbar |
| `project/lib/commands/paletteCommands.ts` | Palette = `PALETTE_TOOLS` |
| `canvas/PlannerFabricStage.tsx` | wall / door / window / pan / place |
| `editor/OOPlannerWorkspace.tsx` | door vs window place |

---

## Kill order

- [x] Evidence dir + vitest shortcut + RAC rail a11y + palette authority → `09-shortcuts-chrome/` (23/23, HEAD `0bc58eb`)
- [x] NOTES: live tools id→key→handler; deferred only arm (`agents-work/.../09-shortcuts-chrome/NOTES.md`)
- [ ] Browser: wall + opening + window (N) + place labels match — **optional residual** (no dev server this pass; not blocking unit honesty)
- [x] No Dimension→D rebind · no lucide · no RAC drop (code read + units)
- [x] Do not mark W1 room-rectangle PASS from deferred room tool

**CP-09 unit honesty green** with fresh evidence on live tier (2026-07-12 Slice D).  
Live tier proof = shortcut/rail/keyboard/palette units + (optional) browser labels — **do not** wait on P07 journey to close W8 unit honesty. Deferred room ≠ W1.  
**Next (sequence):** [P10](./P10-evidence-handover.md).
