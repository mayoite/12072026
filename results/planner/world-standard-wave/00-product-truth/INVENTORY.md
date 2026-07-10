# P01 Product Truth — INVENTORY

**Date:** 2026-07-10  
**HEAD:** `ab930b89c5dcd089f9dcc46490ab2d4dd50cdb96`  
**Checkout:** `.` (main only; single worktree)  
**Scope:** Inventory only — no edits under `site/features/planner/open3d/**`  
**Evidence folder (FOLDER-LOCK):** `results/planner/world-standard-wave/00-product-truth/`

---

## What open3d actually is

Despite the folder name `open3d/`, the live planner is a **hybrid stack**:

| Layer | Engine | Path |
|-------|--------|------|
| **2D edit** | Canvas 2D (`FeasibilityCanvas`) — **not** Fabric by default | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` |
| **3D view** | Three.js + R3F (`Lazy3DViewer` → `ThreeViewerInner`) | `site/features/planner/open3d/3d/` |
| **Orbit** | OrbitControls; product default **ON** | `orbitDefaults.ts`: `OPEN3D_ORBIT_DEFAULT_ENABLED = true` |
| **Model** | UUID entities (`crypto.randomUUID`), mm units | `site/features/planner/lib/newEntityId.ts` + `open3d/model/` |
| **Persistence** | Local IDB autosave; UI labels always “local” honesty | `persistence/useOpen3dWorkspaceAutosave.ts` + `editor/workspaceStatusLabels.ts` |
| **Fabric full stage** | Archive only | `site/features/planner/_archive/fabric/` |
| **Fabric furniture overlay** | Opt-in exact env `"1"` only; default OFF | `canvas-fabric-stage/fabricFurnitureFlag.ts` |

**File counts (this HEAD):**

- Production tree `site/features/planner/open3d/`: **143 files**
- Unit tests `site/tests/unit/features/planner/open3d/`: **91 files**

Folder file counts (TSV also in `open3d-folder-counts.tsv`):

| Folder | Files |
|--------|------:|
| catalog | 41 |
| editor | 31 |
| shared | 15 |
| model | 12 |
| 3d | 9 |
| lib | 8 |
| persistence | 8 |
| ai | 6 |
| canvas-fabric-stage | 5 |
| store | 3 |
| cleanup | 2 |
| canvas-feasibility | 1 |
| ui | 1 |

---

## Dual host chains (live)

### Hybrid entry — guest / canvas

```
app/planner/(workspace)/guest/page.tsx
app/planner/(workspace)/canvas/page.tsx
  → features/planner/ui/Open3dPlannerWorkspaceRoute.tsx
      (Providers + ProjectSetupGate + dynamic Open3dPlannerHost ssr:false)
  → features/planner/ui/Open3dPlannerHost.tsx
  → open3d/ui/Open3dNativeHost.tsx
  → open3d/editor/OOPlannerWorkspace.tsx
      → FeasibilityCanvas (2D) + Lazy3DViewer (3D)
```

### Pilot entry — `/planner/open3d`

```
app/planner/open3d/page.tsx
  → features/planner/ui/Open3dPlannerHost.tsx  (direct; no WorkspaceRoute)
  → open3d/ui/Open3dNativeHost.tsx
  → open3d/editor/OOPlannerWorkspace.tsx
```

| Route | App page | Entry component |
|-------|----------|-----------------|
| `/planner/guest` | `(workspace)/guest/page.tsx` | `Open3dPlannerWorkspaceRoute` |
| `/planner/canvas` | `(workspace)/canvas/page.tsx` | `Open3dPlannerWorkspaceRoute` |
| `/planner/open3d` | `open3d/page.tsx` | `Open3dPlannerHost` (pilot) |
| `/planner/fabric*` | **No app pages** | Permanent redirect → `/planner/open3d/` (`next.config.js` ~206–207) |

---

## Key production paths (exist = TRUE on this HEAD)

| Path | Role |
|------|------|
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Live 2D canvas |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | Workspace shell; delete/place/3D props |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Delete/Backspace → `deleteSelection` |
| `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` | Canvas tool wiring |
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | `applySelectionDelete` |
| `site/features/planner/open3d/editor/workspaceStatusLabels.ts` | `formatAutosaveStatus` local strings |
| `site/features/planner/open3d/3d/ThreeViewerInner.tsx` | OrbitControls path |
| `site/features/planner/open3d/3d/ThreeLazyViewer.tsx` | `Lazy3DViewer` export |
| `site/features/planner/open3d/3d/orbitDefaults.ts` | Orbit default ON + control props |
| `site/features/planner/open3d/ui/Open3dNativeHost.tsx` | Thin native host → workspace |
| `site/features/planner/ui/Open3dPlannerHost.tsx` | Thin wrapper → NativeHost |
| `site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx` | Hybrid route shell |
| `site/features/planner/open3d/persistence/useOpen3dWorkspaceAutosave.ts` | Local autosave |
| `site/features/planner/open3d/canvas-fabric-stage/fabricFurnitureFlag.ts` | Fabric overlay flag |
| `site/features/planner/open3d/cleanup/importGraphProof.ts` | Import graph proof (stale fabric rows noted) |
| `site/features/planner/_archive/fabric/` | Archived Fabric workspace |
| `site/features/planner/lib/newEntityId.ts` | UUID-only IDs |
| `site/config/build/next.config.js` | fabric → open3d redirects |

---

## Engines / product defaults (source truth)

| Concern | Live truth |
|---------|------------|
| 2D furniture interactive default | FeasibilityCanvas only (Fabric overlay OFF unless env exact `1`) |
| 3D orbit | `OPEN3D_ORBIT_DEFAULT_ENABLED = true`; `getOpen3dViewerControlProps()` → `{ enableControls: true }` |
| Delete | Keyboard Delete/Backspace → `handlers.deleteSelection` |
| Save labels | Always local: “Saving locally…”, “Saved locally”, “Draft saved locally”, “Ready (local)”, etc. |
| Entity IDs | `crypto.randomUUID` only |
| Fabric routes | No `site/app/planner/**/fabric` pages; redirects permanent to open3d |

---

## Unit smoke (required)

Command:

```powershell
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d/hostWiringP01.test.ts --reporter=verbose
```

- **Log:** `vitest-hostWiringP01.log`
- **Result:** **4/4 passed**, exit **0** (2026-07-10)

Key unit files for later phases (full list: `open3d-unit-test-files.txt`, 91 paths):

- `hostWiringP01.test.ts`
- `orbitControlsDefault.test.tsx`
- `applySelectionDelete.test.ts`
- `poseContinuityW4.test.ts`
- `toolShortcutTruth.test.ts`
- `open3dWorkspaceKeyboard.test.tsx`
- `workspaceStatusLabels.test.ts`
- `routesCoverage.test.tsx`
- `saveReloadContinuity.test.ts`

---

## E2E sources present (not run this pack)

Under `site/tests/e2e/`:

- `open3d-world-standard-journey.spec.ts`
- `open3d-w3-select-delete.spec.ts`
- `open3d-w4-orbit-continuity.spec.ts`
- `open3d-save-honesty.spec.ts`
- plus systems-v0 / mesh / console residual specs

Browser proof for residual wave remains **unproven on this checkout** until phase folders under `world-standard-wave/` hold non-empty gate artifacts.

---

## Authority for this wave

| Use | Path |
|-----|------|
| Execute | `plans1/START-HERE.md` → P01 |
| Folder names | `Plans/Research/RESULTS-MAP.md` → **`00-product-truth/`** |
| Plan review | `plans1/P01-product-truth/CODE-REVIEW-REPORT.md` (APPROVE-WITH-FIXES) |
| Historical brainstorm | `archive/Idiots2/P01-product-truth/` (not repo-root `Idiots2/`) |
| Claim / honesty docs | `Plans/Others/*` (not `ayushdocs/` — missing at root) |
