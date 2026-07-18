# Parametric Admin CAD dual-pane (32 + 35 + 37)

**Status:** **SUPERSEDED** — do **not** implement this mix.

**Owner FINAL (2026-07-18):** `docs/ui-benchmarks/parametric-lock/32.jpg` **only**.  
**Active plan:** `Agents/PLAN-parametric-cad-team.md`  
**Team rule:** `Agents/Agents-10-TEAM-CYCLE.md`  

Layout target now:

```text
TOOL RAIL | DESK PROPERTIES | PLAN CANVAS
```

35.jpg / 37.jpg = **archive only**. Do not score or re-open mix unless owner says so.

---

**Historical note (obsolete):** this file once locked 32+35+37 dual-pane. Kept for audit only.

**Route:** `/admin/svg-editor/parametric`  
**Primary surface:** `LinearDeskParametricForm`

## Product goal

Admin configures an exact linear desk (mm + options), sees a live multipath plan, publishes for guest place + BOQ. Chrome must feel like the Planner CAD shell — not dock invent, not freehand Excalidraw chrome.

## Scenario mix (OBSOLETE — do not use)

| Source | Keep |
|--------|------|
| **32** | **FINAL sole lock** — see README + PLAN-parametric-cad-team |
| **35** | Archive only |
| **37** | Archive only |

### Explicit non-goals

- No AdminSvgDockHost / dockview panels for parametric
- No invented toolbars (no admin-only icon strip)
- No inventory drawer inside the studio
- No wizard steps
- Freehand Excalidraw shell is a separate path — do not thrash it here

## Layout

```text
[ Inventory | Linear desk + sku/slug | Publish ]
[ lifecycle · validation · footprint · badge ]     ← status strip (37)
[ feedback if any ]
[ RAIL | PLAN (dominant)  |  FORM + chips ]         ← 35 + 32 rail + 37 chips
```

- Grid: `plan ~1.65fr` | `form 18–24rem`
- Plan column: `CanvasToolRail` pinned left + plan stage (graph paper when grid on)
- Form: solid panel; Units · Size · Pedestals · Identity; summary chips at top
- Mobile ≤900px: stack plan then form

## Tool chrome

| Item | Authority |
|------|-----------|
| Tool rail component | `site/features/planner/editor/CanvasToolRail.tsx` only |
| Tool rail CSS | `site/app/css/core/locked/chrome/canvas-tool-rail.module.css` |
| Stack | React Aria + Phosphor (same as Planner) |
| Props | `pinned`; local state for activeTool / grid / snap / ortho |

Plan preview is **read-only multipath SVG** (Maker). Rail is chrome parity + grid toggle; drawing tools do not invent freehand geometry on this stage.

## Data / publish (unchanged)

- Form model → `parseLinearDeskForm` → `renderLinearDeskSvg` / `publishLinearDeskAction`
- Confirm dialog before publish
- Multipath proof: `desk-top`, `pedestal-l` / `pedestal-r` when pedestals on

## CSS homes

- Dual-pane + form craft: `site/app/css/core/locked/chrome/studio-chrome.css`
- Shell topbar/status/feedback grid: `site/app/css/core/locked/admin/svg-editor-shell.css` (parametric dual-pane may override row order so **status sits under topbar**)
- SVG paint: `locked/svg` only

## Acceptance

1. Unit: dual-pane chrome, planner rail present/pinned, one Publish, multipath preview, publish confirm
2. Visual: plan left dominant, status under topbar, chips in form, real planner rail
3. Browser (parent): `http://localhost:3000/admin/svg-editor/parametric` — no invented chrome
4. `pnpm run check:layout` clean for this slice (no new layout violations)

## Out of scope this slice

- C4 guest place + BOQ browser proof
- Freehand studio layout
- DB SVG formal matrix DB-SVG-01…20
