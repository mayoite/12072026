# ENGINE-LOCK-RECORD — Fabric-sole (P02)

**Checkout:** see `HEAD.txt`  
**Status:** Re-proved in code this session · **CP-02 not owner PASS** (no forged signoff)

## Locked stack (upgrade)

| Layer | Locked choice | Live path |
|-------|---------------|-----------|
| Live layout | `editor` · `canvas` · `3d` · `project` · `ui` | `features/planner/` — **no** product `open3d/` or `workspace/` folder |
| Routes | guest + canvas only | `/planner/guest` · `/planner/canvas` |
| Legacy URLs | Redirect only | `/planner/open3d` · `/planner/fabric*` → canvas |
| **2D host** | Fabric.js **7.4.0** sole interactive plan canvas | `PlannerFabricStage` as `PlannerCanvasStage` |
| Browser testid | Sole proof host | `data-testid="planner-fabric-stage"` · `role="application"` |
| Walls + furniture | In Fabric stage | Not flag-gated second canvas |
| Flag leftover | `NEXT_PUBLIC_PLANNER_FABRIC_FURNITURE` / fabric furniture env | Module + tests only — **not** host switch |
| Second plan host | **Gone** | Do not recreate |
| Archive fabric | **Deleted** | Not restorable as product host |
| 3D | Three + orbit ON | `Lazy3DViewer` + `getPlannerViewerControlProps()` |
| Toolbar | React Aria `1.19.0` | `CanvasToolRail` — see P09 |
| Icons | Phosphor only | no lucide-react |
| Tools | live vs deferred tiers | `CANVAS_TOOL_REQUIREMENT` |

```
Document (UUID v7, mm)
  → 2D: Fabric stage (sole) · 3D: Three + orbit
  → Persist: local first (P06 honesty)
```

### Live wiring (proved in code, not browser W gates)

| Layer | Where |
|-------|--------|
| UUID v7 + mm | `lib/newEntityId` → `uuid` **v7**; envelope `units: "mm"` · accept legacy v4 on read via `isEntityUuid` |
| 2D sole | `OOPlannerWorkspace` mounts `PlannerCanvasStage` when viewMode 2d |
| 3D orbit | `Lazy3DViewer` + `{...getPlannerViewerControlProps()}` when viewMode 3d |
| Local first | `usePlannerWorkspaceAutosave` · `cloudEnabled` false · local save labels |

## Forbidden downgrade

- Dual interactive plan canvas
- Prove W gates on archive `planner-2d-canvas`
- Re-add `_archive/fabric` as product host
- R3F rewrite as substitute for workspace Lazy3D path
- Drop RAC toolbar without owner explain

Any of the above = **engine downgrade** — stop, fix plan/code, do not claim W-gate or CP-02 progress on a downgraded host.
