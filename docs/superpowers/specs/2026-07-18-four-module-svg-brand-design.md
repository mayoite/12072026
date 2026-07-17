# Design: Four-module product quality — SVG branding as primary weak link

**Date:** 2026-07-18  
**Modules:** Admin · Planner · Site · TechStack  
**Verdict today:** Functional spine exists; **branded plan SVG inventory is the ceiling** on product score (~7.5–8, not 8.5).

## Problem statement

| Surface | Strength | Weakness |
|---|---|---|
| **Admin** | Publish pipeline, dual-write readiness, disk inventory | Symbols look generic; no brand series identity; dual-write publish not yet operational proof |
| **Planner** | Canvas, underlay, Help, guest diet, BOQ honesty | Plan symbols abstract; Block2D fallback; catalog ≠ Oando marketing line |
| **Site** | Hero guest CTA, PDP Design in Planner | Continuity stamps product but canvas shows unrelated plan kit; branding photos ≠ plan symbols |
| **TechStack** | Migrations, R2, env gates | Cutover OPEN; authority still disk |

**Brutal:** Marketing has 100+ product images. Planner has ~20 OFL-* geometric symbols. Guests feel “cheap CAD,” not “Oando inventory.”

## Goal

One coherent **SVG brand system** across all four modules:

1. **Admin** authors and publishes **branded plan SVGs** (name, SKU, family, footprint).  
2. **TechStack** dual-write + optional DB authority after proof.  
3. **Planner** places those symbols as primary paint.  
4. **Site** deep-links product → same slug/symbol in guest planner.

## Non-goals (this program)

- Photoreal 3D for every SKU first  
- Cloud autosave  
- Fake commercial ERP prices  

## Approaches

| # | Approach | Trade-off |
|---|---|---|
| A | Polish chrome only | Caps score; SVG stays weak |
| B | **Brand SVG program (30 heroes) + dual-write proof + site join** | Highest ROI to 8.5 |
| C | Full catalog 200 SKUs immediately | Slow; quality drops |

**Recommend B.**

## Module design

### Admin (inventory factory)

- Top 30 hero products: real **name + SKU + series** (Deskpro / Curvivo / etc. from marketing folders where known).  
- Each: descriptor + multi-path plan SVG (union multiprim or fixed maker recipes with Y-down).  
- Publish via pipeline → disk + dual-write when enabled.  
- Lifecycle: retire generic seed leftovers from buyer view.  
- UI: preview = **same SVG** Planner paints (UI-CAT-04).

### Planner (buyer canvas)

- Inventory primary source: published plan symbols with brand names.  
- Paint: SVG primary; Block2D only miss.  
- Guest: first 60s place **named** product, not “sample desk.”  
- BOQ lines carry real SKU/name.  
- siteProduct continuity: highlight/focus matching catalog slug when present.

### Site (brand front door)

- Collections / PDP imagery stay marketing photos.  
- **Design in Planner** always carries `siteProduct` → guest banner + inventory focus.  
- Optional: plan SVG thumb next to photo on PDP when published.  
- Trust: no “real inventory” claim unless placeable brand SKUs exist.

### TechStack (trust plumbing)

- Step 1: dual-write publish proof script + Admin publish of hero SKUs.  
- Step 2: svg-blocks serves `/api/planner/catalog/svg/{revisionId}`; canvas loads it.  
- Step 3: only then `SVG_RELEASE_AUTHORITY=db` on preview → prod.  
- Never flip without (1)+(2).

## Success bar (8.5)

| Check | Pass |
|---|---|
| 30 brand-named placeable plan SVGs | Guest inventory |
| Publish dual-write for ≥1 hero with pointer | Products DB + R2 |
| svg-blocks revision URL paints | Browser |
| PDP product → same name on canvas path | Continuity |
| BOQ lists brand SKU/name | Download/review |
| Failures.md cutover OPEN until flip proof | Honesty |

## Phasing

1. **P0 TechStack:** dual-write publish proof (this session).  
2. **P0 Admin+SVG:** rebrand/expand top plan symbols (names, families, fix weak multiprim).  
3. **P1 Planner:** inventory + BOQ identity; siteProduct focus.  
4. **P1 Site:** PDP plan thumb + continuity polish.  
5. **P2 TechStack:** cutover flip after multi-SKU dual-write green.
