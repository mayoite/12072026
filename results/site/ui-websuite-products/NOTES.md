# Phase 3 — Products suite align to home design base

**Date:** 2026-07-10  
**Surface:** `/products/*` catalog suite only  
**Design base:** `results/site/design-base-home/` (Phase 2)  
**Constraint:** zero edits under `site/app/css/core/locked/**`  
**Out of scope:** homepage `/`, `components/home/**`, locked CSS, catalog image path data (Phase 5)

## Goal

FilterGrid / product cards match home **card media layer language**:

1. One image paint layer  
2. `isolation: isolate` on media box  
3. Badges on top of media (not document flow)  
4. Shared type/shell utilities (`typ-*`, `home-heading`, `home-shell-xl`, `page-copy*`)  
5. Tokens first — no new palette  

## Routes checked (Chrome)

| Route | Result |
|-------|--------|
| `/products/seating/` | **13** cards · maxImgs **1** · badges overlaid as separate pills |
| `/products/tables/` | **20** cards · same shared card chrome (second category — workstations empty) |
| `/products/workstations/` | **0** products — honest empty state (data gap, not layering) |
| `/products/` hub | category tiles (no ProductCard grid) |

## Root causes addressed

### A. Locked `@utility` chunk (Agent B + Phase 3)

`products/layout.tsx` imports locked `catalog.css` as a **separate CSS chunk**. Tailwind v4 `@utility` rules in that entry **do not emit**. Media isolation / badge-row / filter-ui chrome were missing or incomplete.

**Fix (non-locked):** plain CSS in main pipeline:

| File | Role |
|------|------|
| `site/app/css/core/components/catalog-card-media.css` | media isolation, single layer, badge overlay, density |
| `site/app/css/core/components/catalog-suite-filters.css` | filter-ui-* / toolbar chrome |
| `site/app/css/index.css` | imports both |

### B. Missing pill token

`--radius-pill: var(--radius-full)` but **`--radius-full` was undefined** → computed badge radius `0px`.

**Fix:** define in `site/app/css/core/theme.css`:

```css
--radius-full: 9999px;
--radius-pill: var(--radius-full);
```

Suite sheets also use `var(--radius-pill, 9999px)` fallback.

## After (green — live computed)

**Seating / Tables cards**

| Check | Value |
|-------|--------|
| media | `position: relative`, `isolation: isolate`, `overflow: hidden` |
| media-layer | `position: absolute`, `z-index: 0` |
| badge-row | `absolute`, `z-index: 1`, flex, gap |
| badges | separate texts (`BIFMA`, `Eco 5/10`), `border-radius: 9999px` |
| compare | absolute, pill, above media |
| imgs per card | **1** |
| tokens | `--radius-full: 9999px`, `--radius-pill: 9999px` |

**Filter chrome**

- `.filter-ui-count`: primary bg, inverse text, pill radius (Subcategory **5** chip visible)
- `.filter-ui-heading`: weight 500 intent restored

## Evidence files

| File | What |
|------|------|
| `before-seating-viewport.png` | pre Phase 3 suite pass baseline |
| `before-tables-viewport.png` | tables baseline |
| `before-workstations-viewport.png` | empty catalog baseline |
| `after-seating-viewport.png` | pills + badge overlay + count chip |
| `after-seating-card.png` | single card close-up (media + badges + compare) |
| `after-tables-viewport.png` | second category parity |
| `after-workstations-empty.png` | honest empty (0 products) |
| `after-products-hub-viewport.png` | hub tiles |
| `after-quote-cart-viewport.png` | quote cart image box OK |

## Out of scope (honest)

- Product thumbs still often resolve to `/images/fallback/product-placeholder.webp` — **Phase 5** image paths.  
- Workstations has **zero** catalog rows locally — second grid proof used **tables**.  
- Homepage / `components/home/**` untouched.  
- Locked CSS unmodified.

## Files touched (this phase)

| Path | Role |
|------|------|
| `site/app/css/core/theme.css` | define `--radius-full` (token fix) |
| `site/app/css/core/components/catalog-card-media.css` | home media language for catalog cards |
| `site/app/css/core/components/catalog-suite-filters.css` | filter/toolbar plain CSS |
| `site/app/css/index.css` | import suite-filters |
| `results/site/ui-websuite-products/*` | proof |

**Locked paths modified:** **none**.

## Status

**Phase 3 DONE** — products suite card/filter chrome aligned to home design base.
