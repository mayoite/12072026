# Product domains

## Site

Public visitors. Owns marketing, SEO, localized content (`next-intl`: `en`/`hi`/`fr`/`de`/`es`), Site→Planner handoff, conversion on qualified entry. Does not own layout, SVG, or BOQ. Planner/Admin workspace UI: English only.

Locales: `site/i18n/`. Marketing data: `features/site/data/`. Presentation: `components/`.

SEO floor: `app/robots.ts` + `app/sitemap.ts` at App Router root, driven by route classification + `SITE_URL` (never invent localhost for production claims).

## Admin

Internal role. Owns catalog identity, availability, SVG authoring/publication, families/options, revisions, rollback, audit, and the released catalog contract for Planner and Site.

**Live:** disk publish (`inventory/descriptors/`, `public/svg-catalog/`). Dual-write only when Products DB **and** R2 ListObjects succeed; enabled dual-write ≠ cutover; disk still authority. UI copy must admit disk authority. Shell chrome uses **ecru paper stack** and Planner-style topbar package (brand | center | actions). **Target:** Products DB transaction — `08-DATABASE-SVG-CONTRACT.md`. Does not own customer layout.

Routes: `app/admin/**`. Behavior: `features/admin/**`. Auth: proxy + `requireAuthUser(..., "admin")` + `requireAdminSession` / `withAuth({ role: "admin" })`. `DEV_AUTH_BYPASS=1` is local/non-prod only — not deploy proof.

## Planner

External customers. Owns guest/member entry, layout editing, catalog placement, 2D/3D sync, persistence, branded BOQ, review/submission. Consumes published inventory; no invented catalog or prices.

**Live:** disk descriptors via loader / `svg-blocks` with DB-aware fallback. **Target:** exact DB revision bytes per product pointer.

Routes: `app/planner/**` (`/planner/guest`, `/planner/canvas`). Legacy fabric/open3d paths redirect to canvas.

## CRM / Ops

| Surface | Path |
|---|---|
| CRM (demo / browser store) | `app/admin/crm/**`, `features/crm/` — localStorage demo; must stay labelled |
| Customer queries ops | `app/admin/customer-queries/**`, `features/ops/` — server-backed manage auth distinct from CRM demo |
| Planner handoff intake | `customer_queries` rows with source `planner-handoff` |

No top-level `/crm` or `/ops` app routes — they redirect into admin.

## Shared contracts

| Contract | Producer | Consumer | Live authority |
|---|---|---|---|
| Marketing catalog | Admin / seed | Site | Products DB |
| Planner managed catalog | Admin / seed | Planner workspace | Products DB |
| Released SVG | Admin publish | Planner 2D | **Disk** (target: DB + R2) |
| Product options | Admin | Planner / BOQ | Disk + DB (split until cutover) |
| Planner document | Planner | 2D, 3D, save, export | Memory + IndexedDB + cloud when configured |
| Branded BOQ | Planner | Customer, Oando | Planner export + handoff API |
| Conversion context | Site | Analytics, Planner entry | `conversionContract.ts` |

Stable IDs and explicit versions. Isolated test fixtures. Never mutate canonical catalog or released DB rows in tests.
