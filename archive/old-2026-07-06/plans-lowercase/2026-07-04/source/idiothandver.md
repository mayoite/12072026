```md
# Handover

## Scope
You asked for a detailed handover of the current planner workspace/UI blocker work and the route-wording audit in `D:\oandO04072026`.

Repo rules were re-read from [AGENTS.md](/D:/new/AGENTS.md) before handing over.

## Current repo truth
These files establish the live route split:

- [guest page](/D:/oandO04072026/site/app/planner/(workspace)/guest/page.tsx)
- [canvas page](/D:/oandO04072026/site/app/planner/(workspace)/canvas/page.tsx)
- [pilot route](/D:/oandO04072026/site/app/planner/open3d/page.tsx)
- [Open3dPlannerWorkspaceRoute.tsx](/D:/oandO04072026/site/features/planner/ui/Open3dPlannerWorkspaceRoute.tsx)
- [Open3dPlannerHost.tsx](/D:/oandO04072026/site/features/planner/ui/Open3dPlannerHost.tsx)

What they mean:

- `/planner/guest` and `/planner/canvas` are the live planner entry points.
- They mount `Open3dPlannerWorkspaceRoute`.
- That route is the live hybrid planner route under the `open3d/` tree.
- `/planner/open3d` is still a separate pilot route mounting `Open3dPlannerHost`.
- Explicit `/planner/fabric/*` routes remain the legacy fallback entry.

## Root cause found
The concrete UI blocker is in the small-screen workspace panel flow.

The relevant files are:

- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx)
- [PanelContainer.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/PanelContainer.tsx)
- [TopBar.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/TopBar.tsx)
- [workspace.module.css](/D:/oandO04072026/site/features/planner/open3d/editor/workspace.module.css)

The exact problem:

- Mobile CSS uses `.panelLeft[data-open="true"]` and `.panelRight[data-open="true"]` to slide side panels onscreen.
- `PanelContainer` did not emit `data-open`.
- `WorkspaceShell` tracked `activePanel`, but that state was not wired to panel visibility.
- `TopBar` had no small-screen controls to open `Inventory` or `Properties`.
- Result: mobile panel behavior was structurally incomplete, not just cosmetically wrong.

## Changes already applied

### 1. `PanelContainer` patch
File:

- [PanelContainer.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/PanelContainer.tsx#L245)

Applied change:

- Added `data-open={isOpen ? "true" : "false"}` on the panel root `<aside>`.

Why:

- This satisfies the existing small-screen CSS contract.

### 2. `TopBar` patch
File:

- [TopBar.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/TopBar.tsx#L46)
- [TopBar.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/TopBar.tsx#L73)
- [TopBar.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/TopBar.tsx#L247)

Applied changes:

- Added optional props:
  - `activePanel`
  - `onToggleLeftPanel`
  - `onToggleRightPanel`
- Added a `Panel toggles` button group.
- Added `Inventory` and `Properties` buttons with `aria-pressed` and active state wiring.

Why:

- This creates a real small-screen control path instead of leaving `activePanel` unused.

### 3. `WorkspaceShell` patch
File:

- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx#L111)
- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx#L137)
- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx#L211)
- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx#L229)
- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx#L283)
- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx#L290)

Applied changes:

- Pulled `setActivePanel` from `useDockingSystem`.
- Added small-screen close/minimize behavior that clears `activePanel`.
- Added effect to clear `activePanel` when leaving small viewport.
- Added effect to clear `activePanel` if its panel becomes collapsed.
- Added `handleSidePanelToggle`.
- Added `resolvePanelOpen`.
- Passed small-screen panel state and toggle callbacks down to `TopBar`.
- Added a backdrop button to dismiss the active side panel.
- Switched left/right/bottom panel visibility to use `resolvePanelOpen(...)`.

Why:

- This is the missing state wiring between viewport size, active panel selection, and the panel DOM state.

## What is only partially done
These files were identified as stale and still need patching, but I did not finish editing them:

- [workspace.module.css](/D:/oandO04072026/site/features/planner/open3d/editor/workspace.module.css)
- [importGraphProof.ts](/D:/oandO04072026/site/features/planner/open3d/cleanup/importGraphProof.ts)
- [fabric archive README](/D:/oandO04072026/site/app/css/_archive/fabric/README.md)
- [open3d page](/D:/oandO04072026/site/app/planner/open3d/page.tsx)

### `workspace.module.css`
This file still needs the CSS classes referenced by the new TSX code:

- `mobilePanelActions`
- `mobilePanelBtn`
- `panelBackdrop`

Without that patch:

- the new JSX refers to CSS module keys that do not exist yet
- the UI patch is incomplete
- type safety may fail if CSS module typings are strict

### `importGraphProof.ts`
File:

- [importGraphProof.ts](/D:/oandO04072026/site/features/planner/open3d/cleanup/importGraphProof.ts)

It is still contradictory to live routes.

Current stale claims in that file:

- it says live guest/canvas are on deployable Fabric
- it maps `route-guest` and `route-canvas` to `PlannerWorkspaceRoute`
- it treats those live routes as `fabric-legacy`
- `fabricRetirementBlocked()` still assumes guest/canvas are Fabric-stack live routes

That no longer matches the actual repo.

### Fabric archive README
File:

- [README.md](/D:/oandO04072026/site/app/css/_archive/fabric/README.md)

Current stale wording:

- says live `/planner/guest/` and `/planner/canvas/` use the “Open3D native host”

That should be revised to the hybrid route wording.

### Pilot route comment
File:

- [page.tsx](/D:/oandO04072026/site/app/planner/open3d/page.tsx)

Current comment still references the earlier Fabric-stack story and should be narrowed to:

- `/planner/open3d` is the separate pilot route
- `/planner/guest` and `/planner/canvas` are the live hybrid route

## Agent work

### Completed agent output
Agent `Meitner` completed a wording-only patch in:

- [routesCoverage.test.tsx](/D:/oandO04072026/site/tests/unit/features/planner/open3d/routesCoverage.test.tsx)

What changed:

- file header now describes the current route split
- guest-route test description now says it is the live hybrid planner route
- canvas-route test description now says it is the live hybrid planner route
- pilot-route test description now says it mounts `Open3dPlannerHost` on `/planner/open3d`

What did not change:

- no assertions changed
- no behavior changed
- no tests were run

### Other agents
Two other agents were assigned but did not return a completed result before handover:

- `Descartes`
  - target file: [cleanupPhase08.test.ts](/D:/oandO04072026/site/tests/unit/features/planner/open3d/cleanupPhase08.test.ts)
- `Russell`
  - target file: [workspaceShell.test.tsx](/D:/oandO04072026/site/tests/unit/features/planner/open3d/workspaceShell.test.tsx)

Status as of handover:

- no completed message received from those two
- [cleanupPhase08.test.ts](/D:/oandO04072026/site/tests/unit/features/planner/open3d/cleanupPhase08.test.ts) is already modified in the worktree, but I did not inspect or integrate a final diff for it in this pass
- [workspaceShell.test.tsx](/D:/oandO04072026/site/tests/unit/features/planner/open3d/workspaceShell.test.tsx) had no returned completion from the assigned agent

## Verification status

### Verified
I verified by reading source, not by executing gates:

- [AGENTS.md](/D:/new/AGENTS.md)
- [Readme.md](/D:/oandO04072026/Readme.md)
- [Failures.md](/D:/oandO04072026/Failures.md)
- [START.md](/D:/oandO04072026/START.md)
- [TESTING.md](/D:/oandO04072026/TESTING.md)
- current route files
- current workspace shell/docking/panel files
- current CSS module
- current route-proof file
- current route coverage test

### Not verified
These were not run:

- no Vitest
- no typecheck
- no build
- no browser/manual runtime check after patch
- no evidence-capture run under `results/...`
- no `Failures.md` logging for this specific incomplete UI slice

## Risks

### 1. The patch is incomplete
The production TSX patch is ahead of the CSS patch.

That means the codebase is in a partially edited state.

### 2. CSS module mismatch risk
New code references these classes that do not yet exist:

- `mobilePanelActions`
- `mobilePanelBtn`
- `panelBackdrop`

If CSS modules are strongly typed in this repo, this may fail typecheck.

### 3. Small-screen close semantics changed
In `WorkspaceShell`, `handlePanelClose` and `handlePanelMinimize` on small screens currently clear `activePanel` and return early instead of collapsing the side panel.

That means:

- the side panel is dismissed from view
- the panel state remains docked, not collapsed

This may be acceptable for mobile overlay UX, but it is a behavior decision and was not validated.

### 4. Route-proof files are still contradictory
Until `importGraphProof.ts` and `cleanupPhase08.test.ts` are aligned, the repo contains mixed truth:

- live source says hybrid route
- proof/test files still partly describe Fabric-live behavior

### 5. Evidence helper mismatch
The repo evidence wrapper at:

- [run-evidence-cmd.ps1](/D:/oandO04072026/scripts/run-evidence-cmd.ps1)

still hardcodes `D:\OOFPLWeb` as repo root. I did not repair or replace that during this slice. That complicates compliant evidence capture for the next test run.

### 6. Dirty worktree
The repo already has many unrelated modifications and some unresolved conflicts outside this slice. This handover does not rely on cleaning them up. Do not use destructive git cleanup.

## Files changed in this pass
These are the files I directly changed:

- [PanelContainer.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/PanelContainer.tsx)
- [TopBar.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/TopBar.tsx)
- [WorkspaceShell.tsx](/D:/oandO04072026/site/features/planner/open3d/editor/WorkspaceShell.tsx)

This file was changed by an agent and not yet further edited by me in this pass:

- [routesCoverage.test.tsx](/D:/oandO04072026/site/tests/unit/features/planner/open3d/routesCoverage.test.tsx)

## Critique merge (plan-revision-2026-07-04.md)
Reviewed plannnerplan/critique/plan-revision-2026-07-04.md. Merged top 5 fixes and omissions into HANDOVER.md, FAILURESPLAN.md, QUALITY-GATES.md, and phases/governance (see those files and design spec).
- Addressed: generatedAt/idempotency, 409 suffixes, versionMismatch 422, R2 authority, registry alias, forbidden omissions (e.g. no shell:true, no base64), status hygiene ("Removed-task" fix), STAGING_PHASE_01A_RESIDUE excised, service key regex.
- Still open in this slice: full phase 02/08/07/10 edits (tracked in FAILURESPLAN), test integration for critique items.

## Exact next steps
1. Patch [workspace.module.css](/D:/oandO04072026/site/features/planner/open3d/editor/workspace.module.css) with:
   - hidden-by-default `mobilePanelActions`
   - active styling for `mobilePanelBtn`
   - small-screen `panelBackdrop`
   - no desktop regression

2. Patch [importGraphProof.ts](/D:/oandO04072026/site/features/planner/open3d/cleanup/importGraphProof.ts) so it reflects:
   - live hybrid guest/canvas routes
   - explicit fabric fallback routes
   - pilot `/planner/open3d` route
   - updated blocking logic for Fabric retirement

3. Patch wording-only stale docs/comments:
   - [README.md](/D:/oandO04072026/site/app/css/_archive/fabric/README.md)
   - [page.tsx](/D:/oandO04072026/site/app/planner/open3d/page.tsx)

4. Review and integrate test-file changes:
   - [routesCoverage.test.tsx](/D:/oandO04072026/site/tests/unit/features/planner/open3d/routesCoverage.test.tsx)
   - [workspaceShell.test.tsx](/D:/oandO04072026/site/tests/unit/features/planner/open3d/workspaceShell.test.tsx)
   - [cleanupPhase08.test.ts](/D:/oandO04072026/site/tests/unit/features/planner/open3d/cleanupPhase08.test.ts)

5. Run focused tests with proper evidence capture once the code is internally consistent.

## Short resume point
If someone resumes this immediately, the next file to open should be:

- [workspace.module.css](/D:/oandO04072026/site/features/planner/open3d/editor/workspace.module.css)

because the TSX patch is already in place and the repo is currently blocked on finishing the matching CSS contract.
```
