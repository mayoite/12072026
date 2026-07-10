# P03 / W3 proof pack — NOTES (Agent 9)

**Date:** 2026-07-10  
**Checkout:** `D:\OandO07072026` only (no worktrees)  
**HEAD pin:** `ded7da283829bb8b54d33019888dc84b8763eb9f` (see `HEAD.txt`)  
**Agent:** P03 Agent 9 — save proof pack under `results/planner/world-standard-wave/03-select-delete/`

---

## Binding honesty

| Law | Applied |
|-----|---------|
| **No paper moon** | `status` is **`open`** — not invented `pass` |
| **Unit alone ≠ W3** | Unit pack green does **not** close CP-03 / W3 |
| **Fabric OFF for proof** | `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` **unset** (≠ `"1"`) |
| **Evidence only under repo-root `results/`** | This folder; never `site/results/` |

---

## Fabric flag

- **Proof requirement:** Fabric furniture flag **OFF**.
- **This pack:** env unset for Agent 9 unit re-prove and Playwright attempts.
- Product: flag ON only when env is exactly `"1"`.

---

## Unit pack

| Field | Value |
|-------|--------|
| Exit | **0** |
| Result | **4 files / 62 tests passed** |
| Logs | `unit-w3-pack.log`, `unit-w3-pack-raw.log` (unfiltered) |
| Proved on tip | **yes** (Agent 9) |

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

### Live re-prove on tip — RED (exit 1)

Latest `browser-w3-raw.log`:

1. Guest/workspace entry sometimes OK after server thrash (earlier: **404** on `/planner/guest/`).
2. Place path can succeed → `01-placed.png` refreshed.
3. Fail at `selectPlannerTool(page, "Select")` — Drawing tools rail Select button not visible (15s).
4. **Delete / Ctrl+Z not reached** on tip re-prove.

```text
.\node_modules\.bin\playwright.cmd test -c config/build/playwright.config.ts \
  tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

### Prior green residual (stale)

| Field | Value |
|-------|--------|
| HEAD | `aea4e76c…` |
| Exit | 0 |
| PNGs 02–04 | residual on disk from that green flow |
| Count proof | 4 → 3 after Delete → 4 after Ctrl+Z |
| Stale vs tip | **yes** |

Do **not** claim browser PASS on current tip from residual PNGs.

---

## Count-only browser residual

**True.** W3 e2e asserts furniture **counts** only (status bar), not same entity id/pose after undo.

- Id/pose bar: unit `applySelectionDelete` + `updateOpen3dProject` undo tests.
- Browser does not claim identity of restored furniture.

---

## Status

```text
status = open
```

- Unit half: green on tip.  
- Browser half: live exit **1** on tip.  
- Combined W3: **not pass**.  
- Residual historical green + unit alone **must not** be sold as CP-03 PASS.

---

## Out of Agent 9 scope

- Fix guest 404 intermittency / Drawing tools Select locator / product select-delete thrash.
- Re-green browser after harden commit `ded7da28` — head / browser seat.
