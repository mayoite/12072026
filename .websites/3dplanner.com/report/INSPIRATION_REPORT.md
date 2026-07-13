# 3dplanner.com — Crawl / Inspiration Report

**Source:** Firecrawl only (scrape, map, search, interact).  
**Date:** 2026-07-09  
**Purpose:** Check crawlability; extract product/UX/tech inspiration if any.  
**Raw evidence:** `D:\websites\3dplanner.com\raw\`

---

## Verdict

| Check | Result |
|-------|--------|
| Crawlable via Firecrawl API? | **Yes** (HTTP 200, content returned) |
| Is it a product site? | **No** |
| Useful for features / UX / tech inspiration? | **No** |
| Recommendation | **Skip.** Pick a live product domain next. |

### What the site actually is
After cookie wall content, the page is a **HugeDomains parking / domain-for-sale** listing:

- **Domain:** 3dPlanner.com  
- **Listed price:** $8,295 (or payment plan ~$345.63/mo × 24)  
- **Vendor UI:** hugedomains.com shopping cart / payment-plan flows  
- **No** floor-plan editor, catalog, pricing tiers, or app shell  

Confirmed in: `raw/3dplanner.com.md`, `raw/3dplanner.com-en.md`, `raw/3dplanner.com-pricing.md` (same parking content).

---

## Firecrawl attempts

| Action | Result |
|--------|--------|
| `map` | Essentially only root URL (`map.json` tiny) |
| `scrape` homepage | CookieYes consent + later HugeDomains sale page |
| `scrape` /en, /pricing | Same domain-sale content |
| `interact` (accept cookies) | Session reported empty / nothing actionable |
| `search` “3dplanner.com …” | Unrelated products (Houzz, Remplanner, My3DPlanner, Planner5D) |

### Tech signals on parking page only
- CookieYes consent  
- Cloudflare bot cookie (`__cf_bm`)  
- Google Analytics / gtag  
- YouTube / DoubleClick / StatCounter cookies  
- `static.hugedomains.com` assets  

**None of this is floor-planner product tech.**

---

## Search near-misses (for next crawl pick)

Firecrawl search surfaced **other live products** when querying around this name — candidates if you want a second real competitor:

| Site | Note |
|------|------|
| https://planner5d.com/ | Already reported (strong crawl) |
| https://www.my3dplanner.com/en/ | Free 2D/3D interior tool (name similarity) |
| https://remplanner.com/ | Online 3D interior planner |
| Houzz Pro 3D floor plan | Different product family |

---

## Inspiration takeaway

**Zero product inspiration from 3dplanner.com.**  
Domain name is generic and parked; do not treat as a competitor.

### Suggested next 2nd site (when you continue)
Pick one crawlable live product, e.g.:
1. **my3dplanner.com**  
2. **remplanner.com**  
3. **floorplanner.com** / **roomstyler.com** / **smartdraw.com**

Output layout stays: `D:\websites\<domain>\raw\` + `D:\websites\<domain>\report\`.

---

## Evidence index

| File | Notes |
|------|-------|
| `raw/home.md` | Cookie banner heavy |
| `raw/3dplanner.com.md` | Full domain-sale page |
| `raw/3dplanner.com-en.md` | Same |
| `raw/3dplanner.com-pricing.md` | Same |
| `raw/map.json` | Minimal |
| `raw/search.json` | Off-target product hits |
| `raw/interact-home.json` | Interact failed / empty page |
