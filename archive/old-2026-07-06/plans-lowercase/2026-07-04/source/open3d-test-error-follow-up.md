# Planner Open3D — Current State (2026-07-04)

## Changes applied this session

### CSS: `workspace.module.css`
- Added `.mobilePanelActions` (hidden by default, shown on small screens)
- Added `.mobilePanelBtn[data-active="true"]` (accent highlight)
- Added `.panelBackdrop` (small-screen overlay, uses `--overlay-inverse-35`)
- All three keys now match the TSX references in `TopBar` and `WorkspaceShell`

### Route proof: `importGraphProof.ts`
- Renamed live guest/canvas stack from `"fabric-legacy"` to `"open3d-hybrid"`
- Added `workspace-route-open3d` node for `Open3dPlannerWorkspaceRoute`
- `fabricRetirementBlocked()` now checks for any `fabric-legacy` routes still present
- Added `open3dHybridRoutes()` export

### Test: `cleanupPhase08.test.ts`
- Removed JSX (`.ts` file → `createElement()` calls)
- Added imports for `PRODUCTION_IMPORT_GRAPH`, `fabricRetirementBlocked`, `open3dHybridRoutes`, `routesStillOnFabricStack`
- Added test asserting hybrid routes ≠ Fabric fallbacks

**Critique merge note**: This follow-up aligns with plannnerplan/critique/plan-revision-2026-07-04.md (reviewed and fixes merged to plan files). Addresses stale claims in importGraphProof.ts and wording in fabric README/open3d page (see idiothandver.md for full list). Route proof updated to hybrid (per critique on contradictory claims).

## Not yet done

### `workspaceShell.test.tsx`
- No mobile-panel assertions added
- No `createElement` conversion needed (already `.tsx`)
- Untested: `handleSidePanelToggle`, `resolvePanelOpen`, `panelBackdrop`

### `routesCoverage.test.tsx`
- No assertion changes applied
- Wording-only review from agent, not re-validated

### Verification
- No Vitest, typecheck, build, or evidence-capture run
- The repo is still in an incomplete state

## Next step

Run the smallest focused Vitest command per `START.md` / `TESTING.md` policy, or document a gate blocker in `Failures.md`.
