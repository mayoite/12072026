# P04 / W4 — NOTES-BROWSER (Execute 5/5)

**Date:** 2026-07-10  
**Seat:** Playwright W4 orbit continuity  
**Prove tip (at run):** `231b2f032d893e524fab24efcf8c1ee9f14494f5`  
**Spec:** `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts`  
**Server:** `PLAYWRIGHT_BASE_URL=http://localhost:3000` (reuse existing dev; no webServer rebuild)

## Command

```powershell
cd site
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm exec playwright test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=list
```

## Result

| Item | Value |
|------|--------|
| Exit | **0** |
| Tests | **1 passed** (~8s) |
| Log | `browser-w4-playwright-live.log` / `browser-w4-raw.log` |
| Machine deposit | `browser-run.json` (`status: browser-green`) |
| PNGs | `01-2d-after-place.png`, `02-3d-orbit-on.png`, `03-2d-restored.png` |

## What the browser **asserts** (count / orbit attr)

| Assert | How | Honesty |
|--------|-----|---------|
| Place +4 furniture | Status-bar text `(\d+)\s+furniture` via `furnitureCount()` after `placeSeatsFromConfigurator(page, 4)` | **Count only** — not entity UUIDs |
| 3D shell up | `getByTestId("planner-3d-canvas")` visible | Presence, not mesh fidelity |
| Orbit enabled | `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` visible | **DOM attr** — not camera pose math |
| Optional drag | light left-drag on orbit container; canvas still visible | No-crash smoke, not orbit angle proof |
| 2D↔3D↔2D↔3D↔2D | furniture count remains `afterPlace` across toggles | **Count continuity** — not id/mm/rotation continuity |
| Console | filters DevTools/favicon/net::ERR_; records `consoleErrorCount` | Hard app errors only |

From live `browser-run.json`:

- `furnitureBefore: 0` → `furnitureAfterPlace: 4` → toggle remount still **4**
- `orbitEnabled: true`
- `consoleErrorCount: 0`
- `placePath: "placeSeatsFromConfigurator Place 4 seats"`

## What the browser **does not** prove

| Not asserted in this e2e | Where that lives |
|--------------------------|------------------|
| Entity **ids** stable across 2D↔3D | Unit: `poseContinuityW4` / document view continuity |
| **mm** positions / transform equality | Unit / scene-node adapters |
| Document **rotation** degrees | Unit pose packs |
| OrbitControls three.js camera state | Unit: `orbitControlsDefault` + wiring |

**H3 honesty:** browser = **count + `data-orbit-enabled` attr + remount no-crash**. Pose ids/mm/rotation = **units only**. Do not claim “same UUIDs in browser” from this pack.

## Place path note

Inventory Systems configurator defaults collapsed (`defaultOpen=false`). Spec uses `placeSeatsFromConfigurator` which expands “Systems configurator” before clicking **Place 4 seats**. Earlier FAIL (timeout on Place button) was expand residual — fixed helper path; re-prove exit **0**.

## Eyes on PNGs

| PNG | Eyes |
|-----|------|
| `01-2d-after-place.png` | 2D plan; 4 linear workstations; status **4 furniture** |
| `02-3d-orbit-on.png` | 3D mode selected; 4 desks in room shell; configurator Place 4 still present |
| `03-2d-restored.png` | Back on 2D; same 4-seat row; **4 furniture** |

## Gate read (this seat)

| Half | Result |
|------|--------|
| Browser Playwright W4 | **pass** (exit 0) |
| Unit pack (other seats) | See `NOTES-unit-pack.md` / unit logs — not re-run by this seat |
| Combined product “W4 Done” | Only if unit+browser green on **same HEAD** — this seat proves **browser half** only |

**paperPass:** false  
**browser alone ≠ full W4 product close** without consolidator reading unit tip alignment.
