# Site package architecture

Navigation map for `site/` (oando-site). Routes stay thin; behavior lives in `features/`, `lib/`, and `platform/`.

Repo-wide layout: `../Readme.md`. Product domains: `../docs/architecture/02-DOMAINS.md`.

---

## Decision tree

| I am changing… | Go to… |
|---|---|
| Public marketing page or SEO | `app/(site)/` → `components/home/`, `components/site/`, `features/site/data/`, `i18n/` |
| Site product listing / filters | `lib/catalog/site/` (facade) → `lib/catalog/` (logic) |
| Planner guest/member workspace UI | `app/planner/` → `features/planner/editor/`, `canvas/`, `3d/`, **`project/`** |
| Planner document / canvas state | **`features/planner/project/`** (`model/`, `store/`, `persistence/`, `catalog/`) |
| Planner save / review persistence API | `features/planner/cloud-store/` + `project/persistence/` |
| Admin SVG editor, publish, lifecycle | **`features/admin/svg-editor/`** |
| Admin shell / dashboard chrome | `features/admin/` page views + `features/admin/ui/` |
| Admin route page | `app/admin/` — import from `features/admin/` |
| Admin API | `app/api/admin/` — handlers often in `features/admin/api/` |
| CRM / customer-queries | `app/admin/crm/`, `app/admin/customer-queries/` + `features/crm/`, `features/ops/` |
| Marketing catalog (Supabase) | `lib/catalog/` + `platform/` |
| SVG descriptors (live authority) | **`inventory/descriptors/`** + `public/svg-catalog/` + `features/admin/svg-editor/` |
| Catalog lifecycle / audit logs | repo-root `results/admin/catalog-ops/` (gitignored) |
| DB schema / migrations | `platform/drizzle/`, `platform/supabase/` |
| Shared CSS tokens | `app/css/core/` |
| Unit / integration / E2E | `tests/` — see [Tests](#tests) |
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

**Removed / do not restore as live:** `block-descriptors/` (orphan folder). Live descriptors: `inventory/descriptors/` only.

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

---

## Catalog and SVG

| Layer | Path | Authority |
|---|---|---|
| Marketing products | `lib/catalog/` + Products DB | `catalog_products` |
| Site page access | `lib/catalog/site/` | Facade over `lib/catalog/` |
| Planner placement | `features/planner/catalog-api/`, `project/catalog/` | Released inventory consumer |
| SVG symbols | `inventory/descriptors/`, `public/svg-catalog/` | Disk (live); versions as `{slug}.{n}.json` |

Publish: `features/admin/svg-editor/`. Path helper: `resolveBlockDescriptorsDir()` → `inventory/descriptors`.

---

## `lib/` vs `platform/`

| | `lib/` | `platform/` |
|---|---|---|
| Purpose | App logic, pure helpers, catalog adapters | DB boundary, external clients |
| Examples | `lib/catalog/`, `lib/analytics/` | `platform/drizzle/`, `platform/supabase/` |
| Rule | No raw credentials | Migrations and schema live here |

Supabase product clients: `@/platform/supabase/*` (not `@/lib/supabase/*` shims — removed).

---

## `components/`

Marketing and shared UI only (`home/`, `site/`, `ui/`, `products/`, …). Domain behavior belongs in `features/`.

---

## Tests

Layout map: `tests-CONTENTS.md` (this folder).

**Name-mirror rule:**  
`site/<path>/<file>.ts(x)` → `tests/unit/<path>/<file>.test.ts(x)`  
(for handwritten product modules; exclude generated DB types).

| Pattern | Location | Mirrors |
|---|---|---|
| App routes / API | `tests/unit/app/` | `app/` |
| Components | `tests/unit/components/` | `components/` |
| Features (all domains) | `tests/unit/features/` | `features/` |
| Lib | `tests/unit/lib/` | `lib/` |
| Platform | `tests/unit/platform/` | `platform/` |
| Config contracts | `tests/unit/config/` | `config/` |
| i18n | `tests/unit/i18n/` | `i18n/` |
| Integration | `tests/integration/` | multi-module flows |
| E2E | `tests/e2e/` | journeys (not 1:1 file mirror) |

Inventory snapshot: `tests-INVENTORY.md`.

**Rules:** isolated fixtures only — never mutate `inventory/descriptors/` or live DB catalog rows. No `test.skip` as a silent pass. Export-surface-only tests kept under ~5% of unit files.

---

## Known orphans / legacy (do not extend)

| Item | Status |
|---|---|
| `site/inventory/descriptors/` | **Deleted** — use `inventory/descriptors/` |
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

## Related docs (this folder)

- `features-planner-project.md` — live vs parallel planner trees  
- `features-planner-asset-engine.md` — SVG compile / asset engine  
- `features-site-CONTENTS.md` — site marketing feature map  
- `inventory.md` — descriptor inventory  
- `../architecture/02-DOMAINS.md` — product domains  
- Live route contract JSON still in package: `site/config/route-contract.json`
