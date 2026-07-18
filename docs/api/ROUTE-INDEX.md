# API route index

**Source of truth:** `site/app/api/**/route.ts`

Generated from route handlers on 2026-07-18.

Regenerate: `pnpm --filter oando-site run docs:sync:routes` (from repo root).

| Methods | Path |
|---------|------|
| GET | `/api/admin/analytics` |
| PATCH, DELETE | `/api/admin/catalog/[id]` *(deprecated shim → PATCH/DELETE /api/admin/catalogs/standard/[id])* |
| GET, POST | `/api/admin/catalog` *(deprecated shim → GET /api/admin/catalogs/standard)* |
| PATCH, DELETE | `/api/admin/catalogs/[type]/[id]` |
| GET, POST | `/api/admin/catalogs/[type]` — `type`: `standard`, `configurator`, `buddy` |
| PATCH, DELETE | `/api/admin/configurator-catalog/[id]` *(deprecated shim → PATCH/DELETE /api/admin/catalogs/configurator/[id])* |
| GET, PATCH | `/api/admin/features` |
| GET, POST | `/api/admin/planner-catalog` *(deprecated shim → GET/POST /api/admin/catalogs/configurator)* |
| GET, PATCH | `/api/admin/plans/[id]` |
| GET, PATCH, DELETE | `/api/admin/plans` |
| POST | `/api/admin/price-books/[bookId]/action` |
| GET | `/api/admin/price-books/[bookId]` |
| GET | `/api/admin/price-books` |
| PATCH | `/api/admin/svg-editor/[slug]/lifecycle` |
| GET | `/api/admin/svg-editor/[slug]/revisions` |
| POST | `/api/admin/svg-editor/[slug]/rollback` |
| POST | `/api/admin/svg-editor/bulk-import` |
| POST | `/api/admin/svg-editor` |
| POST | `/api/admin/themes/publish` |
| GET | `/api/admin/themes` |
| POST | `/api/ai-advisor` |
| POST | `/api/ai-assist` *(deprecated shim → POST /api/planner/ai-advisor)* |
| POST | `/api/ai/advisor` *(deprecated shim → POST /api/planner/ai-advisor)* |
| POST | `/api/audit` |
| GET | `/api/business-stats` |
| GET | `/api/categories` |
| POST | `/api/configurator/smart-wizard` |
| GET | `/api/csrf` |
| GET, PATCH | `/api/customer-queries/manage` |
| POST | `/api/customer-queries` |
| GET | `/api/dev-tools/lighthouse` |
| GET | `/api/dev/auth-bypass-status` |
| POST | `/api/filter` |
| POST | `/api/generate-alt` |
| GET | `/api/health` |
| POST | `/api/log-error` |
| GET | `/api/nav-categories` |
| GET, POST | `/api/nav-search` |
| POST | `/api/planner/ai-advisor` |
| GET | `/api/planner/catalog/configurator` |
| GET | `/api/planner/catalog/svg-blocks` |
| GET | `/api/planner/catalog/svg/[revisionId]` |
| GET | `/api/planner/catalog` |
| POST | `/api/planner/export/cloud` |
| POST | `/api/planner/generated-glb` |
| POST | `/api/planner/handoff` |
| POST | `/api/planner/project-sketch` |
| POST | `/api/planner/sketch-to-plan` |
| GET, PUT, DELETE | `/api/plans/[id]` |
| GET, POST | `/api/plans` |
| GET | `/api/products/filter` |
| GET | `/api/products` |
| POST | `/api/recommendations` *(deprecated)* |
| GET | `/api/theme/active` |
| GET, POST | `/api/theme/manage` |
| POST | `/api/tracking` |

## Notes

- **Auth:** Most user routes use Supabase session cookies via `createServerClient()`. Admin routes use `withAuth({ role: "admin" })`. Some routes accept `Authorization: Bearer` (e.g. recommendations).
- **CSRF:** `POST`/`PUT`/`DELETE` on `/api/plans` require a valid CSRF token (`GET /api/csrf` first).
- **Deprecated catalog shims:** Prefer `/api/admin/catalogs/{type}` over legacy `/api/admin/catalog`, `buddy-catalog`, and `planner-catalog` paths.
