# 04c Planner Viewer Boundary

Goal: repair or prove viewer and client boundary.

## Allowed Scope

1. `site/features/planner/open3d/3d`
2. Viewer callers under `site/features/planner/open3d`
3. Direct viewer tests

## Hard No-Go Scope

1. Persistence rewrite.
2. SVG pipeline changes.
3. Package additions.
4. Server Component browser API usage.

## Boundary Standard

Three and React Three Fiber stay client-side.

Browser APIs stay behind client components or hooks.

Use `'use client'` only at real client entry points.

## Initial Checks

```powershell
rg -n "three|@react-three/fiber|@react-three/drei|window|document|ResizeObserver|requestAnimationFrame|use client" site/features/planner/open3d site/app/planner
```

## Artifact Path

```text
results/planner/04c-planner-viewer-boundary/viewer-boundary/viewer-boundary-run.json
results/planner/04c-planner-viewer-boundary/viewer-boundary/viewer-boundary-raw.log
```

## Exit Evidence

1. Viewer boundary decision.
2. Browser API locations.
3. Drei keep/audit/defer decision if touched.

## Stop Conditions

1. Viewer needs package additions.
2. Browser APIs leak into Server Components.
3. Fix crosses into persistence.
