# UI Agent W1 — Products suite grid polish (not homepage)

**Date:** 2026-07-10  
**Surface:** `/products/*` catalog suite only  
**Constraint:** zero edits under `site/app/css/core/locked/**`  
**Out of scope:** homepage `/`, `components/home/**`, open3d planner, locked CSS

## Live routes checked (Chrome, isolated context `ui-agent-w1-products`)

| Route | Grid / media result |
|-------|---------------------|
| `/products/seating/` | 13 cards · maxImgs **1** · badges overlaid |
| `/products/tables/` | 20 cards · maxImgs **1** · badges overlaid |
| `/products/workstations/` | empty catalog (0 products — data, not layering) |
| `/products/` hub | category tiles present (no ProductCard grid) |
| `/quote-cart/` | image box `position:relative` + single `absolute` img — OK |

## Before (suite gaps after Agent B media fix)

Card media layering was already green on seating (prior land `23a697b`):

- `.catalog-card__media` → `relative` / `isolate` / `hidden`
- `.catalog-card__media-layer` → `absolute` z-0
- badge-row absolute z-1 · BIFMA / Eco separate left offsets
- `maxImgs` per card = 1

**Still broken on live pass (same locked `@utility` chunk bug):**

| Selector | Expected | Actual before W1 |
|----------|----------|------------------|
| `.filter-ui-heading` | weight 500, strong color | weight 400, no intent |
| `.filter-ui-count` | primary pill chip | unstyled text / transparent |
| badge / compare radius | pill | `0px` — theme `--radius-pill` → missing `--radius-full` |

Evidence: `before-seating-viewport.png`, `before-tables-viewport.png`, `before-workstations-viewport.png` (empty data).

## Fix (non-locked only)

1. **`site/app/css/core/components/catalog-suite-filters.css`** (new)  
   Plain CSS for filter-ui-label / heading / count, sticky toolbar, filter shell, empty/summary bands. Imported via main pipeline.

2. **`site/app/css/core/components/catalog-card-media.css`** (extend)  
   - Badge / signal `white-space` + ellipsis density  
   - `border-radius: var(--radius-pill, 9999px)` fallback (theme chain broken)  
   - Compare pill fallback  
   - Footer / quote-btn density

3. **`site/app/css/index.css`**  
   `@import "./core/components/catalog-suite-filters.css";`

No TSX structure change required (media-layer wrapper already present from Agent B).

## After (green — computed Chrome)

**Seating / Tables cards**

- media: `position: relative`, `isolation: isolate`, `overflow: hidden`, aspect `1 / 1` compact  
- layer: `position: absolute`, `z-index: 0`  
- badge-row: absolute, z-1, flex, gap 8px  
- badges: separate pills, `border-radius: 9999px`, nowrap  
- compare: absolute z-10, pill radius  
- maxImgs: **1**

**Filter chrome**

- `.filter-ui-count`: primary bg, inverse text, `border-radius: 9999px`, padding 2×6  
- `.filter-ui-heading`: font-weight 500  

Evidence:

- `after-seating-viewport.png` — Subcategory count pill; BIFMA/Eco over image; Compare top-right  
- `after-tables-viewport.png` — same shared grid chrome  
- `after-products-hub-viewport.png` — hub category tiles  
- `after-quote-cart-viewport.png` — single image box OK (no CSS change)

## Out of scope (honest)

- Product image assets still often resolve to placeholder (data/path — not this UI layer).  
- Workstations category has zero products in local catalog.  
- Theme missing `--radius-full` is a global token debt; W1 only falls back on suite sheets, did not edit `theme.css` (fence prefers tokens; fallback is local).  
- Homepage / home components untouched.

## Files touched

| Path | Role |
|------|------|
| `site/app/css/core/components/catalog-suite-filters.css` | non-locked filter/toolbar utilities |
| `site/app/css/core/components/catalog-card-media.css` | pill fallback + density |
| `site/app/css/index.css` | import suite-filters |
| `results/site/ui-websuite-products/*` | proof |

**Locked paths modified:** **none** (asserted).
