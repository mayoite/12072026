# P07 / CP-07 — Draw/Place Journey — PHASE SUMMARY

| Field | Value |
|-------|--------|
| **Date** | 2026-07-10 |
| **Verdict** | **PASS** (live Playwright green + evidence on disk) |
| **Prior review** | `CODE-REVIEW-LIVE.md` FAIL → rewrite landed |
| **Spec** | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| **Helpers** | `getFurnitureCount`, `drawWallByTwoClicks` in `plannerCanvasHelpers.ts` |
| **npm** | `pnpm run test:e2e:world-standard-w1w2` (from `site/`) |
| **Evidence** | `results/planner/world-standard-wave/02-browser-open3d-journey/` |

## Gates

| Gate | Result | Proof |
|------|--------|--------|
| **W1 walls Δ** | pass | wallsBefore 0 → wallsAfterDraw 1 |
| **W1 Opening objects Δ** | pass | objectsAfterWalls 1 → objectsAfterOpening 2; `doorOrOpeningPlaced` |
| **W2 cabinet-v0** | pass | exact CTA `Add Modular Cabinet to canvas`; `includesCabinetV0: true` |
| **W2 second SKU** | pass | exact CTA `Add Executive Standing Desk to canvas`; `secondCatalogId: sample-desk-1` |
| **placePath catalog only** | pass | no `placeSeatsFromConfigurator` in journey |
| **Entry** | pass | `routeUsed: "open3d"` (primary path) |
| **Non-blank canvas** | pass | `06-canvas-2d-symbols.png` byteLength 8880 (> 5000) |
| **Storyboard 01–07** | pass | all PNGs on disk |
| **playwright-run.json** | pass | `result: pass`, `failed: 0`, gates W1/W2 |

## Product fix required for green

Empty-state card `.open3d-first-use` was intercepting canvas pointer events (wall taps no-op while Wall tool pressed). Fixed:

- `pointer-events: none` on `.open3d-first-use`
- `pointer-events: auto` on `.open3d-first-use__actions`

File: `site/app/css/core/locked/planner/workspace-open3d-route-host.css`

## Commands run

```powershell
cd D:\OandO07072026\site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
$env:NEXT_PUBLIC_PLANNER_DEV_TOOLS = "true"
pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/open3d-world-standard-journey.spec.ts --reporter=list
# → 1 passed (~6–7s)
```

Raw log: `playwright-raw.log`  
Proof JSON: `playwright-run.json`  
Phase alias: `results/planner/world-standard-wave/07-browser-journey/playwright-run.json`

## Explicit non-claims

- Not W3 (select/delete), W4 (orbit), W5 (save honesty), Fabric cutover, or systems configurator batch as place path.
- P06 residual still open after this phase.

## Files touched

- `site/tests/e2e/plannerCanvasHelpers.ts` — helpers
- `site/tests/e2e/open3d-world-standard-journey.spec.ts` — CP-07 rewrite
- `site/package.json` — `test:e2e:world-standard-w1w2`
- `site/app/css/core/locked/planner/workspace-open3d-route-host.css` — empty-state hit-test fix
