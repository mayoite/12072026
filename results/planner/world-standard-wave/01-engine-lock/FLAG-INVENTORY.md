# FLAG-INVENTORY (P02)

| Item | Value |
|------|--------|
| Env | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` |
| Constant | `OPEN3D_FABRIC_FURNITURE_ENV` |
| Enable rule | exact `"1"` only (`=== "1"`) |
| File | `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` |
| Helper | `isOpen3dFabricFurnitureEnabled()` |
| Barrel | `canvas-fabric-stage/index.ts` |
| Consumer | `OOPlannerWorkspace.tsx` — when ON, `FurnitureFabricLayer`; Feasibility still owns walls |
| Not this flag | `site/features/planner/lib/featureFlags.ts` |

Default OFF → Feasibility sole furniture draw.  
Local enable: set env `1`, restart next dev. Flag-ON = migration spike (pan/zoom desync risk per open3d README).
