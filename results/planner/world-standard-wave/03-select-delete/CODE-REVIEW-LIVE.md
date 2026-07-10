# CODE-REVIEW-LIVE — P03 Select / Delete (W3 residual)

**Date:** 2026-07-10  
**Seat:** Read-only product code · live re-verify of `plans1/P03-select-delete/CODE-REVIEW-REPORT.md`  
**Checkout:** `.` (main only)  
**Source plan report:** `plans1/P03-select-delete/CODE-REVIEW-REPORT.md`  
**This file:** `results/planner/world-standard-wave/03-select-delete/CODE-REVIEW-LIVE.md`

---

## Verdict

**APPROVE-WITH-FIXES — Mode A residual only.**

Product select/delete/undo path is **landed and correct on disk**. Prior CODE-REVIEW H/M findings on **test gaps + evidence** remain **true**.  
CP-03 / W3 is still **OPEN**: evidence dir now exists but is **empty** (no vitest logs, PNGs, `run.json`, `W3-ACCEPTANCE.md`).  
**Do not rebuild** pure helpers, pick, keyboard, or Fabric path. **Do not** treat appendix PASS or unit-only green as W3.

---

## Live re-verify table (2026-07-10)

| Artifact | Path | Status |
|----------|------|--------|
| `applySelectionDelete` | `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` L112–164 | **Present** — empty/`none` same-ref; locked skip; wall cascade; returns `Open3dProject` only |
| `deleteSelection` wire | `…/editor/OOPlannerWorkspace.tsx` L325–333 | **Present** — one `updateProject(applySelectionDelete)` then clear selection |
| `pickFurnitureAtPoint` | `…/lib/geometry/canvasPicking.ts` L145–164 | **Present** — reverse scan; inverse-rot AABB; `?? 600`; padding |
| Select pointer | `…/canvas-feasibility/FeasibilityCanvas.tsx` L736–778 | **Present** — furniture → openings → wall → room |
| Keyboard Del/Bksp | `…/editor/useWorkspaceKeyboard.ts` L83–86 | **Present** — `!mod` + `preventDefault` + optional handler; editable early-return L47 |
| History identity | `…/store/history.ts` `updateOpen3dProject` L82–98 | **Present** — same ref = no past push |
| Unit pure delete | `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` | **Partial** — none/remove/multi hand-rolled/missing/wall; **no locked / pose / `updateOpen3dProject` / empty furniture ids** |
| Unit pick | `…/geometry/canvasPicking.test.ts` | **Partial** — hit/miss/top/rot90/pad; **no empty array / default-600** |
| Unit keyboard | `…/open3dWorkspaceKeyboard.test.tsx` | **Partial** — Del/Bksp preventDefault; Esc; editable Ctrl+K only; **no Ctrl+Bksp / Del-in-input / omitted handler** |
| Unit canvas select | `…/open3dFeasibilityCanvas.test.tsx` | **Gap** — `activeTool="select"` used only for **place** path; **no furniture → setSelection** |
| Wire deleteSelection | `workspaceDeleteSelection.wire.test.ts` | **Absent** (optional if Task 02 covers) |
| E2E W3 | `site/tests/e2e/open3d-w3-select-delete.spec.ts` | **Present** — place → Select → click → Delete → Ctrl+Z; **count-only**; raw Select button; `clickOnCanvas` |
| Evidence folder | `results/planner/world-standard-wave/03-select-delete/` | **Exists, empty** (only this live review will land here first) |
| `updateOpen3dProject` in any test | `site/tests/**` | **Zero matches** — history seam untested via real API |

---

## Confirmed still true (do not rebuild)

1. **Approach A is production:** Feasibility + document furniture; transient `CanvasSelection`; pure `applySelectionDelete` → one `updateProject`; Fabric default OFF.
2. **`applySelectionDelete` API** returns `Open3dProject` only (not appendix `{project,selection}`). Repo wins.
3. **Locked skip + same-ref no-op** already implemented (L132–140).
4. **Multi-id single revision** already implemented (filter once, one new floor/project).
5. **`deleteSelection` is not an N-loop** — single `updateProject` then clear selection.
6. **Keyboard** Del/Bksp with `!mod` + preventDefault + optional `deleteSelection?.()` already correct.
7. **Pick** reverse order, degrees rotation, default 600, padding already correct.
8. **Select hit order** furniture-first already correct in FeasibilityCanvas.
9. **Baseline unit suites exist** — extend, do not rename or replace with `deleteSelection.test.ts`.
10. **E2E skeleton + manifest gate** (`playwrightOpen3dWorldSpecs` → W3) exist; need run + evidence, not rewrite of place path.
11. **Esc cancel clears selection** in workspace cancel handlers (code audit; theater-only mock test still optional skip).
12. **Do not dual-store** to `store/selection.ts`; open3d authority is workspace `CanvasSelection`.

---

## Residual unit tests still missing (each = one TDD task)

| ID | Gap | Production already? | Extend file |
|----|-----|---------------------|-------------|
| U1 | `pickFurnitureAtPoint` empty array → null | Yes | `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` |
| U2 | Missing width/depth defaults to 600mm footprint (hit at 0/290, miss at 310) | Yes (`?? 600`) | same |
| U3 | Locked furniture selected → same project ref; id remains | Yes | `site/tests/unit/features/planner/open3d/applySelectionDelete.test.ts` |
| U4 | `updateOpen3dProject` + pure delete + undo restores **same id + pose** (position, rotation, W/D, catalogId) | Yes (history + pure) | same — **must import `updateOpen3dProject`** |
| U5 | Multi-id delete via `updateOpen3dProject` → **exactly one** `past` entry; undo restores all ids | Hand-rolled multi exists; **not** real history API | same |
| U6 | `type: "furniture", ids: []` → same ref | Yes (`ids.length === 0`) | same |
| U7 | Ctrl/Cmd+Backspace does **not** call `deleteSelection` | Yes (`!mod`) | `…/open3dWorkspaceKeyboard.test.tsx` |
| U8 | Delete while focus in `<input>` does not delete | Yes (editable early-return) | same |
| U9 | Omitted `deleteSelection` handler does not throw | Yes (`?.()`) | same |
| U10 | Select tool pointer on furniture → `selection = { type: "furniture", ids: [id] }` | Yes (Feasibility L740–746) | `…/open3dFeasibilityCanvas.test.tsx` |
| U11 | Select tool empty click → selection `{ type: "none", ids: [] }` | Yes (L769–775) | same |

**Optional (only if U4/U5 leave wire doubt):**

| ID | Gap | File |
|----|-----|------|
| U12 | Workspace-level single history for multi-id (optional wire) | **Create** `site/tests/unit/features/planner/open3d/workspaceDeleteSelection.wire.test.ts` |

**Not residual (already covered — do not re-do as primary work):**

- none selection same-ref  
- single furniture remove  
- multi-id via hand-rolled past (keep; supersede with U5 for history claim)  
- missing id same-ref  
- wall cascade doors/windows  
- pick hit/miss/top/rot90/padding  
- Del/Bksp preventDefault happy path  
- Esc → cancel  

---

## Residual browser gaps

| ID | Gap | Severity |
|----|-----|----------|
| B1 | Spec never run / **no PNGs, no `browser-w3-raw.log`** under evidence folder | **Hard gate** |
| B2 | Asserts **furniture count only** — not same entity id/pose in browser | Accepted for minimal CP-03 **only if U4 green**; document non-claim in NOTES |
| B3 | Uses raw `getByRole(…/Select/)` instead of `selectPlannerTool(page, "Select")` | Flake / arming hygiene |
| B4 | Uses `clickOnCanvas` (+2,+2 drag) for select hit — may deselect/miss; prefer `tapOnCanvas` if red | Flake |
| B5 | Default tool is `wall` in workspace — Select must be armed (spec does click Select; harden with helper) | Already partially mitigated |
| B6 | Fabric env must be **unset / ≠ `"1"`** during proof; document in NOTES | Gate hygiene |
| B7 | Esc browser clear-selection — optional stretch; **not** CP-03 blocker if Del path proven | Low |

---

## False-green risks

| Risk | Defense |
|------|---------|
| Unit pack green = W3 PASS | Browser Task required; unit alone = FAIL |
| Empty evidence dir + this review = proven | Folder existence ≠ pack; need logs/PNGs/`run.json` |
| Appendix / phase card “CP-03 PASS” | Stale; ignore for gate |
| Journey folder (`02-browser-open3d-journey/`) substitutes W3 | Forbidden |
| Hand-rolled multi-id history “proves” undo identity | Must land U4/U5 with `updateOpen3dProject` |
| Count-only browser “proves same id” | Document non-claim; U4 carries id/pose bar |
| Fabric flag-ON dual hit surface | Unset env before browser; NOTES |
| Reintroducing N× `updateProject` in `deleteSelection` | U5 + code audit; production currently correct |
| Theater Esc unit that only mocks `setSelection` | Skip weak pure mock; rely on cancel-path audit / optional real wire |
| Plan Task 05 snippet `width: 600, depth: 600, depth: 0` | **Bug at execute** — use `rotation: 0` or omit; do not paste duplicate `depth` |
| Brainstormer path `Idiots2/…` | Live is `archive/Idiots2/P03-select-delete/REPORT.md` |
| Absolute furniture ≥1 without place delta | Keep before/after place assert in e2e |
| Evidence under `site/results/` | Root `results/` only |

---

## Ordered implement list (Task 1…N)

TDD: write/extend **failing or missing assertion first**; run suite; **production edit only if red**. Mode A expects GREEN without product edits for U1–U11.

### Task 1 — Pick completeness
**Extend:** `site\tests\unit\features\planner\open3d\geometry\canvasPicking.test.ts`  
**Cases:** U1 empty array; U2 default 600mm.  
**Prod only if red:** `site/features/planner/open3d/lib/geometry/canvasPicking.ts`  
**Evidence:** `results/planner/world-standard-wave/03-select-delete/01-pick-furniture-vitest-raw.log`

### Task 2 — Pure delete + real history identity (highest conviction residual)
**Extend:** `site\tests\unit\features\planner\open3d\applySelectionDelete.test.ts`  
**Cases:** U3 locked same-ref; U4 pose+id via `updateOpen3dProject`+undo; U5 multi-id one past; U6 empty furniture ids.  
**Import:** `updateOpen3dProject` from `@/features/planner/open3d/store/history` (currently **unused in entire test tree**).  
**Prod only if red:** `site/features/planner/open3d/editor/workspaceEntityHelpers.ts`  
**Evidence:** `…/02-delete-undo-vitest-raw.log`

### Task 3 — Keyboard edges
**Extend:** `site\tests\unit\features\planner\open3d\open3dWorkspaceKeyboard.test.tsx`  
**Cases:** U7 Ctrl/Cmd+Bksp; U8 Del in input; U9 omitted handler.  
**Prod only if red:** `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`  
**Evidence:** `…/04-keyboard-delete-vitest-raw.log`

### Task 4 — Canvas select → setSelection (highest interaction residual)
**Extend:** `site\tests\unit\features\planner\open3d\open3dFeasibilityCanvas.test.tsx`  
**Cases:** U10 furniture hit → furniture selection; U11 empty click → none.  
**Coord:** seed mm; `projectToScreen` with `{ origin: {-4000,-2500}, scale: 0.1 }`; mock rect 800×600; **no** `fitToView`; `useWorkspaceCanvas({ initialProject })` + `activeTool="select"`.  
**Fix plan snippet:** `rotation: 0` not second `depth`.  
**Prod only if red:** `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`  
**Evidence:** `…/05-canvas-select-vitest-raw.log`

### Task 5 — Optional wire (skip if Task 2 U4/U5 sufficient)
**Create only if needed:** `site\tests\unit\features\planner\open3d\workspaceDeleteSelection.wire.test.ts`  
**Assert:** multi-id path cannot become N history steps at command/`updateOpen3dProject` seam.  
**Evidence:** `…/03-workspace-delete-vitest-raw.log`

### Task 6 — Unit pack deposit
Run full W3 unit set; deposit `vitest-w3-raw.log` / `p0-unit-raw.log` + `p0-unit-run.json` under evidence folder.  
**Unit green ≠ W3.**

### Task 7 — Browser hard gate
**Harden then run:** `site\tests\e2e\open3d-w3-select-delete.spec.ts`  
**Prefer:** `selectPlannerTool(page, "Select")`; keep place delta; Fabric env unset; PNGs `01-placed`…`04-undone` (or NOTES-named scheme).  
**On flake:** try `tapOnCanvas` for select hit.  
**Evidence:** `browser-w3-raw.log` + PNGs.  
**Optional helper:** export `getFurnitureCount` from `site/tests/e2e/plannerCanvasHelpers.ts`.

### Task 8 — Sign-off
Only after Task 6 **and** Task 7 green: `W3-ACCEPTANCE.md`, `run.json`, `HEAD.txt`, `NOTES.md` (Fabric OFF, count-only browser non-claim, unit id/pose claim).  
**Never** tick MASTER/INDEX W3 without browser artifacts.

---

## Stop rules

1. **No Fabric ON** for W3 proof (`NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE` ≠ `"1"` / unset).  
2. **Unit alone ≠ W3** — browser pack mandatory.  
3. **Evidence folder name (canonical only):**  
   `results/planner/world-standard-wave/03-select-delete/`  
   Never `site/results/`, never journey folder substitute.  
4. **No product rewrite** of working pure/pick/keyboard unless a new test is legitimately red.  
5. **No worktrees**; main checkout only.  
6. **Do not** rename suites mid-phase to stale card names (`deleteSelection.test.ts`).  
7. **Do not** change `applySelectionDelete` return shape to appendix tuple.  
8. **Stop on red** — fix minimal; do not paper PASS.  
9. **Skip Task 5 theater Esc mock** if it only sets selection none without real cancel wiring.

---

## Score vs prior report

| Dimension | Prior | Live 2026-07-10 |
|-----------|-------|-----------------|
| Product code landed | Yes | **Confirmed** |
| Test gaps listed | Accurate | **Still accurate; none closed** |
| Evidence | `results/` missing | **Dir exists, pack empty → still unproven** |
| `updateOpen3dProject` in tests | Missing | **Still zero usages** |
| Plan snippet / Idiots path bugs | Noted | **Still execute hazards** |

**Overall residual score for implement readiness:** **8/10** — clear Mode A task list; no architecture rewrite.

---

## Top 5 residual tasks (for implementer / head)

1. **Task 2 (U3–U6)** — locked + **`updateOpen3dProject` pose/id undo** + multi-id one-past in `applySelectionDelete.test.ts`  
2. **Task 4 (U10–U11)** — Feasibility select pointer → `setSelection` furniture / clear  
3. **Task 3 (U7–U9)** — keyboard Ctrl+Bksp, Del-in-input, omitted handler  
4. **Task 1 (U1–U2)** — pick empty + default 600mm  
5. **Task 7** — browser W3 run with Fabric OFF + evidence PNGs/logs (hard gate)

---

## Metadata

| Field | Value |
|-------|--------|
| Product code changed | **None** (read-only seat) |
| Plan files edited | **None** |
| Evidence written | This file only |
| Next seat | TDD implementer — start Task 1 or Task 2 (prefer Task 2 first for correctness bar) |
