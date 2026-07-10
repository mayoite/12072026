# Homepage media VERIFY — HOME-IMG-2

**Agent:** HOME-IMG-2 (Chrome DevTools independent pass)  
**Date:** 2026-07-10  
**URL:** http://localhost:3000/  
**Depends on:** HOME-IMG-1 land `04fd130` (`fix(home): restore homepage product images`)

## Method

1. Dev server live (`HTTP 200` on `/`).
2. Chrome DevTools: navigate `http://localhost:3000/`, soft/hard reload (`ignoreCache`).
3. `list_network_requests` resourceTypes=`image` — no 4xx on product/hero/project/logo assets.
4. DOM check: all six Collections `<img>` have `naturalWidth > 0`.
5. HEAD probe of 33 homepage surface assets (hero ×6, collections ×6, showcase ×3, client logos ×18) → **0 non-OK**.
6. Console errors for failed resources: **none** after fix land.

## Surfaces checked

| Surface | Component / data | Result |
|---------|------------------|--------|
| Hero | `HomepageHero` + `HOMEPAGE_HERO_IMAGES` | First slide `dmrc-hero.webp` 200/304; all 6 hero files exist on disk |
| Collections | `Collections` + `HOMEPAGE_COLLECTIONS_CONTENT` | 6/6 images load (`nw>0`); paths post-IMG-1 |
| Trust KPIs | `TrustStrip` (stats only) | N/A images |
| Client logos | Footer `FooterLogoMarquee` + `HOMEPAGE_TRUST_CONTENT.logos` | 18/18 files on disk; network 200/304 for loaded logos |
| Showcase | `ShowcaseCarousel` + `HOMEPAGE_SHOWCASE_CONTENT` | DMRC / Titan / TVS `hero.webp` 200/304 |
| Residual non-home | `FeaturedCarousel`, `CollaborationSection` | Not mounted on `/` — not in this 404 count |

## Product / media 404 count (homepage)

| Bucket | Failed (4xx / `nw===0`) | Notes |
|--------|-------------------------|-------|
| Collections product imgs | **0** | Was 4× 400 before IMG-1 |
| Hero media | **0** | |
| Showcase project imgs | **0** | |
| Client logos | **0** | |

**Remaining product-image 404s on homepage: 0**

## Collections naturalWidth (post soft-reload)

| Alt | Path | naturalWidth |
|-----|------|--------------|
| Seating | `/images/catalog/oando-seating--fluid-x/image-1.webp` | 480 |
| Workstations | `/images/catalog/oando-workstations--deskpro/image-1.jpg` | 480 |
| Tables | `/images/catalog/oando-tables--curvivo-meet/image-1.jpg` | 480 |
| Storage | `/images/catalog/oando-storage--metal-storages/image-1.jpg` | 480 |
| Soft Seating | `/images/catalog/oando-soft-seating--accent/image-1.jpg` | 480 |
| Education | `/images/catalog/oando-educational--academia/image-1.jpg` | 480 |

## Network image sample (post reload)

All observed image requests: **200 or 304** — no 400/404 for product/hero/project/logo URLs.

## Screenshots (this agent)

| File | What |
|------|------|
| `collections-with-images.png` | Collections grid with six product images visible |
| `collections-grid.png` | Collections viewport capture |
| `showcase-carousel.png` | Showcase DMRC/Titan/TVS cards |
| `hero-viewport.png` | Hero viewport |
| (IMG-1) `before-full.png` / `after-full.png` | Pre/post fix full page |
| (IMG-1) `NOTES.md` / `network-fails.md` | Root cause + before fails |

## Code changes by HOME-IMG-2

**None required** for homepage residuals after IMG-1. Showcase / Trust logos / hero already green.  
Coordination: did not thrash Collections paths in `homepage.ts` after IMG-1 owned that file.

## Residual outside homepage (not blocking this goal)

- `CollaborationSection` still references `/images/hero/tvs-patna-hq.webp` (missing; use `tvs-patna-enhanced.webp` or `tvs-patna-hero.webp`) — **not on** `app/(site)/page.tsx`.
- Catalog JSON may still use zero-padded `image-01.webp` names on product listing pages (IMG-1 residual note).

## Verdict

**PASS** — homepage product images load; remaining product-img 404 count = **0**.
