# 04 Planner Open3D

Goal: define planner Open3D slice order and hard acceptance.

This file is an overview.

Implementation must use slice files `04a` through `04e`.

## Modules

- Planner Open3D.
- Planner route shell.
- SVG consumer.
- Persistence.
- Viewer.
- App Router boundaries.

## Allowed Scope

1. Planning and slice selection.
2. `site/features/planner/open3d` only through slice files.
3. `site/app/planner` only through slice files.

## Hard No-Go Scope

1. Legacy root planner paths unless migration is explicitly scoped.
2. Database migrations.
3. Broad UI redesign.
4. Moving browser-only planner engines into Server Components.

## App Router Boundary

Planner routes stay thin.

`site/app/planner/**` should:

1. Own route entries.
2. Own layouts and metadata.
3. Pass serializable data.
4. Import feature hosts.

`site/app/planner/**` should not own:

1. Canvas logic.
2. Fabric lifecycle.
3. Three or React Three Fiber runtime.
4. Browser APIs.
5. Planner command implementation.

Client-only boundaries:

1. Canvas and Fabric code stay client-side.
2. Three and React Three Fiber code stay client-side.
3. Browser APIs stay behind client components or hooks.
4. Use `'use client'` only at real client entry points.

React rules:

1. Effects are for external systems.
2. Derived planner state should be computed in render or model/store code when possible.
3. Do not add memoization by habit.

## Product Invariants

Planner repair must protect:

1. No silent data loss.
2. Undo/redo remains coherent.
3. Save/reload round trip preserves project data.
4. Export can be reloaded or validated.
5. Guest and member persistence do not cross.
6. Command seam owns mutations where designed.
7. Client-only engines stay client-side.

## Journey Evidence

No "planner repaired" claim without this journey:

1. Open planner.
2. Edit.
3. Undo.
4. Save.
5. Reload.
6. Export.
7. Verify console output.

## Slice Order

1. `04a-planner-command-seam.md`
2. `04b-planner-persistence-json.md`
3. `04c-planner-viewer-boundary.md`
4. `04d-planner-svg-consumer.md`
5. `04e-planner-browser-journey.md`

## Artifact Path

```text
results/planner/04-planner-open3d/slice-selection/slice-selection-run.json
results/planner/04-planner-open3d/slice-selection/slice-selection-raw.log
```

## Initial Commands

```powershell
pnpm --filter oando-site exec eslint -c config/build/eslint.config.mjs features/planner/open3d --max-warnings=0
pnpm --filter oando-site exec vitest run tests/unit/features/planner/open3d --config vitest.site.config.ts
```

## Likely Failure Buckets

1. Persistence.
2. JSON export.
3. Guest promotion.
4. Upload utils.
5. Viewer lazy paths.
6. Command boundary wiring.
7. Server/client boundary leaks.
8. Effects used for derived state.

## Exit Evidence

1. Selected slice.
2. Reason for slice order.
3. Known blockers.

## Stop Conditions

1. Failure is actually auth or DB.
2. Fix requires changing schema.
3. UI acceptance criteria are missing.
4. Fix requires changing App Router boundaries outside planner scope.
