# CODE-REVIEW-REPORT — P03 Select Delete

**Date:** 2026-07-10  
**Verdict:** **APPROVE-WITH-FIXES**  
**Reviewer seat:** Read-only product code · plan vs live repo truth · no product edits · no `IMPLEMENTATION-PLAN.md` edits  
**Checkout:** `.` (main only; no worktrees)

---

## Executive summary

The implementation plan is **aligned with live open3d product code**. Approach **A** (FeasibilityCanvas + document model; Fabric furniture flag OFF; selection transient; pure `applySelectionDelete` → one `updateProject`; undo via history) is **already landed** in production paths. The plan’s dual-truth posture—**code mostly present, evidence tree absent, Mode A = close test gaps + re-prove**—matches disk.

**CP-03 / W3 is unproven on this checkout:** `results/` does not exist. Appendix and any prior “CP-03 PASS” language are **stale gate claims**. Unit suites exist but miss locked/pose/`updateOpen3dProject` cases and a dedicated Feasibility furniture-select pointer test. Browser spec exists (count-only, not id/pose). Plan correctly refuses unit-only or journey-substitute green.

**Do not rewrite working pure helpers or re-open Fabric cutover.** Execute Mode A: extend tests (TDD where behavior is asserted), deposit evidence under `results/planner/world-standard-wave/03-select-delete/`, harden browser Select path. Fix plan-side path typo and Task 05 snippet bug before copy-paste execute (report notes only; plan file left untouched per brief).

---

## Repo truth table

| Claim / artifact | Live path | Verified 2026-07-10 | Plan claim | Match? |
|------------------|-----------|---------------------|------------|--------|
| `pickFurnitureAtPoint` | `site/features/planner/open3d/lib/geometry/canvasPicking.ts` ~L145–164 | Reverse scan, inverse-rot AABB, `?? 600`, padding arg | Present; snippet matches | **Yes** |
| Select pointer path | `…/canvas-feasibility/FeasibilityCanvas.tsx` ~L736–778 | Furniture → openings → wall → room; padding `Math.max(20, 40/scale)` | Present | **Yes** |
| Selection ring paint | FeasibilityCanvas ~L591–623 | `selectedFurnitureIds` dashed ring | Present | **Yes** |
| `INITIAL_TRANSFORM` | FeasibilityCanvas L63–65 | `{ origin: {-4000,-2500}, scale: 0.1 }` | Correct | **Yes** |
| `deleteSelection` | `…/editor/OOPlannerWorkspace.tsx` L325–333 | One `updateProject(applySelectionDelete)` then clear selection; **no N-loop** | Present | **Yes** |
| Esc clears selection | OOPlannerWorkspace ~L730–757 | Both palette + keyboard cancel clear selection | Present | **Yes** |
| Default tool | OOPlannerWorkspace L183 | `useState<PlannerTool>("wall")` | Plan notes Select must be armed | **Yes** |
| Keyboard Del/Bksp | `…/editor/useWorkspaceKeyboard.ts` L83–86 | `!mod` + `preventDefault` + optional handler | Present | **Yes** |
| Editable early-return | same L47 | Before delete block | Present | **Yes** |
| `applySelectionDelete` | `…/editor/workspaceEntityHelpers.ts` L112–164 | Returns **`Open3dProject` only**; locked skip; same-ref no-op; wall cascade | Repo wins over appendix `{project,selection}` | **Yes** |
| History no-op on same ref | `…/store/history.ts` `updateOpen3dProject` L82–98 | `if (updated === history.present) return history` | Correct | **Yes** |
| Command write seam | `useWorkspaceCanvas` `document.update` / `history.undo` | Sole history write authority | Correct | **Yes** |
| Selection transient | `useWorkspaceCanvas` L86–90 | `useState` CanvasSelection; not in history | Correct | **Yes** |
| `store/selection.ts` | PlannerSelection helper | **Not** open3d runtime authority (`CanvasSelection` is) | “Do not dual-store migrate” | **Yes** |
| Fabric flag | `fabricFurnitureFlag.ts` | Enabled only if env `=== "1"`; default OFF | Correct | **Yes** |
| Fabric layer wire | OOPlannerWorkspace ~L234, ~L950 | Flag gates layer; Feasibility furniture hidden when ON | W3 must prove OFF | **Yes** |
| Unit: pick | `site/tests/unit/…/geometry/canvasPicking.test.ts` | hit/miss/top/rot90/pad; **no** empty / default-600 cases | Gaps listed | **Yes** |
| Unit: pure delete | `…/applySelectionDelete.test.ts` | none/remove/multi hand-rolled past/missing/wall cascade; **no** locked / pose via `updateOpen3dProject` / empty ids | Gaps listed | **Yes** |
| Unit: keyboard | `…/open3dWorkspaceKeyboard.test.tsx` | Del/Bksp preventDefault; Esc; editable Ctrl+K only; **no** Ctrl+Bksp / Del-in-input / omitted handler | Gaps listed | **Yes** |
| Unit: canvas select | `…/open3dFeasibilityCanvas.test.tsx` | walls/room/place; select tool used for **place** only | **No furniture select→setSelection** | **Yes** |
| E2E W3 | `site/tests/e2e/open3d-w3-select-delete.spec.ts` | place seats → Select → click → Delete → Ctrl+Z; count deltas; PNGs to evidence dir | Present; count-only | **Yes** |
| Manifest gate | `playwrightOpen3dWorldSpecs.test.ts` | W3 → `open3d-w3-select-delete.spec.ts` | Present | **Yes** |
| Evidence tree | `results/planner/world-standard-wave/03-select-delete/` | **`results/` does not exist** | Absent / re-prove | **Yes** |
| Status bar furniture count | WorkspaceShell L386–391 `pw-status-bar` | `{n} furniture` | E2E parser OK | **Yes** |
| `selectPlannerTool` helper | `plannerCanvasHelpers.ts` L91–97 | Exists; live W3 spec uses raw `getByRole` | Plan optional harden | **Yes** |
| Brainstormer report | Plan: `Idiots2/P03-…` | Live: **`archive/Idiots2/P03-select-delete/REPORT.md`** only | Path wrong | **No** |
| Phase appendix | `Plans/phases/P03-select-delete/P03-appendix.md` | Claims CP-03 **PASS** + evidence | Plan: stale | **Yes (stale)** |
| Execute card inventory | `P03-select-delete.md` | Still mentions pre-land gaps / `deleteSelection.test.ts` | Plan prefers live names | **Yes (stale card)** |

---

## Findings (B / H / M / L)

Format: **Claim → Verified → Judgment → Action**

### Blocking (B)

None for **plan quality as an execute Mode A guide**. Product code is not missing. Gate green is blocked by **missing evidence**, not by a false architecture in the plan.

| ID | Claim → Verified → Judgment → Action |
|----|--------------------------------------|
| B0 | *Implicit “can tick W3 now”* → `results/` absent; no live unit/browser raw logs under canonical folder → **Gate not green** → Execute Tasks 00 + 07–09; **never** paper PASS from appendix. |

### High (H)

| ID | Claim → Verified → Judgment → Action |
|----|--------------------------------------|
| H1 | **CP-03 proven / appendix PASS** → Appendix header “PASS” + “Browser hard gate Met”; disk has **zero** `results/planner/…/03-select-delete/` → **False-green if trusted** → Treat appendix as design history only; re-deposit full pack; plan Mode A is correct. |
| H2 | **Unit-only or journey substitute = W3** → Plan non-negotiables forbid this; no journey folder can replace `03-select-delete/` → **Judgment sound** → Keep Task 08 hard gate; do not re-label P07 journey as W3. |
| H3 | **Browser proves same id + pose** → Goal/done-when mention id when observable; live e2e asserts **furniture count only** (no id/pose) → **Residual gap** (plan admits count-only) → Accept for minimal CP-03 **only if** unit pack asserts id+pose (Task 02); optional e2e id assert later; do not claim browser id proof until instrumented. |
| H4 | **Product rewrite needed** → Live `deleteSelection` / pure delete / pick / keyboard match plan §1.2 → **Rewrite would thrash** → Stay Mode A; Mode C greenfield only if code deleted (unlikely). |

### Medium (M)

| ID | Claim → Verified → Judgment → Action |
|----|--------------------------------------|
| M1 | Brainstormer at `Idiots2/P03-…` → Only `archive/Idiots2/P03-select-delete/REPORT.md` exists; no root `Idiots2/` → **Stale path in plan** → Execute agents open **archive** path; do not invent new Idiots tree. |
| M2 | Task 05 fixture `width: 600, depth: 600, depth: 0` → Duplicate `depth` key in plan snippet (L1158-ish) → **Copy-paste would drop rotation intent / confuse** → Fix at execute: `rotation: 0` or drop second key; production path OK. |
| M3 | Test gaps (locked, pose+`updateOpen3dProject`, empty ids, canvas select, Ctrl+Bksp, Del-in-input) → Confirmed missing in live tests; production already implements most behavior → **Plan gaps accurate** → Land Task 01–05 extensions; expect GREEN without production edits. |
| M4 | Multi-id history via **hand-rolled** past in `applySelectionDelete.test.ts` (not `updateOpen3dProject`) → Plan Task 02/03 close this → **Real coverage hole for history identity** → Prefer `updateOpen3dProject` assertions (and optional wire test). |
| M5 | Task 06 optional “simulates workspace cancel” only sets selection none → **Theater test** if shipped alone → Keep code audit of both cancel sites (already correct live); skip weak pure mock or fold into real wiring. |
| M6 | Default tool `wall` + browser click 0.5/0.5 → Select must arm; hit may miss if place cluster not under center → **Flake risk** → Use `selectPlannerTool(page, "Select")`; keep place delta; debug red with screenshots kept. |
| M7 | Execute card still lists `deleteSelection.test.ts` / “missing pick” inventory → Live: `applySelectionDelete.test.ts` + pick suite present → **Stale phase card** → Plan already prefers live names; do not rename suites mid-phase. |
| M8 | Properties `handleDeleteEntity` vs keyboard multi-id → Both live; plan allows dual delete paths → **OK for P03** → Do not force panel multi-batch. |

### Low (L)

| ID | Claim → Verified → Judgment → Action |
|----|--------------------------------------|
| L1 | `store/selection.ts` vs `CanvasSelection` → Two types; open3d uses workspace state → Plan: no dual-store migrate → Keep. |
| L2 | Wire test optional vs Task 02 `updateOpen3dProject` cases → Some overlap → Optional Task 03 is fine; not required if Task 02 covers one-past. |
| L3 | Evidence PNG naming 01–04 vs w3-01-* → Plan allows either with NOTES → Pick one in NOTES. |
| L4 | `clickOnCanvas` slight move (+2,+2) → May deselect/miss edge hits rarely → Prefer `tapOnCanvas` if flake on select. |
| L5 | Research ethics / non-copy sections → Aligned with AGENTS + Idiots2 report → No product action. |

---

## Already exists (do not rebuild)

| Capability | Location | Notes |
|------------|----------|--------|
| Furniture hit-test | `canvasPicking.ts` `pickFurnitureAtPoint` | Degrees rotation; 600 default |
| Select tool interaction | `FeasibilityCanvas.tsx` | Furniture-first hit order |
| Selection highlight | Feasibility paint path | Token primary stroke |
| Pure batch delete | `applySelectionDelete` | Locked skip; wall cascade; same-ref |
| Workspace delete wire | `OOPlannerWorkspace.deleteSelection` | Single history step |
| Keyboard Delete/Backspace | `useWorkspaceKeyboard` | preventDefault + `!mod` |
| Esc deselect | cancel handlers ×2 | Clears pending place + selection |
| Undo/redo | command `history.undo` / keyboard Ctrl+Z | |
| History identity | `updateOpen3dProject` | Same ref = no past push |
| Fabric OFF default | `isOpen3dFabricFurnitureEnabled` | |
| Unit baselines | pick, pure delete, keyboard, feasibility (partial) | |
| E2E W3 skeleton | `open3d-w3-select-delete.spec.ts` | Needs run + evidence deposit |
| Status bar counts | `WorkspaceShell` `pw-status-bar` | `{n} furniture` |
| Tool helper | `selectPlannerTool` | Prefer over raw button click |

---

## Residual / re-prove

| Item | Status | Re-prove how |
|------|--------|--------------|
| Full unit pack green on HEAD | Unproven (no log deposit) | Task 00 baseline + Task 07 vitest pack → raw logs |
| Locked delete same-ref | Code yes; test **no** | Task 02 case |
| Undo same id + pose | Multi-id restores ids; **pose not asserted** | Task 02 via `updateOpen3dProject` |
| Canvas select → setSelection | Code yes; unit **no** | Task 05 pointer cases |
| Browser place→select→delete→undo | Spec yes; **not run / no PNGs** | Task 08 Playwright (Fabric env unset) |
| Fabric flag OFF during proof | Code default OFF | NOTES + `Remove-Item Env:…` in Task 08 |
| CP-03.1–03.11 table | Not green | Task 09 `W3-ACCEPTANCE.md` + `run.json` only after 07+08 |
| Browser id/pose | Not asserted | Unit pose; browser optional later |
| Esc browser | Optional stretch | Not CP-03 blocker if Del path proven |

**results/ missing = unproven.** No log, PNG, or `run.json` under the canonical folder → W3 remains **OPEN**.

---

## False-green risks

| Risk | How it appears | Plan defense | Residual |
|------|----------------|--------------|----------|
| Unit pack green = W3 | Agent ticks MASTER after vitest | Task 08 hard gate; unit alone = FAIL | Enforce at sign-off |
| Appendix “PASS” memory | Agent cites P03-appendix | Plan §0.1 dual-truth | Agents still read appendix first — **call out** |
| Journey folder substitute | `02-browser-open3d-journey/` | Explicit ban | — |
| Fabric flag-ON proof | Dual hit surfaces | Flag OFF + NOTES | Check env in browser run |
| Multi-history delete | N× `updateProject` loop | Live code fixed; audit Task 03 | Guard against reintroduce |
| Hand-rolled history unit | Looks like undo tested | Task 02 forces `updateOpen3dProject` | Do not skip |
| Count-only browser | Undo “works” without same id | Goal says id when observable | Document non-claim in NOTES |
| Absolute furniture ≥1 | Pass without place delta | Plan bans | Keep before/after place assert |
| Default tool wall | Delete without select | Force Select | Live e2e does click Select; prefer helper |
| Evidence gitignored / not written | Local green only | Task 00 create dir + raw logs | Layout: root `results/` only |
| Stale execute inventory | Rebuild pick/delete from scratch | Mode A default | — |

---

## Score (1–10)

**8 / 10**

| Dimension | Score | Note |
|-----------|-------|------|
| Repo dual-truth accuracy | 9 | Paths, APIs, gaps match disk |
| Execute posture (Mode A) | 9 | Re-prove > rewrite |
| False-green hygiene | 9 | Unit≠W3, evidence rules |
| Test gap completeness | 8 | Good matrix; wire optional overlap |
| Plan hygiene (paths/snippets) | 6 | Wrong Idiots2 path; Task 05 typo |
| Browser proof honesty | 7 | Count-only residual stated |
| Scope control | 9 | Out-of-scope list correct |

Not 9–10: path error + snippet bug + browser id residual + weak Esc “unit” option.

---

## Kill-order notes

| Rule | Assessment |
|------|------------|
| After CP-02 / engine lock | Plan assumes spine position; not re-verified here beyond open3d presence |
| W3 before celebrating full journey | Correct — P07 separate folder |
| One CP: unit **+** browser | Correct — split rejected |
| Furniture-only product bar | Correct — openings/walls not gate targets |
| Fabric full stage after W gates | Correct — prove Feasibility |
| No worktrees; main checkout | Correct |
| Evidence only root `results/` | Correct; currently **missing** |

**Execute order (plan Tasks 00→09):** baseline evidence dir → unit gap tests → full unit pack → **browser hard gate** → sign-off. Stop on red. Do not tick INDEX/MASTER W3 without Task 08–09 artifacts.

---

## Bottom line

1. **Product select/delete/undo path is already landed** and matches the plan’s Approach A.  
2. **CP-03 is not green** until unit + browser evidence lives under `results/planner/world-standard-wave/03-select-delete/`.  
3. **Execute Mode A** (gap tests + re-prove); do not greenfield rewrite; fix plan-path/`depth` issues at execute without changing architecture.  

**Verdict: APPROVE-WITH-FIXES** — safe to execute after path/snippet awareness and full evidence deposit; reject any claim of W3 PASS from appendix alone.

---

## Top 3 (for head agent)

1. **`results/` absent → W3 unproven.** Re-prove only; ignore appendix “PASS.”  
2. **Code is present; tests/evidence are the work.** Mode A: extend locked/pose/`updateOpen3dProject`, canvas select unit, keyboard edges; run Playwright W3 with Fabric OFF.  
3. **Plan bugs to avoid at execute:** brainstormer path is `archive/Idiots2/…`; Task 05 duplicate `depth` key; use `selectPlannerTool("Select")`; do not rewrite `applySelectionDelete` signature to appendix’s `{project,selection}`.

---

## Report metadata

| Field | Value |
|-------|--------|
| Plan reviewed | `plans1/P03-select-delete\IMPLEMENTATION-PLAN.md` |
| Optional brainstormer | `archive\Idiots2\P03-select-delete\REPORT.md` |
| Phase card / appendix | `Plans/phases/P03-select-delete/` (stale PASS in appendix) |
| Product scope | `site/features/planner/open3d/**` (read-only) |
| This report | `plans1/P03-select-delete\CODE-REVIEW-REPORT.md` |
| Product code changed | **None** |
| Plan file edited | **None** |
