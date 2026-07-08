# ADMIN_workflow.md

## 1. Authority
- **Docs:** Read `AGENTS.md` (conduct), `Readme.md` (paths), and `docs/api/ROUTE-INDEX.md`.

## 2. Request Flow
- **Pattern:** Browser → `site/app/admin/*` (layout) → `page.tsx` (thin route) → `*View.tsx` (fat view) → API.
- **Rules:** Routes own URLs. Views own logic. APIs enforce auth.

## 3. Route Map
- **CRM:** `/admin/crm/*` (Projects, Clients, Quotes)
- **Ops:** `/admin/customer-queries`
- **Planner:** `/admin/plans`, `/admin/features`, `/admin/analytics`
- **Catalog:** `/admin/catalog` (Standard), `/admin/planner-catalog` (Config), `/admin/workspace-catalog` (Static)
- **Platform:** `/admin/settings`, `/admin/themes`, `/admin/inventory`
- **SVG Editor:** `/admin/svg-editor`

## 4. Catalog Constraints
- **Standard (`planner_managed_products`):** Fixed dimensions, prices.
- **Configurator (`configurator_products`):** Parametric / discrete / fixed.
- **Workspace:** Read-only static TS library.

## 5. Security & Auth
- **Session:** Supabase `requireAdminUser()`. Role MUST be `"admin"`.
- **CSRF:** `CsrfBootstrap` required for mutating browser requests.
- **No Standalone:** Legacy `/crm/*` and `/ops/*` redirect to `/admin/*`.

## 6. Layout & Creation
- **Views:** Add to `site/features/planner/admin/`, `site/features/crm/`, or `site/features/ops/`.
- **Routes:** Add thin `site/app/admin/foo/page.tsx`.
- **Nav:** Register in `site/features/planner/admin/adminNav.ts`.
- **API:** Protect with `withAuth({ role: "admin" })`.
