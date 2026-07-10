# W3 ACCEPTANCE â€” P03 Select / Delete / Undo (browser hard gate)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD:** `19243a45a093ce07dd1cd3f707e5326298e5a567`  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**Seat:** P03 Agent 4 â€” browser W3 hard gate (Playwright + eyes)  

---

## Verdict: **PASS**

| Check | Result |
|-------|--------|
| Fabric furniture flag OFF (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` â‰  `"1"`) | **PASS** â€” unset in shell for run |
| Playwright W3 spec green | **PASS** â€” exit code **0** |
| Flow: place â†’ select â†’ Delete â†’ Ctrl+Z | **PASS** (1.9s body; 2.5s total on tip re-prove) |
| PNGs 01â€“04 present + counts | **PASS** â€” 4 furniture â†’ 3 after Delete â†’ 4 after Ctrl+Z (eyes) |
| `browser-w3-raw.log` | **PASS** â€” deposited (tip re-prove) |
| `run.json` status | **PASS** |
| Product select/delete thrash | **None** â€” e2e helper only |

**Unit alone â‰  W3.** This seat closes the **browser** hard gate only.

---

## What ran

``text
cd D:\OandO07072026\site
# Fabric OFF; force reuse of running server:
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
.\node_modules\.bin\playwright.cmd test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
``

- **Spec:** `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- **Path:** guest â†’ `placeSeatsFromConfigurator(4)` â†’ `selectPlannerTool("Select")` + canvas click â†’ Delete â†’ Ctrl+Z
- **Server:** `http://localhost:3000` (`PLAYWRIGHT_BASE_URL` set so Playwright does not spawn build+start)
- **Exit code:** `0`
- **Reporter:** `1 passed (2.5s)` on tip `dada98ee`

### Screenshots (eyes)

| File | Role | Proof |
|------|------|-------|
| `01-placed.png` | After place 4 seats | 4 furniture |
| `02-selected.png` | After Select + pick | Furniture selected |
| `03-deleted.png` | After Delete | **3 furniture** |
| `04-undone.png` | After Ctrl+Z | **4 furniture** restored |

---

## Root cause this re-prove (RED â†’ green)

1. **FAIL:** `selectPlannerTool("Select")` scoped only to `group "Drawing tools"`.
2. **Product chrome:** open3d `CanvasToolRail` puts **Select/Pan under `Navigation tools`**; Drawing tools = Room/Wall/Opening/Dimension/Place.
3. **Mode B fix:** `plannerToolButton` uses `navigation "Canvas tools"` first, Drawing-tools group as `locator.or()` fallback.
4. **Re-run / tip re-prove â†’ exit 0.** No product select/delete code change.

---

## Environment

1. Fabric OFF (env unset).
2. Dev server on :3000; guest route 200.
3. Chrome-devtools not required â€” Playwright + PNG eyes.

---

## Status for head

- **DONE** browser W3 hard gate (Agent 4).
- Helper land: `site/tests/e2e/plannerCanvasHelpers.ts`.
- Product Mode A: **no product change**.