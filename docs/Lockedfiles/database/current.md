# Database — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Disk JSON for block descriptors is valid through **1B**; Supabase revision tables are **Phase 08** (not done). **1A / 1B not accepted.**

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Products DB | Supabase Postgres `PRODUCTS_DATABASE_URL` | `platform/drizzle/productsDb.ts`, `schema/catalog.ts` |
| Admin DB | Supabase Postgres `SUPABASE_AUTH_DATABASE_URL` | `platform/drizzle/adminDb.ts`, `schema/planner.ts` |
| Legacy Supabase HTTP | Some auth/catalog paths still use Supabase client | `platform/supabase/`, `lib/supabase/` |
| Migrations | `platform/supabase/migrations/` + `migrations.admin/` | `site/platform/supabase/` |
| Block descriptors | JSON on disk `site/block-descriptors/{slug}.json` | `persistBlockDescriptor.ts`, `svgBlockDescriptorLoader.ts` |
| SVG revisions | `ImmutableSvgRevisionRepository` interface; **no live Supabase adapter** | `svgRevisionRepository.server.ts` |
| Catalog tables | `planner_managed_products`, `configurator_products`, `catalog_products`, … | Drizzle schemas |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `drizzle-orm` | `^0.45.2` | ORM for both DBs |
| `postgres` | `^3.4.9` | Postgres driver |
| `drizzle-kit` | `^0.19.1` | Migrations tooling (dev) |
| `@supabase/supabase-js` | `^2.108.2` | Legacy HTTP paths only — no new `.from()` for catalog |

**Not a package:** block descriptors on disk (`site/block-descriptors/` — may be empty at clone; populated by admin persist).

---

## Summary

Data layer policy is clear and mostly followed: two Postgres databases, Drizzle for catalog and planner CRUD, migrations under `platform/`. Block descriptors for SVG currently live on disk with atomic writes. Supabase revision storage is designed but not connected — the gap between “files on disk” and “immutable published catalog in DB” is the main database story for 1B/Phase 08.

## Strengths

Well-documented schema with ERD and RLS references. Clean split products vs admin/planner DBs. Drizzle schemas colocated with migrations. `persistBlockDescriptor` gives atomic disk semantics suitable for admin concurrent edit. Revision repository interface and tests prepare Phase 08 without blocking 1B disk path.

## Weaknesses

Dual persistence story for SVG (disk JSON now, Supabase later) can confuse consumers. PLAN-FAIL-0409 explicitly deferred — no `block_descriptors` table yet. Legacy Supabase HTTP usage still present for some paths. CRM tables in admin DB may be underused while CRM UI stays client-local.
