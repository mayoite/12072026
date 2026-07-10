# PHASE-SUMMARY — P03 Select / Delete (W3 residual)

**Date:** 2026-07-10  
**Seat:** Code-review units + browser W3 hard gate (updated after green Playwright)  
**Checkout:** `.` (main only)  
**Status:** **UNITS DONE · BROWSER W3 PASS · CP-03 SCORECARD PASS** (Agent 5)

---

## Verdict (units only)

| Gate | Status |
|------|--------|
| Mode A residual unit gaps U1–U11 on disk | **DONE** |
| Unit pack green (4 files / 62 tests) | **DONE** (logs deposited) |
| Product thrash beyond tests | **None observed** for residual land |
| Browser W3 (Fabric OFF + PNGs + raw log) | **PASS** |
| `W3-ACCEPTANCE.md` / `run.json` / browser CP-03 | **PASS** (see W3-ACCEPTANCE.md) |
| **Unit alone = W3?** | **NO — FAIL if claimed** |

**False-green law (still binding):**  
Unit residual green proves pure delete, pick edges, keyboard edges, and Feasibility select→`setSelection` only.  
**Unit alone still does not close W3.** Browser Task + evidence pack are now deposited (PASS).

---

## Done (units)

### Residual cases present (U1–U11 closed on disk)

| ID | Case | File | Status |
|----|------|------|--------|
| U1 | `pickFurnitureAtPoint` empty array → null | `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | Present |
| U2 | Missing width/depth → 600mm footprint (hit 290 / miss 310) | same | Present |
| U3 | Locked furniture selected → same project ref; id remains | `…/applySelectionDelete.test.ts` | Present |
| U4 | `updateOpen3dProject` + delete + undo restores **same id + pose** | same | Present |
| U5 | Multi-id delete via `updateOpen3dProject` → **exactly one** `past` entry; undo restores all | same | Present |
| U6 | `type: "furniture", ids: []` → same ref | same | Present |
| U7 | Ctrl/Cmd+Backspace does **not** call `deleteSelection` | `…/open3dWorkspaceKeyboard.test.tsx` | Present |
| U8 | Delete while focus in `<input>` does not delete | same | Present |
| U9 | Omitted `deleteSelection` handler does not throw | same | Present |
| U10 | Select tool pointer on furniture → `{ type: "furniture", ids: [id] }` | `…/open3dFeasibilityCanvas.test.tsx` | Present |
| U11 | Select tool empty click → `{ type: "none", ids: [] }` | same | Present |

**Optional U12** (`workspaceDeleteSelection.wire.test.ts`): **not created** — acceptable; U4/U5 cover real history API seam.

### Suite counts (source + green logs)

| Suite | `it(` count (source) | Vitest log result |
|-------|---------------------:|-------------------|
| `geometry/canvasPicking.test.ts` | 33 (incl. 7 `pickFurnitureAtPoint`) | **33 passed** |
| `applySelectionDelete.test.ts` | 9 | **9 passed** |
| `open3dWorkspaceKeyboard.test.tsx` | 11 | **11 passed** |
| `open3dFeasibilityCanvas.test.tsx` | 9 (incl. 2 select residual) | **9 passed** |
| **W3 unit pack (4 files)** | **62** | **4 files / 62 tests passed** |

Residual-focused new cases among the pack: **11** (U1–U11). Baseline happy-path cases retained (do not re-do as primary work).

### Product / thrash audit

| Check | Result |
|-------|--------|
| Recent residual commits | `test(planner): P03 Mode A residual unit gaps for select-delete`; evidence log commits only |
| Product path rewrite in residual land | **None** in residual commit messages — Mode A tests + results only |
| Earlier product fixes (pre-residual; not this land) | Historical: Feasibility pick/selection ring; canvasPicking quality — already landed production |
| `applySelectionDelete` return shape | Still `Open3dProject` only (no appendix tuple thrash) |
| Fabric cutover / dual-store selection | **Not reopened** |

**Code-review quality bar (units land):**  
No structural product regression from residual work. Tests are direct (pure helpers + real `updateOpen3dProject`, not theater). Hand-rolled multi-id past case kept alongside U5 — redundant but harmless; U5 is the history claim. No file-size / spaghetti issue in test extensions. **No approval of W3** from this seat.

---

## Browser (closed 2026-07-10)

> Filled by W3 browser seat after green Playwright. See `W3-ACCEPTANCE.md`.

| ID | Gap | Severity | Status |
|----|-----|----------|--------|
| B1 | Spec run + PNGs + `browser-w3-raw.log` under evidence folder | **Hard gate** | **PASS** |
| B2 | Count-only browser assert (not id/pose) — accept only with U4 green; document non-claim | Accepted residual | OPEN to document in NOTES |
| B3 | Prefer `selectPlannerTool(page, "Select")` over raw role | Flake hygiene | OPEN |
| B4 | Prefer `tapOnCanvas` if `clickOnCanvas` select-hit flakes | Flake | OPEN if red |
| B5 | Select tool must be armed (default tool is `wall`) | Mitigated in spec | **PASS** (live 2026-07-10) |
| B6 | Fabric env unset / ≠ `"1"` during proof | Gate hygiene | **PASS** (unset) |
| B7 | Esc browser clear-selection | Low / optional | Not CP-03 blocker |

**Artifacts (browser seat):**

- [x] `01-placed.png` … `04-undone.png`
- [x] `browser-w3-raw.log`
- [x] `run.json` / `HEAD.txt` (NOTES optional; W3-ACCEPTANCE covers Fabric OFF + count-only)
- [x] `W3-ACCEPTANCE.md` — unit pack + browser both green

**E2E source (proven this wave):**  
`site/tests/e2e/open3d-w3-select-delete.spec.ts`

---

## Evidence paths

**Canonical folder only:**  
`results\planner\world-standard-wave\03-select-delete\`  
(Never `site/results/`; never journey folder substitute.)

### Units (deposited)

| Artifact | Path |
|----------|------|
| Task 1 pick raw | `results/planner/world-standard-wave/03-select-delete/01-pick-furniture-vitest-raw.log` (33 passed) |
| Task 2 delete/undo raw | `…/02-delete-undo-vitest-raw.log` (9 passed) |
| Task 3 keyboard raw | `…/04-keyboard-delete-vitest-raw.log` (11 passed) |
| Task 4 canvas select raw | `…/05-canvas-select-vitest-raw.log` (9 passed) |
| Pack residual | `…/unit-residual.log` (4 files / **62 passed**) |
| Pack alias | `…/unit-w3-pack.log` (4 files / **62 passed**) |
| Per-suite copies | `unit-canvasPicking.log`, `unit-applySelectionDelete.log`, `unit-open3dWorkspaceKeyboard.log`, `unit-open3dFeasibilityCanvas.log` |
| Prior live review | `…/CODE-REVIEW-LIVE.md` (pre-residual gaps list; **superseded for unit gap table** by this summary) |
| This summary | `…/PHASE-SUMMARY.md` |

### Browser (deposited)

| Artifact | Path (expected) |
|----------|-----------------|
| Playwright raw | `…/browser-w3-raw.log` |
| PNGs | `…/01-placed.png` … `…/04-undone.png` |
| Sign-off | `…/W3-ACCEPTANCE.md`, `run.json`, `HEAD.txt`, `NOTES.md` |

---


---

## Unit re-prove (P03 seat A — 2026-07-10)

| Item | Value |
|------|--------|
| Seat | **A — unit pack only** |
| Tip re-proved | `40c341964428b3fef2551ff8653c309b8167e003` |
| Pack | 4 files / **62 passed** / exit **0** (~3.52s) |
| Product code edits | **None** (green on tip; no fix required) |
| Residual open for units | **None** — U1–U11 still present; pack green on current tip |
| Unit alone = W3? | **NO** — units re-prove only; browser remains separate evidence |

Logs refreshed: `unit-w3-pack.log`, per-suite `unit-*.log`, `unit-residual.log`, `HEAD.txt`.
## False-green defenses (do not weaken)

1. **Unit pack green ≠ W3 PASS** — browser Task required.  
2. Empty evidence dir or unit logs only ≠ proven CP-03.  
3. Appendix / stale phase-card “CP-03 PASS” — ignore for gate.  
4. Journey folder (`02-browser-open3d-journey/`) **cannot** substitute W3.  
5. Count-only browser does **not** prove same entity id/pose — **U4 carries id/pose bar**.  
6. Fabric ON dual hit surface — prove with Fabric **OFF**.  
7. Hand-rolled multi past alone does not prove history API — **U5 does**.

---

## Next phase after P03 close

**Kill order (program):**  
`P00 → P01 → P02 → P03 → P07 → P06 → P04 → P05 → P08 → P09 → P10 → P11`  
(Source: `plans1/EXECUTE-NOW.md` §3 · `plans1/START-HERE.md`)

**After this phase fully closes (units + browser + acceptance):**

### → **P02 freeze re-prove** (next)

| Field | Value |
|-------|--------|
| Phase | **P02 — engine lock / freeze re-prove** |
| Evidence | `results/planner/world-standard-wave/01-engine-lock/` |
| Plan | `plans1/P02-engine-lock/` |
| Posture | **Re-prove freeze only** — no engine rebuild, no package upgrades, no Konva, no Fabric cutover |
| Note | `01-engine-lock/` is currently **empty / unproven** on this checkout; residual wave still owes freeze pack even if P03 units finished first |

**Do not start P07 journey residual as a substitute for either P03 browser close or P02 freeze pack.**

---


---

## Agent 5 scorecard (2026-07-10)

| Field | Value |
|-------|--------|
| File | `results/planner/world-standard-wave/03-select-delete/CP-03-SCORECARD.md` |
| Live: one `updateProject(applySelectionDelete)` | **OK** (`OOPlannerWorkspace` ~L327–335) |
| Live: keyboard Del/Bksp `preventDefault` + `!mod` | **OK** (`useWorkspaceKeyboard` ~L83–86) |
| Live: Fabric flag `=== "1"` only | **OK** (`fabricFurnitureFlag.ts`) |
| Unit pack green? | **Y** — `unit-w3-pack.log` (4 files / 62 passed) |
| Browser green? | **Y** — `browser-w3-raw.log` + PNGs 01–04; exit 0 |
| Unit alone = W3? | **NO — FAIL if claimed** |
| **Overall CP-03** | **PASS** (both unit + browser evidence on disk) |
| Honesty residual | Browser count-only; U4 carries id/pose; evidence pack HEAD `aea4e76c` (tip advanced after) |

## Checklist (P03 close criteria)

- [x] Baseline + residual unit gaps (locked, pose+history, canvas select, keyboard edges)
- [x] Full unit pack raw log PASS (62)
- [x] Unit alone **not** claimed as W3 (stated in this file)
- [x] No `applySelectionDelete` signature thrash
- [x] Browser W3 Fabric OFF + Select + place delta
- [x] PNGs + browser raw log
- [x] `run.json` / `HEAD.txt` / acceptance meta
- [x] `W3-ACCEPTANCE.md` from data (unit + browser)
- [x] `CP-03-SCORECARD.md` Agent 5 gate (unit Y + browser Y → overall PASS; unit alone = FAIL reminder)

---

## Metadata

| Field | Value |
|-------|--------|
| Product code changed this phase residual | **None** (tests + evidence only) |
| Units residual | 62 green |
| Browser seat | **PASS** — commit `8660997` |
| W3 / CP-03 | **PASS** — Agent 5 `CP-03-SCORECARD.md` (count-only e2e; U4 id/pose unit bar) |
