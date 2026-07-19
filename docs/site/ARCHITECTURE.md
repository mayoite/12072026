# Site package architecture

Navigation map for `site/` (oando-site). Routes stay thin; behavior lives in `features/`, `lib/`, and `platform/`.

Repo-wide layout: `../../Readme.md`. Product domains: `../architecture/02-DOMAINS.md`.  
Feature maps: `features.md`. Tests: `tests.md`. Live routes: `route-classification.md`.

---

## Decision tree

| I am changing… | Go to… |
|---|---|
| Public marketing page or SEO | `app/(site)/` → `components/home/`, `components/site/`, `features/site/data/`, `i18n/` |
| Site product listing / filters | `lib/catalog/site/` (facade) → `lib/catalog/` (logic) |
| Planner guest/member workspace UI | `app/planner/` → `features/planner/editor/`, `canvas/`, `3d/` |
| Planner document / canvas state | `features/planner/model/` (document kernel) + `features/planner/cloud-store/` (workspace Zustand) + `features/planner/persistence/` |
| Planner save / review persistence API | `features/planner/cloud-store/` + `features/planner/persistence/` |
| Admin SVG editor, publish, lifecycle | **`features/admin/svg-editor/`** |
| Admin parametric linear desk (Part C) | `features/admin/svg-editor/parametric/` + planner `asset-engine/svg/parametric/` — **live Maker pen** (`drawLinearDesk`); template residual deprecated only |
| Admin shell / dashboard chrome | `features/admin/` page views + `features/admin/ui/` |
| Admin route page | `app/admin/` — import from `features/admin/` |
| Admin API | `app/api/admin/` — handlers often in `features/admin/api/` |
| CRM / customer-queries | `app/admin/crm/`, `app/admin/customer-queries/` + `features/crm/`, `features/ops/` |
| Marketing catalog (Supabase) | `lib/catalog/` + `platform/` |
| SVG descriptors (live authority) | **`inventory/descriptors/`** + `public/svg-catalog/` + `features/admin/svg-editor/` |
| Catalog lifecycle / audit logs | repo-root `results/admin/catalog-ops/` (gitignored) |
| DB schema / migrations | `platform/drizzle/`, `platform/supabase/` |
| Shared CSS tokens | `app/css/core/` |
| Unit / integration / E2E | `tests/` — see `tests.md` |
| npm script implementation | `scripts/` |

---

## Top-level folders

| Path | Role |
|---|---|
| `app/` | App Router — routes, layouts, API handlers (keep thin) |
| `features/` | Product behavior by domain (`admin`, `planner`, `site`, `crm`, `ops`, `shared`) |
| `components/` | Shared and marketing presentation (not domain logic) |
| `lib/` | Pure utilities, catalog adapters, analytics |
| `platform/` | DB clients, Drizzle schema, Supabase migrations |
| `inventory/descriptors/` | **Live** SVG descriptor JSON (authoring inventory) |
| `public/` | Static assets; `public/svg-catalog/` = compiled SVG output |
| `tests/` | Vitest + Playwright (name-mirror under `tests/unit/`) |
| `scripts/` | CLI entry points for `package.json` scripts |
| `config/` | ESLint, Playwright, TS, route contract, deploy stubs |
| `i18n/` | `next-intl` messages and routing |

Build artifacts (not product): `.next/`, `node_modules/`, `.tmp/`.

**Removed / do not restore as live:** `block-descriptors/`. Live descriptors: `inventory/descriptors/` only.

---

## Features domains

| Domain | Path | Role |
|---|---|---|
| Admin | `features/admin/` | Inventory, SVG studio, pricing, catalog management |
| Planner | `features/planner/` | Layout workspace, catalog consume, BOQ, 2D/3D |
| Site | `features/site/` | Marketing data, assistant, advisor |
| CRM | `features/crm/` | Demo CRM (browser storage) |
| Ops | `features/ops/` | Customer-queries ops UI |
| Shared | `features/shared/` | Auth shell, API envelope, contracts, entry |

Detail maps: **`features.md`**.

---

## Catalog and SVG inventory

| Layer | Path | Authority |
|---|---|---|
| Marketing products | `lib/catalog/` + Products DB | `catalog_products` |
| Site page access | `lib/catalog/site/` | Facade over `lib/catalog/` |
| Planner placement | `features/planner/catalog-api/`, `features/planner/catalog/` | Released inventory consumer |
| SVG symbols | `inventory/descriptors/`, `public/svg-catalog/` | Code default: disk; local dev may set `SVG_RELEASE_AUTHORITY=db` — see `Failures.md` |

Publish: `features/admin/svg-editor/`. Path helper: `resolveBlockDescriptorsDir()` → `inventory/descriptors`.

### Descriptor file layout (`inventory/descriptors/`)

| Layout | Meaning |
|--------|---------|
| `{slug}.json` | Legacy single file (still supported) |
| `{slug}.latest.json` | Pointer to current version |
| `{slug}.{n}.json` | Version `n` of the descriptor |

No separate `descriptors/_archive/`. Older versions are co-located as numbered files.  
Compiled SVG: `public/svg-catalog/`. Do not load from `block-descriptors/` (removed).

Lifecycle/audit logs: repo-root `results/admin/catalog-ops/` (gitignored).  
Target DB authority: `../architecture/08-DATABASE-SVG-CONTRACT.md`.  
Tests must not mutate `inventory/descriptors/` — use tmp fixtures.

---

## CSS

| Path | Role |
|------|------|
| `app/css/core/theme.css` | Tokens |
| `app/css/core/components/` | Shared component styles |
| `app/css/core/utilities/` | Utility classes |
| `app/css/core/locked/site/` | Public marketing chrome (locked) |
| `app/css/core/locked/admin/` | Admin shell (locked) |
| `app/css/core/locked/planner/` | Planner workspace chrome (locked) |

Entry: `app/css/index.css`. Do not invent parallel token systems.

---

## Config / environment

Secrets and runtime env belong in the **repo-root** `.env.local` only.  
`site/config/` holds tool stubs (lint, Playwright, route contract). Do not commit API keys, service-role tokens, or database URLs there.

---

## CDN / demo assets

| Path | Role |
|------|------|
| `public/cdn/planner/canvas/` | Static assets for 2D canvas host (`/planner/guest`, `/planner/canvas`) |
| Open3D-related static | Demo-only; live entry is `/planner/canvas` (open3d URLs 301 to canvas) |

**Open3D donor assets are demo-only**, not production catalog items. Textures (ambientCG CC0) and GLB models under vendor/open3d paths are reference/fallback only. Real product models stay R2/DB-backed. SVG symbols come from typed catalog definitions + sanitization, not external markup as source.

---

## `lib/` vs `platform/`

| | `lib/` | `platform/` |
|---|---|---|
| Purpose | App logic, pure helpers, catalog adapters | DB boundary, external clients |
| Examples | `lib/catalog/`, `lib/analytics/` | `platform/drizzle/`, `platform/supabase/` |
| Rule | No raw credentials | Migrations and schema live here |

Supabase product clients: `@/platform/supabase/*` (not `@/lib/supabase/*` — removed).

---

## `components/`

Marketing and shared UI only (`home/`, `site/`, `ui/`, `products/`, …). Domain behavior belongs in `features/`.

---

## Tests

Full layout and counts: **`tests.md`**.

**Name-mirror:** `site/<path>/<file>.ts(x)` → `tests/unit/<path>/<file>.test.ts(x)`  
(handwritten product modules; exclude generated DB types).

Isolated fixtures only. No silent skips. Export-surface-only tests under ~5% of unit files.

---

## Known orphans / legacy (do not extend)

| Item | Status |
|---|---|
| `site/inventory/descriptors/` under wrong root | **Deleted** — use `inventory/descriptors/` |
| `/planner/fabric/**`, `/planner/open3d/**` | **301** → `/planner/canvas` |
| `/admin/buddy-catalog` | **301** → `/admin/planner-catalog` |
| `/crm/*`, `/ops/*` app routes | **301** → `/admin/crm/*`, `/admin/customer-queries/` |
| `@/lib/supabase/*` reexport shims | **Deleted** — use `@/platform/supabase/*` |

---

## Path aliases (`tsconfig.json`)

| Alias | Points to |
|---|---|
| `@/features/*` | `features/` |
| `@/lib/*` | `lib/` |
| `@/components/*` | `components/` |
| `@/app/*` | `app/` |
| `@/types/*` | `config/database/types/*` |
| `@/*` | `site/` root |

---

## Related

- `features.md` — planner / site / admin feature maps  
- `tests.md` — name-mirror + inventory counts  
- `route-classification.md` — generated live routes  
- `../architecture/02-DOMAINS.md` — product domains  
- Package route contract JSON: `site/config/route-contract.json`
