# D4 CLOSED — Marketing suite align to home

**Date:** 2026-07-10  
**Track:** Site `D4` only  
**Verdict:** **PASS**

## Scope

| Route | Role |
|-------|------|
| `/projects/` | Marketing — client roster + stats |
| `/trusted-by/` | Marketing — trust proof + roster |
| `/portfolio/` | Marketing — case mosaic |
| `/contact/` | Audit only (no layout thrash) |

**Out of scope:** Homepage, products catalog (`D3`/`D5`), locked CSS, portal (`D6`).

## Prior land (code)

| Item | Value |
|------|--------|
| Commit | `4c89431` — `fix(ui): marketing suite pages polish (non-locked, not home)` |
| Files | `projects/page.tsx`, `portfolio/page.tsx`, `trusted-by/page.tsx`, `client-badge.css` (non-locked) |
| Locked CSS | **zero** edits under `site/app/css/core/locked/**` |
| Evidence | `results/site/ui-websuite-marketing/NOTES.md`, `before/*`, `after/*` |

## Live Chrome verify (close gate)

**Base:** `http://localhost:3000`  
**Viewport:** 1440×900  
**Context:** isolated `d4-close-final`

| Route | H1 / content | Error boundary | Console errors | Overlap (main interactive) | Notes |
|-------|--------------|----------------|----------------|----------------------------|--------|
| `/projects/` | Projects + stats + client roster | **No** | **0** | **0** | Hero + KPI cards clean; badges render |
| `/trusted-by/` | Trusted by + roster (`data-testid=trusted-by-roster`) | **No** | **0** | **0** | Sector chips + client cards readable |
| `/portfolio/` | Spaces we’ve delivered. + cases 01–05 | **No** | **0** | **0** | Mosaic media non-zero, `radius: 28px` |
| `/contact/` | Contact us + form + office cards | **No** | **0** | **0** | Form present; no layout break |

### Screenshots (close)

- `results/site/ui-websuite-marketing/d4-close/projects-desktop.png`
- `results/site/ui-websuite-marketing/d4-close/trusted-by-desktop.png`
- `results/site/ui-websuite-marketing/d4-close/portfolio-desktop.png`
- `results/site/ui-websuite-marketing/d4-close/contact-desktop.png`

### Metrics already proven in land (replay)

From `NOTES.md` / `after/audit.json` (Playwright 1440 / 768 / 390):

| Metric | After |
|--------|--------|
| Projects desktop badge min W | **237** (was 178) |
| Projects mobile badge min W | **316** (was 138) |
| Portfolio mobile primary H | **~224** + radius (was ~186 sharp) |
| Broken logos / zero media / overlaps | **0 / 0 / 0** |

## Fixes on close

**None required.** Live gate matched land; no non-locked CSS/TSX patch this close.

## Residual (not D4 blockers)

| Residual | Owner track |
|----------|-------------|
| Cookie consent first-visit banner (sitewide) | shell / global — not marketing layout |
| Client logos incomplete (monograms for missing assets) | content/assets; not stacking |
| Catalog product image residual | **D5** |
| Portal real DB list | **D6** |
| Mobile re-check this session was desktop-primary; multi-viewport already in `after/*` | optional regression if pages change |

## Gate checklist

1. Align marketing suite to home language/shell — **yes** (shared header/footer, token surfaces, badge pattern)  
2. No error boundary on four routes — **PASS**  
3. No obvious stacking — **PASS**  
4. Locked CSS untouched — **PASS**  
5. Evidence under `results/site/ui-websuite-marketing/` — **PASS**

**D4 = DONE.** Do not start D5 from this close.
