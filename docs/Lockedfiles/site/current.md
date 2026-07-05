# Site — current (locked)

**Baseline:** 2026-07-05  
**Revision alignment:** Per [`plann/00-REVISION.md`](../../../plann/00-REVISION.md), Phase **1A** (Open3D pilot) and **1B** (SVG publish) are **not accepted** — portal svg-catalog is read-only preview ahead of full admin compose.

## Cross-links

| Doc | Path |
|-----|------|
| Module layout | [`docs/architecture/MODULE-LAYOUT.md`](../../architecture/MODULE-LAYOUT.md) |
| UI contract | [`docs/architecture/MODULE-UI-CONTRACT.md`](../../architecture/MODULE-UI-CONTRACT.md) |
| Architecture index | [`docs/architecture/README.md`](../../architecture/README.md) |
| Locked index | [`docs/Lockedfiles/INDEX.md`](../INDEX.md) |

---

| Topic | On disk today | Paths |
|--------|---------------|-------|
| Marketing | `(site)/*` — products, about, portfolio, solutions, legal, … | `site/app/(site)/`, `site/components/`, `site/lib/site-data/` |
| Member | `/dashboard`, `/login`, `/access` | `site/app/(site)/dashboard/`, `site/lib/auth/session.ts` |
| Portal | `/portal`, `/portal/[id]`, `/portal/guest/view/[id]`, `/portal/svg-catalog` | `site/app/(site)/portal/`, `site/features/planner/portal/` |
| Site catalog | `/catalog`, product pages, R2 images | `site/features/catalog/`, `site/lib/catalog/` |
| i18n | `site/i18n/messages/` + `request.ts` | `site/i18n/` |
| CSS | `globals.css` → `site/app/css/index.css` | `site/app/css/core/site/bundles/*` |

## Packages (on disk)

| Package | Pin | Role in this domain |
|---------|-----|---------------------|
| `next` | `^16.2.9` | App framework |
| `next-intl` | `^4.13.0` | Locale routing + messages |
| `@radix-ui/react-*` | various | Dialog, tabs, tooltip, accordion (marketing) |
| `gsap`, `@gsap/react` | `^3.15` / `^2.1` | Marketing motion |
| `lenis` | `^1.3.23` | Smooth scroll |
| `swiper`, `embla-carousel-react` | `^12` / `^8.6` | Carousels |
| `recharts` | `^3.8.1` | Charts (where used) |
| `@puckeditor/core` | `0.22.0` | Portal `svg-catalog` `Render` only |
| `drizzle-orm` | `^0.45.2` | Catalog/product reads (via platform) |
| `lucide-react` | `^1.21.0` | Marketing iconography |

**Not site-core:** `fabric`, `three` — only via product viewers / links to planner routes.

---

## Summary

The public site is a mature Next.js marketing and member layer: many localized pages, product catalog integration, portal entry points, and token-driven CSS. It is largely separate from the planner pilot except where portal surfaces SVG catalog previews and member plan views.

## Strengths

Established patterns for thin routes, `site-data` copy ownership, and i18n with test helpers for async pages. Product catalog and R2-backed imagery are wired through Drizzle on the products DB. Marketing UI has substantial Vitest and Playwright coverage. Portal svg-catalog gives a clean public read-only seam for admin-produced blocks.

## Weaknesses

Site and planner documentation can blur (“catalog” means different things in site vs planner admin). Portal and dashboard auth flows depend on session layer with duplicate Supabase entry points. Marketing snapshot and locale workflows are CI-sensitive (`check:site-ui:*`). SVG catalog on portal is ahead of admin Puck compose workflow (1B not done).
