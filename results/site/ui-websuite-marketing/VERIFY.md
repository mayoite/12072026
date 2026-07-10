# D4 VERIFY — Marketing suite align to home

**Track:** D4 only  
**Date:** 2026-07-10  
**Agent:** context-saver / Chrome DevTools  
**Landed polish:** `4c89431` — `fix(ui): marketing suite pages polish (non-locked, not home)`  
**Design base:** `results/site/design-base-home/` (D2)  
**CSS fence:** zero edits under `site/app/css/core/locked/**`

## Verdict

**PASS — D4 CLOSED.**  
No further code changes required for projects / portfolio / trusted-by alignment.

## Scope checked

| Route | Align to home | Result |
|-------|---------------|--------|
| `/projects/` | `HomeMarketingLayout`, `Hero`, `home-heading`, `typ-label`, `btn-*`, `client-badge-group` | **PASS** |
| `/portfolio/` | `HomeMarketingLayout`, `home-shell-xl`, `home-heading`, `page-copy`, rounded media | **PASS** |
| `/trusted-by/` | `HomeMarketingLayout`, `home-heading`, `typ-label`, `page-copy`, `client-badge-group` roster | **PASS** |
| `/contact/` | Audit-only (no layout breakage in prior after/) | **N/A for close** |

**Out of scope (not D4):** D5 catalog images, D6 portal DB, homepage redesign, locked CSS.

## Live Chrome (this pass, localhost:3000)

### `/projects/` desktop 1440×900

| Check | Value |
|-------|--------|
| Featured badges | 12 · minW **279** · maxW 279 |
| Dense badges | 49 · minW **237** · maxW 237 |
| Grid | 4-col (`client-badge-group`) |
| nameOverflow | **0** |
| Logos / monograms | 29 / 32 (lazy below-fold may incomplete mid-scroll; audit after: **brokenLogos []**) |
| Home chrome | `home-heading` 1 · `typ-label` 3 · `scheme-panel` 1 · `btn-primary` present |

Screenshot: `verify-projects-desktop.png`

### `/portfolio/` desktop 1440×900

| Check | Value |
|-------|--------|
| Cases | **5** (Titan, TVS, Usha, DMRC, Franklin Templeton) |
| Media cells | **15** · zeroMedia **0** · all `border-radius` **28px** |
| Primary sample | 714×544 · secondaries 506×266 |
| Index pad | `01`…`05` (`padStart(2,"0")`) |
| Home chrome | `home-heading` · `page-copy` · `home-shell-xl` |

Screenshot: `verify-portfolio-desktop.png`

### `/trusted-by/` desktop 1440×900

| Check | Value |
|-------|--------|
| Roster testid | `trusted-by-roster` **present** |
| Badges | **28** · minW/maxW **299** · 4-col grid |
| Logos / monograms | 13 / 15 · **brokenLogos 0** |
| nameOverflow | **0** |
| Home chrome | `home-heading` 4 · `typ-label` 9 · `page-copy` 3 |

Screenshot: `verify-trusted-by-desktop.png`

## Prior multi-viewport audit (land `4c89431`)

Source: `after/audit.json` + `after/*.png` (Playwright 1440 / 768 / 390).

| Metric | Before | After (land) | Still holds |
|--------|--------|--------------|-------------|
| Projects desktop badge min W | 178 | **237** | Live **237** (dense) / **279** (featured) |
| Projects mobile badge min W | 138 | **316** | after/audit mobile |
| Portfolio mobile primary H | ~186 | **~224** + radius | after/audit mobile primary **224** |
| Broken logos / zero media / overlaps | — | **0 / 0 / 0** | Live trusted-by broken **0**; portfolio zeroMedia **0** |

## Code alignment (no drive-by)

| File | Home-base patterns |
|------|--------------------|
| `site/app/(site)/projects/page.tsx` | `HomeMarketingLayout`, `Hero`, `typ-label`, `home-heading`, `btn-outline`/`btn-primary`, `client-badge-group` (+ dense) |
| `site/app/(site)/portfolio/page.tsx` | `HomeMarketingLayout`, `home-shell-xl`, `home-heading`, `page-copy`, `rounded-2xl` mosaic |
| `site/app/(site)/trusted-by/page.tsx` | `HomeMarketingLayout`, `Hero`, `typ-label`, `home-heading`, `page-copy`, `client-badge-group` |
| `site/app/css/core/components/client-badge.css` | Tokens (`--surface-*`, `--border-*`, `--radius-*`); **not** locked |

## Evidence index

| Path | Role |
|------|------|
| `NOTES.md` | W2 polish log + metrics |
| `before/*` · `after/*` | Multi-viewport baseline vs land |
| `after/audit.json` | Numeric audit |
| `verify-projects-desktop.png` | This verify |
| `verify-portfolio-desktop.png` | This verify |
| `verify-trusted-by-desktop.png` | This verify |

## Residual (not D4)

- Catalog product image residual → **D5**
- Portal real DB list → **D6**
- Concurrent Chrome tabs can thrash shared viewport emulation; metrics above use isolated evaluate + prior Playwright after/

**D4 status: DONE / CLOSED.**
