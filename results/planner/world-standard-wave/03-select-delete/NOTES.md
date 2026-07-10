# P03 / W3 proof pack — NOTES (coherent same-tip)

**Date:** 2026-07-10  
**Checkout:** `.` only (no worktrees)  
**HEAD pin:** `d4b0c492d3ecd596bb65498fe2cfa404f2aa0a99` (see `HEAD.txt`)  
**Agent:** P03 coherent proof pack seat  
**Single status:** `run.json` → **`pass`** (also this file + `PROOF-INDEX.md` — no dual-status)

---

## Binding honesty

| Law | Applied |
|-----|---------|
| **No paper moon** | `status` is **`pass`** only after **both** unit exit **0** and browser exit **0** on this deposit |
| **Unit alone ≠ W3** | Unit pack green does **not** close CP-03 / W3 by itself |
| **Fabric OFF for proof** | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` **unset** (≠ `"1"`) for unit + Playwright runner |
| **Evidence only under repo-root `results/`** | This folder; never `site/results/` |
| **One coherent set** | `HEAD.txt` / `run.json` / `NOTES.md` / `PROOF-INDEX.md` share the same status |

---

## Fabric flag

- **Proof requirement:** Fabric furniture flag **OFF**.
- **This pack:** env **unset** for unit re-prove and Playwright run.
- Spec also asserts runner env is falsy (`open3d-w3-select-delete.spec.ts`).
- Product: flag ON only when env is exactly `"1"`.

---

## E2E harden (exact counts)

Landed on main as **`85b8d1ed`** — `test(planner): P03 W3 e2e exact counts hard gate`.

Soft inequality asserts (`toBeLessThan` / `toBeGreaterThan`) are **gone**. Spec now uses exact furniture counts:

| Step | Assert |
|------|--------|
| Place | `furnitureCount === furnitureBefore + SEATS_PLACED` (**+4**) |
| Select | `isFurnitureSelection === true`; count still **`afterPlace`** |
| Delete | `furnitureCount === afterPlace - FURNITURE_REMOVED_ON_DELETE` (**−1**) |
| Undo (Ctrl+Z) | `furnitureCount === afterPlace` (full restore of count) |

Constants: `SEATS_PLACED = 4`, `FURNITURE_REMOVED_ON_DELETE = 1`.

**Count residual (still true):** browser proves **counts** (status bar), not same entity id/pose after undo. Id/pose bar remains unit: `applySelectionDelete` + `updateOpen3dProject` undo tests.

---

## Unit pack

| Field | Value |
|-------|--------|
| Exit | **0** |
| Result | **4 files / 97 tests passed** |
| Logs | `unit-w3-pack.log`, `unit-w3-pack-raw.log` (unfiltered twin) |
| Suites | `canvasPicking`, `applySelectionDelete`, `open3dWorkspaceKeyboard`, `open3dFeasibilityCanvas` |

```text
cd site
pnpm exec vitest run \
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts \
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts \
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx \
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx \
  --reporter=verbose
```

**Unit alone ≠ W3.**

---

## Browser

| Field | Value |
|-------|--------|
| Exit | **0** |
| Result | **1/1 passed** (~5.5s) |
| Log | `browser-w3-raw.log` |
| Base URL | `http://localhost:3000` (`PLAYWRIGHT_BASE_URL`) |
| PNGs | `01-placed.png` … `04-undone.png` refreshed this run |

```text
cd site
Remove-Item Env:NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE -EA SilentlyContinue
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
pnpm exec playwright test -c config/build/playwright.config.ts \
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

---

## Same-tip note

Concurrent **P04** trustdata commits advanced `main` while this seat ran. Between browser green and unit re-pin, **`git diff` on W3 product/e2e/unit open3d paths was empty** — only unrelated P04 evidence moved. Deposit tip `d4b0c492` includes harden `85b8d1ed` and both green logs.

---

## Non-proof junk

- **`chrome/_cdm/node_modules`**: deleted (chrome-devtools-mcp dump; not W3 proof).
- Remaining `chrome/` logs / HTML probes are diagnostic only, not gate evidence.

---

## Status (single)

```text
status = pass
```

- Unit half: exit **0** (97/97).  
- Browser half: exit **0** (exact-count e2e).  
- Combined W3: **pass**.  
- Do **not** reintroduce dual-status (pass in one file, open in another).
