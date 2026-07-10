# UI Agent B — Seating product grid image layering

**Surface:** `http://localhost:3000/products/seating/`  
**Date:** 2026-07-10  
**Constraint:** zero edits under `site/app/css/core/locked/**`

## Before (broken)

DOM proof on product cards:

| Selector | Expected (locked intent) | Actual |
|----------|--------------------------|--------|
| `.catalog-card__media` | `position: relative`, `isolation: isolate`, `overflow: hidden` | `static` / `auto` / `visible` |
| `.catalog-card__badge-row` | `position: absolute`, `z-index: 1` | `static` / `auto` |
| Badges | separate pills over image | flow text jammed as `BIFMAEco 5/10` |

**Root cause:** `products/layout.tsx` imports locked `catalog.css` as a **separate CSS chunk**. In that entry, Tailwind v4 `@utility catalog-card__media` (and badge/body utilities) **do not emit**. Only plain selectors from the locked file appear (e.g. compact aspect-ratio, z-index on `> img`). Media box isolation never applied, so badges sat in flow and image retries could stack.

Evidence:

- `before-viewport.png` / `before-seating-grid.png` — badges not overlaid; jammed labels

## Fix (non-locked only)

1. **`site/app/css/core/components/catalog-card-media.css`** (new)  
   Plain CSS re-applies media isolation, single image layer, badge overlay, body/signal compact spacing. Imported via main pipeline (`app/css/index.css`), not locked.

2. **`site/app/css/index.css`**  
   `@import "./core/components/catalog-card-media.css";`

3. **`FilterGrid.components.tsx`**  
   Wrap `next/image` in `.catalog-card__media-layer`; keep `key={imgSrc}` for error-candidate remounts (one image node).

## After (green)

Computed styles (live Chrome):

- media: `position: relative`, `isolation: isolate`, `overflow: hidden`
- layer: `position: absolute`, `z-index: 0`
- badge-row: `position: absolute`, `z-index: 1`, `display: flex`, `gap: 8px`
- badges separate: BIFMA + Eco 5/10 at distinct left offsets
- `maxImgs` per card: **1**

Evidence:

- `after-seating-grid.png` — BIFMA / Eco pills over image; compare top-right; one chair image

## Out of scope (honest)

- All seating thumbs currently resolve to `/images/fallback/product-placeholder.webp` (asset/path data — not this UI layering task).
- Homepage (Agent A), open3d locked styles, catalog backend.

## Files touched

| Path | Role |
|------|------|
| `site/app/css/core/components/catalog-card-media.css` | non-locked media/badge layering |
| `site/app/css/index.css` | import new sheet |
| `site/app/(site)/products/[category]/FilterGrid.components.tsx` | media-layer wrapper + keep `key={imgSrc}` |
| `results/site/ui-agent-b-seating/*` | proof |

**Locked files modified:** none.
