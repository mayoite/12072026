# ENTRYPOINT-MAP (P02)

| Route | Chain |
|-------|--------|
| `/planner/open3d` | `app/planner/open3d/page.tsx` → `Open3dPlannerHost` → `Open3dNativeHost` → `OOPlannerWorkspace` |
| `/planner/guest` | `app/planner/(workspace)/guest/page.tsx` → `Open3dPlannerWorkspaceRoute` → Host → Native → Workspace |
| `/planner/canvas` | same as guest with WorkspaceRoute |

Inside OOPlannerWorkspace:

- 2D: `FeasibilityCanvas`
- 3D: `Lazy3DViewer` default `enableControls` (orbit ON)
- optional: `FurnitureFabricLayer` when fabric flag ON

Orbit: `ThreeViewerInner` dynamic OrbitControls when enableControls.  
Secondary R3F: `site/features/planner/3d/Planner3DViewer.tsx` — not a second product engine.  
Admin: `ModelViewerPreview` single-asset only.  
Archive: `_archive/fabric/` not live guest/canvas.
