# P04 / W4 proof pack — NOTES (Playwright seat)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only (no worktrees)  
**HEAD pin:** `bb0531685e7e714acb6026d0afcb214ba6e68f7a` (see `HEAD.txt`)  
**Seat:** P04 Playwright — browser W4 re-prove

---

## Binding honesty

| Law | Applied |
|-----|---------|
| **No paper moon** | Claims only from this seat’s fresh Playwright run |
| **Unit alone ≠ W4** | Unit packs green do **not** close browser layer |
| **H3 (CODE-REVIEW-REPORT)** | Browser proves **furniture count** + **`data-orbit-enabled="true"`** + 2D↔3D count stability — **not** entity ids / mm position / document rotation |
| **Fabric** | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` **unset** for server + runner |
| **Evidence** | Repo-root `results/planner/world-standard-wave/04-orbit-continuity/` only |

---

## Fabric / orbit defaults

| Flag / default | This run |
|----------------|----------|
| `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` | **unset** (not `"1"`) |
| Orbit product default | ON (`OPEN3D_ORBIT_DEFAULT_ENABLED = true`) — browser asserts DOM attr, not env flag |
| Server | `http://localhost:3000` (`PLAYWRIGHT_BASE_URL` set; reuseExistingServer) |

---

## Browser (this seat — fresh on tip)

| Field | Value |
|-------|--------|
| Spec | `site/tests/e2e/open3d-w4-orbit-continuity.spec.ts` |
| Command | `cd site; pnpm exec playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w4-orbit-continuity.spec.ts --reporter=list` |
| Exit | **0** |
| Result | **1 passed** (~7–8s) |
| Raw log | `browser-w4-raw.log` |
| Run JSON | `browser-run.json` (`status: browser-green`) |
| Place path | `placeSeatsFromConfigurator(page, 4)` (expand collapsed Systems configurator) |

### What browser proved

1. Guest planner ready → Place **4 seats** → status furniture count **0 → 4**
2. Switch **3D** → `[data-testid="three-viewer-container"][data-orbit-enabled="true"]` visible
3. Optional left-drag on orbit container → 3D canvas still visible (no crash)
4. **3D → 2D → 3D → 2D** round-trip → furniture count stays **4**

### What browser did **not** prove (H3)

- Same entity **ids** across mode toggles  
- **mm** position continuity  
- Document **rotation degrees**  

Those remain **unit** (`poseContinuityW4`, scene node packs). Do not claim “ids/mm/rotation browser-proved.”

### Screenshots

| File | Content |
|------|---------|
| `01-2d-after-place.png` | 2D after Place 4 seats (status: 4 furniture) |
| `02-3d-orbit-on.png` | 3D view with orbit-enabled viewer |
| `03-2d-restored.png` | 2D after round-trip (count still 4) |

---

## Unit (other seats — not re-run by Playwright seat)

| Pack | Log (deposit) | Note |
|------|---------------|------|
| Orbit core | `unit-orbit-pack.log` | Prior seat — 9/9 historically |
| Pose + adapter | `unit-pose-pack.log` | Prior seat — 26/26 historically |

**Unit alone ≠ W4 browser green.** Browser status is independent and was missing until this seat.

---

## First fail → fix (honest)

| Attempt | Exit | Failure |
|---------|------|---------|
| 1 (stale place path in some tree state / race) | 1 | `Place 4 seats` click timeout while navigation / collapsed panel |
| 2+ on tip with `placeSeatsFromConfigurator` | **0** | Green |

Spec uses the same expand helper as W3 (`plannerCanvasHelpers.placeSeatsFromConfigurator`) — Inventory `defaultOpen={false}`.

---

## Status claim (this pack)

| Layer | Status |
|-------|--------|
| Browser W4 re-prove on tip | **green** (exit 0, PNGs + `browser-run.json`) |
| H3 overclaim | **avoided** — count + orbit attr only |
| Full product “W4 Done / CP-04 ship” | **not claimed by this seat** — needs program closeout |
| paperPass | **false** |
