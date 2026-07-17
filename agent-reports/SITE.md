# Site — status

**Date:** 2026-07-17  
**Deploy SEO:** **PASS on local dev** after fixes; **production re-probe OPEN**  
**Plans:** `plan/Site/COMPLETION-CONTRACT.md` · `FEATURES.md` · `docs/architecture/09-SITE-UI-BENCHMARK.md`

## Scope
Public marketing, catalog discovery, contact, Site→Planner entry, SEO

## Fixed (dev, after restart)
| Item | Result |
|------|--------|
| `/robots.txt` | 200 (`app/robots.ts`) |
| `/sitemap.xml` | 200 |
| Hard redirects (catalog, login, news, brochure…) | 308 |
| Unknown `/solutions/…` | real 404 |
| Footer public Admin link | removed |
| Legacy `/products/category/:slug` | 308 → canonical category |

## Viewports
| Report | Result |
|--------|--------|
| 4 VP (1920 / 1440 / 390 / 360) marketing | no H-overflow (STATUS run) |
| 6 VP (1880→440) marketing + guest + admin | no H-overflow (perf report) |

## Open
- Production host in robots/sitemap (not localhost)
- Live contact form + analytics proof
- Planner entry param continuity browser
- Full `pnpm run test` / build not claimed here

## Bar
Dev SEO pass ≠ production SEO pass.
