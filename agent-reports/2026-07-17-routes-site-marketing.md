# Site marketing route exploration

**Verdict:** PARTIAL content OK · **FAIL** SEO/infra on dev  
**Probe:** `http://localhost:3000` (dev only — not production)

## OK
- Primary marketing pages 200 with real titles: `/`, products, solutions, contact, portfolio, downloads, planner marketing
- Primary nav hrefs do not 404
- Sample PDP `/products/seating/arvo/` OK
- Bare paths 308 → trailing slash OK
- True 404 path returns 404 (dual title issue remains)

## FAIL (dev evidence)
| Issue | Evidence |
|-------|----------|
| `/robots.txt` | **404** HTML despite `robots.ts` + unit tests |
| Soft redirects | `/catalog`, `/login`, `/news`, brochure… → **200** + meta-refresh, not hard 3xx |
| Soft not-found | `/solutions/office/` → **200** not 404 |
| Dual titles | Soft shells, portal, category alias |
| `/products/category/seating/` | Wrong title + homepage canonical |
| Footer Admin link | Public chrome exposes `/admin/` |

## OPEN
- Dev auth bypass opens dashboard/portal/admin — production auth unproved
- Sitemap 123 URLs with localhost host in this env
- Analytics / Planner conversion browser proof

## Deploy
Do not ship SEO claim until **production** re-probe of robots + redirect status codes.

Artifacts: `results/site/route-probe/` (raw only).
