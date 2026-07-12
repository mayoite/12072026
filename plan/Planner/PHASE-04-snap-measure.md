# PHASE-04 — Snap, grid, and measure

**Parallel:** yes · **Blocks on:** Planner P02 (snap toggle) · UI P01 (M tool live) · **Proof:** live browser + screenshots

---

## In plain words
Drawing on the plan is freehand — walls don't line up and corners don't meet. This phase makes
drawing **precise**: shapes snap to a grid and endpoints, the grid is visible, and measurements
work with the **live dimension tool (M)** from UI PHASE-01.

## Why this matters
Snapping separates a sketch from a plan. The dimension tool promotion happens in **UI P01** —
this phase does **not** re-promote M; it verifies snap + measure work together.

## What exists today (grounded in code)
- `lib/geometry/index.ts` — `snapToGrid`, `snapToNearestEndpoint`, `snapToSegment` (math exists, not wired).
- `store/plannerStore.ts` — `snapToGrid(point)` helper.
- `editor/canvasTool.ts` — `dimension` deferred until UI P01 lands.
- UI P01 — promotes M/T, `annotationGeometry.ts`, Fabric annotation layer.

## Steps
1. Apply snapping during wall drawing and furniture placement when snap is enabled (P02 toggle).
2. Use endpoint/segment snapping so rooms close without gaps.
3. **Verify** (do not re-implement) M tool from UI P01 measures between two points with snap on/off.

## Done when
Boxes in `plan/Planner/CHECKLIST.md` → PHASE-04.

## How to prove
With snap on, draw a room — corners meet on grid. Snap off — freehand returns. Use M (from UI P01)
to measure a wall. Raw artifacts → `results/planner/phase-04/`. Report → `agents-work/reports/planner-phase-04.md`.

## Guardrails
- Do not promote `dimension` to `live` here — UI P01 owns M/T promotion.
- Snapping respects P02 toggle; not forced on.

## Out of scope
Angle/parallel guides and full CAD constraints — grid + endpoint + one measure tool only.