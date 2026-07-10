# Homepage a11y audit — NOTES

**URL:** `http://localhost:3000/`  
**Date:** 2026-07-10  
**Device:** desktop (Chrome DevTools MCP Lighthouse)

## Scores

| Run | Accessibility | Best Practices | SEO | Agentic |
|-----|---------------|----------------|-----|---------|
| **Before fixes** | **97** | 96 | 100 | 100 |
| **After fixes** | **100** | 96 | 100 | 100 |

Reports: `report.json`, `report.html` (overwritten by post-fix run).

## Chrome issues (`list_console_messages` types=issue)

None reported (with preserved messages).

## Top issues (before)

### 1. Color contrast — FIXED
- **Audit:** `color-contrast` score 0
- **Element:** `label[for="locale-switcher"]` (“Select Language”)
- **Problem:** `text-body` (`#1b2940`) on footer inverse bg (`#070d12`) → **1.33:1** (need 4.5:1)
- **Fix:** `site/components/site/LanguageSwitcher.tsx` — `text-body` → `text-inverse-muted`
- **Verify:** post-fix computed contrast **~13.15:1** (AA pass)

### 2. Label / accessible name mismatch — FIXED
- **Audit:** `label-content-name-mismatch` score 0
- **Element:** `a.home-tools-floor-demo` (InteractiveTools / PlannerToolsShowcase)
- **Problem:** Visible caption “Example layout · 10 × 8 m · true-scale floor plan” not included in `aria-label` “Open Oando Planner — example 10 by 8 metre office floor plan”
- **Fix:** `site/features/planner/landing/PlannerToolsShowcase.tsx` — default `demoAriaLabel` includes the full visible caption + action
- **Verify:** a11y tree name is now “Example layout · 10 × 8 m · true-scale floor plan — open Oando Planner”

### 3. Console / image network errors — DEFERRED (not a11y score)
- **Audit:** `errors-in-console` (Best Practices)
- **Cause:** `_next/image` **400** for missing/bad assets:
  - `/images/catalog/oando-seating--fluid-x/image-01.webp`
  - `/images/products/meeting-table-10pax.webp`
  - `/images/products/softseating-solace-1.webp`
  - `/images/products/chair-cafeteria.webp`
- Out of a11y fix scope (asset pipeline / catalog images). Alts exist; names OK.

## Semantics / forms / keyboard (manual)

| Check | Result |
|-------|--------|
| `lang` | `en-IN` |
| `title` | present |
| Skip link | `Skip to main content` → `#main-content` |
| Landmarks | `banner` / `nav` / `main#main-content` / `contentinfo` |
| H1 | single: “Spaces that work as hard as your team” |
| Heading hierarchy | h1 → h2 → h3, no level skips |
| Partnership banner | **absent** (as expected) |
| ContactTeaser inputs | all labeled (name/city/phone/email/brief); none orphaned |
| Empty buttons / missing alt | none |
| First tab targets | Skip → logo → Products → nav links (logical) |
| Focus traps (home static) | none observed |

## Residual / deferred polish (not LH a11y fails)

1. **Broken collection images (400)** — catalog/product webp paths; BP 96 residual.
2. **Duplicate accessible names on category/project cards** — e.g. link name “Seating Seating” (img alt + h3). Screen-reader redundancy; fix by decorative alt or `aria-labelledby` on cards later.
3. **Small hit targets** (web.dev 48×48 guidance; not in LH a11y score here):
   - Footer social icons ~16×16
   - Showcase prev/next ~20×20
   - Some footer/text links short height (line-box)
4. **Cookie banner** can intercept first focus on cold load (dialog) — expected consent pattern; dismiss before a11y keyboard runs when testing.

## Files changed

- `site/components/site/LanguageSwitcher.tsx`
- `site/features/planner/landing/PlannerToolsShowcase.tsx`

## Evidence files

- `report.json` / `report.html` — Lighthouse post-fix (a11y 100)
- `a11y-tree.txt` — pre-fix snapshot dump
- `home-viewport.png` — hero viewport
- `footer-locale-after.png` — post-nav screenshot
- `SNAPSHOT-summary.md` — landmarks / headings
- `NOTES.md` — this file
