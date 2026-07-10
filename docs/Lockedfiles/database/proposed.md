# Database — proposed (locked)

**Baseline:** 2026-07-05  
**Authority:** [`Plans/global-standard-revision/README.md`](../../../Plans/global-standard-revision/README.md) — disk JSON through **1B**; immutable Supabase revisions in **Phase 08**

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | Policy | Paths | Docs |
|--------|--------|-------|------|
| Products DB | All catalog/product CRUD via **Drizzle** `productsDb` | `productsDb.ts`, `schema/catalog.ts` | `SCHEMA.md` |
| Admin DB | Plans, audit, CRM tables via **Drizzle** `adminDb` | `adminDb.ts`, `schema/planner.ts` | same |
| No new `.from()` | **Do not add** Supabase `.from()` for catalog/planner data | — | `Readme.md` |
| Migrations | Migrations live under `platform/` only | `site/platform/supabase/` | `RESTORE-RUNBOOK.md` |
| Block descriptors | Atomic persist via `persistBlockDescriptor`; history slots on write | `admin/svg-editor/` | Phase 04 |
| SVG revisions | Immutable revisions + artifact metadata in Supabase (**Phase 08**) | `svgRevisionRepository.server.ts` | `Plans/P-track/START.md` §8 |
| Catalog tables | ERD + RLS matrix in SCHEMA; advisors at zero SECURITY ERRORs before gate | Drizzle + migrations | `ADVISORS.md` |

## Packages (proposed per plan)

| Package | Phase | Policy |
|---------|-------|--------|
| `drizzle-orm`, `postgres` | ongoing | All catalog/planner CRUD |
| `drizzle-kit` | ongoing | Migrations under `platform/` only |
| Supabase HTTP | sunset | No new `.from()` — migrate stragglers |
| — | Phase 08 | Supabase tables for `PublishedRevision` + artifacts (not a new ORM) |

Disk `block-descriptors/` remains valid through **1B**; DB revision pointer in **Phase 08**.
