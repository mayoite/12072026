# P04 / W4 — NOTES-BROWSER (Playwright seat)

**Date:** 2026-07-10  
**Seat:** P04 Playwright — browser W4 re-prove  
**Prove tip (at run):** `bb0531685e7e714acb6026d0afcb214ba6e68f7a`  
**Trustdata commit:** `6c236ac66883dd62cc0355c277e86ec22ebafcf1`  
**Spec:** `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`  
**Server:** `PLAYWRIGHT_BASE_URL=http://localhost:3000` (reuse existing dev; fabric **unset**)

## Command

```powershell
cd site
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -EA SilentlyContinue
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=list
```

## Result

| Item | Value |
|------|--------|
| Exit | **0** |
| Tests | **1 passed** (7.1s / 8.3s wall) |
| Raw log | `browser-w4-raw.log` |
| Machine deposit | `browser-run.json` (`status: browser-green`) |
| PNGs | `01-2d-after-place.png`, `02-3d-orbit-on.png`, `03-2d-restored.png` |
| Fabric | unset (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` not `"1"`) |

## What the browser **asserts** (count / orbit attr) — H3

| Assert | How | Honesty |
|--------|-----|---------|
| Place +4 furniture | Status-text `(\d+)\s+furniture` after `placeSeatsFromConfigurator(page, 4)` | **Count only** — not entity UUIDs |
| 3D shell up | `getByTestId("planner-3d-canvas")` visible | Presence, not mesh fidelity |
| Orbit enabled | `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` | **DOM attr** — not camera pose math |
| Optional drag | light left-drag; canvas still visible | No-crash smoke |
| 2D↔3D round-trip | furniture count remains `afterPlace` | **Count continuity** — not id/mm/rotation |
| Console | hard app errors filtered; `consoleErrorCount: 0` | Not a full empty-console hard assert |

Live `browser-run.json`:

- `furnitureBefore: 0` → `furnitureAfterPlace: 4` → after toggle still **4**
- `orbitEnabled: true`
- `browserDoesNotProve: ["entity-ids","mm-position","document-rotation-degrees"]`
- H3 honesty note written into run JSON

## What the browser **does not** prove (CODE-REVIEW-REPORT H3)

| Not asserted | Lives in |
|--------------|----------|
| Entity **ids** across 2D↔3D | Unit: `poseContinuityW4` |
| **mm** position continuity | Unit / scene-node adapters |
| Document **rotation** degrees | Unit pose packs |
| Three.js camera orbit state | Unit: `orbitControlsDefault` + wiring |

**Do not claim “ids/mm/rotation browser-proved.”** Browser = count + orbit attr + remount stability.

## Place path

Inventory Systems configurator is collapsed by default. Spec uses `placeSeatsFromConfigurator` (expand then Place N). First attempt this seat hit Place-button timeout (navigation / collapsed residual); re-prove on tip with helper path → **exit 0**.

## Status

| Claim | Value |
|-------|--------|
| Browser W4 re-prove | **green** (exit 0) |
| paperPass | **false** |
| Full W4/CP-04 product PASS | **not claimed** — needs program dual-green same-tip lock |
