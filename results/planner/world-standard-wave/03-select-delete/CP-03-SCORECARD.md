# CP-03 SCORECARD — P03 Select / Delete / Undo (W3)

**Date:** 2026-07-10  
**Seat:** Agent 5 — code-review gate + scorecard (read product; write evidence only)  
**Authority:** `plans1/P03-select-delete/CODE-REVIEW-REPORT.md`  
**Checkout:** `.` (main only; no worktrees)  
**Scorecard written at tip:** `74e89a4b431f5e5cecab79f1523a84543981a7f0`  
**Evidence pack HEAD (browser pin):** `aea4e76c44ed82130b3d8b38d8980877fc976540`  
**Canonical evidence:** `results/planner/world-standard-wave/03-select-delete/`

---

## Overall: **PASS**

| Gate | Result | Notes |
|------|--------|-------|
| Live product wire (Agent 5 re-verify) | **OK** | See live checks below |
| Unit pack green on disk | **Y** | 4 files / 62 passed |
| Browser hard gate on disk | **Y** | 1/1 Playwright + PNGs + raw log |
| Unit alone = W3? | **NO — FAIL if claimed** | Binding law |
| **CP-03 / W3 overall** | **PASS** | Both unit **and** browser evidence on disk |

**PASS rule (this seat):** Overall **PASS** only if **both** unit pack + browser evidence exist under the canonical folder for this residual wave. Missing either → OPEN/FAIL. **Not invented.**

---

## Live product re-verify (Agent 5 — 2026-07-10)

| Check | Path | Verified | Result |
|-------|------|----------|--------|
| `deleteSelection` → **one** `updateProject(applySelectionDelete)` | `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` ~L327–335 | Single call, then clear selection; **no N-loop** | **OK** |
| Keyboard Delete/Backspace `preventDefault` + `!mod` | `…/editor/useWorkspaceKeyboard.ts` ~L83–86 | `preventDefault` then `deleteSelection?.()` | **OK** |
| Fabric furniture flag **exactly** `"1"` | `…/canvas-fabric-stage/fabricFurnitureFlag.ts` L14–17 | `env[…] === "1"` only; default OFF | **OK** |
| Pure helper returns project only | `…/editor/workspaceEntityHelpers.ts` `applySelectionDelete` | `Open3dProject` only (not appendix tuple) | **OK** |

**Product thrash this scorecard seat:** **None** (read-only product; evidence docs only).

---

## Unit pack green?

| Field | Value |
|-------|--------|
| **Y/N** | **Y** |
| Result | **4 files / 62 tests passed** / exit **0** |
| Duration (last re-prove log) | ~3.52s |
| Primary log | `results/planner/world-standard-wave/03-select-delete/unit-w3-pack.log` |
| Alias / residual | `unit-residual.log` (same 4/62) |
| Per-suite raw | `01-pick-furniture-vitest-raw.log`, `02-delete-undo-vitest-raw.log`, `04-keyboard-delete-vitest-raw.log`, `05-canvas-select-vitest-raw.log` |
| Per-suite copies | `unit-canvasPicking.log`, `unit-applySelectionDelete.log`, `unit-open3dWorkspaceKeyboard.log`, `unit-open3dFeasibilityCanvas.log` |
| Suites | `canvasPicking.test.ts` (33), `applySelectionDelete.test.ts` (9), `open3dWorkspaceKeyboard.test.tsx` (11), `open3dFeasibilityCanvas.test.tsx` (9) |
| Residual U1–U11 | Present in source (locked, pose+`updateOpen3dProject`, multi one-past, empty ids, Ctrl+Bksp, Del-in-input, omitted handler, select→setSelection, empty clear) |

### Unit alone = FAIL reminder

> **Unit pack green ≠ W3 PASS. Unit alone = FAIL for CP-03.**  
> Browser Task (Playwright W3 + PNGs + `browser-w3-raw.log` under this folder) is mandatory.  
> Journey folder (`02-browser-open3d-journey/`) **cannot** substitute.  
> Appendix / stale phase-card “CP-03 PASS” without this pack = **false-green**.

---

## Browser green?

| Field | Value |
|-------|--------|
| **Y/N** | **Y** |
| Result | **1/1 passed** / `PLAYWRIGHT_EXIT=0` (~3.0s total; ~2.0s body) |
| Spec | `site/tests/e2e/open3d-w3-select-delete.spec.ts` |
| Primary log | `results/planner/world-standard-wave/03-select-delete/browser-w3-raw.log` |
| Acceptance | `W3-ACCEPTANCE.md` (browser seat verdict PASS) |
| Meta | `run.json` (`status: "PASS"`, HEAD `aea4e76c…`), `HEAD.txt` |
| PNGs | `01-placed.png`, `02-selected.png`, `03-deleted.png`, `04-undone.png` |
| Count proof | 4 furniture → 3 after Delete → 4 after Ctrl+Z |
| Fabric during proof | **OFF** — `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` unset (≠ `"1"`) |

**First attempt honesty (browser seat):** RED on collapsed Systems configurator (`defaultOpen={false}`); e2e helper expand fix only; re-run green. Documented in `W3-ACCEPTANCE.md` / `run.json`.

---

## Honesty residuals (do not inflate)

| Item | Severity | Note |
|------|----------|------|
| Browser asserts **count only** (not same entity id/pose) | Accepted for minimal CP-03 | **U4** unit (`updateOpen3dProject` + undo pose/id) carries id/pose bar; browser does **not** claim id identity |
| Evidence pack HEAD ≠ current tip | Low | Browser pin `aea4e76c`; scorecard tip advanced through later P02/P05 docs/tests. P03 product path re-verified live still correct |
| `CODE-REVIEW-LIVE.md` says empty pack | Stale seat A0 | **Superseded** by unit/browser deposits + this scorecard |
| `selectPlannerTool` / `tapOnCanvas` harden | Hygiene | Optional flake hardening still open; live e2e green without it this run |
| Esc browser clear-selection | Low | Not CP-03 blocker |

---

## False-green defenses enforced

1. Unit alone ≠ W3 — **stated; would be FAIL.**  
2. Both unit logs **and** browser log/PNGs present under `03-select-delete/` — **required for this PASS.**  
3. Fabric OFF for browser proof — **documented.**  
4. No journey-folder substitute.  
5. No paper PASS from appendix alone.  
6. Live one-`updateProject` + keyboard `preventDefault` + Fabric `=== "1"` re-audited this seat.

---

## Summary table (return surface)

| Dimension | Status |
|-----------|--------|
| Live: one `updateProject(applySelectionDelete)` | OK |
| Live: keyboard `preventDefault` on Del/Bksp | OK |
| Live: Fabric flag `=== "1"` only | OK |
| Unit pack green? | **Y** — `unit-w3-pack.log` (62/62) |
| Browser green? | **Y** — `browser-w3-raw.log` + PNGs 01–04 |
| Unit alone = W3? | **FAIL if claimed** |
| **Overall CP-03** | **PASS** |

---

## Metadata

| Field | Value |
|-------|--------|
| Product code changed this seat | **None** |
| Evidence written | This scorecard; PHASE-SUMMARY pointer update |
| Commit intent | `trustdata(P03): CP-03 scorecard honest` |
