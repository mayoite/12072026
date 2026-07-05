# Admin — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Per [`plann/REVISION-2026-07-05.md`](../../../plann/REVISION-2026-07-05.md), **1B** (full Puck + publish) is **not accepted** — svg-editor is JSON + `Render` preview today.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Admin contract | [`docs/architecture/ADMIN-UI-CONTRACT.md`](../../architecture/ADMIN-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Shell | `/admin/*` — `requireAuthUser(…, "admin")` + `CsrfBootstrap` | `site/app/admin/layout.tsx`, `AdminLayoutShell.tsx` |
| Nav | CRM, Ops, Planner, Catalog, Platform, **SVG editor** | `features/planner/admin/adminNav.ts` |
| Catalog admin | Standard, planner-catalog, workspace-library | `AdminCatalogPageView`, `ConfiguratorCatalogPageView` |
| SVG editor | `/admin/svg-editor` — JSON edit + Puck `Render` preview; **no full `<Puck>`** | `features/planner/admin/svg-editor/`, `app/admin/svg-editor/` |
| Portal SVG | `/portal/svg-catalog`, `…/[slug]` — Puck `Render` | `site/app/(site)/portal/svg-catalog/` |
| Views vs routes | Thin `app/admin/**/page.tsx` | `site/app/admin/` |
| Icons | Lucide throughout admin nav and svg-editor | `adminNav.ts`, `AdminSvgEditorEditView.tsx` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `@puckeditor/core` | `0.22.0` | Registry, portal/admin `Render`; not full editor mount yet |
| `@ark-ui/react` | `5.37.2` | Admin headless primitives (policy target) |
| `react-aria-components` | `1.19.0` | Accessible form controls in admin surfaces |
| `zod` | `^4.4.3` | BlockDescriptor / admin payload validation |
| `lucide-react` | `^1.21.0` | SVG editor + admin chrome icons (revision allows admin CMS) |
| `dompurify`, `svgo`, `@resvg/resvg-js`, `sharp` | server | SVG API pipeline (via open3d compiler modules) |
| `@flatten-js/core`, `polygon-clipping` | server | Option A geometry in compiler |

**Not in admin client chunks:** resvg, sharp, svgo, compiler — enforced by `svgPackageBoundaries.test.ts`.

**Gaps:** `ADMIN_workflow.md` (2026-06-26) omits svg-editor and portal svg-catalog; publish can succeed if pipeline fails.

---

## Summary

Admin is a real console: gated layout, CRM/ops/catalog/planner surfaces, and a working SVG block path from JSON persist through compile to portal preview. Heavy lifting lives in `features/planner/admin/` with thin routes. SVG work is **infrastructure-rich, product-thin** — registry, Zod, atomic disk write, pipeline runner, and tests exist, but the primary edit experience is still JSON plus render preview rather than visual Puck composition.

## Strengths

Solid security baseline: admin role on pages, CSRF on mutating APIs, `noindex` on private shells. Catalog admin separates three planner-related data sets with shared API handlers. Svg-editor stack has strong contracts — `puckBlockRegistry`, field metadata from Zod, boundary tests, POST API. Nav already includes svg-editor where older docs do not.

## Weaknesses

Admin product lags plumbing. No full `<Puck>` mount, publish can succeed while compile fails, `ADMIN_workflow.md` is out of date. CRM and catalog UIs share shell but SVG publication is not yet draft/publish with visible failure states. **1B not accepted.**
