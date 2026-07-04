# Planner Handover

Date: 2026-07-03  
Current phase: **05 not accepted; 07 route swap rolled back on live paths; 08 prep**

## Production routes (plan-aligned)

| Route | Stack | Status |
|-------|-------|--------|
| `/planner/guest`, `/planner/canvas` | **Fabric** (`PlannerWorkspaceRoute`) | **Deployable production** |
| `/planner/open3d` | **Native Open3D** (`Open3dPlannerHost`) | Pilot only — not deploy-ready |
| `/planner/fabric/*` | Fabric mirror | Rollback drill |

**Why:** Native Open3D failed deploy-readiness (no external Phase 05 gate, incomplete workflows). Fabric restored 2026-07-04 per operator decision. Native work continues at `/planner/open3d` only.

## Build paths

| Role | Path |
|------|------|
| Native Open3D modules | `site/features/planner/open3d/` |
| Unit tests | `site/tests/unit/features/planner/open3d/` |
| Fabric production editor | `site/features/planner/_archive/fabric/` (aliased as `@/features/planner/editor`) |
| Theme / CSS | `site/app/css/core/planner/`, `site/app/css/ooplanner/` |

## Open blockers (from plannnerplan)

1. **Phase 05** — workspace UI not accepted; browser/visual/a11y evidence missing.
2. **Coverage** — ~58% vs 90% hard floor (`FAILURESPLAN.md`, `phases/05/evidence.md`).
3. **Phase 07 MET** — route swap reverted on live paths; promotion manifest open.
4. **Native UI** — `OOPlannerWorkspace` uses one `useWorkspaceCanvas` document; canvas, properties, 3D, and undo share that state (2026-07-03).

## Next (per plan)

1. Finish Phase 05 on `site/features/planner/open3d/` only; gate from site.
2. Browser/visual/a11y evidence before any live route swap.
3. Re-swap guest/canvas only after Phase 05 + 07 exit gates pass.

Evidence: `plannnerplan/phases/05/evidence.md`, `plannnerplan/07-route-swap-and-fallback-control.md`
