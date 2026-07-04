# Open3D planner route (production hybrid)

This directory is the **production source of truth** for the live planner route.

Despite the `open3d/` folder name, the live planner is currently a **hybrid** stack:

- 2-D editing uses the Fabric-backed [`canvas-fabric/`](D:/oandO04072026/site/features/planner/open3d/canvas-fabric)
- 3-D viewing uses the Three/r3f [`3d/`](D:/oandO04072026/site/features/planner/open3d/3d)
- route composition, chrome, catalog, persistence, and commands live under this `open3d/` tree

This replaces the old top-level Fabric workspace routes, but it does **not** mean Fabric is absent from the live planner implementation.

## Layout

Mirrors `site/features/planner/` top-level names where the Open3D slice has code:

- `editor/`, `canvas-fabric/`, `catalog/`, `model/`, `3d/`, `shared/`, `lib/`, `ai/`, `persistence/`, `store/`, `ui/`, `cleanup/`

See `plannnerplan/phases/07/structure-mirror.md` for the full before/after mapping.

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
| `/planner/open3d` | Redirect to guest or canvas |

Host chain: `Open3dPlannerHost` → `ui/Open3dNativeHost` → `editor/OOPlannerWorkspace` → `canvas-fabric/FeasibilityCanvas` (2-D) or `3d/ThreeLazyViewer` (3-D).

`/planner/fabric/*` refers to the archived legacy workspace shell, not the Fabric-backed canvas that is still embedded inside the live hybrid planner.

## Archive mirrors

`OOPlanner/` and `open3d-next-staging/` are reference copies only; edit production code here.
