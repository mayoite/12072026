# D6 — Portal real DB list

**Date:** 2026-07-10  
**Status:** DONE  
**Commit intent:** `fix(portal): D6 plan list stability`

## Goal

Portal plan list: real success **or** honest non-crash path with correct “configured” detection. No UI redesign.

## Diagnosis

| Item | Finding |
|------|---------|
| Planner DB URL | **`SUPABASE_AUTH_DATABASE_URL`** (fallback `PLANNER_DATABASE_URL`). **Not** `PRODUCTS_DATABASE_URL`. |
| Products URL | `PRODUCTS_DATABASE_URL` is catalog only (`productsDb` / `schema/catalog`). |
| Drizzle table | `platform/drizzle/schema/planner.ts` → `pgTable("oando_plans", …)` |
| Migrations | `platform/supabase/migrations.admin/20260628100000_planner_plans_and_audit.sql` |
| Old `isPlannerDatabaseConfigured` | Sync URL check only via `isPlannerDatabaseUrlConfigured()` — true even when table missing → bad “configured but broken” UX. |
| Portal page | Already try/catch on list → `listError` (no crash). |
| Live admin DB (this env) | `db:test` + ensure: connection OK; **`oando_plans` present; 0 rows** → real empty list success. |
| `db:ensure-plans` bug | Loaded `.env.local` from **cwd** (`site/`) with dotenv → 0 vars. Fixed to `loadEnvLocal` + `resolvePlannerDatabaseUrl`. |

### Live probe (2026-07-10)

```
urlConfigured: true
urlMasked: postgresql://postgres.rxzpznmxbaoxpikowmfc:***@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
productsUrlSet: true
note: Planner uses SUPABASE_AUTH_DATABASE_URL, not PRODUCTS_DATABASE_URL
table_exists true
LIST_OK { count: 0 }
```

Commands:

- `pnpm --filter oando-site run db:test` → tables present, 0 rows  
- `pnpm --filter oando-site run db:ensure-plans` → present (after env fix)

If table ever missing: `pnpm --filter oando-site run db:apply:admin` (migrations.admin; no ad-hoc DDL).

## Code changes

1. **`isMissingOandoPlansTableError`** in `plannerPersistence.ts` — classifies 42P01 / relation-does-not-exist.  
2. **`portal/page.tsx`** — missing table → `databaseConfigured=false` (honest “not configured”); other failures → existing `listError` panel; success [] → empty state.  
3. **`db_ensure_plans_table.ts`** — repo-root env via `loadEnvLocal` + planner URL resolver.  
4. **Tests** — portal page demotion + non-schema listError; classifier unit cases.

## Tests run

```
vitest: tests/unit/app/(site)/portal/page.test.tsx          4 pass
vitest: tests/unit/portal-page-view.test.tsx                4 pass
vitest: tests/unit/features/planner/store/plannerPersistence.test.ts  17 pass
vitest: tests/integration/planner-store-plannerPersistence.test.ts    15 pass
```

## UX paths (unchanged chrome)

| Condition | Portal shows |
|-----------|----------------|
| No planner URL | “Planner storage is not configured yet” |
| URL set, table missing | Same not-configured message (demoted) |
| URL set, query fails (network/etc.) | “Plans could not be loaded” + `listError` |
| URL set, list `[]` | “No saved plans yet” |
| URL set, rows | Saved layouts grid |

## Out of scope / residual

- Creating sample plan rows for a demo account (not required for D6).  
- Async schema probe inside sync `isPlannerDatabaseConfigured` (kept URL-only for API gates; portal demotes on missing table).  
- UI redesign (forbidden).
