# Live route classification

*Generated: 2026-07-16 — `node scripts/generate-route-classification.mjs`*

Canonical planner surface is **`/planner/**`** (`app/planner/`). Legacy `/oando-planner/**` and `/buddy-planner/**` redirect via `config/build/next.config.js`.

## Canonical planner

- `/planner/features/[slug]` → `app/planner/(marketing)/features/[slug]/page.tsx`
- `/planner/features` → `app/planner/(marketing)/features/page.tsx`
- `/planner/help` → `app/planner/(marketing)/help/page.tsx`
- `/planner` → `app/planner/(marketing)/page.tsx`
- `/planner/canvas` → `app/planner/(workspace)/canvas/page.tsx`
- `/planner/guest` → `app/planner/(workspace)/guest/page.tsx`

## Public site (`app/(site)/`)

- `/about` → `app/(site)/about/page.tsx`
- `/access` → `app/(site)/access/page.tsx`
- `/brochure` → `app/(site)/brochure/page.tsx`
- `/career` → `app/(site)/career/page.tsx`
- `/catalog` → `app/(site)/catalog/page.tsx`
- `/choose-product` → `app/(site)/choose-product/page.tsx`
- `/compare` → `app/(site)/compare/page.tsx`
- `/contact` → `app/(site)/contact/page.tsx`
- `/dashboard` → `app/(site)/dashboard/page.tsx`
- `/download-brochure` → `app/(site)/download-brochure/page.tsx`
- `/downloads` → `app/(site)/downloads/page.tsx`
- `/gallery` → `app/(site)/gallery/page.tsx`
- `/imprint` → `app/(site)/imprint/page.tsx`
- `/login` → `app/(site)/login/page.tsx`
- `/news` → `app/(site)/news/page.tsx`
- `/` → `app/(site)/page.tsx`
- `/planning` → `app/(site)/planning/page.tsx`
- `/portal/[id]` → `app/(site)/portal/[id]/page.tsx`
- `/portal/guest` → `app/(site)/portal/guest/page.tsx`
- `/portal/guest/view/[id]` → `app/(site)/portal/guest/view/[id]/page.tsx`
- `/portal` → `app/(site)/portal/page.tsx`
- `/portal/svg-catalog/[slug]` → `app/(site)/portal/svg-catalog/[slug]/page.tsx`
- `/portal/svg-catalog` → `app/(site)/portal/svg-catalog/page.tsx`
- `/portfolio` → `app/(site)/portfolio/page.tsx`
- `/privacy` → `app/(site)/privacy/page.tsx`
- `/products/[category]/[product]` → `app/(site)/products/[category]/[product]/page.tsx`
- `/products/[category]` → `app/(site)/products/[category]/page.tsx`
- `/products/category/[slug]` → `app/(site)/products/category/[slug]/page.tsx`
- `/products` → `app/(site)/products/page.tsx`
- `/projects` → `app/(site)/projects/page.tsx`
- `/quote-cart` → `app/(site)/quote-cart/page.tsx`
- `/refund-and-return-policy` → `app/(site)/refund-and-return-policy/page.tsx`
- `/repo-store` → `app/(site)/repo-store/page.tsx`
- `/service` → `app/(site)/service/page.tsx`
- `/showrooms` → `app/(site)/showrooms/page.tsx`
- `/social` → `app/(site)/social/page.tsx`
- `/solutions/[category]` → `app/(site)/solutions/[category]/page.tsx`
- `/solutions` → `app/(site)/solutions/page.tsx`
- `/support-ivr` → `app/(site)/support-ivr/page.tsx`
- `/sustainability` → `app/(site)/sustainability/page.tsx`
- … +5 more site routes

## Admin / CRM / Ops

- `/admin/analytics` → `app/admin/analytics/page.tsx`
- `/admin/catalog` → `app/admin/catalog/page.tsx`
- `/admin/crm/clients` → `app/admin/crm/clients/page.tsx`
- `/admin/crm` → `app/admin/crm/page.tsx`
- `/admin/crm/projects/[id]` → `app/admin/crm/projects/[id]/page.tsx`
- `/admin/crm/projects` → `app/admin/crm/projects/page.tsx`
- `/admin/crm/quotes` → `app/admin/crm/quotes/page.tsx`
- `/admin/customer-queries` → `app/admin/customer-queries/page.tsx`
- `/admin/features` → `app/admin/features/page.tsx`
- `/admin/inventory` → `app/admin/inventory/page.tsx`
- `/admin` → `app/admin/page.tsx`
- `/admin/planner-catalog` → `app/admin/planner-catalog/page.tsx`
- `/admin/plans/[id]` → `app/admin/plans/[id]/page.tsx`
- `/admin/plans` → `app/admin/plans/page.tsx`
- `/admin/price-books` → `app/admin/price-books/page.tsx`
- `/admin/settings` → `app/admin/settings/page.tsx`
- `/admin/svg-editor/[id]` → `app/admin/svg-editor/[id]/page.tsx`
- `/admin/svg-editor` → `app/admin/svg-editor/page.tsx`
- `/admin/themes` → `app/admin/themes/page.tsx`
- `/admin/workspace-catalog` → `app/admin/workspace-catalog/page.tsx`

## API routes

- `/api/admin/analytics` → `app/api/admin/analytics/route.ts`
- `/api/admin/catalog/[id]` → `app/api/admin/catalog/[id]/route.ts`
- `/api/admin/catalog` → `app/api/admin/catalog/route.ts`
- `/api/admin/catalogs/[type]/[id]` → `app/api/admin/catalogs/[type]/[id]/route.ts`
- `/api/admin/catalogs/[type]` → `app/api/admin/catalogs/[type]/route.ts`
- `/api/admin/configurator-catalog/[id]` → `app/api/admin/configurator-catalog/[id]/route.ts`
- `/api/admin/features` → `app/api/admin/features/route.ts`
- `/api/admin/planner-catalog` → `app/api/admin/planner-catalog/route.ts`
- `/api/admin/plans/[id]` → `app/api/admin/plans/[id]/route.ts`
- `/api/admin/plans` → `app/api/admin/plans/route.ts`
- `/api/admin/price-books/[bookId]/action` → `app/api/admin/price-books/[bookId]/action/route.ts`
- `/api/admin/price-books/[bookId]` → `app/api/admin/price-books/[bookId]/route.ts`
- `/api/admin/price-books` → `app/api/admin/price-books/route.ts`
- `/api/admin/svg-editor/[slug]/lifecycle` → `app/api/admin/svg-editor/[slug]/lifecycle/route.ts`
- `/api/admin/svg-editor/[slug]/revisions` → `app/api/admin/svg-editor/[slug]/revisions/route.ts`
- `/api/admin/svg-editor/[slug]/rollback` → `app/api/admin/svg-editor/[slug]/rollback/route.ts`
- `/api/admin/svg-editor/bulk-import` → `app/api/admin/svg-editor/bulk-import/route.ts`
- `/api/admin/svg-editor` → `app/api/admin/svg-editor/route.ts`
- `/api/admin/themes/publish` → `app/api/admin/themes/publish/route.ts`
- `/api/admin/themes` → `app/api/admin/themes/route.ts`
- `/api/ai-advisor` → `app/api/ai-advisor/route.ts`
- `/api/ai-assist` → `app/api/ai-assist/route.ts`
- `/api/ai/advisor` → `app/api/ai/advisor/route.ts`
- `/api/audit` → `app/api/audit/route.ts`
- `/api/business-stats` → `app/api/business-stats/route.ts`
- `/api/categories` → `app/api/categories/route.ts`
- `/api/configurator/smart-wizard` → `app/api/configurator/smart-wizard/route.ts`
- `/api/csrf` → `app/api/csrf/route.ts`
- `/api/customer-queries/manage` → `app/api/customer-queries/manage/route.ts`
- `/api/customer-queries` → `app/api/customer-queries/route.ts`
- … +22 more API routes

## Legacy redirects (301)

- `/oando-planner` → `/planner/`
- `/oando-planner/canvas` → `/planner/canvas/`
- `/oando-planner/guest` → `/planner/guest/`
- `/buddy-planner` → `/planner/canvas/`
- `/buddy-planner/guest` → `/planner/guest/`
- `/buddy-planner/editor` → `/planner/canvas/`
- `/buddy-planner/:path*` → `/planner/canvas/`

See also: `site/config/route-contract.json`, `docs/site/ARCHITECTURE.md`, `docs/api/ROUTE-INDEX.md`.
