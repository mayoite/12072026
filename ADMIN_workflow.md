# Admin console workflow

**Last updated:** 2026-06-26

**Owns:** admin UI routes and request flow. Conduct `AGENTS.md`. App paths `Readme.md`. API inventory `docs/api/ROUTE-INDEX.md`.

Internal admin UI for **CRM**, **ops**, planner, catalog CRUD, themes, and platform settings. Routes live under `site/app/admin/`; views in `site/features/planner/admin/`, `site/features/crm/`, and `site/features/ops/`.

Legacy `/crm/*` and `/ops/*` URLs redirect here (admin role required).

---

## Request flow

```
Browser → /admin/*
       → site/app/admin/layout.tsx
            requireAdminUser()  (Supabase session + role === "admin")
            AdminLayoutShell + adminNav sidebar
       → site/app/admin/<route>/page.tsx   (thin route — imports a *PageView)
       → features/planner/admin/*PageView.tsx | features/crm/*View.tsx | features/ops/*
       → browserApiFetch → /api/admin/* | /api/customer-queries/*
```

- **Routes** (`site/app/admin/`) own URLs and metadata only.
- **Views** own forms, tables, and client logic.
- **APIs** enforce `withAuth({ role: "admin" })` (or dedicated ops token for legacy standalone ops mode).

Unauthenticated users redirect to access login; non-admin users redirect to `/dashboard?error=unauthorized_admin_access`.

---

## Route map

| URL | Route file | View / notes | API |
|-----|------------|--------------|-----|
| `/admin` | `page.tsx` | `AdminDashboardPageView` — hub cards from `adminNav.ts` | — |
| **CRM** | | | |
| `/admin/crm` | `crm/page.tsx` | Redirect → `/admin/crm/projects/` | — |
| `/admin/crm/clients` | `crm/clients/page.tsx` | `ClientsView` (`embedded`) | — (local store today) |
| `/admin/crm/projects` | `crm/projects/page.tsx` | `ProjectsView` (`embedded`) | — |
| `/admin/crm/projects/[id]` | `crm/projects/[id]/page.tsx` | `ProjectDetailView` (`embedded`) | `GET /api/plans` (link plans) |
| `/admin/crm/quotes` | `crm/quotes/page.tsx` | `QuotesView` (`embedded`) | — |
| **Ops** | | | |
| `/admin/customer-queries` | `customer-queries/page.tsx` | `CustomerQueriesOpsPageView` (`embedded`) | `GET/PATCH /api/customer-queries/manage` |
| **Planner** | | | |
| `/admin/plans` | `plans/page.tsx` | `AdminPlansPageView` | `GET/PATCH/DELETE /api/admin/plans`, `GET/PATCH /api/admin/plans/[id]` |
| `/admin/plans/[id]` | `plans/[id]/page.tsx` | `AdminPlanDetailPageView` | same |
| `/admin/features` | `features/page.tsx` | `AdminFeatureFlagsPageView` | `GET/PATCH /api/admin/features` |
| `/admin/analytics` | `analytics/page.tsx` | `AdminAnalyticsPageView` | `GET /api/admin/analytics` |
| **Catalog** | | | |
| `/admin/catalog` | `catalog/page.tsx` | `AdminCatalogPageView` — **standard** catalog | `GET/POST/PATCH/DELETE /api/admin/catalogs/standard` |
| `/admin/planner-catalog` | `planner-catalog/page.tsx` | `ConfiguratorCatalogPageView` — **configurator** | `GET/POST/PATCH/DELETE /api/admin/catalogs/configurator` |
| `/admin/workspace-catalog` | `workspace-catalog/page.tsx` | `AdminWorkspaceCatalogPageView` — read-only static library | (no CRUD API) |
| `/admin/buddy-catalog` | `buddy-catalog/page.tsx` | **Legacy redirect** → `/admin/planner-catalog` | deprecated shim |
| **Platform** | | | |
| `/admin/settings` | `settings/page.tsx` | `AdminSettingsPageView` | — |
| `/admin/themes` | `themes/page.tsx` | `ThemeEditor` | `POST /api/admin/themes/publish` |
| `/admin/inventory` | `inventory/page.tsx` | `AdminInventoryPageView` | — |

**Legacy redirects**

| Old URL | New URL |
|---------|---------|
| `/crm`, `/crm/clients`, `/crm/projects`, `/crm/quotes`, `/crm/projects/[id]` | `/admin/crm/...` |
| `/ops`, `/ops/customer-queries` | `/admin/customer-queries` |

Nav source of truth: `site/features/planner/admin/adminNav.ts` (`ADMIN_NAV_GROUPS` — CRM, Ops, Planner, Catalog, Platform).

CRM path constants: `site/features/crm/crmRoutes.ts`.

---

## Catalog workflow (three data sets)

Admin exposes **three planner-related catalogs**. Guest planner hydrates **static + configurator + managed** at runtime (`catalogStore`).

| Admin label | Route | DB table | Type | Consumer today |
|-------------|-------|----------|------|----------------|
| **Standard catalog** | `/admin/catalog` | `planner_managed_products` | Fixed dimensions, price, mesh, visibility | Planner via `/api/planner/catalog` + `catalogStore` |
| **Planner catalog** | `/admin/planner-catalog` | `configurator_products` | Parametric / discrete / fixed | Planner via `/api/planner/catalog/configurator` + `catalogStore` |
| **Workspace library** | `/admin/workspace-catalog` | — (static TS) | Read-only browse | Guest planner static layer |

**Canonical catalog API:** `/api/admin/catalogs/{type}` where `type` is `standard` or `configurator`.

---

## Auth & env

- Session: Supabase (`requireAdminUser` in `site/lib/auth/adminSession.ts`).
- Admin role: `user.app_metadata.role` or `user.user_metadata.role` must be `"admin"`.
- CRM and ops are **admin-only** (no separate member CRM surface under `/crm/*`).
- CSRF: `CsrfBootstrap` in admin layout for mutating browser requests.
- Env: repo-root `.env.local` — see `.env.example`.

---

## Folder layout

```
site/app/admin/              ← App Router pages (thin)
  crm/                       ← CRM under admin shell
  customer-queries/          ← Ops
  layout.tsx                 ← auth gate + AdminLayoutShell

site/features/crm/           ← CRM views + crmRoutes.ts
site/features/ops/           ← Customer queries ops view
site/features/planner/admin/ ← Planner/catalog admin views + adminNav.ts

site/app/crm/                ← legacy redirects only
site/app/ops/                ← legacy redirects only
```

---

## Adding a new admin screen

1. Add view under `site/features/planner/admin/`, `site/features/crm/`, or `site/features/ops/`.
2. Add thin `site/app/admin/foo/page.tsx` (pass `embedded` when the view supports it).
3. Register in `adminNav.ts` (`ADMIN_NAV_GROUPS`).
4. Add API route with `withAuth({ role: "admin" })` if needed.

---

## Related docs

- `START.md` — dev and test commands
- `site/lib/api/catalogAdminHandlers.ts` — shared catalog handlers
