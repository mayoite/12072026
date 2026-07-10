# P05 Scratch Status — Seat B eyes

**Date:** 2026-07-10  
**Seat:** B (browser prove cabinet multiprim + S7 chaise)  
**Entry:** `/planner/guest/?plannerDevTools=1`  
**E2E:** `site/tests/e2e/open3d-p05-cabinet-multiprim.spec.ts` (green)

## Gates (eyes hard bar)

| Gate | Result | Evidence |
|------|--------|----------|
| **Cabinet multiprim** | **YES** | `browser/p05-scratch-cabinet-canvas.png` |
| **S7 multipath chaise** | **YES** | `browser/p05-scratch-s7-chaise.png` |
| **Overall PASS** | **YES** | both eyes agree |

## Eye notes

### Cabinet multiprim — YES

Zoomed Modular Cabinet (`cabinet-v0`) is **not** a solid empty cream tile.

Visible multiprim structure:

- thick dark outer carcass stroke
- cream fill
- dashed vertical mid stile
- solid black handle block (lower-right on door face)
- thick front edge band

Product path: fractional inset/stroke language in `furnitureBlock2D.ts` `modularCabinetBlock` (fraction of footprint, not 6–16 mm fixed insets that collapse at plan zoom).

### S7 chaise — YES

Placed Chaise Lounge still draws published multipath SVG on plan:

- armrest, segmented seat cushions, backrest, footrest extension
- clearly multipath (not a single solid rect blob)
- cabinet multiprim still readable beside it in the same frame

## Soft metrics (not the hard bar)

From `browser/p05-scratch-run.json`:

- cabinet: `uniqueQuantized=15`, `channelStdDev≈67`, `notPureSolid=true`
- chaise: `uniqueQuantized=51`, `channelStdDev≈56`, `notPureSolid=true`
- furniture: 0 → 2

## Paint fix attempts

**0** — fractional multiprim already legible on first clean proof. No thicker-fraction product change required after eyes.

## Infra note (honest)

Mid-session turbo `.next` cache returned 404 for `/planner/guest` and `/api/planner/catalog/svg-blocks` until `.next` was cleared and dev restarted. After clean restart both routes 200 again. Not a product FAIL for multiprim/S7.

## Commands

```bash
# from site/
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm exec playwright test \
  -c config/build/playwright.config.ts \
  tests/e2e/open3d-p05-cabinet-multiprim.spec.ts --reporter=list
```
