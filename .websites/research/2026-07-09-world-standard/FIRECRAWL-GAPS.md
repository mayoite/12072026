# Firecrawl gaps only (2026-07-09) — status

**Rule:** Ideas / feature patterns only. No competitor code, JS bundles, GLBs, logos, or UI clones.  
**MIT:** Package names → verify license on npm before install.  
**Auth:** `FIRECRAWL_API_KEY` is **User** env var (load into process: `[Environment]::GetEnvironmentVariable('FIRECRAWL_API_KEY','User')`).

## Already covered (skip re-scrape)

| Source | Path |
|--------|------|
| Planner5D deep | `D:\websites\planner5d.com\` |
| 3dplanner shallow | `D:\websites\3dplanner.com\` |
| Comparison matrix | `D:\websites\research\2026-07-09-world-standard\comparison\` |
| Canvas/UI options | `D:\websites\oando-render-options\` |

## Gap scrapes (this session)

| # | Site | Status | Raw | Inspiration report |
|---|------|--------|-----|-------------------|
| G1 | RoomSketcher | **Scraped** | `D:\websites\roomsketcher.com\raw\` | `report\INSPIRATION.md` |
| G2 | Floorplanner | **Scraped** (manual PDF OK via static/brochures URL) | `D:\websites\floorplanner.com\raw\` | `report\INSPIRATION.md` |
| G3 | Homestyler | **Scraped** (marketing heavy; some login/wrong-region noise) | `D:\websites\homestyler.com\raw\` | `report\INSPIRATION.md` |
| G4 | IKEA planners public | **Scraped** | `D:\websites\ikea.com\planner-public\raw\` | `report\INSPIRATION.md` |

## Failed / thin URLs (do not retry same)

- Old help article slugs (`/en/articles/4140…`) → 404 / template junk  
- `floorplanner.com/features` → login wall  
- Old PDF path `cdn.floorplanner.com/assets/FloorplannerManualEN.pdf` → AccessDenied  
- **Working PDF:** `cdn.floorplanner.com/static/brochures/FloorplannerManualEN.pdf`

## Out of scope

- Competitor app editors / authenticated apps / bundles  
- SmartDraw / Foyr / Coohom (optional later)  
- Re-scrape Planner5D  

## Product next (not research)

Research gaps closed enough for patterns. Ship O&O: Approach A → select/delete → orbit → symbols → save honesty → Playwright.
