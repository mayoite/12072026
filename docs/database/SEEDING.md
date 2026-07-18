# Database seeding

Two databases, multiple entry points. Prerequisites: repo-root `.env.local` with `PRODUCTS_DATABASE_URL` and `SUPABASE_AUTH_DATABASE_URL`. Commands: `pnpm --filter oando-site run …` from repo root (`Readme.md`).

## Quick reference

| Goal | Command | DB |
|---|---|---|
| Marketing catalog (`catalog_products` / `catalog_categories`) | `seed` | Products |
| Configurator catalog | `seed:configurator` | Products |
| Planner managed workspace (6 rows, idempotent on `slug`) | `seed:managed` | Products — needs `db:apply` first |
| Pending products migrations | `db:apply` | Products |
| Configurator seed preview (SVG/PNG, no DB) | `exec npx tsx scripts/seed-catalog-preview.ts` | — |
| Planner Drizzle schema verify | `db:sync-drizzle` | Admin |

`seed_direct.ts` is **deprecated** — use `seed`. Legacy-only for canonical-function refresh (hardcoded credentials; not CI).

---

## 1. Marketing catalog — `seed`

| | |
|---|---|
| Script | `scripts/seed.ts` |
| Data | `scripts/seed_data.sql` (~258 KB, ~100 product upserts) |
| Target | `catalog_products`, `catalog_categories` |

**Flow:** read `PRODUCTS_DATABASE_URL` → direct `postgres` (bypasses RLS) → split SQL on `;` → report inserted/skipped/errors. Products: `ON CONFLICT (slug) DO UPDATE`. Categories: `ON CONFLICT (id) DO NOTHING`. Safe to re-run.

**Path fix (2026-06-20):** was `tools/scripts/seed_data.sql` — now `scripts/seed_data.sql`.

**Live count:** ~85 rows in `catalog_products` as of 2026-06-28 is normal (partial catalog). Re-run upserts missing slugs; does not delete extras.

**`seed_data.sql` structure**

- Categories: `INSERT INTO categories … ON CONFLICT (id) DO NOTHING` — IDs include `oando-workstations`, `oando-tables`, `oando-storage`, `oando-soft-seating`, `oando-chairs`, `oando-other-seating`, `oando-educational`, `oando-collaborative`, plus legacy `cafe`, `meeting-tables`, `others`, `projects`.
- Products: per-slug `INSERT INTO products … ON CONFLICT (slug) DO UPDATE` with `name`, `slug`, `category`, `category_id`, `flagship_image`, `description`, `scene_images`, `variants`, `detailed_info`, `metadata`, `specs`, `series_id`, `series_name`.

Inserts use legacy view names `products`/`categories`; `SECURITY INVOKER` views flow to `catalog_*` tables. `seed_direct.ts` writes physical tables directly as belt-and-braces.

```powershell
pnpm --filter oando-site run seed
```

---

## 2. Configurator — `seed:configurator`

| | |
|---|---|
| Script | `scripts/seed_configurator_catalog.ts` |
| Target | `configurator_products` |

1. Apply `20260601120000_create_configurator_products.sql` if needed (`_local_migration_history`).
2. `buildOandoSeedProducts()` → `productToRow` → upsert by `slug` (`ON CONFLICT DO UPDATE`).
3. Read-back summary by `category` / `sizing_type`.

Separate from `catalog_products` so empty-image rows never hit the live marketing site.

```powershell
pnpm --filter oando-site run seed:configurator
pnpm --filter oando-site exec npx tsx scripts/seed_configurator_catalog.ts --verify-only
```

---

## 3. Deprecated — `seed_direct.ts`

Re-applies `20260309113000_add_canonical_catalog_fields.sql`, then `seed_data.sql` with rewrites to `catalog_products`/`catalog_categories`. One-shot when canonical SQL functions change. Hardcoded credentials — not routine.

---

## 4. Visual preview — `seed-catalog-preview.ts`

Output: `results/catalog-seed-preview/seed-catalog.svg` + `.png`. Renders configurator blocks (workstation, L-shape, pedestal, storage, tables) via `lib/catalog/blocks2d`; PNG via `sharp`. No DB.

---

## 5. Admin schema — `db:sync-drizzle`

| | |
|---|---|
| Script | `scripts/db_sync_drizzle_schema.ts` |
| Target | Admin — verifies `oando_plans`, `audit_events` |

Not a data seed. Schema: `platform/supabase/migrations.admin/` → apply with `db:apply:admin` if missing.

---

## SVG seeds and tests

SVG revision tables exist in schema; released SVG **live authority is still disk** until cutover (`Failures.md`). Routine seeds must not create published revisions as if DB were sole authority. After cutover, disk descriptors become migration/fixture input only. Migration: dry-run, conflict/checksum report, non-prod targets, normal publish transaction. Tests: temporary rows, unique storage prefixes; never mutate released rows. Document commands only when in `site/package.json`. Contract: [08-DATABASE-SVG-CONTRACT.md](../architecture/08-DATABASE-SVG-CONTRACT.md).

## Idempotency

| Entry | Behavior |
|---|---|
| `seed.ts` | Upserts; duplicates → "skipped" |
| `seed_configurator_catalog.ts` | `ON CONFLICT (slug) DO UPDATE` |
| `db:sync-drizzle` | Verify only; schema via `db:apply:admin` |

## Troubleshooting

| Error | Fix |
|---|---|
| `seed_data.sql not found` | Run from repo root (`pnpm-workspace.yaml`) |
| `PRODUCTS_DATABASE_URL is not set` | Add to `.env.local` |
| `Could not parse PRODUCTS_DATABASE_URL` | `postgresql://user:password@host:port/db`; `@` in password handled |
| Duplicate-key → skipped | Expected on re-run |
| Configurator 0 rows | Check `buildOandoSeedProducts` + `productToRow` in `oandoCatalog.ts` |
