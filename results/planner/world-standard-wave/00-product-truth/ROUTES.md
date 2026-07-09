# ROUTES — claims vs code (P01)

| Claim source | Claim text | Code path | Actual behavior | Match? |
|--------------|------------|-----------|-----------------|--------|
| guest page | Open3dPlannerWorkspaceRoute | `site/app/planner/(workspace)/guest/page.tsx` | WorkspaceRoute → Host | yes |
| canvas page | same | `.../canvas/page.tsx` | WorkspaceRoute → Host | yes |
| open3d page | direct Host | `site/app/planner/open3d/page.tsx` | Open3dPlannerHost only | yes |
| open3d README table | guest → Host only | README | Omits WorkspaceRoute | **no** (stale) |
| next.config | fabric → open3d | `site/config/build/next.config.js` | permanent redirect | yes |
| archive README | fabric fallback | `_archive/fabric/` | code archive only | yes as archive |
| WAVE | live 2D Feasibility | FeasibilityCanvas | sole interactive 2D | yes |

## Dual host entry

1. Guest/canvas: page → `Open3dPlannerWorkspaceRoute` → Providers/ProjectSetupGate → `Open3dPlannerHost` → NativeHost → Workspace  
2. Open3d pilot: page → `Open3dPlannerHost` → same chain (no WorkspaceRoute)

## Live 2D

FeasibilityCanvas only (default). Fabric furniture overlay flag-gated OFF.
