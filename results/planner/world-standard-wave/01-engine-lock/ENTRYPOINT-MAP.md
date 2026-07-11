# ENTRYPOINT-MAP — P02 engine lock (Fabric-sole, live routes / hosts)

**Phase:** P02 / CP-02  
**Date:** 2026-07-11  
**Authority:** live `page.tsx` + host components + workspace mounts  
**Supersedes:** any prior map that names FeasibilityCanvas as interim product 2D.

---

## 1. Live planner routes (app router)

| URL | App page | Host chain |
|-----|----------|------------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` → dynamic `Open3dPlannerHost` → **`OOPlannerWorkspace`** |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | Same WorkspaceRoute chain; `guestMode` from `!user` |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | **Direct** `Open3dPlannerHost` → **`OOPlannerWorkspace`** (no WorkspaceRoute / no ProjectSetupGate) |

### Route comments (live)

- Guest L5: `Open3dFabricStage (Fabric 2-D) + Three 3-D`
- Canvas L6: `Fabric 2-D (PlannerCanvasStage) + Three 3-D`
- Open3d L7: `Open3dFabricStage 2-D + Three 3-D`

---

## 2. Host component chain

```
/planner/guest | /planner/canvas
  → Open3dPlannerWorkspaceRoute
      site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx
      dynamic(Open3dPlannerHost, ssr:false)
      Providers → ProjectSetupGate → Open3dPlannerHost

/planner/open3d (skips WorkspaceRoute)
  → Open3dPlannerHost
      site/features/planner/ui/Open3dPlannerHost.tsx
      → OOPlannerWorkspace (direct)

  → OOPlannerWorkspace
      site/features/planner/open3d/editor/OOPlannerWorkspace.tsx
      2D: PlannerCanvasStage (Fabric sole)
      3D: Lazy3DViewer + getOpen3dViewerControlProps()
```

**Note:** Prior packs cited `Open3dNativeHost` / `open3d/ui/` — that path is **gone**. Host is `Open3dPlannerHost` only (`hostWiringP01` asserts `open3d/ui` does not exist).

**Import graph proof (secondary):** `site/features/planner/open3d/cleanup/importGraphProof.ts` — stacks still labeled `open3d-hybrid` for guest/canvas (naming residue; **not** dual 2D host).

---

## 3. Sole 2D mount — Fabric stage

| Item | Live path / fact |
|------|------------------|
| Workspace import | `OOPlannerWorkspace.tsx` L17–21: `PlannerCanvasStage` from `../canvas-stage` |
| Barrel | `open3d/canvas-stage/index.ts` → `Open3dFabricStage as PlannerCanvasStage` |
| Implementation | `site/features/planner/canvas-fabric-stage/Open3dFabricStage.tsx` |
| Mount | `OOPlannerWorkspace.tsx` ~L1093–1116 inside `viewMode === "2d"` |
| Walls + furniture | Drawn in Fabric stage via layer visibility (`onWallDrawn`, furniture objects) |
| `data-testid` | `open3d-fabric-stage` |
| Feasibility mount | **None** |
| Flag-gated overlay | **None** |

---

## 4. Lazy3DViewer + `getOpen3dViewerControlProps`

| Item | Live path |
|------|-----------|
| Lazy viewer | `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` |
| Orbit defaults + helper | `site/features/planner/open3d/3d/orbitDefaults.ts` |
| `OPEN3D_ORBIT_DEFAULT_ENABLED` | `true as const` |
| `getOpen3dViewerControlProps()` | returns `{ enableControls: true }` |
| Product mount | `OOPlannerWorkspace.tsx` spreads helper into `Lazy3DViewer` (~L1149) |

**Lock note:** Product path **spreads** the helper (typed force `enableControls: true`).

---

## 5. `canvas-fabric-stage` layout (live + leftovers)

| File | Role |
|------|------|
| `Open3dFabricStage.tsx` | **Product** sole 2D canvas |
| `canvasStageTypes.ts` | Handle / status types |
| `furnitureFabricMapper.ts` | Document ↔ Fabric pose (mm; entityId) |
| `fabricBlock2D.ts` | Block2D helpers on Fabric path |
| `fabricFurnitureFlag.ts` | **Leftover** env gate (`=== "1"`) — tests/module only |
| `FurnitureFabricLayer.tsx` | **Spike leftover** — not mounted by workspace |
| `index.ts` | Barrel (stage + mapper + leftover flag/layer) |

Location: `site/features/planner/canvas-fabric-stage/` (outside `open3d/`; open3d barrel re-exports stage only).

---

## 6. Feasibility / archive — not product hosts

| Surface | Status |
|---------|--------|
| `open3d/canvas-feasibility/` | **Absent** (not live) |
| `_archive/canvas-feasibility/` | **Absent on this tip** (plan cards still name it) |
| Residual CSS | `site/app/css/core/locked/planner/workspace-FeasibilityCanvas.css` |
| `_archive/fabric/` | Legacy Fabric workspace shell — not live routes |
| `/planner/fabric`, `/planner/fabric/:path*` | Permanent redirect → `/planner/open3d/` (`next.config.js`) |

**Restore Feasibility or dual host = owner unlock only.** Do not prove gates on archive selectors.

---

## 7. Secondary surfaces (not product engine re-vote)

| Surface | Path | Note |
|---------|------|------|
| `Planner3DViewer` | `site/features/planner/3d/Planner3DViewer.tsx` | Still Three family |
| model-viewer preview | admin svg-editor | Not open3d workspace engine |
| Marketing planner pages | `app/planner/(marketing)/*` | Not workspace |

---

## 8. Absolute cite roots

- `site\app\planner\(workspace)\guest\page.tsx`
- `site\app\planner\(workspace)\canvas\page.tsx`
- `site\app\planner\open3d\page.tsx`
- `site\features\planner\ui\Open3dPlannerWorkspaceRoute.tsx`
- `site\features\planner\ui\Open3dPlannerHost.tsx`
- `site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `site\features\planner\open3d\canvas-stage\index.ts`
- `site\features\planner\canvas-fabric-stage\Open3dFabricStage.tsx`
- `site\features\planner\open3d\3d\ThreeLazyViewer.tsx`
- `site\features\planner\open3d\3d\orbitDefaults.ts`
- `site\config\build\next.config.js`
- `site\features\planner\_archive\fabric\`
