# Phase 1 — Route Inventory Matrix

## Purpose

Measure each route against **homepage (`/`) and solutions template** — not against legal `shell-card` pages.

## Reference rows (golden)

| path | role |
|------|------|
| `/` | Primary visual reference |
| `/solutions` | Inner-page reference (`Hero` + `home-section--*`) |

## Matrix columns

| Column | Values |
|--------|--------|
| `path` | URL |
| `homepage_gap` | free text: differs from `/` or `solutions` how |
| `homepage_fidelity` | 0–5 score vs `/` (wrapper, hero, sections, container, type) |
| `dialect` | `homepage` \| `solutions-like` \| `legal-shell` \| … |
| `wrapper` | `overflow-x-hidden` \| `scheme-page` \| other |
| `hero` | `HomepageHero` \| `Hero` \| `none` |
| `sections` | `home-section--*` \| `shell-card` \| `mixed` |
| `container` | `home-shell-xl` \| `shell-container` \| other |
| `copy_source` | `homepage.ts` \| `routeCopy.ts` \| `inline` |
| `layout_root` | `site` \| `planner` \| `offline` |

**Target:** all marketing rows → `dialect=homepage` or `solutions-like`, `wrapper=overflow-x-hidden`, `sections=home-section--*`, `container=home-shell-xl`.

## Deliverables

- `site/results/site-ui/route-matrix.csv`
- `site/scripts/generate-site-ui-route-matrix.mjs`

## Acceptance Checklist

- [x] Golden rows for `/` and `/solutions` documented first.
- [x] Every `(site)` route scored vs homepage.
- [x] Count of `legal-shell` / `scheme-page` rows = migration backlog size.

**Latest run (2026-06-30):** 43 `(site)` routes; 1 `solutions-like`; 9 `legal-shell`; 13 `scheme-page`; migration backlog **22** marketing rows (`legal-shell` + `scheme-page` on `layout_root=site`).
