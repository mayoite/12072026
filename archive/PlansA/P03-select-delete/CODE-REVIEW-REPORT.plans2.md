# P03 Select Delete (idiotplanners2)

| Field | Value |
|-------|--------|
| **Date** | 2026-07-10 |
| **Checkout** | `D:\OandO07072026` (main only; no worktrees) |
| **HEAD** | `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc` |
| **Plan** | `plans2/P03-select-delete/IMPLEMENTATION-PLAN.md` |
| **Reviewer posture** | Repo first · no product code · no plan edits · `results/` missing = unproven |
| **Verdict** | **FAIL — UNPROVEN (gate closed)** |

---

## Executive summary

P03 / W3 (select furniture → Delete/Backspace → undo same id+pose) has **mostly landed product code** and **partial unit + e2e specs**, but the **canonical evidence tree does not exist**. Entire `D:\OandO07072026\results\` is **absent**. Under this repo’s rules, that is not “almost done” — it is **CP-03 FAIL / non-claimable**.

Live wiring matches Approach A:

- Feasibility Select → `pickFurnitureAtPoint` → transient `CanvasSelection`
- `deleteSelection` → one `applySelectionDelete` → one `updateProject`
- Keyboard Del/Bksp (`!mod`) + `preventDefault` + Ctrl/Cmd+Z undo
- Fabric furniture flag defaults **OFF** (`=== "1"` only)

What is **not** proven on disk: unit pack exit 0 under `03-select-delete/`, browser PNGs 01–04, `run.json` PASS, Fabric-OFF NOTES for this execute, gap tests the plan still lists as missing.

`Plans/phases/P03-select-delete/P03-appendix.md` still says **“CP-03 PASS”** and points at `results/planner/world-standard-wave/03-select-delete/`. That is **stale prose / false-green** relative to this checkout.

**Mode for next execute:** Plan Mode **A / Gamma** — fill unit gaps, re-run unit pack + browser, deposit evidence. Do **not** rewrite working pure helpers unless RED.

---

## Repo truth table

| Claim / artifact | Live path / fact | Status 2026-07-10 |
|------------------|------------------|-------------------|
| Evidence root `results/planner/world-standard-wave/03-select-delete/` | Entire `results/` missing | **ABSENT — unproven** |
| `run.json` / `NOTES.md` / `HEAD.txt` / PNGs / vitest logs | Would live under evidence root | **ABSENT** |
| `pickFurnitureAtPoint` | `site/features/planner/open3d/lib/geometry/canvasPicking.ts` ~L146–164 | **Present** (degrees→rad for hit; `?? 600`) |
| Feasibility select hit order | `FeasibilityCanvas.tsx` ~L736–778 furniture → openings → wall → room → none | **Present** |
| Selection ring paint | `selectedFurnitureIds` ~L203, paint ~L591 | **Present** |
| `applySelectionDelete` pure API | `workspaceEntityHelpers.ts` ~L112–164 returns `Open3dProject` only | **Present** (locked skip, multi-id one clone, wall cascade, same-ref no-op) |
| `deleteSelection` single history | `OOPlannerWorkspace.tsx` ~L326–333 | **Present** (one `updateProject`, then clear selection) |
| Properties single-id delete | `handleDeleteEntity` ~L315–321 | **Present** (allowed dual path; not W3 keyboard proof) |
| Keyboard Del/Bksp/Esc/undo | `useWorkspaceKeyboard.ts` ~L71–104 | **Present** (`!mod` guard; optional `deleteSelection?.()`) |
| Esc clears selection | keyboard + palette `cancel` ~L730–757 | **Present** |
| Transient selection | `useWorkspaceCanvas.ts` selection `useState`; not in history | **Present** |
| History identity | `updateOpen3dProject` same-ref → no past push | **Present** |
| Fabric flag OFF | `fabricFurnitureFlag.ts` only `"1"` enables; env unset in review shell | **Present / OFF** |
| Dual `store/selection.ts` | Typed helper exists; canvas authority is workspace | **Present; not dual-authority at runtime** |
| Unit pick suite | `geometry/canvasPicking.test.ts` hit/miss/top/rot90/pad | **Present** — gaps: empty array, default 600mm omit |
| Unit pure delete | `applySelectionDelete.test.ts` none/single/multi+undo/missing/wall | **Present** — gaps: locked-only same-ref; single-id **pose** restore; multi-id uses **manual** history, not `updateOpen3dProject` |
| Unit keyboard | `open3dWorkspaceKeyboard.test.tsx` Del/Bksp preventDefault, Esc, undo/redo, editable skip Ctrl+K | **Present** — gaps: Ctrl+Bksp no-delete; omit-handler; textarea Delete |
| Unit Feasibility furniture select | `open3dFeasibilityCanvas.test.tsx` | **Missing dedicated case** (`activeTool="select"` only for place-path test ~L200) |
| Browser spec | `site/tests/e2e/open3d-w3-select-delete.spec.ts` | **Present** — asserts count deltas + “No Selection” absent; **no same-entity-id**; systems place dependency |
| Appendix “CP-03 PASS” | `Plans/phases/P03-select-delete/P03-appendix.md` | **Stale vs disk** |
| Plan tasks 00–09 checkboxes | `IMPLEMENTATION-PLAN.md` | **All still open** (plan is execute card; not re-proven) |
| Worktree | Review on main checkout only | **OK** |

---

## Findings

### B — Blocking

| ID | Finding | Evidence |
|----|---------|----------|
| **B1** | **No evidence deposit.** Entire `results/` tree missing. Unit alone cannot close W3; browser alone without artifacts also cannot. CP-03.6–03.9 / Task 07–09 are hard-fail. | `Test-Path results` → false; plan §1.6 + Done-when #1 |
| **B2** | **Gate claims from appendix are invalid.** “CP-03 PASS” without re-deposited `run.json` + logs + PNGs is a **false-green** program risk. | `P03-appendix.md` phase status PASS vs disk absent |
| **B3** | **Browser hard gate never re-proven this checkout.** Spec exists and targets correct folder relative to `site/`, but zero `browser-w3-raw.log`, zero `0{1-4}-*.png`. | e2e present; evidence absent |

### H — High

| ID | Finding | Evidence |
|----|---------|----------|
| **H1** | **No unit proof that Select-tool pointer sets furniture selection.** Production branch exists; Feasibility unit only uses `activeTool="select"` for catalog place path. Task 05 still open. | `open3dFeasibilityCanvas.test.tsx` ~L195–213 vs `FeasibilityCanvas.tsx` ~L736–749 |
| **H2** | **Undo same id + pose under-asserted.** Multi-id test restores ids via manually constructed `history` object, not `updateOpen3dProject` / command path. No case asserts position/rotation/width/depth/catalogId after undo. Plan Task 02 gap remains. | `applySelectionDelete.test.ts` ~L58–91 |
| **H3** | **Locked-only same-ref not unit-tested.** Production filters locked and returns same ref; no locked furniture case in pure suite. | helper ~L132–140; test file has no `locked` cases |
| **H4** | **Unit pack not re-run with artifacts.** Even existing green suites are **unproven this session** without `vitest-w3-raw.log` / exit 0 on disk. | results absent; plan Task 07 |

### M — Medium

| ID | Finding | Evidence |
|----|---------|----------|
| **M1** | Pick suite missing empty-array + omitted width/depth default 600mm cases (code implements both). | `canvasPicking.test.ts` pick describe ends at padding; code `?? 600` |
| **M2** | Keyboard missing Ctrl/Cmd+Backspace/Delete must-not-delete; omit `deleteSelection`; Delete in textarea. Live code has `!mod` + optional chain + editable early return. | keyboard test ends ~L161; code L47, L83–86 |
| **M3** | E2E asserts furniture **count** only (`toBeLessThan` / `toBeGreaterThan`), not same entity id after undo. Acceptable if unit carries CP-03.5 — unit does **not** fully carry pose yet (H2). | `open3d-w3-select-delete.spec.ts` ~L67–78 |
| **M4** | E2E depends on `placeSeatsFromConfigurator(4)` (systems). Flake / systems-red kills W3 browser without inventory fallback. Click `0.5,0.5` may miss. | e2e L47–59; plan §2.7 |
| **M5** | Multi-id one-history is proven only at pure layer + code read of workspace; no integration that `deleteSelection` never loops `updateProject`. Grep shows no id-loop anti-pattern in workspace — residual is “no automated guard.” | workspace L326–331; `deleteEntityFromProject` only in `handleDeleteEntity` |

### L — Low

| ID | Finding | Evidence |
|----|---------|----------|
| **L1** | `store/selection.ts` coexists with canvas selection. Documented non-authority for W3; dual-store migrate out of scope. Residual confusion risk only. | plan §1.1 / 1.5 |
| **L2** | Esc residual: no deselect when focus in INPUT/TEXTAREA (by design; early return). Document in NOTES when re-proving; not a product rewrite. | `isEditableTarget` first in keyboard |
| **L3** | Status-bar furniture count regex in e2e is brittle (`/\d+\s+furniture/i` on body fallback). | e2e `furnitureCount` |
| **L4** | Plan still references brainstormer path `Idiots/P03-select-delete/`; live brainstorm is under `archive/Idiots/P03-select-delete/REPORT.md`. Path drift only — content already baked into plan. | archive vs plan inputs |

---

## Already exists (do not rebuild)

| Piece | Path | Note |
|-------|------|------|
| Pure pick | `lib/geometry/canvasPicking.ts` | Keep degrees; do not thrash |
| Pure multi-delete | `editor/workspaceEntityHelpers.ts` `applySelectionDelete` | Live returns project only — **do not** force appendix `{project,selection}` signature |
| Workspace delete wire | `OOPlannerWorkspace.tsx` `deleteSelection` | One history step |
| Keyboard adapter | `useWorkspaceKeyboard.ts` | Thin; no document mutation |
| Canvas select branch | `FeasibilityCanvas.tsx` | Hit order correct for product bar |
| History + commands | `store/history.ts`, `lib/commands/plannerCommand.ts` | Ref-identity no-op |
| Fabric flag | `fabricFurnitureFlag.ts` | Default OFF |
| Unit: pick core | `geometry/canvasPicking.test.ts` | Add cases only |
| Unit: pure delete core | `applySelectionDelete.test.ts` | Add locked + pose + prefer real history API |
| Unit: keyboard core | `open3dWorkspaceKeyboard.test.tsx` | Add guards |
| E2E skeleton | `open3d-w3-select-delete.spec.ts` | Harden if flaky; deposit evidence |
| Transient selection | `useWorkspaceCanvas.ts` | Never push selection into history |

---

## Residual (honest, post-green)

Even after Mode A close-out, document these — they are **not** silent fails if unit+browser evidence lands:

1. E2E may remain **count-based** for undo identity; unit must own same id+pose.
2. Esc does not clear selection while typing in editable fields.
3. Systems configurator place path is a soft dependency for browser.
4. Openings/walls selectable in canvas but **furniture-only product bar** for CP-03.
5. No re-select after undo; no marquee multi-select; no 3D pick (later module).
6. Properties panel delete is a second path (single id) — OK dual path.

---

## False-green traps

| Trap | Why it fails the bar |
|------|----------------------|
| “Unit tests exist” ⇒ W3 PASS | Unit alone = **CP-03 FAIL** (plan non-negotiable #1) |
| Appendix / expert “CP-03 PASS” | `results/` absent ⇒ claim **void** |
| Journey folder `02-browser-open3d-journey/` substitutes W3 | Wrong evidence root; plan forbids |
| Fabric furniture flag ON as “proof” | Wrong engine for W3 |
| Multi-id delete via loop of `updateProject` | Multi-history undo footgun (not live; do not introduce) |
| Degrees → radians on furniture document | False-reverse killer |
| Count-only e2e + no pose unit | Looks green while identity bar unproven |
| `site/results/` deposit | Layout hard-fail (`check:layout`) |
| Tick INDEX/MASTER W3 without `run.json` PASS on disk | Program lie |

---

## Score

| Dimension | Score (0–10) | Rationale |
|-----------|--------------|-----------|
| Product path land | **8** | Select → delete → history → undo wired; Approach A intact |
| Unit coverage vs plan | **5** | Core cases present; Task 01/02/04/05 gaps still open |
| Browser readiness | **4** | Spec written; unrun; weak identity asserts; systems dependency |
| Evidence / gate honesty | **0** | `results/` missing; appendix PASS is stale |
| Scope discipline | **9** | No Fabric thrash; no dual selection migration; furniture bar held in plan |
| **Overall CP-03 claim** | **1** | Code landable ≠ phase done. **Gate FAIL until re-proof** |

---

## Kill-order (next work — execute Mode A)

1. **Task 00** — Create `results/planner/world-standard-wave/03-select-delete/`; `HEAD.txt`; NOTES scaffold; Fabric OFF; baseline vitest log (honest exit).
2. **Tasks 01–02, 04–05** — Add missing unit cases (pick empty/default 600; locked + pose undo via `updateOpen3dProject`; Ctrl+Bksp/omit/textarea; Feasibility furniture select setSelection). GREEN without production thrash if live code holds.
3. **Task 03 / 06** — Grep-verify single-history delete + Esc cancel clear (already look correct; log only unless RED).
4. **Task 07** — Full W3 unit pack + optional `p0:unit`; deposit logs. **Do not claim CP-03 yet.**
5. **Task 08** — Playwright (or chrome-devtools) W3 spec; PNGs 01–04; Fabric OFF. Fail = FAIL.
6. **Task 09** — `run.json` + W3-ACCEPTANCE + FILES-TOUCHED + NOTES residuals; then only tick program checklists if unit **and** browser green on disk.

Do **not** open P04 orbit / P07 journey as substitute proof.

---

## Bottom line

**Verdict: FAIL — UNPROVEN.**

Production select/delete/undo for open3d Feasibility is largely **already implemented** and directionally correct. The phase is **not done**: gap tests remain, and — decisive — **there is zero `results/planner/world-standard-wave/03-select-delete/` pack**. Any “W3 green” language (appendix or otherwise) is **false-green** until Mode A re-proof deposits unit logs + browser artifacts + `run.json` with honest PASS/FAIL.

### Top 3

1. **`results/` entirely missing** → CP-03 hard FAIL / unclaimable (B1).
2. **No dedicated Feasibility furniture-select unit + weak undo pose/id unit path** (H1, H2).
3. **Browser spec unrun this checkout**; count-only identity + systems place dependency (B3, M3, M4).

---

*Review only. No product code. No plan edits. HEAD `cb62c4eb5fff3a0c3e1ea099809b4e7d77d74ecc`.*
