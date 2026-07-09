# Open3d planner code audit — Agent A (interaction / persist / product honesty)

**Date:** 2026-07-09  
**Scope:** `D:\OandO07072026\site\features\planner\open3d` (+ related planner IDB helper under `site/features/planner/persistence`)  
**Method:** Code-only independent audit. **No trust** of Plans/, ayushdocs, or NOTES.md pass claims.  
**Ranking:** Highest buyer impact first within each severity band.

---

## Executive summary (top 10 — see short list at end)

Product path has a working 2D select→delete→undo **document** loop for furniture/walls/rooms, and autosave labels mostly say “locally.” Critical gaps for a buyer: **doors/windows not selectable**, **wall delete orphans openings**, **2D degrees vs 3D radians breaks rotation continuity**, **3D is view-only (no pick/delete) and incomplete geometry**, **save is local IDB only despite member/cloud modules**, **BOQ/quote has no prices**, **most furniture is boxes**, **PDF/PNG export menus lie**, and **dual/dead engines** (history, fabric flag, door hooks, AI stubs).

---

## Findings (ranked by buyer impact)

### P0 — Breaks core trust / plan correctness

#### F01 — Select path cannot pick doors or windows (buyer cannot select→delete openings by click)
- **Impact:** Doors/windows are drawn and placeable, but select tool never hits them. Delete/Backspace only works after selection — so openings are effectively undead unless Properties (which needs selection) or wall cascade (also broken — F02).
- **Evidence:** `canvas-feasibility/FeasibilityCanvas.tsx` select handler: furniture → wall → room only; no door/window pick.
  ```735:761:D:\OandO07072026\site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx
  if (event.button === 0 && activeTool === "select" && workspaceCanvas) {
    // Furniture first (top-most), then walls, then rooms — product select bar.
    const furnitureId = pickFurnitureAtPoint(...);
    ...
    const wallId = pickWallAtPoint(...);
    ...
    workspaceCanvas.setSelection(
      wallId ? { type: "wall", ids: [wallId] }
        : room ? { type: "room", ids: [room.id] }
        : { type: "none", ids: [] },
    );
  }
  ```
- **Also:** `lib/geometry/canvasPicking.ts` exports wall/furniture/room helpers only — no `pickDoorAtPoint` / `pickWindowAtPoint`.
- **Selection model supports types** `"door" | "window"` in `editor/useWorkspaceCanvas.ts` and `workspaceEntityHelpers.ts` `COLLECTION_BY_SELECTION`, but product UI never sets them.

#### F02 — Keyboard/panel wall delete does not cascade openings (orphans)
- **Impact:** Deleting a wall leaves doors/windows pointing at missing `wallId`. 2D still tries to draw them via `wallById.get` (skips silently if missing). Plan integrity / export / BOQ-adjacent geometry wrong.
- **Evidence — product delete path (no cascade):**
  ```105:141:D:\OandO07072026\site\features\planner\open3d\editor\workspaceEntityHelpers.ts
  export function applySelectionDelete(...) {
    // filters only selected collection; no doors/windows cleanup when collection === walls
    const nextItems = items.filter(...);
    ...
  }
  ```
- **Evidence — pureActions *does* cascade (unused by keyboard delete):**
  ```165:174:D:\OandO07072026\site\features\planner\open3d\model\operations\pureActions.ts
  export function removeWall(...) {
    floor.walls = floor.walls.filter((w) => w.id !== id);
    floor.doors = floor.doors.filter((d) => d.wallId !== id);
    floor.windows = floor.windows.filter((w) => w.wallId !== id);
  }
  ```
- **Buyer impact:** Two delete engines disagree; product uses the incomplete one.

#### F03 — Furniture rotation units: 2D degrees vs 3D radians (2D/3D continuity broken)
- **Impact:** Any non-zero rotation looks correct in 2D and wrong in 3D (e.g. 90° plan becomes ~90 rad ≈ 15+ turns). Buyer trust in “what I placed is what I see in 3D” fails.
- **Evidence — document + placement are degrees:**
  - `catalog/placementAction.ts`: `/** Rotation in degrees (default: 0) */`
  - `canvas-fabric-stage/furnitureFabricMapper.ts`: `/** Degrees, same convention as Open3dFurnitureItem.rotation. */`
  - 2D draw: `context.rotate((item.rotation * Math.PI) / 180)` in `FeasibilityCanvas.tsx`
  - 2D pick: `const rad = (-(item.rotation || 0) * Math.PI) / 180` in `canvasPicking.ts`
- **Evidence — 3D applies raw number as radians:**
  ```147:154:D:\OandO07072026\site\features\planner\open3d\3d\createSceneObjectFromNode.ts
  mesh.position.set(mmToMeters(node.xMm), mesh.position.y, mmToMeters(node.yMm));
  mesh.rotation.y = -node.rotation;  // no deg→rad
  ```
  Same for modular/workstation paths (`meshGroup.rotation.y = -node.rotation`).
- **Node pipeline** copies `rotation: item.rotation` unchanged (`buildOpen3dSceneNodes.ts`).

#### F04 — 3D view is not an editor: no pick / select / delete / undo feedback on meshes
- **Impact:** Tab to 3D is preview-only. Buyer cannot select furniture in 3D; Delete while in 3D may still hit keyboard delete on *2D selection state* if selection was set before switch — confusing dual UX.
- **Evidence:** `3d/ThreeViewerInner.tsx` rebuilds meshes + OrbitControls only; no raycast, no selection props, no callbacks. `entityId` is stamped on `userData` but never consumed for interaction.
- **Evidence product mount:** `OOPlannerWorkspace.tsx` renders `<Lazy3DViewer projectData={...} />` with control props only.

#### F05 — 3D scene incomplete vs 2D document (doors, windows, rooms, openings missing)
- **Impact:** 2D plan shows rooms/doors/windows; 3D only extrudes walls + furniture boxes/modular groups. Continuity promise fails for openings and space definition.
- **Evidence:** `buildOpen3dSceneNodes.ts` iterates `floor.walls` and `floor.furniture` only — no doors/windows/rooms/stairs/columns.

---

### P1 — Save / commerce / export honesty

#### F06 — Product “save” is local IndexedDB only; cloud member path exists but is unwired
- **Impact:** Authenticated buyers may assume “Save” / `isSynced` means account/cloud persistence. Data lives in browser IDB; clearing site data loses plans. Member cloud API client is dead code relative to workspace autosave.
- **Evidence — autosave:**
  ```17:50:D:\OandO07072026\site\features\planner\open3d\persistence\useOpen3dWorkspaceAutosave.ts
  // createAutoSaver(projectId) → IDB via @/features/planner/persistence/persistence
  isSynced: status === "saved",  // means local save callback fired
  ```
- **Evidence — labels honest in status strip, but naming is not:**
  - `workspaceStatusLabels.ts`: “Always honest: open3d path is local IDB until cloud is wired”
  - `WorkspaceShell.tsx` JSDoc: “local IDB until cloud is wired”
  - Prop still named `isSynced` → TopBar `data-synced`
- **Evidence — cloud modules unused by product path:**
  - `persistence/memberPlanRepository.ts` — REST `/api/plans/*` client
  - `persistence/guestPromotion.ts` — `promoteGuestSession` never imported outside its file
  - Autosave only uses `migrateGuestProjectToMember` + `loadProject`/`createAutoSaver` (IDB)
- **UI mixed honesty:** TopBar button for non-guest is plain **“Save”** (`TopBar.tsx`); guest is “Save draft”. Status text says “Saved locally” after save — good — but button does not.

#### F07 — Command registry Save/Export/Import are permanent stubs
- **Impact:** Palette/command path reports save as unavailable even when TopBar save works — dual command surfaces disagree.
- **Evidence:**
  ```108:138:D:\OandO07072026\site\features\planner\open3d\lib\commands\registry.ts
  const phase05StubCommands = [
    { id: "save", execute: () => ({ status: "unavailable", commandId: "save" }) },
    { id: "export-plan", ... unavailable },
    { id: "import-plan", ... unavailable },
    { id: "open-file", ... unavailable },
    { id: "print", ... unavailable },
  ];
  ```

#### F08 — Export menu offers PDF/PNG; preflight marks them ready; runtime says “coming soon”
- **Impact:** Lying UI. Buyer clicks Export PDF/PNG and gets a toast, not a file.
- **Evidence — menu:**
  ```281:290:D:\OandO07072026\site\features\planner\open3d\editor\TopBar.tsx
  Export as JSON / SVG / BOQ / quote / PDF / PNG
  ```
- **Evidence — preflight treats png/pdf as supported “ready”:**
  ```15:21:D:\OandO07072026\site\features\planner\open3d\shared\export\exportPreflight.ts
  SUPPORTED_EXPORT_FORMATS = ["json","svg","png","pdf","dxf"]
  // returns status ready if floor has geometry
  ```
- **Evidence — handler:**
  ```638:640:D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx
  `${format.toUpperCase()} export is coming soon — use JSON, SVG, BOQ, or quote for now.`
  ```
- **Also:** Import menu shows “Import from URL…” with **no action** (only `key === "file"` handled in TopBar).

#### F09 — BOQ / quote is systems-v0 qty only; no pricing; ignores non-workstation catalog
- **Impact:** Facility buyer cannot price a plan. “Add seats to quote cart” adds qty lines without price.
- **Evidence:**
  ```1:4:D:\OandO07072026\site\features\planner\open3d\catalog\workstationBoqV0.ts
  // No pricing (quote later); identity + footprint + quantity
  ```
  ```58:66:D:\OandO07072026\site\features\planner\open3d\catalog\workstationBoqV0.ts
  workstationBoqToQuoteCartItems → { id, name, qty } // no price field
  ```
  ```69:106:D:\OandO07072026\site\features\planner\open3d\catalog\workstationBoqV0.ts
  // Only parseWorkstationConfigKey; non-ws furniture ignored
  totalSeats: totalInstances, // v0: 1 seat per workstation instance
  ```
- Catalog has optional `pricing` types and sort-by-price (`catalogTypes.ts`, `catalogClient.ts`) but demo/seed items lack real prices; BOQ never reads them.

---

### P1 — Placement / mesh / dual engines

#### F10 — Default catalog furniture is parametric boxes; modular quality is narrow exception
- **Impact:** Visual quality for most inventory is “gray box.” Only `geometryMode === modular-cabinet-v0` and `workstation-v0` get multi-part meshes; comments admit “Not photoreal GLB.”
- **Evidence:**
  - `createSceneObjectFromNode.ts`: modular cabinet / workstation groups, else `ParametricBuilder.generate3DMesh` (single BoxGeometry).
  - `parametricBuilder.ts`: box footprint + box mesh.
  - `workstationMeshV0.ts` header: “Pure plan (mm) + Three group of role-colored boxes. Not photoreal GLB.”
  - Placement stamps modular only for cabinet-v0 catalog id/slug (`placementAction.ts` `MODULAR_CABINET_V0_CATALOG_ID`).

#### F11 — Dual 2D furniture engines (Canvas 2D + optional Fabric overlay)
- **Impact:** Flag-off path is single canvas. Flag-on (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`) mounts FeasibilityCanvas **and** FurnitureFabricLayer — double representation risk (double hit-test, desync if transform lag, furniture drawn twice unless layerVisibility hides canvas furniture).
- **Evidence:**
  - `canvas-fabric-stage/fabricFurnitureFlag.ts` default OFF
  - `OOPlannerWorkspace.tsx`: when enabled, wraps canvas + Fabric; sets `feasibilityLayerVisibility` to hide canvas furniture when fabric on
  - Fabric layer rebuilds Rects from document; interactive only when `activeTool === "select"`

#### F12 — Dual history engines (live vs dead)
- **Impact:** Maintenance / bug risk; wrong import could silently fork semantics.
- **Live:** `store/history.ts` via `lib/commands/plannerCommand.ts` + `useWorkspaceCanvas`.
- **Dead alternate:** `model/operations/history.ts` (JSON clone, maxHistory, jumpTo) re-exported from `model/operations/index.ts` but **not** used by workspace.
- **Standalone dual path in FeasibilityCanvas:** When `workspaceCanvas` prop is absent, canvas keeps internal `history`/`future` arrays (`FeasibilityCanvas.tsx` undo/redo/commitProject branches). Product embeds with `workspaceCanvas` — OK — but dual path remains.

#### F13 — Dead / parallel placement & drawing hooks
- **Impact:** Code suggests more product capability than wired UI delivers; tests may cover dead paths.
- **Evidence:**
  - `useDoorWindowPlacement.ts` — self-contained hook; **no production importer** (grep only finds definition). FeasibilityCanvas places doors/windows directly via pureActions.
  - `useRoomElements.ts` — same: defined, not imported by product shell.
  - `useCanvasDrawing` explicitly marked dead production path (`useWorkspaceCanvas.ts` comments; only tests).
  - `guestProjectRepository.ts` in-memory Map — not used by autosave IDB path.

#### F14 — Async modular GLB place can clobber concurrent document edits
- **Impact:** Race: place cabinet with GLB starts from `baseProject = workspaceCanvas.project` snapshot; on resolve does `updateProject(() => result.project)` which **replaces** full project, discarding edits made during await.
- **Evidence:** `OOPlannerWorkspace.tsx` `handlePlaceAtPoint` modular branch (~471–487): captures base, async place, then `updateProject(() => result.project)`.

#### F15 — Properties panel action groups largely empty / stubbed
- **Impact:** UI shows Dimensions / Placement / Appearance / Metadata sections with no content; Reset/Commit/Cancel buttons are no-ops.
- **Evidence:** `PropertiesPanel.tsx` ~996–1032: empty group shells + `/* reset stub */` / `/* commit stub */` / `/* cancel stub */`.

#### F16 — AI sketch-to-plan server path is a successful placeholder (lying success)
- **Impact:** If wired, reports “Sketch converted successfully” while returning a default rectangular room and message “placeholder - API not connected.”
- **Evidence:** `ai/sketchToPlan.ts` `executeSketchToPlan` lines 128–207.

#### F17 — Unbounded undo history in live store
- **Impact:** Long sessions grow `past: Open3dProject[]` without cap (`store/history.ts` always appends). `useWorkspaceCanvas` accepts `maxHistory` option but **never applies it**. Dead history engine caps at 50.
- **Buyer impact:** Memory/perf degradation after heavy edit sessions; less “data loss” than P0s.

#### F18 — 3D orbit present; camera/view not shared with 2D; remount on toggle
- **Impact:** Orbit works (defaults ON via `orbitDefaults.ts` + `getOpen3dViewerControlProps`). Switching 2D↔3D unmounts/remounts viewers (`viewMode === "2d" ? FeasibilityCanvas : Lazy3DViewer`) — loses orbit pose, loses 2D transform continuity in reverse only if canvas remounts (it does). Fixed initial camera `position.set(4,6,8)` every mount.
- **Evidence:** `ThreeViewerInner.tsx` setup; `OOPlannerWorkspace.tsx` conditional render.

#### F19 — Catalog status can claim “Live catalog” while seeding demo/sample items
- **Impact:** Status pill uses `catalog.status === "ready"` → “Live catalog” even though items always merge `OPEN3D_DEMO_CATALOG_ITEMS` when remote present (`useOpen3dWorkspaceCatalog.ts`).
- **Evidence:** `OOPlannerWorkspace.tsx` status pills; catalog hook merge logic.

#### F20 — Room delete / wall delete may leave inconsistent room wall id lists
- **Impact:** `applySelectionDelete` for rooms only removes room records, not walls; wall delete does not update room wall membership. Milder than F02 but plan topology can go stale.

---

## Focus-area map

| Focus | Verdict | Key findings |
|-------|---------|--------------|
| 1. Select/delete/undo | Partial | F01, F02; furniture/wall/room select+delete+undo works via full project snapshots; selection not restored on undo; doors/windows unselectable |
| 2. Save honesty | Partial honesty | Labels mostly local; F06 isSynced/cloud unwired; F07 stub commands; button “Save” for members |
| 3. 2D/3D continuity & orbit | Broken for rotation / openings | F03, F04, F05, F18; orbit ON |
| 4. Placement / catalog / workstation v0 | Works narrowly | Workstation place/batch/BOQ v0 present; F10 box default; F11 dual fabric; F14 race |
| 5. Mesh quality | Box-default | F10; modular + workstation multi-box only |
| 6. BOQ/pricing | Qty only | F09 |
| 7. Dual engines / stubs / lying UI | Multiple | F07, F08, F11–F13, F15–F16 |

---

## What appears *working* (for fairness, still code-backed)

1. **Furniture select → Delete/Backspace → undo restore of document entities**  
   - `useWorkspaceKeyboard` → `deleteSelection` → `applySelectionDelete` → `updateOpen3dProject` history push  
   - Undo: `executePlannerCommand({ type: "history.undo" })` restores prior `Open3dProject`  
   - Selection is cleared on delete and **not** re-bound on undo (UX gap, not data loss for document)

2. **Autosave to IDB** via `createAutoSaver` + session envelope; restore on load path exists in `useOpen3dWorkspaceAutosave.restoreSnapshot`

3. **Workstation systems v0** place, batch place, configurator panel, mesh parts, BOQ JSON download — present in product wiring

4. **OrbitControls default enabled** for product 3D mount

---

## Recommended fix order (buyer impact)

1. F03 rotation deg↔rad in 3D (one-line class of fix)  
2. F01 door/window pick + F02 cascade delete through product delete path  
3. F04/F05 3D interact + openings (or honest “preview only” chrome)  
4. F06 wire cloud or keep UI forever local-clear  
5. F08 remove/disable PDF/PNG or implement  
6. F09 pricing or honest “qty-only BOQ” product language everywhere  
7. F10 expand modular/GLB coverage beyond cabinet-v0  
8. Collapse dual engines (F11–F13)  

---

## Top 10 problems only (short)

1. **Doors/windows not selectable** on canvas — delete path dead for openings (F01).  
2. **Wall delete orphans doors/windows** — product helpers skip cascade that pureActions has (F02).  
3. **2D rotation degrees vs 3D radians** — 3D pose wrong for rotated furniture (F03).  
4. **3D is view-only** — no select/delete on meshes (F04).  
5. **3D omits doors/windows/rooms** — incomplete continuity (F05).  
6. **Save is local IDB; cloud modules unwired**; `isSynced` misnames local save (F06).  
7. **PDF/PNG export menus + preflight “ready” but runtime “coming soon”** (F08).  
8. **BOQ/quote has no prices**; only workstation-v0 seats (F09).  
9. **Most furniture meshes are boxes**; modular quality is the exception (F10).  
10. **Dual/dead engines & stubs** — fabric flag, dual history, dead door hooks, command save stubs, Properties stubs, AI placeholder success (F07, F11–F13, F15–F16).  

---

## Files heavily cited

| Path | Role |
|------|------|
| `canvas-feasibility/FeasibilityCanvas.tsx` | Pick, draw, dual history, door/window place |
| `lib/geometry/canvasPicking.ts` | Pick helpers |
| `editor/workspaceEntityHelpers.ts` | Selection delete (no cascade) |
| `editor/OOPlannerWorkspace.tsx` | Product wiring, save/export, place, view mode |
| `editor/useWorkspaceKeyboard.ts` | Delete/undo keys |
| `store/history.ts` | Live undo stack |
| `model/operations/history.ts` | Dead alternate history |
| `model/operations/pureActions.ts` | Cascade removeWall |
| `3d/createSceneObjectFromNode.ts` | Rotation + box/modular mesh |
| `3d/buildOpen3dSceneNodes.ts` | Walls+furniture only |
| `3d/ThreeViewerInner.tsx` | Orbit, no pick |
| `persistence/useOpen3dWorkspaceAutosave.ts` | Local IDB save |
| `persistence/memberPlanRepository.ts` | Unwired cloud |
| `lib/commands/registry.ts` | Stub commands |
| `catalog/workstationBoqV0.ts` | Qty-only BOQ |
| `shared/export/exportPreflight.ts` | False ready for pdf/png |
| `canvas-fabric-stage/*` | Optional second 2D engine |
| `ai/sketchToPlan.ts` | Placeholder success |

---

*End of Agent A audit.*
