# Database Seeding

How to populate the Oando Platform databases with seed data. There are **two databases** and several seed entry points — pick the one that matches what you need.

> **Prerequisites**
> - `.env.local` at **repo root** must define `PRODUCTS_DATABASE_URL` (Supabase products DB) and `SUPABASE_AUTH_DATABASE_URL` (admin Supabase).
> - Run from repo root with `pnpm --filter oando-site run …` (see `START.md`).

---

## Quick reference

| Goal | Command | Target DB |
|---|---|---|
| Seed the marketing catalog (`catalog_products` / `catalog_categories`) | `pnpm --filter oando-site run seed` | Products (Supabase) |
| Seed the parametric configurator catalog | `pnpm --filter oando-site run seed:configurator` | Products (Supabase) |
| Seed planner admin-managed workspace catalog | `pnpm --filter oando-site run seed:managed` | Products (Supabase) |
| Apply pending products migrations (`planner_managed_products`, etc.) | `pnpm --filter oando-site run db:apply` | Products (Supabase) |
| Render a visual preview sheet of the configurator seed | `pnpm --filter oando-site exec npx tsx scripts/seed-catalog-preview.ts` | none (writes SVG/PNG) |
| Sync the Drizzle planner schema + indexes | `pnpm --filter oando-site run db:sync-drizzle` | Admin (Supabase) |

> **Planner managed catalog:** `pnpm --filter oando-site run seed:managed` upserts six curated rows into `planner_managed_products` (idempotent on `slug`). Requires `db:apply` first.

> **`seed_direct.ts` is deprecated** — removed from routine workflows. Use `pnpm --filter oando-site run seed` instead. See §3 only for legacy canonical-function refresh (hardcoded credentials; do not use in CI).

---

## 1. Marketing catalog — `pnpm --filter oando-site run seed`

**Script**: `scripts/seed.ts` (npm script `seed`).
**Data file**: `scripts/seed_data.sql` (~258 KB).
**Target**: `catalog_products`, `catalog_categories` on the Products DB.

### What it does

1. Reads `PRODUCTS_DATABASE_URL` from `.env.local`.
2. Opens a direct `postgres` connection (bypasses RLS — needed because the anon key can only read).
3. Loads `scripts/seed_data.sql`, splits on `;`, and runs each non-comment statement.
4. Reports `inserted / skipped (already exist) / errors`.

The SQL uses `ON CONFLICT (slug) DO UPDATE` for products and `ON CONFLICT (id) DO NOTHING` for categories, so re-running is safe and upserts the latest seed values.

### Path note (fixed 2026-06-20)

`seed.ts` previously pointed at `tools/scripts/seed_data.sql`, which does not exist. It now points at the correct `scripts/seed_data.sql`. If you have an old checkout, `git pull` to get the fix.

### Running it

```powershell
pnpm --filter oando-site run seed
```

Sample output (counts vary — current `seed_data.sql` has **~100** product upserts):

```
Connecting to: db.xxx.supabase.co:5432/postgres as postgres
Connecting to Supabase via direct postgres connection...
✅ Done: 100 inserted, 0 skipped (already exist), 0 errors.
```

> **Live DB count may differ.** As of 2026-06-28, Products Supabase has **85** rows in `catalog_products` (partial catalog — missing categories like workstations). Re-running seed upserts missing slugs; it does not delete extra rows.

### `seed_data.sql` structure

- **CATEGORIES SEED** — `INSERT INTO categories ... ON CONFLICT (id) DO NOTHING`. Categories use text IDs like `oando-workstations`, `oando-tables`, `oando-storage`, `oando-soft-seating`, `oando-chairs`, `oando-other-seating`, `oando-educational`, `oando-collaborative`, plus legacy `cafe`, `meeting-tables`, `others`, `projects`.
- **PRODUCTS SEED** — one `INSERT INTO products ... ON CONFLICT (slug) DO UPDATE SET ...` per product. Each row sets `name`, `slug`, `category`, `category_id`, `flagship_image`, `description`, `scene_images`, `variants`, `detailed_info`, `metadata`, `specs`, `series_id`, `series_name`.

> The inserts target the legacy table names `products` / `categories`. Because the catalog was renamed to `catalog_*` with `SECURITY INVOKER` compatibility views, these inserts hit the views and flow through to the physical `catalog_*` tables. `seed_direct.ts` does the rename explicitly in JS as a belt-and-braces approach.

---

## 2. Configurator catalog — `seed_configurator_catalog.ts`

**Script**: `scripts/seed_configurator_catalog.ts`.
**Target**: `configurator_products` on the Products DB.

### What it does

1. Ensures the `configurator_products` table exists by applying `20260601120000_create_configurator_products.sql` (tracked in `_local_migration_history`).
2. Builds the typed Oando seed via `lib/catalog/seed/oandoCatalog.buildOandoSeedProducts()` and maps each product to a DB row with `lib/catalog/configuratorCatalog.productToRow`.
3. Upserts each row by `slug` (`ON CONFLICT (slug) DO UPDATE`). Idempotent — no duplicates, no deletes, re-running refreshes values.
4. Prints a read-back summary grouped by `category` / `sizing_type`.

### Running it

```powershell
pnpm --filter oando-site run seed:configurator
# or verify-only (no writes, just prints the current contents):
pnpm --filter oando-site exec npx tsx scripts/seed_configurator_catalog.ts --verify-only
```

> This catalog is intentionally separate from `catalog_products` so empty-image seed rows never surface on the live marketing site. Fill thumbnails/3D in admin later.

---

## 3. DEPRECATED — `seed_direct.ts` (legacy only)

**Script**: `scripts/seed_direct.ts`.
**Target**: Products DB.

A one-off helper that:
1. Re-applies `20260309113000_add_canonical_catalog_fields.sql` to refresh the canonical-field SQL functions (idempotent via `CREATE OR REPLACE`).
2. Runs `seed_data.sql` with `INSERT INTO products`/`categories` rewritten to `INSERT INTO catalog_products`/`catalog_categories` (bypassing the views, writing directly to the physical tables).

Use this when you've changed the canonical-field functions and want to re-seed in one shot. **Deprecated** — hardcodes connection credentials; prefer `pnpm --filter oando-site run seed` for routine seeding. Remove from local workflows when canonical functions are stable.

---

## 4. Visual preview — `seed-catalog-preview.ts`

**Script**: `scripts/seed-catalog-preview.ts`.
**Output**: `results/catalog-seed-preview/seed-catalog.svg` and `.png`.

Renders a sample of the configurator seed blocks (linear workstation, L-shape panel, pedestal, storage unit, cabin/meeting/discussion tables) to an SVG sheet via `lib/catalog/blocks2d` and rasterizes to PNG with `sharp`. No DB access — purely for visual QA of the seed shapes.

---

## 5. Admin / Planner schema check — `pnpm --filter oando-site run db:sync-drizzle`

**Script**: `scripts/db_sync_drizzle_schema.ts`.
**Target**: `SUPABASE_AUTH_DATABASE_URL` (admin Supabase).

Not a data seed — verifies planner Drizzle tables (`oando_plans`, `audit_events`) exist. Schema changes belong in `platform/supabase/migrations.admin/`; apply with `db:apply:admin`.

```powershell
pnpm --filter oando-site run db:sync-drizzle
```

If tables are missing, run:

```powershell
pnpm --filter oando-site run db:apply:admin
```

---

## SVG migration and test data

The SVG revision tables are planned. They are not live yet.

Routine seeds must not create published revisions.

Disk descriptors are migration inputs only.

Migration must dry-run first, report conflicts and checksums, use non-production targets, and publish through the normal transaction.

Tests must use temporary rows and unique storage prefixes.

Tests must never mutate released rows.

Do not document a command until `site/package.json` provides it.

See [Database SVG contract](../architecture/08-DATABASE-SVG-CONTRACT.md).

## Idempotency

All seed entry points are safe to re-run:
- `seed.ts` — `ON CONFLICT` upserts; duplicate-key errors are caught and counted as "skipped".
- `seed_configurator_catalog.ts` — `ON CONFLICT (slug) DO UPDATE`.
- `db:sync-drizzle` — verify-only; apply schema with `db:apply:admin`.

---

## Troubleshooting

- **`seed_data.sql not found at .../scripts/seed_data.sql`** — run from **repo root** (directory with `pnpm-workspace.yaml`). The path is resolved via `process.cwd()`.
- **`PRODUCTS_DATABASE_URL is not set`** — add `PRODUCTS_DATABASE_URL` to `.env.local`.
- **`Could not parse PRODUCTS_DATABASE_URL`** — the URL must match `postgresql://user:password@host:port/db`. The parser handles `@` in passwords by taking the last `@`-separated segment as host.
- **Duplicate-key errors counted as "skipped"** — expected on re-runs; the row already exists.
- **Configurator seed writes 0 rows** — check that `lib/catalog/seed/oandoCatalog.ts` exports `buildOandoSeedProducts` and that `productToRow` maps every field.
