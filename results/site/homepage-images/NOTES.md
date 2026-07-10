# Homepage product/collection images — diagnosis & fix

**Agent:** HOME-IMG-1  
**Date:** 2026-07-10  
**URL:** http://localhost:3000/

## Root cause

`HOMEPAGE_COLLECTIONS_CONTENT` in `site/lib/site-data/homepage.ts` pointed at **paths that do not exist under `site/public/`**.  
`Collections.tsx` passes those strings straight into `next/image` (no `normalizeAssetPath`), so the optimizer returned **400** and cards rendered empty (`naturalWidth === 0`).

### Broken → why

| Category | Broken path | Why missing |
|----------|-------------|-------------|
| Seating | `/images/catalog/oando-seating--fluid-x/image-01.webp` | Folder has `image-1.webp` (and `image-2.jpg`…), **not** zero-padded `image-01.webp` |
| Tables | `/images/products/meeting-table-10pax.webp` | No top-level `public/images/products/*.webp` marketing files |
| Soft Seating | `/images/products/softseating-solace-1.webp` | Same — path not on disk |
| Education | `/images/products/chair-cafeteria.webp` | Same — path not on disk |

Already OK: Workstations (`deskpro/image-1.jpg`), Storage (`metal-storages/image-1.jpg`), Showcase project heroes, hero, logos.

**Not** an AFC branding issue. **Not** CDN/`NEXT_PUBLIC_ASSET_BASE_URL` in this local check — pure missing local public files / wrong filenames.

## Fix (minimal)

Point homepage copy at **existing catalog assets**:

| Category | Restored path |
|----------|----------------|
| Seating | `/images/catalog/oando-seating--fluid-x/image-1.webp` |
| Tables | `/images/catalog/oando-tables--curvivo-meet/image-1.jpg` |
| Soft Seating | `/images/catalog/oando-soft-seating--accent/image-1.jpg` |
| Education | `/images/catalog/oando-educational--academia/image-1.jpg` |

Also aligned `HOMEPAGE_SOLUTIONS_CONTENT` capabilities images and `FeaturedCarousel` Fluid X path (`image-1.jpg` → `image-1.webp`).

## Files changed

- `site/lib/site-data/homepage.ts`
- `site/components/home/FeaturedCarousel.tsx`

## Evidence

- `before-full.png` — pre-fix full page (broken collection cards)
- `after-full.png` — post-fix full page
- `network-fails.md` — 400 list before; 200/304 collection set after

## Live verification (Chrome DevTools)

After reload, all six collection alts loaded with `naturalWidth > 0`; no 400s on collection image URLs. Showcase DMRC/Titan/TVS OK after scroll.

## Residual (out of this slice)

Catalog JSON / `localCatalogIndex.json` still reference many `image-01.webp` names that may not exist on disk; product listing pages may need the same path discipline or a zero-pad resolver in `normalizeAssetPath`. Homepage collections no longer depend on those.
