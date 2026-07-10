# W3 ACCEPTANCE — P03 Select / Delete / Undo (browser hard gate)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD (pre-land tip at re-prove):** will pin to deposit commit after land  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**Seat:** P03 Agent 4 — browser W3 hard gate (Playwright + eyes)  

---

## Verdict: **PASS**

| Check | Result |
|-------|--------|
| Fabric furniture flag OFF (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"`) | **PASS** — unset in shell for run |
| Playwright W3 spec green | **PASS** — exit code **0** |
| Flow: place → select → Delete → Ctrl+Z | **PASS** (2.1s test body; 3.1s total) |
| PNGs 01–04 present + counts | **PASS** — 4 furniture → 3 after Delete → 4 after Ctrl+Z (eyes on PNGs) |
| `browser-w3-raw.log` | **PASS** — deposited (this re-prove) |
| `run.json` status | **PASS** (browser gate closed; unit alone ≠ W3) |
| Product select/delete thrash | **None** — e2e helper only |

**Unit alone ≠ W3.** This seat closes the **browser** hard gate only.

---

## What ran

```text
cd D:\OandO07072026\site
# Fabric OFF:
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -ErrorAction SilentlyContinue
.\node_modules\.bin\playwright.cmd test -c config/build/playwright.config.ts `
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

- **Spec:** `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- **Path under test:** guest planner → `placeSeatsFromConfigurator(4)` → `selectPlannerTool(Select)` + canvas click → `Delete` → furniture count down → `Control+z` → count up
- **Server:** `http://localhost:3000` (reuseExistingServer; fabric unset)
- **Exit code:** `0`
- **Reporter summary:** `1 passed (3.1s)`

### Screenshots (eyes)

| File | Role | Status bar / panel proof |
|------|------|--------------------------|
| `01-placed.png` | After systems configurator place (4 seats) | 4 furniture · selection active |
| `02-selected.png` | After Select tool + canvas pick | Furniture selected · properties show furniture |
| `03-deleted.png` | After Delete | **3 furniture** · No Selection |
| `04-undone.png` | After Ctrl+Z | **4 furniture** restored |

---

## Root cause this re-prove (RED → green)

1. **First run FAIL** (e2e helper scope, not product select/delete):
   - `selectPlannerTool("Select")` looked only under `role=group name="Drawing tools"`.
   - open3d `CanvasToolRail` places **Select/Pan under `Navigation tools`**; Drawing tools = Room/Wall/Opening/Dimension/Place.
   - Error context proved place succeeded (4 furniture, Select already pressed in Navigation tools) but helper could not find Select in Drawing tools.
2. **Mode B minimal fix (e2e helper only):** `plannerToolButton` in `site/tests/e2e/plannerCanvasHelpers.ts` scopes to `navigation "Canvas tools"` first, with Drawing-tools group as legacy fallback via `locator.or()`.
3. **Re-run → green.** No product select/delete code change.

Earlier session notes (configurator expand) remain valid and already landed in the same helper.

---

## Environment / pre-flight

1. **Fabric OFF** — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset.
2. **localhost:3000** up (guest `/planner/guest/` → 200 after clean server restart; stale server had intermittent guest 404).
3. Chrome-devtools manual: **not needed** — Playwright + PNG eyes sufficient.

---

## Honesty notes / residual risk

| Item | Severity | Note |
|------|----------|------|
| Proof server may be dev or `next start` reuse | Low for W3 | Client workspace path; fabric OFF proven. |
| Prior Agent-9 `run.json` said browser RED while log was overwritten mid-pack | Fixed here | This seat re-proves browser green with helper land. |
| Count-only assert (no id/pose) | By design | Spec contract; eyes show 4→3→4. |

---

## False-green matrix (this seat)

| Failure mode | Mitigated? |
|--------------|------------|
| Unit green claimed as W3 | **No** — browser log + PNGs required and deposited |
| Fabric ON desync | Flag unset for run |
| Empty place then fake select | Poll asserts furniture +4 after place; selection asserts no "No Selection" |
| Delete without selection | Delete only after selection assertion |
| Undo without prior delete | Count after delete, then expect greater after undo |
| Select helper scoped wrong group | Fixed — Canvas tools nav includes Navigation tools |
| Journey folder substituted | Evidence only under `03-select-delete/` |

---

## Status for head

- **DONE** for browser W3 hard gate re-prove (Agent 4).
- Helper fix (Select under Navigation tools) lands with evidence.
- Product select/delete Mode A: **no product code change** this seat.