# P01 — Product truth (lightweight inventory)

**Date:** 2026-07-09  
**Checkout:** `D:\OandO07072026` (main only, no worktrees)  
**HEAD at write:** `6461924b064819e71833ad6a470436a5a2b7c15f`  
**Approach:** A (product journey first; recorded in `Plans/trustdata/00-START.md`)  
**Scope:** Read-only inventory of live open3d. No product code edited. No hype.

Production planner source: `site/features/planner/open3d/`. App hosts: `site/app/planner/`.

---

## Routes / host chain

| Route | Page | Host pattern |
|-------|------|--------------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` → `Open3dPlannerHost` |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` | same |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` | direct `Open3dPlannerHost` (no WorkspaceRoute) |

Chain after host:  
`Open3dPlannerHost` → `open3d/ui/Open3dNativeHost.tsx` → `open3d/editor/OOPlannerWorkspace.tsx`  
→ 2D `canvas-feasibility/FeasibilityCanvas.tsx` and/or 3D `3d/ThreeLazyViewer.tsx` → `ThreeViewerInner.tsx`.

`/planner/fabric*` permanent redirect → `/planner/open3d/` in `site/config/build/next.config.js`.  
Archive (not live pages): `site/features/planner/_archive/fabric/`.

---

## Engines (what runs today)

| Layer | Live | Path |
|-------|------|------|
| 2D interim | **FeasibilityCanvas** (Canvas 2D API) | `open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| 2D Fabric overlay | Flag **OFF** by default | `open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=== "1"` only; layer `FurnitureFabricLayer.tsx` |
| 3D | Three + orbit default ON | `open3d/3d/ThreeLazyViewer.tsx`, `ThreeViewerInner.tsx`, `orbitDefaults.ts` (`OPEN3D_ORBIT_DEFAULT_ENABLED = true`); workspace spreads `getOpen3dViewerControlProps()` |

Fabric.js package is installed; full Fabric workspace is archive + future destination, **not** default interactive 2D.

---

## Tools (code surface)

Defined in `open3d/editor/canvasTool.ts` / rail `CanvasToolRail.tsx`:

- Runtime: select, wall, door, window, text, pan  
- Planner extras: room (→ wall), opening (→ door), dimension (→ text), placement (→ select)  
- Shortcuts map: V/R/W/O/M/P/D/N/T/H  

Door/window placement hooks: `editor/useDoorWindowPlacement.ts`.  
Wall/opening model actions: `model/actions/walls.ts`, `model/actions/openings.ts`.

---

## Catalog / demo items

Offline seed when live API empty: `editor/demoCatalogItems.ts` → `OPEN3D_DEMO_CATALOG_ITEMS`.

Includes at least:

- Proof item via `catalog/proofCatalog.ts`  
- Sample sofa, desk, meeting table, chair (`sample-*`)  
- **cabinet-v0** (`geometryMode: "modular-cabinet-v0"`)  
- Systems v0 workstation matrix via `...WORKSTATION_V0_DEMO_CATALOG_ITEMS` (`catalog/workstationCatalogV0.ts`)

Inventory UI: `editor/InventoryPanel.tsx` (falls back to demo list).  
Place path: `catalog/placementAction.ts` (+ modular cabinet / workstation branches).  
Block2D: `catalog/furnitureBlock2D.ts`. Modular mesh: `catalog/modularCabinetV0.ts`.

---

## Systems v0

| Piece | Path |
|-------|------|
| Rules (size grid × linear/L, modules) | `catalog/workstationSystemV0.ts` |
| Catalog SKUs | `catalog/workstationCatalogV0.ts` |
| Place into document | `placementAction.ts` → `placeWorkstationConfigOnProject` |
| Prior evidence | `results/planner/world-standard-wave/07-systems-v0/` |

Workstation geometry still **box** at place time until modular workstation mesh lands.

---

## Select / delete

| Piece | Path |
|-------|------|
| Workspace delete | `OOPlannerWorkspace.tsx` — `deleteSelection` / `applySelectionDelete` |
| Keyboard Delete/Backspace | `editor/useWorkspaceKeyboard.ts` |
| Canvas selection | `FeasibilityCanvas.tsx` + `editor/useWorkspaceCanvas.ts` |

Code present. Product-usable browser bar is a separate gate (W3 / P03 evidence under `03-select-delete/` when green). This note does not claim buyer-ready delete.

---

## Save (local)

| Piece | Path |
|-------|------|
| Autosave hook | `persistence/useOpen3dWorkspaceAutosave.ts` (IDB via planner `createAutoSaver`) |
| Project JSON | `persistence/projectJson.ts` |
| Status copy honesty | `editor/workspaceStatusLabels.ts` — “Saved locally” / “Draft saved locally” |
| Guest / member repos | `guestProjectRepository.ts`, `memberPlanRepository.ts` |

Save is **local-first**. Do not claim cloud member save as default open3d path without separate W6 proof.

---

## One-paragraph reality

Open3d is a hybrid workspace: FeasibilityCanvas for interactive 2D, Three for 3D with orbit ON by default, document model in mm with UUID entities, demo + systems-v0 catalog for offline place, modular cabinet-v0 mesh path, IDB autosave with local status labels. Fabric full stage is not live; furniture Fabric overlay is flag-gated OFF. Fabric URL routes redirect to open3d. This inventory is code-path truth for later W-gate work — not a ship-quality claim for W1–W8.

---

## Explicit non-claims

- Not claiming full Fabric 2B cutover  
- Not claiming photoreal / multiplayer / AR  
- Not claiming all W1–W8 browser-green solely from this file  
- README route table still slightly stale on WorkspaceRoute vs direct Host; dual entry above is code truth  
