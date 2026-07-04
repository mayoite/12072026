# Open3D native planner (production)

This directory is the **production source of truth** for the Open3D-to-React planner that replaces the archived Fabric stack.

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
| `/planner/fabric/*` | Fabric fallback → `_archive/fabric/` |
| `/planner/open3d` | Redirect to guest or canvas |

Host chain: `Open3dPlannerHost` → `ui/Open3dNativeHost` → `editor/OOPlannerWorkspace`.

## Archive mirrors

`OOPlanner/` and `open3d-next-staging/` are reference copies only; edit production code here.
