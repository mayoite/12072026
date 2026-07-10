# W3 ACCEPTANCE — P03 Select / Delete / Undo (browser hard gate)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD:** `fb5ff5f4cf269e824e6b20da1142c6c033b03861`  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**Seat:** P03 Agent 4 — browser W3 hard gate (Playwright + eyes)  

---

## Verdict: **PASS**

| Check | Result |
|-------|--------|
| Fabric furniture flag OFF | **PASS** — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset |
| Playwright W3 spec green | **PASS** — exit code **0** |
| Flow: place, select, Delete, Ctrl+Z | **PASS** (1.9s body; 2.5s total tip re-prove) |
| PNGs 01-04 + eyes | **PASS** — 4 furniture, then 3 after Delete, then 4 after Ctrl+Z |
| `browser-w3-raw.log` | **PASS** — deposited |
| `run.json` status | **PASS** |
| Product select/delete thrash | **None** — e2e helper only |

**Unit alone is not W3.** This seat is the browser hard gate only.

---

## What ran

``text
cd D:\OandO07072026\site
# Fabric OFF; reuse running server:
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
.\node_modules\.bin\playwright.cmd test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
``

- **Spec:** `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- **Path:** guest planner, `placeSeatsFromConfigurator(4)`, `selectPlannerTool("Select")` + canvas click, Delete, Ctrl+Z
- **Server:** `http://localhost:3000` with `PLAYWRIGHT_BASE_URL` set (avoids Playwright webServer build+start)
- **Exit code:** `0`
- **Reporter:** `1 passed (2.5s)`
- **Land commits:** helper + evidence in `3a56da69` / `19243a45`; tip pin `fb5ff5f4`

### Screenshots (eyes)

| File | Role | Proof |
|------|------|-------|
| `01-placed.png` | After place 4 seats | 4 furniture |
| `02-selected.png` | After Select + pick | Furniture selected |
| `03-deleted.png` | After Delete | 3 furniture |
| `04-undone.png` | After Ctrl+Z | 4 furniture restored |

---

## Root cause this re-prove (RED then green)

1. **FAIL:** `selectPlannerTool("Select")` only searched `group "Drawing tools"`.
2. **Chrome fact:** open3d `CanvasToolRail` puts Select/Pan under **Navigation tools**; Drawing tools are Room/Wall/Opening/Dimension/Place.
3. **Mode B fix:** `plannerToolButton` in `site/tests/e2e/plannerCanvasHelpers.ts` uses `navigation "Canvas tools"` first, with Drawing-tools group as `locator.or()` fallback.
4. **Tip re-prove:** exit 0. No product select/delete code change.

---

## Environment

1. Fabric OFF (env unset).
2. Dev server on :3000; `/planner/guest/` HTTP 200.
3. Chrome-devtools not required — Playwright + PNG eyes.

---

## Status for head

- **DONE** browser W3 hard gate (Agent 4).
- Helper land: `site/tests/e2e/plannerCanvasHelpers.ts`.
- Product Mode A: no product change.
- Origin pushed: tip `fb5ff5f4`.