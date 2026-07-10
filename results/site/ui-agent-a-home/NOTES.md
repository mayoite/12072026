# UI Agent A — Homepage collection / logo layer polish

**Date:** 2026-07-10  
**URL:** http://localhost:3000/  
**Constraint:** non-locked CSS only — **zero** edits under `site/app/css/core/locked/**`

## Diagnosis (before)

Live Chrome DOM measurement at 1440×900:

| Surface | Issue |
|---------|--------|
| Collection cards | Footer + overlay both computed `z-index: 1` (footer class had `z-[2]` but non-locked `.home-collection-card__footer { z-index: 1 }` won). Layers not clearly ordered. |
| Showcase cards | No `isolation`; overlay/caption lacked explicit z-order; media class missing. |
| Footer logo marquee | **Double animation fight:** `animate-marquee` (hardcoded **30s** `marquee`) overrode locked/intended `marquee-left` + `--marquee-duration: 110s`. Measured `animationName: marquee`, duration `30s`. |
| Logo images | `w-auto` + `max-h-*` collapsed to **0×0** until load (`complete:false`); risk of empty strip / layout jump. Intrinsic-size fill not used. |

Prove targets: no stacked images · clear media/footer layers · logos not overflowing.

## Fix

### 1. One non-locked sheet
`site/app/css/core/components/home-media-layers.css`  
Imported from `site/app/css/index.css` (same pattern as `catalog-card-media.css`).

- Collection: isolation + media/overlay/footer z **0 / 1 / 2**; pin next/image fill spans
- Showcase: `.home-showcase-card__media-box` isolation + media/overlay/caption z **0 / 1 / 2**
- Marquee: `marquee-left` + `--marquee-duration`; logo `object-fit: contain` inside fixed item box

### 2. TSX (class composition)
- `Collections.tsx` — footer chrome uses CSS positioning/z; one fill image only
- `ShowcaseCarousel.tsx` — media-box wrapper + `home-showcase-card__media`
- `FooterLogoMarquee.tsx` — drop `animate-marquee`; logos use `fill` + `footer-logo-marquee__logo`
- `HomeTrustStrip.tsx` — same marquee/logo discipline (home path component)

### 3. `cards.css` (already non-locked)
- `.home-collection-card__footer { z-index: 2 }` (was 1)

## Live proof (after)

| Check | Result |
|-------|--------|
| Collection z-order | media `0` · overlay `1` · footer `2` · isolation `isolate` · **1 img/card** |
| Showcase z-order | media `0` · overlay `1` · caption `2` · isolation `isolate` · nw>0 |
| Marquee animation | `marquee-left` · **110s** (duration token honored) |
| Logos (first 8) | all `contained:true` · `overflows:false` · zero 0×0 |

## Evidence files

| File | What |
|------|------|
| `before-hero-viewport.png` / `before-collections.png` | Pre-fix homepage hero + collections |
| `after-hero-viewport.png` | Post hero |
| `after-collections.png` | Collection cards — media + footer chrome |
| `after-showcase.png` | DMRC / Titan / TVS layered captions |
| `after-logo-marquee.png` | Trust logo strip contained |
| `after-full.png` | Full homepage after |
| `before-full-misnav-seating.png` | Accidental products/seating capture (shared Chrome tab noise) — ignore |

## Files touched (no locked)

- `site/app/css/core/components/home-media-layers.css` **(new)**
- `site/app/css/index.css`
- `site/app/css/core/components/cards.css`
- `site/components/home/Collections.tsx`
- `site/components/home/ShowcaseCarousel.tsx`
- `site/components/home/HomeTrustStrip.tsx`
- `site/components/site/FooterLogoMarquee.tsx`
- `results/site/ui-agent-a-home/*`

## Out of scope (not touched)

- `site/app/css/core/locked/**`
- open3d planner canvas
- products catalog grid (Agent B)
