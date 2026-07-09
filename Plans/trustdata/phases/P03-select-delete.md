# P03 — Select furniture + Delete/Backspace + undo (W3)

> **For agentic workers:** REQUIRED: `/using-superpowers` (test-driven-development, systematic-debugging, verification-before-completion).  
> **Approach:** **A** (product journey first on FeasibilityCanvas + document model).  
> **Do not execute until owner unlocks after workflow briefing** (plan-only until then).  
> **Ethics:** Inspiration patterns only from `D:\websites\floorplanner.com\report\INSPIRATION.md` (select/delete grammar). No competitor UI, chrome, assets, copy, or layout trade dress.

**Goal:** A facilities buyer on `/planner/open3d` (or guest) can **select a placed furniture item on the 2D canvas**, press **Delete or Backspace** to remove it from the document, and press **Ctrl/Cmd+Z** to restore the same entity id and pose. Proof is unit-green + evidence under `results/planner/world-standard-wave/03-select-delete/`. Playwright browser journey is **noted for P07 / wave pack**, not a blocker for CP-03 unit gate.

**Gate:** **W3** — Select furniture + Delete/Backspace removes it; undo restores (Unit required; Playwright later).

**Checkpoint:** **CP-03** = W3 green with unit + evidence (see end of this file).

---

## 1. Product intent (Approach A)

| Intent | Behavior (O&O, not a clone) |
|--------|-----------------------------|
| Select | With **Select tool** (`V`), pointer-down on a furniture footprint selects that item (single-select P0). Empty canvas clears selection. Furniture wins over wall/room when hit. |
| Feedback | Selected furniture shows existing canvas highlight + status/properties selection label. |
| Delete | **Delete** or **Backspace** removes the selected furniture from the active floor document. Properties-panel delete must use the same document write path. |
| Undo | **Ctrl/Cmd+Z** restores furniture (same `id`, `position`, `rotation`, catalog fields) via history. Selection may stay empty after undo (acceptable); document truth is required. |
| Esc | Esc clears in-progress draw/place **and** clears selection (CAD-lite deselect). |
| Out of scope for P03 | Multi-select marquee, 3D pick/delete, Fabric full-stage cutover, move/rotate handles, groups, competitor chrome. |

### Inspiration patterns only (Floorplanner report → O&O)

Source: `D:\websites\floorplanner.com\report\INSPIRATION.md` §2.2, §2.7, §3 (select/delete rows). **Do not copy UI.**

| Pattern (abstract) | O&O action in P03 |
|--------------------|-------------------|
| Click select → object becomes active | Hit-test furniture on FeasibilityCanvas select tool |
| Del / Backspace deletes selection | `useWorkspaceKeyboard` → `deleteSelection` |
| Undo restores last edit | History via `useWorkspaceCanvas` / `executePlannerCommand` |
| Esc deselects / exits | Workspace cancel clears selection |
| Furniture priority over structure in select | Already: furniture pick before wall/room |
| Multi-select marquee | **Stretch after W3** — not required for CP-03 |

---

## 2. Architecture (locked)

```
Pointer (select tool)
  → FeasibilityCanvas.onPointerDown
  → pickFurnitureAtPoint(mm, furniture[], paddingMm)
  → workspaceCanvas.setSelection({ type: "furniture", ids: [id] })
  → paint selection ring + PropertiesPanel resolveSelectedEntity

Delete | Backspace (not in editable field)
  → useWorkspaceKeyboard.deleteSelection
  → OOPlannerWorkspace.deleteSelection
  → pure applySelectionDelete / deleteEntityFromProject (active floor)
  → workspaceCanvas.updateProject (ONE history entry)
  → setSelection(none)

Ctrl/Cmd+Z
  → history.undo → furniture row restored on active floor
```

**Document truth:** `Open3dProject` / active floor `furniture[]`. Selection is **transient** (not in undo stack). Undo restores **document only**.

**Engines:** FeasibilityCanvas is the interactive 2D surface for Approach A. Fabric furniture layer may overlay under flag; do **not** block W3 on Fabric. Prefer proving select on the default (non-flag) Feasibility path.

---

## 3. Tech stack (locked Plan A)

- Next.js site package `site/`
- FeasibilityCanvas (Canvas 2D)
- Vitest unit tests (primary CP-03 proof)
- Playwright **later** (P07 / `02-browser-open3d-journey` pack)
- `crypto.randomUUID` via `newEntityId` for any new fixtures that create entities
- No `any` in handwritten code
- Phosphor / existing O&O chrome only

---

## 4. Honest inventory (repo truth before coding)

**Already present (verify; do not rewrite blindly):**

| Piece | Path | Status |
|-------|------|--------|
| Furniture hit-test | `site/features/planner/open3d/lib/geometry/canvasPicking.ts` → `pickFurnitureAtPoint` | Implemented (rotated AABB, top-most last-in-array) |
| Select tool pick order | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` (~furniture → wall → room) | Implemented |
| Selection ring paint | same file (`selectedFurnitureIds`) | Implemented |
| Selection type | `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` (`CanvasSelection`) | Implemented |
| Selection helpers | `site/features/planner/open3d/store/selection.ts`, `workspaceEntityHelpers.ts` | Implemented |
| Delete entity pure | `workspaceEntityHelpers.ts` → `deleteEntityFromProject` (respects `locked`) | Implemented |
| Workspace deleteSelection | `OOPlannerWorkspace.tsx` | Implemented (gap: multi-id = N history steps) |
| Keyboard Delete/Backspace | `useWorkspaceKeyboard.ts` | Implemented (gap: no `preventDefault`; no unit coverage for Del/Bksp) |
| Keyboard wired | `OOPlannerWorkspace.tsx` passes `deleteSelection` | Implemented |
| Properties delete button | `PropertiesPanel.tsx` → `onDeleteEntity` | Implemented |
| History undo | `store/history.ts` + `lib/commands/plannerCommand.ts` | Implemented |
| Pure removeFurniture | `model/operations/pureActions.ts` | Implemented (model ops path; workspace uses helpers) |

**Missing / broken for W3 proof:**

1. **No unit tests** for `pickFurnitureAtPoint` (file `canvasPicking.test.ts` only covers walls/polygons).
2. **No unit tests** for Delete/Backspace → `deleteSelection` handler.
3. **No pure integration test** place/select-state → delete → undo restores id+pose.
4. **No FeasibilityCanvas pointer test** that selecting furniture sets `selection.type === "furniture"`.
5. **Backspace** does not call `preventDefault` → risk of browser back navigation.
6. **Esc cancel** in workspace does not clear selection (inspiration grammar; W8-adjacent but cheap in P03).
7. **Multi-id delete** loops `updateProject` per id → multi undo steps (fix to single updater even for single-id).
8. Default tool is **`wall`**, not `select` — W3 accepts Select tool (`V` / rail); document that select requires Select tool. Optional polish: after successful place, switch to `select` (product nicety; include only if tests stay small).
9. WAVE note (`results/planner/world-standard-wave/WAVE.md`) still claims select/delete broken — **replace with evidence**, do not trust the note.

**Hooks path note:** There is **no** `open3d/editor/hooks/` directory. Keyboard lives at:

- `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`
- Related: `useWorkspaceCanvas.ts` (same folder)

Do not invent a hooks folder unless a pure helper clearly belongs elsewhere.

---

## 5. Exact files (touch list)

### Primary (expect edits)

| File | Role in P03 |
|------|-------------|
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` | Source of `pickFurnitureAtPoint` (edit only if tests expose bug) |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Select pointer path; ensure furniture select + empty clear |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | `deleteSelection`, keyboard handlers, Esc clears selection |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Delete/Backspace + `preventDefault` |
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | Extract pure `applySelectionDelete` (or sibling) for TDD |

### Supporting (read / thin edit if needed)

| File | Role |
|------|------|
| `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` | `selection`, `updateProject`, `undo` |
| `site/features/planner/open3d/store/history.ts` | Undo stack semantics |
| `site/features/planner/open3d/lib/commands/plannerCommand.ts` | Command write seam |
| `site/features/planner/open3d/store/selection.ts` | `createPlannerSelection` (optional align) |
| `site/features/planner/open3d/editor/PropertiesPanel.tsx` | Confirm delete button still hits `handleDeleteEntity` |
| `site/features/planner/open3d/editor/canvasTool.ts` | Select guidance string already mentions Delete |
| `site/features/planner/open3d/model/operations/pureActions.ts` | Reference for removeFurniture semantics |
| `site/features/planner/open3d/model/types.ts` | `Open3dFurnitureItem` shape for fixtures |

### Tests (create / extend)

| File | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | **Add** `pickFurnitureAtPoint` suite |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | **Add** Delete / Backspace / preventDefault cases |
| `site/tests/unit/features/planner/open3d/deleteSelection.test.ts` | **New** pure delete + history undo restore |
| `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` | **Add** select-furniture pointer case (or thin companion test) |

### Evidence (create on execution)

| Path | Contents |
|------|----------|
| `results/planner/world-standard-wave/03-select-delete/` | Full gate folder (see §9) |

### Do not touch (P03)

- Fabric full stage cutover (`canvas-fabric-stage/*` beyond read)
- Three orbit / 3D pick (`ThreeViewerInner.tsx`) — **P04**
- Autosave honesty — **P06**
- Playwright world journey spec — **P07** (note only here)
- Chrome / shortcut label audit beyond Esc/Delete — **P09**

---

## 6. Pure design for testability

Add a **pure** function (no React) next to entity helpers so TDD does not require mounting the whole workspace:

**Proposed API** (exact names may match surrounding style; keep types strict):

```ts
// workspaceEntityHelpers.ts (or editor/applySelectionDelete.ts if file grows)
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): { project: Open3dProject; selection: CanvasSelection }
```

Rules:

1. `selection.type === "none"` or empty ids → return same project reference + empty selection.
2. Map types: `wall→walls`, `door→doors`, `window→windows`, `furniture→furniture`, `room→rooms`.
3. Remove **all** listed ids from the active floor in **one** project clone (single history entry when wired through one `updateProject`).
4. Skip locked entities (same as `deleteEntityFromProject`); if all locked/missing, project may be unchanged.
5. Always return `selection: { type: "none", ids: [] }` after a successful attempt path (including no-ops that clear intent).
6. **No `any`.**

`OOPlannerWorkspace.deleteSelection` becomes:

1. Read `workspaceCanvas.selection`.
2. `const next = applySelectionDelete(project, selection)`.
3. If `next.project !== project`, `updateProject(() => next.project)` once (or functional updater that applies pure delete).
4. `setSelection(next.selection)`.

**Undo path:** rely on existing `updateOpen3dProject` / `history.undo` — do not push selection into history.

---

## 7. Tasks (TDD — red → green → evidence → commit)

Checkbox progress for executors. Every implementation task: **failing test first**.

### Task 00 — Setup / baseline verification

- [ ] **00.1** Read `Plans/trustdata/00-START.md`, this file, design gate W3 in `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`, inspiration select/delete rows only.
- [ ] **00.2** Confirm Approach **A** and owner unlock for implementation (stop if plan-only).
- [ ] **00.3** Re-read live sources listed in §4–§5 (no worktrees; checkout `D:\OandO07072026`).
- [ ] **00.4** Create evidence dir: `results/planner/world-standard-wave/03-select-delete/`.
- [ ] **00.5** Capture baseline git short status + HEAD into `03-select-delete/NOTES.md` (branch, dirty files). No push.
- [ ] **00.6** Run existing related unit files once for baseline noise (expect pass/fail recorded):

```bash
cd D:\OandO07072026\site
pnpm exec vitest run tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx tests/unit/features/planner/open3d/modelOperations.test.ts --reporter=verbose
```

- [ ] **00.7** Save raw log to `results/planner/world-standard-wave/03-select-delete/00-baseline-vitest-raw.log` and a minimal `00-baseline-run.json` (command, cwd, exit code, timestamp, HEAD).

**Commit (optional if only notes):**  
`docs(planner): P03 baseline evidence dir for W3 select/delete`

---

### Task 01 — Unit: `pickFurnitureAtPoint` (RED → GREEN)

**Files:**  
- Test: `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts`  
- Impl: `site/features/planner/open3d/lib/geometry/canvasPicking.ts` (only if RED exposes a real bug)

**Fixtures:** Build minimal `Open3dFurnitureItem` objects (id, catalogId, position, rotation, scale, width, depth). No full project required.

- [ ] **01.1 RED** — Add describe `pickFurnitureAtPoint` with cases:
  1. Hit center of axis-aligned item → returns id.
  2. Miss outside footprint (beyond padding) → `null`.
  3. Padding expands hit box (point just outside raw half-size but inside padding).
  4. **Top-most wins:** two overlapping items; last array entry returned.
  5. **Rotation:** item rotated 90°; point in rotated footprint hits; old AABB corner may miss.
  6. Empty furniture array → `null`.
  7. Default width/depth fallback when omitted (600mm per implementation).
- [ ] **01.2** Run vitest on the file — **must fail** if any assertion does not match current behavior; if all pass immediately, still keep suite (behavior already correct) and record “green without impl change.”
- [ ] **01.3 GREEN** — Fix `pickFurnitureAtPoint` only for genuine failures (rotation math, padding, order).
- [ ] **01.4** Re-run; save `01-pick-furniture-vitest-raw.log` + update run.json fragment in NOTES.
- [ ] **01.5 Commit:**  
  `test(open3d): cover pickFurnitureAtPoint for W3 select`  
  and if impl fixed:  
  `fix(open3d): correct furniture pick hit-test for select tool`

---

### Task 02 — Pure: `applySelectionDelete` + undo restore (RED → GREEN)

**Files:**  
- New test: `site/tests/unit/features/planner/open3d/deleteSelection.test.ts`  
- Impl: `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` (and/or small pure module)  
- History: `site/features/planner/open3d/store/history.ts` (use only, prefer no edit)

- [ ] **02.1 RED** — Write tests:
  1. Project with one furniture id `furn-1` at known pose; selection `{ type: "furniture", ids: ["furn-1"] }`; `applySelectionDelete` removes furniture; floor.furniture length 0; returned selection empty.
  2. Missing id → project furniture unchanged (or same membership); selection empty.
  3. Locked furniture → not removed (matches helper).
  4. **History integration:** `createOpen3dHistory` → `updateOpen3dProject(history, (p) => applySelectionDelete(p, sel).project)` → furniture gone → `undoOpen3dAction` → furniture id + position + rotation + catalogId restored equal to pre-delete snapshot.
  5. Non-furniture selection type wall (optional one case) uses same helper map — proves shared path without expanding product scope.
- [ ] **02.2** Run — fail until pure function exists / matches.
- [ ] **02.3 GREEN** — Implement `applySelectionDelete` reusing `deleteEntityFromProject` in a loop **inside one project return** (compose without intermediate history).
- [ ] **02.4** Evidence: `02-delete-undo-vitest-raw.log`.
- [ ] **02.5 Commit:**  
  `feat(open3d): pure applySelectionDelete with undo-safe history`

---

### Task 03 — Wire workspace deleteSelection to pure helper (RED → GREEN)

**Files:**  
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`  
- Prefer testing pure + thin workspace behavior; if a hook test is needed, use `renderHook(() => useWorkspaceCanvas(...))` + call the same pure function the workspace will call (avoid brittle full shell mount unless already easy).

- [ ] **03.1 RED** — Extend `deleteSelection.test.ts` or add `workspaceDeleteSelection.test.ts`:
  - Simulate workspace algorithm: given project+selection, one `updateOpen3dProject` then empty selection; assert **single** past entry for multi-id furniture delete (two ids removed → one undo restores both).
- [ ] **03.2 GREEN** — Change `OOPlannerWorkspace.deleteSelection` to:
  - Use pure helper.
  - Single `updateProject` when project changes.
  - Always clear selection after attempt.
  - No behavior change for properties panel `handleDeleteEntity` beyond ensuring it still clears selection (already does).
- [ ] **03.3** Confirm `handleDeleteEntity` remains one-id path (OK) and still uses `deleteEntityFromProject`.
- [ ] **03.4 Evidence: `03-workspace-delete-vitest-raw.log`.
- [ ] **03.5 Commit:**  
  `fix(open3d): single-history deleteSelection for furniture W3`

---

### Task 04 — Keyboard Delete / Backspace (RED → GREEN)

**Files:**  
- `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx`  
- `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts`  
- Wire remains in `OOPlannerWorkspace.tsx` (already passes `deleteSelection`)

- [ ] **04.1 RED** — Cases:
  1. `key: "Delete"` calls `deleteSelection` once.
  2. `key: "Backspace"` calls `deleteSelection` once.
  3. Both call **`preventDefault`** (spy on event or dispatch cancelable event and assert `defaultPrevented`).
  4. With mod key (Ctrl+Backspace) does **not** delete (current `!mod` guard).
  5. Editable `<input>` target does **not** call deleteSelection.
  6. When `deleteSelection` omitted, Delete does not throw.
- [ ] **04.2 GREEN** — In `useWorkspaceKeyboard`, on Delete/Backspace:
  - `event.preventDefault()` before/when invoking handler.
  - Keep editable-target early return.
- [ ] **04.3** Confirm `OOPlannerWorkspace` still passes `deleteSelection` into `useWorkspaceKeyboard`.
- [ ] **04.4 Evidence: `04-keyboard-delete-vitest-raw.log`.
- [ ] **04.5 Commit:**  
  `fix(open3d): Delete/Backspace preventDefault and unit coverage`

---

### Task 05 — Canvas select furniture (RED → GREEN)

**Files:**  
- `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` (or new `feasibilitySelectFurniture.test.tsx` if file is too heavy)  
- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`

**Setup pattern:** Reuse existing ResizeObserver / canvas context mocks from `open3dFeasibilityCanvas.test.tsx`. Seed `useWorkspaceCanvas` with `initialProject` containing one furniture item at a known mm position; map screen coordinates via known transform **or** mock `screenToProject` path by firing pointer at center after `fit`/default transform math documented in test.

- [ ] **05.1 RED** — With `activeTool="select"` and `workspaceCanvas` provided:
  1. Pointer down on furniture footprint → `workspaceCanvas.selection` becomes `{ type: "furniture", ids: [thatId] }`.
  2. Pointer down on empty area → selection `{ type: "none", ids: [] }`.
  3. When tool is `wall`, pointer does **not** set furniture selection (draw path owns the gesture).
- [ ] **05.2 GREEN** — Fix FeasibilityCanvas only if pick/select branch fails (coordinate conversion, tool gate, missing setSelection).
- [ ] **05.3** Visual highlight already depends on `selectedFurnitureIds` — no new chrome; optional assertion that selection ids feed props (state is enough for unit).
- [ ] **05.4 Evidence: `05-canvas-select-vitest-raw.log`.
- [ ] **05.5 Commit:**  
  `test(open3d): FeasibilityCanvas furniture select sets selection`

---

### Task 06 — Esc clears selection (product grammar)

**Files:**  
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`  
- Keyboard test or small unit on cancel behavior

- [ ] **06.1 RED** — Assert cancel path clears selection: either unit-test a small `clearSelection` helper or document that workspace `cancel` handler must call `workspaceCanvas.setSelection({ type: "none", ids: [] })` and cover via keyboard Escape → `cancel` mock that includes setSelection spy in workspace-level test.
- [ ] **06.2 GREEN** — In `useWorkspaceKeyboard` cancel wiring inside `OOPlannerWorkspace`, extend cancel to clear selection + existing canvas cancel + clear pending catalog.
- [ ] **06.3** Do not steal Escape from editable fields (already guarded).
- [ ] **06.4 Commit:**  
  `fix(open3d): Esc clears planner selection (W3 grammar)`

---

### Task 07 — Non-regression + CP-03 evidence pack

- [ ] **07.1** Run the full W3 unit set:

```bash
cd D:\OandO07072026\site
pnpm exec vitest run ^
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts ^
  tests/unit/features/planner/open3d/deleteSelection.test.ts ^
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx ^
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx ^
  tests/unit/features/planner/open3d/modelOperations.test.ts ^
  --reporter=verbose
```

(If a companion select test file was added, include it.)

- [ ] **07.2** Also run non-regression smoke:

```bash
cd D:\OandO07072026\site
pnpm run p0:unit
```

- [ ] **07.3** Write evidence files under `results/planner/world-standard-wave/03-select-delete/`:

| Artifact | Purpose |
|----------|---------|
| `vitest-w3-raw.log` | Full stdout/stderr of W3 unit set |
| `vitest-w3-run.json` | command, cwd, exitCode, HEAD, startedAt, endedAt, test files |
| `p0-unit-raw.log` | p0:unit raw |
| `p0-unit-run.json` | structured |
| `NOTES.md` | Honest summary: what worked, what failed, file list, residual risks |
| `FILES-TOUCHED.md` | Paths changed in P03 |
| `W3-ACCEPTANCE.md` | Checkbox map to W3 criteria with **pass/fail + log pointers** |

- [ ] **07.4** Zero suppression: do not filter failing tests or use `--silent` for sign-off.
- [ ] **07.5** If anything fails: fix or log in `Failures.md` / residual in NOTES — **do not claim CP-03 green**.
- [ ] **07.6 Commit:**  
  `test(open3d): W3 select/delete evidence pack CP-03`

---

### Task 08 — Playwright later note (not CP-03 blocker)

**Explicit deferral (no TBD):**

- Full browser journey belongs in **P07** and/or  
  `site/tests/e2e/open3d-world-standard-journey.spec.ts` (create when P07 executes)  
  with screenshots under `results/planner/world-standard-wave/02-browser-open3d-journey/`.
- Minimum future Playwright steps for W3 (for the later author):
  1. Open guest or member open3d planner.
  2. Place one catalog furniture item (or seed fixture project).
  3. Switch to Select (`V` or tool rail).
  4. Click furniture → assert properties/selection chrome visible (O&O selectors, not competitor).
  5. Press Delete → furniture count 0 / node gone.
  6. Ctrl+Z → furniture restored.
- **CP-03 does not require Playwright green.** Unit + evidence folder is the gate.

- [ ] **08.1** Add a short “Playwright later” subsection to `03-select-delete/NOTES.md` pointing at P07 — no e2e code required in P03.

---

## 8. Implementation notes (avoid thrash)

1. **Select tool required:** Default workspace tool is `wall`. W3 acceptance is “user can select,” not “always in select mode.” Tool rail + `V` already exist (`canvasTool.ts`, `CanvasToolRail.tsx`).
2. **Fabric flag path:** If `isOpen3dFabricFurnitureEnabled()`, furniture layer may intercept pointers when `interactive={activeTool === "select"}`. Prefer default flag-off path for unit proof. If flag-on is default in some env, ensure Feasibility still owns selection state or Fabric writes the same `setSelection` — **do not invent dual selection stores**.
3. **Locked items:** Delete no-ops; properties button already blocks locked. Test one locked case.
4. **IDs:** Undo must restore the **same** furniture `id` (history snapshot), not create a new UUID.
5. **No competitor UI:** Selection ring already uses theme tokens; keep it. No new mega-panels or Floorplanner-like chrome.
6. **Systematic debugging:** If unit green but manual browser fails later, log coordinate transform / focus / preventDefault issues — do not expand into P04 orbit work.
7. **Commit as you go** after each landable task. **Push only on owner ask.** No worktrees.

---

## 9. Evidence root layout (create on execution)

```
results/planner/world-standard-wave/03-select-delete/
  NOTES.md
  FILES-TOUCHED.md
  W3-ACCEPTANCE.md
  00-baseline-vitest-raw.log
  00-baseline-run.json
  01-pick-furniture-vitest-raw.log
  02-delete-undo-vitest-raw.log
  03-workspace-delete-vitest-raw.log
  04-keyboard-delete-vitest-raw.log
  05-canvas-select-vitest-raw.log
  vitest-w3-raw.log
  vitest-w3-run.json
  p0-unit-raw.log
  p0-unit-run.json
```

---

## 10. Checkpoint CP-03 (hard gate)

**CP-03 = W3 green with unit + evidence.**

| # | Criterion | Proof |
|---|-----------|--------|
| CP-03.1 | `pickFurnitureAtPoint` covered and correct for hit/miss/top-most/rotation | `01-*.log` + test file |
| CP-03.2 | Selecting furniture is achievable via select tool + pick path (unit) | `05-*.log` |
| CP-03.3 | Delete removes selected furniture from document | `02`/`03` logs |
| CP-03.4 | Backspace and Delete both invoke deleteSelection; preventDefault on both | `04-*.log` |
| CP-03.5 | Undo restores same furniture id + pose | `02-delete-undo-vitest-raw.log` |
| CP-03.6 | Evidence pack complete under `results/planner/world-standard-wave/03-select-delete/` | directory listing + run.json exitCode 0 |
| CP-03.7 | `p0:unit` non-regression recorded | `p0-unit-run.json` exitCode 0 |
| CP-03.8 | Commits exist on main checkout for landable slices | `git log` referenced in NOTES |
| CP-03.9 | Playwright **not** falsely claimed done | NOTES “Playwright later → P07” |

**Stop if red.** Do not mark INDEX / MASTER-CHECKLIST W3 complete without CP-03.6–03.7.

---

## 11. Suggested commit sequence (summary)

1. `docs(planner): P03 baseline evidence dir for W3 select/delete`
2. `test(open3d): cover pickFurnitureAtPoint for W3 select`
3. `fix(open3d): correct furniture pick hit-test for select tool` *(only if needed)*
4. `feat(open3d): pure applySelectionDelete with undo-safe history`
5. `fix(open3d): single-history deleteSelection for furniture W3`
6. `fix(open3d): Delete/Backspace preventDefault and unit coverage`
7. `test(open3d): FeasibilityCanvas furniture select sets selection`
8. `fix(open3d): Esc clears planner selection (W3 grammar)`
9. `test(open3d): W3 select/delete evidence pack CP-03`

---

## 12. Skills checklist (superpowers)

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| test-driven-development | Tasks 01–06 |
| systematic-debugging | Any RED that does not match inventory |
| verification-before-completion | Task 07 / CP-03 |
| executing-plans / subagent-driven-development | After owner unlock; parallelize test authoring vs pure helper if needed (max 8 agents) |

---

## 13. Done definition (P03 file complete when executing)

- [ ] All Task 00–07 checkboxes complete  
- [ ] CP-03 table all pass with paths  
- [ ] No competitor UI introduced  
- [ ] No Playwright false green  
- [ ] Owner can read `W3-ACCEPTANCE.md` and reproduce vitest commands  

**Next phase after CP-03:** [P04-orbit-continuity.md](./P04-orbit-continuity.md) (W4). Do not start P04 implementation until CP-03 is green or owner reorders gates.
