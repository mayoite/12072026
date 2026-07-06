# open3d-next-staging — archived validation lab

**Status (2026-07-03):** Tests, public assets, and production modules **moved** to `site/`. Do not build here.

## Where everything went

| Was | Now |
|-----|-----|
| `open3d-next-staging/tests/` | `site/tests/unit/features/planner/open3d/` |
| `open3d-next-staging/public/*.svg` | `site/public/` (identical hashes) |
| `open3d-next-staging/src/` | `site/features/planner/open3d/` (site is ahead; this `src/` is a frozen mirror) |

## Build and gate from site only

```powershell
pnpm --filter oando-site run typecheck
pnpm --filter oando-site run test:planner
```

## Salvage note

No staging-only production modules were newer than `site/features/planner/open3d/` at move time. Site workspace UI (`OOPlannerWorkspace`, `WorkspaceShell`, `FeasibilityCanvas`) is strictly ahead of this folder.

## Retire

Safe to delete this folder after soak once `plannnerplan` Phase 08 cleanup is accepted. Until then, `src/` remains a read-only diff reference only.
