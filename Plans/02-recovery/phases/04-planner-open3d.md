# 04 Planner Open3D

Goal: repair product-core Open3D slices.

## Modules

- Planner Open3D.
- Planner route shell.
- SVG consumer.
- Persistence.
- Viewer.

## Allowed Scope

1. `site/features/planner/open3d`
2. `site/app/planner`
3. Direct Open3D tests

## Hard No-Go Scope

1. Legacy root planner paths unless migration is explicitly scoped.
2. Database migrations.
3. Broad UI redesign.

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

## Exit Evidence

1. One repaired slice.
2. Scoped test result.
3. Remaining failure bucket.
4. Browser smoke result, when relevant.

## Stop Conditions

1. Failure is actually auth or DB.
2. Fix requires changing schema.
3. UI acceptance criteria are missing.
