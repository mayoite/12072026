# Module layout

## Repository

| Path | Ownership |
|---|---|
| `site/app/` | Routes, layouts, API — keep thin |
| `site/features/` | Product behavior, domain UI |
| `site/components/` | Shared and marketing presentation |
| `site/lib/` | Utilities, shared data, server helpers |
| `site/platform/` | DB and platform clients (`drizzle/`, `supabase/`) |
| `site/app/css/` | Shared styling (`core/theme.css`, `core/locked/{site,admin,chrome,svg,planner}/`) |
| `site/config/` | Build, lint, Playwright, route contract |
| `site/i18n/` | next-intl locales + messages |
| `site/tests/` | Unit (name-mirror), integration, browser tests |
| `site/inventory/descriptors/` | Live SVG descriptor JSON (authoring inventory) |
| `site/public/` | Static assets; `public/svg-catalog/` compiled SVG |
| `site/scripts/` | Tooling (optional unit mirrors) |
| `docs/site/ARCHITECTURE.md` | Package decision tree (“where do I edit?”) |
| `results/admin/catalog-ops/` | Lifecycle manifest + descriptor audit (gitignored) |

**Not product paths:** `site/block-descriptors/` (removed). Live descriptors: `site/inventory/descriptors/`.

## Product roots

| Area | Root |
|---|---|
| Site routes | `site/app/(site)/` |
| Site UI / data / SEO | `site/components/home/`, `site/features/site/data/`, `site/features/site/assistant/` |
| Site i18n | `site/i18n/` |
| Planner workspace UI | `site/features/planner/editor/`, `canvas/`, `3d/`, **`project/`** |
| Planner routes | `site/app/planner/` (`/guest`, `/canvas`; fabric/open3d 301 → canvas) |
| Admin | `site/app/admin/`, `site/features/admin/` |
| CRM / ops UI | `site/app/admin/crm/`, `site/app/admin/customer-queries/` + `features/crm/`, `features/ops/` |
| Catalog adapters | `site/lib/catalog/`, `site/lib/catalog/site/` |
| Live descriptors | `site/inventory/descriptors/` |
| Live compiled SVG | `site/public/svg-catalog/` |
| SVG target | Products DB via server APIs |
| Supabase clients | `@/platform/supabase/*` |
| Analytics contract | `site/lib/analytics/conversionContract.ts` |

## Planner dual trees (honest)

| Tree | Role |
|---|---|
| `features/planner/project/` | **Live canvas host** document model |
| `features/planner/catalog-api/` | Panel, bridges, resolvers (parallel API surface) |
| `features/planner/cloud-store/` | Cloud saves, domain stores (parallel) |

Do not invent a third tree. Prefer consolidating duplicates over growing both.

## Tests

Name-mirror: `site/<path>/File.ts` → `site/tests/unit/<path>/File.test.ts`.  
Rules: `docs/site/tests.md`.

## Quality floor

No handwritten `any`. No silent test skips. Secrets only in repo-root `.env.local`.
