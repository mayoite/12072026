# 04 Planner Open3D

Goal: repair product-core Open3D slices.

## Modules

- Planner Open3D.
- Planner route shell.
- SVG consumer.
- Persistence.
- Viewer.
- App Router boundaries.

## Allowed Scope

1. `site/features/planner/open3d`
2. `site/app/planner`
3. Direct Open3D tests

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

1. One repaired slice.
2. Scoped test result.
3. Remaining failure bucket.
4. Browser smoke result, when relevant.
5. Server/client boundary decision, when touched.

## Stop Conditions

1. Failure is actually auth or DB.
2. Fix requires changing schema.
3. UI acceptance criteria are missing.
4. Fix requires changing App Router boundaries outside planner scope.
