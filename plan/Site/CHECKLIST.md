# Site checklist

**Status:** OPEN  
**Code map:** `FEATURES.md`  
**Blockers:** `../../Failures.md`  
**Notes (not proof):** `../../agent-reports/SITE.md`

## Outcome

Public commercial site: inform → discover products → qualify intent → hand off to Planner with product identity.

## Rules

- Live code wins. Unit ≠ browser. `results/` ≠ PASS.
- Status: **OPEN** · **PARTIAL** · **PASS** · **FAIL**.
- Never invent stock, price, or SKU. Demo prices never commercial authority.
- Site consumes released catalog; does not own DB-SVG cutover.

## Open now (important)

| Item | Status |
|------|--------|
| Production SEO matches current code | PARTIAL / deploy lag |
| Live catalog has released products (env) | OPEN |
| Browser Site→Planner entry (SF-08) | OPEN |
| Contact live delivery (SF-09) | OPEN |
| Browser title / SEO HTML | OPEN |

## Phases (short)

| Area | Status |
|------|--------|
| Routes / redirects / 404 | PARTIAL (unit; live OPEN) |
| SEO robots / sitemap | PARTIAL |
| Marketing layout / a11y | PARTIAL (much unit/a11y; re-verify) |
| Product discovery | PARTIAL |
| Contact / forms | PARTIAL |
| Site→Planner continuity | PARTIAL (unit; browser OPEN) |
| i18n marketing parity | PARTIAL (gate exists) |
| Analytics / consent | PARTIAL |

## Not this track

Planner canvas · Admin inventory authoring · CRM ops UI.
