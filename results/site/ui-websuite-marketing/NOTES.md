# Phase 4 — Marketing suite align to home design base

**Date:** 2026-07-10  
**Scope:** `/projects/`, `/trusted-by/`, `/portfolio/`  
**Design base:** `results/site/design-base-home/` (Phase 2)  
**Constraint:** zero edits under `site/app/css/core/locked/**`  
**Out of scope:** homepage polish, products grid (Phase 3), open3d, locked CSS

## Goal

Align marketing suite pages to homepage visual system:

1. `typ-*` / `home-heading` / `page-copy*` type utilities  
2. Shell spacing (`home-shell-xl`, `HomeSection`, section borders)  
3. Card / media isolation (portfolio mosaic + client-badge mark)  
4. Readable grids (`client-badge-group`, never 6-col crush)  
5. Buttons `btn-*` where CTAs appear  

Not a redesign — class/language alignment only.

## Before (prior polish + residual gaps)

Earlier W2 polish (`4c89431`) fixed badge grid crush + portfolio mobile mosaic height. Residual vs home design base:

| Surface | Gap |
|---------|-----|
| `/projects/` | KPI cards used ad-hoc `scheme-panel-soft` + `stats-block` chrome, not home `home-trust-kpi` + `typ-label` |
| `/trusted-by/` | Stats labels via `stats-block__label` (body-size tracking) vs home `typ-label` |
| `/portfolio/` | Media cells lacked `isolation: isolate` / single-layer pin; index used raw bronze color; CTA custom border button not `btn-primary`; not on `HomeSection` |
| Shared | `EditorialCta` / `EditorialArrowLink` off home button/type language |

## Fixes (this phase)

### 1. `projects/page.tsx`
- KPI row → `home-trust-kpi home-trust-kpi--light` + `typ-stat text-primary` + `typ-label`
- As-of → `typ-caption text-muted`
- Drop legacy `stats-block` wrapper
- Keep `client-badge-group` / dense + `btn-outline` / `btn-primary`

### 2. `trusted-by/page.tsx`
- Stats tiles → `home-trust-kpi` + `typ-stat` / `typ-label`
- Hero media: `!scale-100` + overlay/content spacing (parity with projects)
- Roster stays `client-badge-group` + `data-testid="trusted-by-roster"`

### 3. `portfolio/page.tsx`
- Cases inside `HomeSection` + `HomeSectionInner` (home shell spacing)
- Index → `typ-label text-brand`; location → `typ-body-sm text-muted`
- Media class `portfolio-case__img` for layer pin

### 4. `EditorialRoute.tsx` (shared marketing editorial)
- Borders → `border-theme-soft`
- Arrow link → `typ-label` + `text-brand`
- CTA → `btn-primary` (home button language)

### 5. Non-locked CSS
| File | Role |
|------|------|
| `site/app/css/core/components/portfolio-media.css` | isolation + single image layer for mosaic cells |
| `site/app/css/core/components/client-badge.css` | mark `isolation: isolate` |
| `site/app/css/index.css` | import `portfolio-media.css` |

## After (live computed — Playwright headless)

Source: `phase4-audit.json` · viewports 1440×900 + 390×844

| Route | Check | Result |
|-------|--------|--------|
| `/projects/` | trust KPIs | **3** · `typ-stat` **3** · `typ-label` **5** |
| `/projects/` | badge min W | desktop **237** · mobile **316** · 4-col / 5-col dense |
| `/projects/` | logos | 29 logos · 32 monograms · **0 broken** |
| `/projects/` | legacy `stats-block` | **0** |
| `/projects/` | mark isolation | **isolate** |
| `/trusted-by/` | trust KPIs | **4** · roster badges **28** · min W **299** · **0 broken** |
| `/portfolio/` | cases | **5** |
| `/portfolio/` | media isolation | **all cells `isolation: isolate`**, overflow hidden, **1 img each** |
| `/portfolio/` | mobile primary H | **224** (readable) |
| `/portfolio/` | CTA | `btn-primary` present |

## Evidence files

| Path | What |
|------|------|
| `phase4-before-projects-viewport.png` | pre Phase 4 projects viewport |
| `phase4-after-projects-viewport.png` | after projects (home-trust-kpi + badges) |
| `phase4-after-trusted-by-viewport.png` | after trusted-by |
| `phase4-after-portfolio-viewport.png` | after portfolio mosaic |
| `after/{projects,trusted-by,portfolio}-{desktop,mid,mobile}.png` | full/mid/mobile |
| `phase4-audit.json` | computed metrics |
| `phase4-verify.mjs` | repro script |

## Files touched

- `site/app/(site)/projects/page.tsx`
- `site/app/(site)/trusted-by/page.tsx`
- `site/app/(site)/portfolio/page.tsx`
- `site/components/site/EditorialRoute.tsx`
- `site/app/css/core/components/portfolio-media.css` *(new, non-locked)*
- `site/app/css/core/components/client-badge.css`
- `site/app/css/index.css`
- `results/site/ui-websuite-marketing/**`

**Locked paths modified:** **none**.

## Unit

`pnpm exec vitest run tests/unit/app/(site)/projects/page.test.tsx` → **pass**

## Status

**Phase 4 DONE** — marketing suite pages aligned to home design base (type, shell, media isolation, readable grids).
