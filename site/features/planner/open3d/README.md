# Open3D planner route (production hybrid)

This directory is the **production source of truth** for the live planner route.

Despite the `open3d/` folder name, the live planner is currently a **hybrid** stack:

- 2-D editing uses raw Canvas 2D via [`canvas-feasibility/FeasibilityCanvas`](./canvas-feasibility/FeasibilityCanvas.tsx) — **not** Fabric
- 3-D viewing uses the Three/r3f [`3d/`](./3d)
- route composition, chrome, catalog, persistence, and commands live under this `open3d/` tree

Fabric.js is package-installed and present under `_archive/fabric/` only; live open3d is not Fabric-backed. Fabric full-stage cutover is Phase **2B** (`Plans/01-execution/core/02B-PHASE-2B-2C.md`).

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
