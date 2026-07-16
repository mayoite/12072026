# Product domains

## Site

Public visitors. Owns marketing, SEO, localized content (`next-intl`: `en`/`hi`/`fr`/`de`/`es`), Site→Planner handoff, conversion on qualified entry. Does not own layout, SVG, or BOQ. Planner/Admin workspace UI: English only.

Locales: `site/i18n/`. Marketing data: `features/site/data/`. Presentation: `components/`.

## Admin

Internal role. Owns catalog identity, availability, SVG authoring/publication, families/options, revisions, rollback, audit, and the released catalog contract for Planner and Site.

**Live:** disk publish (`inventory/descriptors/`, `public/svg-catalog/`). Both Admin publish entrypoints optionally dual-write when the Products DB is configured; that additive stub is not authority. **Target:** Products DB transaction — `08-DATABASE-SVG-CONTRACT.md`. Does not own customer layout.

Routes: `app/admin/**`. Behavior: `features/admin/**`.

## Planner

External customers. Owns guest/member entry, layout editing, catalog placement, 2D/3D sync, persistence, branded BOQ, review/submission. Consumes published inventory; no invented catalog or prices.

**Live:** disk descriptors via `loadBuyerVisibleDescriptors()` / `svgBlockDescriptorLoader` → `inventory/descriptors/`. **Target:** exact DB revision bytes per product pointer.

Routes: `app/planner/**` (`/planner/guest`, `/planner/canvas`). Legacy `/planner/fabric/**` and `/planner/open3d/**` redirect to canvas.

## CRM / Ops

| Surface | Path |
|---|---|
| CRM (demo / browser store) | `app/admin/crm/**`, `features/crm/` |
| Customer queries ops | `app/admin/customer-queries/**`, `features/ops/` |

No top-level `/crm` or `/ops` app routes — they redirect into admin.

## Shared contracts

| Contract | Producer | Consumer | Live authority |
|---|---|---|---|
| Marketing catalog | Admin / seed | Site | Products DB |
| Planner managed catalog | Admin / seed | Planner workspace | Products DB |
| Released SVG | Admin publish | Planner 2D | **Disk** `inventory/descriptors/` (target: DB + R2) |
| Product options | Admin | Planner / BOQ | Disk + DB (split) |
| Planner document | Planner | 2D, 3D, save, export | Store + admin DB |
| Branded BOQ | Planner | Customer, Oando | Planner export |
| Conversion context | Site | Analytics, Planner entry | `conversionContract.ts` |

Stable IDs and explicit versions. Isolated test fixtures. Never mutate canonical catalog or released DB rows.
