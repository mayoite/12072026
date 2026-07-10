# W3 ACCEPTANCE — P03 Select / Delete / Undo (browser hard gate)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` (main only; no worktrees)  
**HEAD:** `aea4e76c44ed82130b3d8b38d8980877fc976540`  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/`  
**Seat:** Browser W3 hard gate only (seat B re-prove)  

---

## Verdict: **PASS**

| Check | Result |
|-------|--------|
| Fabric furniture flag OFF (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"`) | **PASS** — unset in shell for run |
| Playwright W3 spec green | **PASS** — exit code **0** |
| Flow: place → select → Delete → Ctrl+Z | **PASS** (2.0s test body; 3.0s total; warm dev server) |
| PNGs 01–04 present + counts | **PASS** — 4 furniture → 3 after Delete → 4 after Ctrl+Z |
| `browser-w3-raw.log` | **PASS** — deposited (this re-prove) |
| `run.json` status | **PASS** |
| Product select/delete thrash | **None** — e2e helper expand only |

**Unit alone ≠ W3.** This seat closes the **browser** hard gate only.

---

## What ran

```text
cd D:\OandO07072026\site
# pnpm exec playwright failed (ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL) — use local bin:
.\node_modules\.bin\playwright.cmd test -c config/build/playwright.config.ts \
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

- **Spec:** `site/tests/e2e/open3d-w3-select-delete.spec.ts`
- **Path under test:** guest planner → `placeSeatsFromConfigurator(4)` → Select tool + canvas click → `Delete` → furniture count down → `Control+z` → count up
- **Server:** existing `http://localhost:3000` (reuseExistingServer)
- **Exit code:** `0`
- **Reporter summary:** `1 passed (3.0s)`

### Screenshots

| File | Role | Status bar proof |
|------|------|------------------|
| `01-placed.png` | After systems configurator place (4 seats) | 4 furniture |
| `02-selected.png` | After Select tool + canvas pick | selection active |
| `03-deleted.png` | After Delete | 3 furniture |
| `04-undone.png` | After Ctrl+Z | 4 furniture restored |

---

## Root cause on first re-prove (RED → green)

1. **First run FAIL** (not select/delete product):
   - Timeout waiting for `Place 4 seats` inside region `Workstation systems configurator`.
   - Snapshot: configurator collapsed — only `Systems configurator ▸` header (`aria-expanded` path).
   - Product: `InventoryPanel` passes `defaultOpen={false}` (catalog-first, commit `b0720f94`).
2. **Minimal fix (e2e helper only):** `placeSeatsFromConfigurator` in `site/tests/e2e/plannerCanvasHelpers.ts` expands the header when Place N is not visible, then clicks.
3. **Re-run → green.** No select/delete product code change.

---

## Environment / pre-flight

1. **Fabric OFF** — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset.
2. **localhost:3000** already up (HTTP 200); did not start a second dev server.
3. Chrome-devtools manual: **not needed** — Playwright + PNGs sufficient.

---

## Honesty notes / residual risk

| Item | Severity | Note |
|------|----------|------|
| Proof server = **dev**, not `pnpm start` prod | Low for W3 | Client workspace path; fabric OFF proven. |
| Other e2e specs that click Place N without expand | Medium | `open3d-systems-v0-batch-place`, W4 orbit, etc. may still RED until they use the helper or expand. Out of seat B scope unless head asks. |
| Fast 2.0s body | N/A | Warm turbo/dev; PNG counts still prove place/delete/undo. |

---

## False-green matrix (this seat)

| Failure mode | Mitigated? |
|--------------|------------|
| Unit green claimed as W3 | **No** — browser log + PNGs required and deposited |
| Fabric ON desync | Flag unset for run |
| Empty place then fake select | Poll asserts furniture +4 after place; selection asserts no "No Selection" |
| Delete without selection | Delete only after selection assertion |
| Undo without prior delete | Count after delete, then expect greater after undo |
| Journey folder substituted | Evidence only under `03-select-delete/` |
| Collapsed configurator false-green | First run failed honestly; expand fix required |

---

## Status for head

- **DONE** for browser W3 hard gate re-prove (seat B).
- Helper fix lands with evidence.
- Product select/delete Mode A: **no product code change** this seat.
