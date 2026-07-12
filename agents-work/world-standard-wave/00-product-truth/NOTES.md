# P01 notes — product truth (2026-07-12)

**Approach:** A  
**HEAD:** `9d0d3cdaea2eeae8ac67d63bbc51c55f47c9c0fd`  
**vitestSmoke:** `hostWiringP01` **ok** (4/4)

## Live canvas (only)

- Workspace: `features/planner/open3d/editor/OOPlannerWorkspace.tsx`
- 2D entry: `open3d/canvas-stage` → `Open3dFabricStage as PlannerCanvasStage`
- Implementation: `features/planner/canvas-fabric-stage/`
- Browser testid: `open3d-fabric-stage`
- Routes: guest + canvas → `Open3dPlannerWorkspaceRoute`; pilot → `Open3dPlannerHost`

## Config honesty (this session)

- Product TS/Next no longer alias short names to `_archive/fabric`
- Archive excluded from main `tsconfig` include graph
- Default dev = **webpack** (avoid turbo multi-worker RAM bomb)

## Residual

- `importGraphProof.ts` still lists fabric-legacy route ids while live `app/planner/**/fabric` tree is absent (hostWiring asserts) — graph doc stale
- `PlannerWorkspaceRoute` still mounts archive shell for legacy/tests — not live guest/canvas
- Browser host smoke not re-run this session (dev server intentionally down after memory kill)
