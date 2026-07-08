# Open3D planner route (production hybrid)

This directory is the **production source of truth** for the live planner route.

Despite the `open3d/` folder name, the live planner is currently a **hybrid** stack:

- 2-D editing uses raw Canvas 2D via [`canvas-feasibility/FeasibilityCanvas`](./canvas-feasibility/FeasibilityCanvas.tsx) — **not** Fabric
- 3-D viewing uses the Three/r3f [`3d/`](./3d)
- route composition, chrome, catalog, persistence, and commands live under this `open3d/` tree

Fabric.js is package-installed; the archived full Fabric workspace lives under `_archive/fabric/`. Default live 2-D remains FeasibilityCanvas. Fabric full-stage cutover is Phase **2B** (`Plans/01-execution/core/02B-PHASE-2B-2C.md`). A **furniture-only** Fabric overlay is opt-in (below).

## Fabric furniture stage (opt-in proof)

Default **OFF** (unset or any value other than `1`). Production UI unchanged.

```powershell
# repo-root .env.local — then restart dev
NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1
```

Only exact `1` enables (`fabricFurnitureFlag.ts`). When on:

| Layer | Owner |
|-------|--------|
| Walls / floor / draw tools | `FeasibilityCanvas` (unchanged) |
| Furniture | `canvas-fabric-stage/FurnitureFabricLayer` overlay |

**Pointer:** Fabric gets events only when the active tool is **select**; otherwise the host uses `pointer-events: none` so walls/draw keep ownership.

**Known limits (proof only, not production dual-mode):**

- Select + flag: fabric host is `pointer-events: auto` over the full stage — empty space can block FeasibilityCanvas pick
- Pan/zoom transform is not shared with FeasibilityCanvas yet (overlay can desync after pan/zoom)

## Layout

Mirrors `site/features/planner/` top-level names where the Open3D slice has code:

- `editor/`, `canvas-feasibility/`, `catalog/`, `model/`, `3d/`, `shared/`, `lib/`, `ai/`, `persistence/`, `store/`, `ui/`, `cleanup/`

See `archive/plans/2026-07-05_phase1-execution/phases/07-auth-and-permissions.md` for the full before/after mapping.

## Tests

Unit tests live in **`site/tests/unit/features/planner/open3d/`** (not co-located here). Run:

```bash
pnpm --filter oando-site run test:planner
```

## Route wiring

| Route | Entry |
|-------|--------|
| `/planner/guest` | `site/app/planner/(workspace)/guest/page.tsx` → `Open3dPlannerHost` |
| `/planner/canvas` | `site/app/planner/(workspace)/canvas/page.tsx` → `Open3dPlannerHost` |
| `/planner/fabric/*` | legacy top-level Fabric fallback → `_archive/fabric/` |
| `/planner/open3d` | `site/app/planner/open3d/page.tsx` → `Open3dPlannerHost` (1A pilot shell) |

Host chain: `Open3dPlannerHost` → `ui/Open3dNativeHost` → `editor/OOPlannerWorkspace` → `canvas-feasibility/FeasibilityCanvas` (2-D) or `3d/ThreeLazyViewer` (3-D).

`/planner/fabric/*` is the archived legacy Fabric workspace shell only — not the live 2-D path.

## Archive mirrors

`OOPlanner/` and `open3d-next-staging/` are reference copies only; edit production code here.
