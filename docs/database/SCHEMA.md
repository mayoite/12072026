# Database schema

Documentation of tables, indexes, and RLS across the two Postgres databases.

**Authority:** migrations + Drizzle schema under `site/platform/`. Code wins if this doc lags.  
**SVG release authority:** **disk** until cutover (`docs/architecture/08-DATABASE-SVG-CONTRACT.md`, `Failures.md`). Dual-write optional ≠ cutover.

## Two databases

| DB | Env | Owns (live) | Migrations / schema |
|----|-----|-------------|---------------------|
| **Products** | `PRODUCTS_DATABASE_URL` | Marketing catalog, stats, queries, configurator, planner_managed, feature flags, **SVG revision tables (schema present; not sole publish authority)** | `site/platform/supabase/migrations/` · Drizzle: `site/platform/drizzle/schema/catalog.ts` |
| **Admin / Planner** | `SUPABASE_AUTH_DATABASE_URL` | Auth-adjacent app data: `oando_plans`, profiles, teams, price books, audit | `site/platform/supabase/migrations.admin/` · Drizzle: `site/platform/drizzle/schema/planner.ts` |

Clients: `site/platform/drizzle/productsDb.ts`, `adminDb.ts`, `databaseUrls.ts`. Supabase JS: `@/platform/supabase/*` — no new PostgREST `.from()` catalog path for SVG cutover work.

---

## Products DB

### Marketing catalog

Physical tables use `catalog_*` names. Legacy views `products` / `categories` / … are **SECURITY INVOKER** over those tables (`20260307153500_rename_to_catalog_tables.sql`).

| Table | Role |
|-------|------|
| `catalog_products` | Marketing products (slug unique) |
| `catalog_categories` | Category ids (e.g. `oando-workstations`) |
| `catalog_product_specs` | 1:1 specs jsonb |
| `catalog_product_images` | Gallery / kinded images |
| `catalog_product_slug_aliases` | Alias → canonical slug |
| `catalog_items` / `series` / `templates` | Reference series data (where present) |
| `business_stats_current` / `business_stats_history` | Site stats |
| `customer_queries` | Contact / handoff-related public submissions |
| `image_assets` | Generated image registry |
| `configurator_products` | Parametric planner catalog (separate from marketing) |
| `planner_managed_products` | Admin-curated planner library; optional `published_svg_revision_id` |
| `feature_flags` | Runtime flags (service role) |
| `block_themes` | Design tokens for block editor (service role) |
| `_local_migration_history` | Local apply bookkeeping |

**RLS (summary):** Catalog tables public **select**; writes service role. `configurator_products` / `planner_managed_products` public select where `active`. `customer_queries` public insert. `feature_flags` / `block_themes` service only. Full column detail remains in migrations; Drizzle mirror for catalog subset is `schema/catalog.ts`.

### SVG revision schema (Products DB) — tables exist; disk still live authority

Migrations in repo (apply via `db:apply` when targeting a DB that has them):

| Migration | Adds |
|-----------|------|
| `20260714100000_create_svg_revisions.sql` | `svg_revisions`, `svg_revision_artifacts`, `block_descriptors` |
| `20260716100000_add_published_svg_revision_id.sql` | `planner_managed_products.published_svg_revision_id` |
| Drizzle `schema/catalog.ts` | Same tables + experimental `svg_assets_v2` family |
| `platform/drizzle/migrations/products/0002_svg_assets_v2.sql` | V2 asset tables (isolated until reversible cutover) |

| Table | Purpose |
|-------|---------|
| `svg_revisions` | Immutable published revision metadata + definition snapshot |
| `svg_revision_artifacts` | kind, checksum, storage_key per revision |
| `block_descriptors` | Latest descriptor jsonb per slug |
| `planner_managed_products.published_svg_revision_id` | Optional pointer (DB-SVG-05) |
| `svg_assets_v2` / versions / artifacts / ai_runs | V2 model — **not** live release authority |

**Live publish path still writes disk** (`inventory/descriptors/`, `public/svg-catalog/`). Dual-write may upsert DB rows when `resolveSvgPublishDualWriteDeps` enables. **Do not document DB as live SVG authority.** Contract: `docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

### Drizzle catalog schema path

Source of truth for typed Products tables used by app code:

- `site/platform/drizzle/schema/catalog.ts`
- Export barrel: `site/platform/drizzle/schema/index.ts`

Config: `site/platform/drizzle/drizzle.config.ts` (schema = catalog + planner files).

---

## Admin / Planner DB

Drizzle source: **`site/platform/drizzle/schema/planner.ts`** (not a single `schema.ts`).

| Table | Physical name | Role |
|-------|---------------|------|
| profiles | `profiles` | User profile / role |
| plans | **`oando_plans`** | Planner documents (`payload` jsonb) |
| teams / team_members / invites | same | Team model |
| price_books / price_book_versions | same | Admin price books |
| audit_events | same | Audit log |
| review_links | same | Share links for plans |

SQL apply: `pnpm --filter oando-site run db:apply:admin` → `migrations.admin/`.  
Verify: `pnpm --filter oando-site run db:sync-drizzle`.

**Access:** service-role / server paths; app-layer authorization. Not a public anon catalog.

---

## Migration conventions

- Prefer `IF NOT EXISTS` / idempotent policies.
- Pin function `search_path` (see products migrations).
- Products apply: `pnpm --filter oando-site run db:apply`.
- Admin apply: `pnpm --filter oando-site run db:apply:admin`.

---

## What this file is not

- Not proof migrations ran on a given environment (check that DB’s history).
- Not PASS for cutover.
- Not a substitute for reading SQL under `platform/supabase/migrations/`.

Operate: `docs/approach.md`. Engines/persistence: `docs/architecture/12-DEPENDENCIES-ENGINES.md`.
