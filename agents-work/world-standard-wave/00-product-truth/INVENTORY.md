# P01 INVENTORY — Fabric-sole hosts (live code)

**HEAD:** `9d0d3cdaea2eeae8ac67d63bbc51c55f47c9c0fd` · Approach A  
**Proved:** `hostWiringP01` 4/4 this session · not browser journey

## Host graph (live)

| Role | Path | Notes |
|------|------|--------|
| Guest route | `app/planner/(workspace)/guest/page.tsx` | → `Open3dPlannerWorkspaceRoute` guestMode |
| Canvas route | `app/planner/(workspace)/canvas/page.tsx` | → `Open3dPlannerWorkspaceRoute` |
| Open3d pilot | `app/planner/open3d/page.tsx` | → `Open3dPlannerHost` |
| Workspace route | `features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` | → `Open3dPlannerHost` |
| Host | `features/planner/ui/Open3dPlannerHost.tsx` | → `OOPlannerWorkspace` |
| Workspace | `features/planner/open3d/editor/OOPlannerWorkspace.tsx` | mounts `PlannerCanvasStage` only |
| 2D barrel | `features/planner/open3d/canvas-stage/index.ts` | re-exports Fabric `Open3dFabricStage` |
| Fabric stage | `features/planner/canvas-fabric-stage/Open3dFabricStage.tsx` | `data-testid="open3d-fabric-stage"` |
| 3D | open3d Lazy3D + Three + orbit props | not R3F as plan host |

## Forbidden / gone

| Item | Truth |
|------|--------|
| Second interactive plan host | Forbidden |
| `canvas-feasibility` | Does not / will not exist |
| Live `app/planner/**/fabric` tree | Absent; next.config redirects `/planner/fabric*` → open3d |
| Product path aliases to `_archive/fabric` | Removed from tsconfig + next (this session) |
| Default `next dev --turbo` | Changed to `--webpack` (this session) |

## On-disk archive (historical only)

| Path | Role |
|------|------|
| `features/planner/_archive/fabric/` | Legacy shell only — not product PASS host |
| `PlannerWorkspaceRoute` | Explicit dynamic import of archive workspace — legacy/tests |

## SVG / inventory (boundary)

| Surface | Role |
|---------|------|
| Admin A4 + `public/svg-catalog/` | Inventory **publish** only |
| Plan symbols on stage | Block2D / multiprim on Fabric (P05) |

## W1–W8 code surface (inventory only — not proof)

| Gate | Surface (raise here) |
|------|----------------------|
| W1–W2 | Fabric stage draw/place — P07 |
| W3 | Fabric select/delete/undo — P03 |
| W4 | Fabric↔Three pose — P04 |
| W5–W6 | open3d persistence + labels — P06 |
| W7 | modular mesh — P08 |
| W8 | shortcuts chrome — P09 |

## Furniture env flag

`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` / `fabricFurnitureFlag` — module exists; **not wired** in OOPlannerWorkspace (`hostWiringP01`).
