# Phase 7 — Catalog / Product UI Lane

## Purpose

Catalog routes aligned to **homepage / solutions** pattern (most already use `home-*`).

## Prerequisites

- Phase 7a complete (recommended)
- Phase 3 layout patterns available

## Reference

- `components/home/CategoryGrid.tsx` — `home-section--soft`, `home-heading`, `home-shell-xl`
- `app/(site)/solutions/page.tsx` — inner-page hero + sections

## Routes

`/products`, `/products/[category]`, `/products/[category]/[product]`, `/quote-cart`, `/compare`

- Canonical URL: `/products/[category]`; 308 duplicate slug path

## HomeCatalogLayout

Thin wrapper: `HomeMarketingLayout` + `Hero` or category header band matching solutions + `home-shell-xl` content.

**Do not** introduce `SiteCatalogShell` with `shell-card` dialect — use homepage card/grid components.

## i18n

Namespaces per Phase 4 stages.

## Tests

- `home-marketing-layout` testid
- `home-shell-xl` or `CategoryGrid` home classes present

## Acceptance Checklist

- [x] Catalog UI matches CategoryGrid / solutions visual model.
- [x] No `scheme-page` / legal `shell-card` primary layout on catalog routes.
- [x] Vitest green (catalog + planner marketing unit tests pass).
