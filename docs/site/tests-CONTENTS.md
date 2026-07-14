# Tests layout

**Name-mirror:** product source under `site/` maps to the same path under `tests/unit/`.

```text
site/<area>/.../Name.ts(x)
  → tests/unit/<area>/.../Name.test.ts(x)
```

Handwritten product modules only. Exclude generated DB types (`.d.ts`, `database.types.ts`, `database.admin.types.ts`).

## Unit (`tests/unit/`)

| Path | Mirrors |
|------|---------|
| `app/` | `app/` routes, layouts, API routes |
| `components/` | `components/` |
| `features/admin/` | `features/admin/` |
| `features/planner/` | `features/planner/` (all subtrees) |
| `features/site/` | `features/site/` |
| `features/crm/` | `features/crm/` |
| `features/ops/` | `features/ops/` |
| `features/shared/` | `features/shared/` |
| `lib/` | `lib/` |
| `platform/` | `platform/drizzle/`, `platform/supabase/` |
| `config/` | `config/` contracts (JSON + TS) |
| `i18n/` | `i18n/` |
| `scripts/` | `scripts/` tooling (optional; not product gate) |

## Integration (`tests/integration/`)

Same path idea for multi-module flows, e.g. `integration/features/ops/`, `integration/lib/catalog/`.

## E2E (`tests/e2e/`)

Journey specs (`site-*`, `admin-*`, `planner-*`, `open3d-*`). Not 1:1 file mirror.

Gate list: `config/build/playwright-gate-specs.json` (must match `release:gate` e2e scripts).

## Rules

- No flat `tests/unit/*.test.ts` for new domain coverage — put files under the mirrored tree.
- No `test.skip` / silent early `return` as pass.
- Never mutate `inventory/descriptors/` or live catalog DB in tests.
- Export-surface-only tests (`toBeDefined` / `toBeTypeOf` alone) stay under ~5% of unit files.

## Vitest entry configs (site root)

| File | Role |
|------|------|
| `vitest.config.ts` | Default / planner gate |
| `vitest.site.config.ts` | Site-scope coverage |
| `vitest.shared.ts` | Shared exclude / coverage helpers |

## Inventory

Counts: `INVENTORY.md` (refresh when structure changes).
