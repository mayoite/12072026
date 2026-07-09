# P03 — Select furniture + Delete/Backspace + undo (W3)

> **For agentic workers:** REQUIRED: `/using-superpowers` (test-driven-development, systematic-debugging, verification-before-completion).  
> **Approach:** **A** (product journey first on FeasibilityCanvas + document model). Non-negotiable: W3 ships on Feasibility + document truth first; Fabric full stage remains destination (P02 lock) — do not re-pick engines.  
> **Do not execute until owner unlocks after workflow briefing** (plan-only until then).  
> **Ethics:** Inspiration patterns only from `D:\websites\floorplanner.com\report\INSPIRATION.md` (select/delete grammar). No competitor UI, chrome, assets, copy, or layout trade dress.  
> **Reviews:** [P03-suggestions.md](../reviews/P03-suggestions.md) · Expert revision note 2026-07-09 (end of file).  
> **Governance:** [RESULTS-MAP](../RESULTS-MAP.md) · [CHECKPOINTS CP-03](../checkpoints/CHECKPOINTS.md) · [MASTER W3](../checklists/MASTER-CHECKLIST.md) · design gate W3 in `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`.

**Goal:** A facilities buyer on `/planner/open3d` (or guest) can **select a placed furniture item on the 2D canvas**, press **Delete or Backspace** to remove it from the document, and press **Ctrl/Cmd+Z** to restore the same entity id and pose.

**Proof layers (do not collapse):**

| Layer | What | Gate |
|-------|------|------|
| **Unit / TDD** (Tasks 01–07) | pick + pure delete + keyboard + canvas select + undo | Required to land code; commits as you go |
| **CP-03 / W3 green** | Unit pack **plus** minimal browser proof (Playwright **or** chrome-devtools) select→delete→undo under `03-select-delete/` | **Hard gate** — matches design W3, CHECKPOINTS CP-03, MASTER W3.4 |
| **P07 journey** | Full draw/place wave pack in `02-browser-open3d-journey/` | Separate; may **re-assert** W3, does not own first W3 browser proof |

**Do not mark INDEX / MASTER W3 complete on unit alone.** Unit-only without browser select = **W3 FAIL** per CHECKPOINTS stop rule.

**Gate:** **W3** — Select furniture + Delete/Backspace removes it; undo restores (Unit + browser).

**Checkpoint:** **CP-03** = W3 green with unit + evidence + browser proof (see §10).

**Evidence root (canonical):** `results/planner/world-standard-wave/03-select-delete/`  
Required map artifacts: `run.json`, vitest raw logs, unit proof, browser screenshots or Playwright/chrome-devtools trace when claiming CP-03.

---

## 1. Product intent (Approach A)

| Intent | Behavior (O&O, not a clone) |
|--------|-----------------------------|
| Select | With **Select tool** (`V`), pointer-down on a furniture footprint selects that item (single-select P0). Empty canvas clears selection. Furniture wins over wall/room when hit. |
| Feedback | Selected furniture shows existing canvas highlight + status/properties selection label. |
| Delete | **Delete** or **Backspace** removes the selected furniture from the active floor document. Properties-panel delete must use the same document write helpers (single-id path OK). |
| Undo | **Ctrl/Cmd+Z** restores furniture (same `id`, `position`, `rotation`, catalog fields) via history. Selection may stay empty after undo (acceptable); document truth is required. |
| Esc | Esc clears in-progress draw/place **and** clears selection (CAD-lite deselect). |
| **CP-03 product bar** | **Furniture** select / delete / undo only. |
| Out of scope for P03 | Multi-select marquee, 3D pick/delete, Fabric full-stage cutover, move/rotate handles, groups, competitor chrome, **door/window as first-class select targets** (stretch; wall/room select already exist as side paths — not the W3 pain bar). |

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
  → useWorkspaceKeyboard.deleteSelection  (+ preventDefault)
  → OOPlannerWorkspace.deleteSelection
  → pure applySelectionDelete / deleteEntityFromProject (active floor)
  → workspaceCanvas.updateProject (ONE history entry when project changes)
  → setSelection(none)

Ctrl/Cmd+Z
  → history.undo → furniture row restored on active floor
```

**Document truth:** `Open3dProject` / active floor `furniture[]`. Selection is **transient** (not in undo stack). Undo restores **document only**.

**Selection type (runtime):** `CanvasSelection` from `useWorkspaceCanvas.ts`.  
`store/selection.ts` (`PlannerSelection` / `createPlannerSelection`) is optional align only — **do not** dual-store migrate in P03.

**Engines:** FeasibilityCanvas is the interactive 2D surface for Approach A. Fabric furniture layer may overlay under `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`; do **not** block W3 on Fabric. Prefer proving select on the default (flag **OFF**) Feasibility path. When flag ON, `FurnitureFabricLayer` is `interactive={activeTool === "select"}` — same `setSelection` store or document only; **no dual selection stores**.

---

## 3. Tech stack (locked Plan A)

- Next.js site package `site/`
- FeasibilityCanvas (Canvas 2D)
- Vitest unit tests (TDD + CP-03 unit half)
- Playwright **or** chrome-devtools for **minimal W3 browser** proof (CP-03 hard gate)
- Full journey packaging remains **P07** (`02-browser-open3d-journey/`)
- `crypto.randomUUID` via `newEntityId` for any new fixtures that create entities
- No `any` in handwritten code
- Phosphor / existing O&O chrome only
- No worktrees; checkout `D:\OandO07072026` only

---

## 4. Honest inventory (repo truth before coding)

**Verified 2026-07-09 (planning expert).**

**Already present (verify again at execute; do not rewrite blindly):**

| Piece | Path | Status |
|-------|------|--------|
| Furniture hit-test | `site/features/planner/open3d/lib/geometry/canvasPicking.ts` → `pickFurnitureAtPoint` | Implemented (rotated local AABB, padding, top-most last-in-array, default 600mm) |
| Select tool pick order | `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` (~L735–761 furniture → wall → room) | Implemented |
| Selection ring paint | same file (`selectedFurnitureIds`) | Implemented |
| Screen↔project | `site/features/planner/open3d/lib/geometry/snapping.ts` → `projectToScreen` / `screenToProject` | Implemented |
| Default transform | Feasibility `INITIAL_TRANSFORM` origin `(-4000,-2500)` scale `0.1` | Implemented |
| Selection type | `site/features/planner/open3d/editor/useWorkspaceCanvas.ts` (`CanvasSelection`) | Implemented |
| Selection helpers | `site/features/planner/open3d/store/selection.ts`, `workspaceEntityHelpers.ts` | Implemented |
| Delete entity pure | `workspaceEntityHelpers.ts` → `deleteEntityFromProject` (respects `locked`) | Implemented |
| Workspace deleteSelection | `OOPlannerWorkspace.tsx` ~L289–308 | Implemented (**gap:** multi-id = N history steps) |
| Keyboard Delete/Backspace | `useWorkspaceKeyboard.ts` ~L118–120 | Implemented (**gap:** no `preventDefault`; no unit coverage for Del/Bksp) |
| Keyboard wired | `OOPlannerWorkspace.tsx` passes `deleteSelection` | Implemented |
| Esc cancel | `OOPlannerWorkspace.tsx` ~L508–511 | **Gap:** does not clear selection |
| Properties delete button | `PropertiesPanel.tsx` → `onDeleteEntity` / `handleDeleteEntity` | Implemented (single-id path OK) |
| History undo | `store/history.ts` + `lib/commands/plannerCommand.ts` | Implemented (`createOpen3dHistory`, `updateOpen3dProject`, `undoOpen3dAction`) |
| Pure removeFurniture | `model/operations/pureActions.ts` | Implemented (model ops path; workspace uses helpers) |
| Default tool | `OOPlannerWorkspace` `useState("wall")` | Select requires `V` / rail |
| Fabric flag | `canvas-fabric-stage/fabricFurnitureFlag.ts` `=== "1"` only | Default OFF |

**Missing / broken for W3 proof:**

1. **No unit tests** for `pickFurnitureAtPoint` (`canvasPicking.test.ts` only covers walls/polygons).
2. **No unit tests** for Delete/Backspace → `deleteSelection` handler / `preventDefault`.
3. **No pure integration test** place/select-state → delete → undo restores id+pose.
4. **No FeasibilityCanvas pointer test** that selecting furniture sets `selection.type === "furniture"`.
5. **Backspace/Delete** do not call `preventDefault` → risk of browser back navigation (Backspace).
6. **Esc cancel** in workspace does not clear selection (inspiration grammar; W8-adjacent but cheap in P03).
7. **Multi-id delete** loops `updateProject` per id → multi undo steps (fix to single updater even for single-id path shape).
8. Default tool is **`wall`**, not `select` — W3 accepts Select tool (`V` / rail); document that select requires Select tool. Optional polish: after successful place, switch to `select` — **out of CP-03** unless free.
9. WAVE note (`results/planner/world-standard-wave/WAVE.md`) still claims select/delete broken — **replace with evidence**, do not trust the note; do not rewrite WAVE until CP-03 evidence exists.
10. **No browser proof** under `03-select-delete/` (required for CP-03 / W3 green).

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
| `site/features/planner/open3d/store/history.ts` | Undo stack semantics (`updateOpen3dProject` reference equality) |
| `site/features/planner/open3d/lib/commands/plannerCommand.ts` | Command write seam |
| `site/features/planner/open3d/lib/geometry/snapping.ts` | `projectToScreen` / `screenToProject` for unit pointer coords |
| `site/features/planner/open3d/store/selection.ts` | `createPlannerSelection` (optional align only) |
| `site/features/planner/open3d/editor/PropertiesPanel.tsx` | Confirm delete button still hits `handleDeleteEntity` |
| `site/features/planner/open3d/editor/canvasTool.ts` | Select guidance string already mentions Delete |
| `site/features/planner/open3d/model/operations/pureActions.ts` | Reference for removeFurniture semantics |
| `site/features/planner/open3d/model/types.ts` | `Open3dFurnitureItem` shape for fixtures |
| `site/features/planner/open3d/canvas-fabric-stage/*` | **Read only** for flag behavior |

### Tests (create / extend)

| File | Role |
|------|------|
| `site/tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts` | **Add** `pickFurnitureAtPoint` suite |
| `site/tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx` | **Add** Delete / Backspace / preventDefault cases |
| `site/tests/unit/features/planner/open3d/deleteSelection.test.ts` | **New** pure delete + history undo restore + multi-id single past |
| `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` | **Add** select-furniture pointer case (or thin companion) |

### Browser (CP-03 hard gate)

| Artifact | Role |
|----------|------|
| Playwright narrow W3 spec **or** chrome-devtools scripted session | Select → Delete → undo under `/planner/open3d` or guest |
| `results/planner/world-standard-wave/03-select-delete/` screenshots / trace | Browser proof |

Prefer a **narrow** W3 browser path (seed or place one item). Do **not** expand into full W1–W2 journey (P07).

### Evidence (create on execution)

| Path | Contents |
|------|----------|
| `results/planner/world-standard-wave/03-select-delete/` | Full gate folder (see §9) |

### Do not touch (P03)

- Fabric full stage cutover (`canvas-fabric-stage/*` beyond read)
- Three orbit / 3D pick (`ThreeViewerInner.tsx`) — **P04**
- Autosave honesty — **P06**
- Full Playwright world journey pack — **P07** (W3 may be re-asserted there)
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

1. `selection.type === "none"` or empty ids → return **same project reference** + empty selection.
2. Map types: `wall→walls`, `door→doors`, `window→windows`, `furniture→furniture`, `room→rooms`.
3. Remove **all** listed ids from the active floor in **one** project clone (single history entry when wired through one `updateProject`).
4. Skip locked entities (same as `deleteEntityFromProject`); if all locked/missing, project may be unchanged.
5. **History identity (hard):** if no entity membership actually changed, return the **identical** `project` reference (no clone). `updateOpen3dProject` only pushes past when `updated !== history.present`.
6. Always return `selection: { type: "none", ids: [] }` after a successful attempt path (including no-ops that clear intent).
7. **No `any`.**

`OOPlannerWorkspace.deleteSelection` becomes:

1. Read `workspaceCanvas.selection`.
2. `const next = applySelectionDelete(project, selection)`.
3. If `next.project !== project`, `updateProject(() => next.project)` **once** (or functional updater that applies pure delete in one call).
4. `setSelection(next.selection)`.

**Properties panel:** `handleDeleteEntity` stays single-id `deleteEntityFromProject` + clear selection — OK for P03.

**Undo path:** rely on existing `updateOpen3dProject` / `history.undo` — do not push selection into history.

---

## 7. Tasks (TDD — red → green → evidence → commit)

Checkbox progress for executors. Every implementation task: **failing test first** (except pure evidence/browser packaging after green unit).

### Task 00 — Setup / baseline verification

- [ ] **00.1** Read `Plans/trustdata/00-START.md`, this file, design gate W3, [P03-suggestions.md](../reviews/P03-suggestions.md), inspiration select/delete rows only.
- [ ] **00.2** Confirm Approach **A** and owner unlock for implementation (stop if plan-only).
- [ ] **00.3** Re-read live sources listed in §4–§5 (no worktrees; checkout `D:\OandO07072026`).
- [ ] **00.4** Create evidence dir: `results/planner/world-standard-wave/03-select-delete/`.
- [ ] **00.5** Write `HEAD.txt` (`git rev-parse HEAD` + `git status -sb`) and start `NOTES.md` (branch, dirty files). No push.
- [ ] **00.6** Run existing related unit files once for baseline noise (expect pass/fail recorded):

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose
```

- [ ] **00.7** Save raw log to `results/planner/world-standard-wave/03-select-delete/00-baseline-vitest-raw.log` and `00-baseline-run.json`:

| Field | Value |
|-------|--------|
| `phase` | `"P03"` |
| `approach` | `"A"` |
| `evidenceRoot` | absolute path to `03-select-delete` |
| `checkout` | `D:\OandO07072026` |
| `worktrees` | `false` |
| `command` / `cwd` / `exitCode` | as run |
| `startedAt` / `endedAt` | ISO timestamps |
| `HEAD` | from `HEAD.txt` |

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
- [ ] **01.4** Re-run; save `01-pick-furniture-vitest-raw.log` + update NOTES.
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
  2. Missing id → **same project reference**; selection empty.
  3. Locked furniture → not removed; **same project reference** if nothing else removed.
  4. **History integration:** `createOpen3dHistory` → `updateOpen3dProject(history, (p) => applySelectionDelete(p, sel).project)` → furniture gone → `undoOpen3dAction` → furniture id + position + rotation + catalogId restored equal to pre-delete snapshot.
  5. Non-furniture selection type wall (optional one case) uses same helper map — proves shared path without expanding product scope.
  6. **Multi-id:** two furniture ids removed in one pure call → one subsequent `updateOpen3dProject` → **one** past entry; one undo restores both.
- [ ] **02.2** Run — fail until pure function exists / matches.
- [ ] **02.3 GREEN** — Implement `applySelectionDelete` reusing `deleteEntityFromProject` in a loop **inside one project return** (compose without intermediate history). Preserve reference identity on no-op.
- [ ] **02.4** Evidence: `02-delete-undo-vitest-raw.log`.
- [ ] **02.5 Commit:**  
  `feat(open3d): pure applySelectionDelete with undo-safe history`

---

### Task 03 — Wire workspace deleteSelection to pure helper (RED → GREEN)

**Files:**  
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`  
- Prefer testing pure + thin workspace algorithm in `deleteSelection.test.ts` (avoid brittle full shell mount unless already easy).

- [ ] **03.1 RED** — Extend `deleteSelection.test.ts`:
  - Simulate workspace algorithm: given project+selection, one `updateOpen3dProject` then empty selection; assert **single** past entry for multi-id furniture delete (two ids removed → one undo restores both).
- [ ] **03.2 GREEN** — Change `OOPlannerWorkspace.deleteSelection` to:
  - Use pure helper.
  - Single `updateProject` when project reference changes.
  - Always clear selection after attempt (via helper return).
  - No behavior change for properties panel `handleDeleteEntity` beyond ensuring it still clears selection (already does).
- [ ] **03.3** Confirm `handleDeleteEntity` remains one-id path (OK) and still uses `deleteEntityFromProject`.
- [ ] **03.4** Evidence: `03-workspace-delete-vitest-raw.log`.
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
  3. Both call **`preventDefault`** (dispatch cancelable `KeyboardEvent` with `cancelable: true` and assert `defaultPrevented`, or spy).
  4. With mod key (Ctrl+Backspace) does **not** delete (current `!mod` guard).
  5. Editable `<input>` target does **not** call deleteSelection (Backspace-in-input enough; contentEditable covered by same helper).
  6. When `deleteSelection` omitted, Delete does not throw.
- [ ] **04.2 GREEN** — In `useWorkspaceKeyboard`, on Delete/Backspace (~L118–120 today):
  - `event.preventDefault()` before/when invoking handler.
  - Keep editable-target early return.
- [ ] **04.3** Confirm `OOPlannerWorkspace` still passes `deleteSelection` into `useWorkspaceKeyboard`.
- [ ] **04.4** Evidence: `04-keyboard-delete-vitest-raw.log`.
- [ ] **04.5 Commit:**  
  `fix(open3d): Delete/Backspace preventDefault and unit coverage`

---

### Task 05 — Canvas select furniture (RED → GREEN)

**Files:**  
- `site/tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx` (or new `feasibilitySelectFurniture.test.tsx` if file is too heavy)  
- `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx`  
- Coord helpers: `site/features/planner/open3d/lib/geometry/snapping.ts`

**Coordinate strategy (locked — anti thrash):**

1. Task 01 owns hit math.
2. For canvas integration: seed `initialProject` with one furniture item at known **project mm** (e.g. center of default view).
3. Convert with `projectToScreen(furniture.position, INITIAL_TRANSFORM)` where Feasibility default is `origin: { x: -4000, y: -2500 }, scale: 0.1` — **do not call `fitToView`** unless the test reads live transform from `onStatusChange`.
4. Existing canvas mock uses `getBoundingClientRect` at `(0,0)` size 800×600 → `clientX/Y` ≈ screen coords from `projectToScreen`.
5. Reuse ResizeObserver / canvas context mocks from `open3dFeasibilityCanvas.test.tsx`.
6. If full pointer stays brittle: thin alternate = assert select-tool algorithm (pick id → `setSelection`) without paint — prefer one real pointer case first.

- [ ] **05.1 RED** — With `activeTool="select"` and `workspaceCanvas` from `renderHook(() => useWorkspaceCanvas({ initialProject }))`:
  1. Pointer down on furniture footprint → `workspaceCanvas.selection` becomes `{ type: "furniture", ids: [thatId] }`.
  2. Pointer down on empty area → selection `{ type: "none", ids: [] }`.
  3. When tool is `wall`, pointer does **not** set furniture selection (draw path owns the gesture).
- [ ] **05.2 GREEN** — Fix FeasibilityCanvas only if pick/select branch fails (coordinate conversion, tool gate, missing setSelection).
- [ ] **05.3** Visual highlight already depends on `selectedFurnitureIds` — no new chrome; state assertion is enough for unit.
- [ ] **05.4** Evidence: `05-canvas-select-vitest-raw.log`.
- [ ] **05.5 Commit:**  
  `test(open3d): FeasibilityCanvas furniture select sets selection`

---

### Task 06 — Esc clears selection (product grammar)

**Files:**  
- `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx`  
- Keyboard test or small unit on cancel behavior

- [ ] **06.1 RED** — Assert cancel path clears selection: workspace `cancel` handler must call `workspaceCanvas.setSelection({ type: "none", ids: [] })` and cover via Escape → `cancel` (spy setSelection or extract tiny helper if needed).
- [ ] **06.2 GREEN** — In `useWorkspaceKeyboard` cancel wiring inside `OOPlannerWorkspace`, extend cancel to clear selection + existing canvas cancel + clear pending catalog.
- [ ] **06.3** Do not steal Escape from editable fields (already guarded).
- [ ] **06.4** Do not expand into full W8 chrome audit.
- [ ] **06.5 Commit:**  
  `fix(open3d): Esc clears planner selection (W3 grammar)`

---

### Task 07 — Non-regression + unit evidence pack

- [ ] **07.1** Run the full W3 unit set:

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/deleteSelection.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose
```

(If a companion select test file was added, include it.)

- [ ] **07.2** Also run non-regression smoke:

```powershell
Set-Location D:\OandO07072026\site
pnpm run p0:unit
```

- [ ] **07.3** Write unit evidence files under `results/planner/world-standard-wave/03-select-delete/` (see §9).
- [ ] **07.4** Zero suppression: do not filter failing tests or use `--silent` for sign-off.
- [ ] **07.5** If anything fails: fix or log in `Failures.md` / residual in NOTES — **do not claim unit half green**.
- [ ] **07.6** Partial commit allowed:  
  `test(open3d): W3 select/delete unit evidence pack`  
  (CP-03 still open until Task 08 browser green.)

---

### Task 08 — Minimal browser proof (CP-03 hard gate)

**Not optional for CP-03 / W3 green.** Matches design W3 (Unit + Playwright), CHECKPOINTS CP-03.5, MASTER W3.4.

**Narrow scope (not P07 journey):**

| Step | Action |
|------|--------|
| 1 | Open `/planner/guest/?plannerDevTools=1` **or** `/planner/open3d` (same open3d stack). Document URL + Fabric flag env in NOTES (prefer flag OFF). |
| 2 | Place one catalog furniture item **or** seed fixture project with one furniture id. |
| 3 | Switch to Select (`V` or tool rail Select). |
| 4 | Click furniture footprint → assert selection chrome / properties (O&O selectors only). |
| 5 | Press **Delete** (or Backspace) → furniture gone from document / canvas. |
| 6 | **Ctrl/Cmd+Z** → same furniture id + pose restored. |
| 7 | Capture screenshots (select, after-delete, after-undo) and/or Playwright trace / chrome-devtools evidence. |

- [ ] **08.1** Implement **either** a focused Playwright case under site e2e **or** a chrome-devtools scripted session with full raw log — both deposit artifacts in `03-select-delete/`.
- [ ] **08.2** Files: `browser-w3-raw.log` (or `playwright-w3-raw.log`), screenshots `w3-01-select.png`, `w3-02-deleted.png`, `w3-03-undone.png` (names may vary; list in NOTES), optional trace.
- [ ] **08.3** Record Fabric env, base URL, whether dev server or `PLAYWRIGHT_BASE_URL` was used.
- [ ] **08.4** **Do not** claim full W1–W2 journey; point P07 for draw/place pack re-assert.
- [ ] **08.5** If browser cannot select furniture: **CP-03 FAIL** even if unit green — stop MASTER W3 claim; log Failures.md.

---

### Task 09 — CP-03 sign-off pack

- [ ] **09.1** Write canonical **`run.json`** (RESULTS-MAP contract):

```json
{
  "phase": "P03",
  "gate": "W3",
  "checkpoint": "CP-03",
  "approach": "A",
  "checkout": "D:\\OandO07072026",
  "worktrees": false,
  "evidenceRoot": "results/planner/world-standard-wave/03-select-delete",
  "HEAD": "<from HEAD.txt>",
  "unit": { "exitCode": 0, "log": "vitest-w3-raw.log" },
  "p0unit": { "exitCode": 0, "log": "p0-unit-raw.log" },
  "browser": { "exitCode": 0, "tool": "playwright|chrome-devtools", "log": "browser-w3-raw.log" },
  "startedAt": "<ISO>",
  "endedAt": "<ISO>",
  "status": "PASS|FAIL"
}
```

- [ ] **09.2** Complete `W3-ACCEPTANCE.md` checkbox map with **pass/fail + log pointers** (unit + browser).
- [ ] **09.3** `FILES-TOUCHED.md`, final `NOTES.md` (residual risks: Fabric flag-on, multi-select stretch, openings stretch).
- [ ] **09.4** Commit:  
  `test(open3d): W3 select/delete evidence pack CP-03`
- [ ] **09.5** Only then may agent propose ticking MASTER W3 / CHECKPOINTS CP-03 (owner or authorized sync).

---

## 8. Implementation notes (avoid thrash)

1. **Select tool required:** Default workspace tool is `wall`. W3 acceptance is “user can select,” not “always in select mode.” Tool rail + `V` already exist (`canvasTool.ts`, `CanvasToolRail.tsx`). Post-place auto-switch to select is **optional polish**, not CP-03.
2. **Fabric flag path:** Prefer default flag-off path for unit + browser proof. Document env in NOTES. If flag-on is set in some env, ensure Feasibility/Fabric write the same selection/document path — **do not invent dual selection stores**.
3. **Locked items:** Delete no-ops (same project reference); properties button already blocks locked. Test one locked case.
4. **IDs:** Undo must restore the **same** furniture `id` (history snapshot), not create a new UUID.
5. **No competitor UI:** Selection ring already uses theme tokens; keep it. No new mega-panels or Floorplanner-like chrome.
6. **Systematic debugging:** If unit green but browser fails, log coordinate transform / focus / preventDefault / tool mode issues — do not expand into P04 orbit work.
7. **Openings:** Not CP-03 product bar. Wall/room select side paths stay as-is.
8. **Commit as you go** after each landable task. **Push only on owner ask.** No worktrees.
9. **WAVE.md:** Do not rewrite until evidence exists; then point WAVE to `03-select-delete/` (optional P10/handover).

---

## 9. Evidence root layout (create on execution)

```
results/planner/world-standard-wave/03-select-delete/
  run.json                 # canonical RESULTS-MAP contract
  HEAD.txt
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
  browser-w3-raw.log       # or playwright-w3-raw.log
  w3-01-select.png         # names may vary; list in NOTES
  w3-02-deleted.png
  w3-03-undone.png
```

| Artifact | Task |
|----------|------|
| `HEAD.txt`, `00-baseline-*` | 00 |
| `01-pick-furniture-*` | 01 |
| `02-delete-undo-*` | 02 |
| `03-workspace-delete-*` | 03 |
| `04-keyboard-delete-*` | 04 |
| `05-canvas-select-*` | 05 |
| `vitest-w3-*`, `p0-unit-*` | 07 |
| `browser-w3-*`, screenshots | 08 |
| `run.json`, `W3-ACCEPTANCE.md`, `FILES-TOUCHED.md` | 09 |

---

## 10. Checkpoint CP-03 (hard gate)

**CP-03 = W3 green with unit + browser + evidence.**

| # | Criterion | Proof |
|---|-----------|--------|
| CP-03.1 | `pickFurnitureAtPoint` covered and correct for hit/miss/top-most/rotation | `01-*.log` + test file |
| CP-03.2 | Selecting furniture is achievable via select tool + pick path (unit) | `05-*.log` |
| CP-03.3 | Delete removes selected furniture from document | `02`/`03` logs |
| CP-03.4 | Backspace and Delete both invoke deleteSelection; preventDefault on both | `04-*.log` |
| CP-03.5 | Undo restores same furniture id + pose | `02-delete-undo-vitest-raw.log` |
| CP-03.6 | Unit evidence pack under `results/planner/world-standard-wave/03-select-delete/` | vitest logs exitCode 0 |
| CP-03.7 | `p0:unit` non-regression recorded | `p0-unit-run.json` exitCode 0 |
| CP-03.8 | **Browser** select→delete→undo proven (Playwright or chrome-devtools) with screenshots/trace | `browser-w3-raw.log` + PNGs; CHECKPOINTS CP-03.5 |
| CP-03.9 | Canonical `run.json` status PASS; HEAD + NOTES honest | `run.json` |
| CP-03.10 | Commits exist on main checkout for landable slices | `git log` in NOTES |
| CP-03.11 | Full W1–W2 journey **not** falsely claimed; openings multi-select not claimed | NOTES honesty |

**Stop if red.** Do not mark INDEX / MASTER-CHECKLIST W3 complete without CP-03.6–03.9.

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
9. `test(open3d): W3 select/delete unit evidence pack`
10. `test(open3d): W3 select/delete browser + evidence pack CP-03`

---

## 12. Skills checklist (superpowers)

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| test-driven-development | Tasks 01–06 |
| systematic-debugging | Any RED that does not match inventory |
| verification-before-completion | Task 07 unit pack + Task 08–09 CP-03 |
| Agents-browser / chrome-devtools | Task 08 if not Playwright |
| executing-plans / subagent-driven-development | After owner unlock; parallelize test authoring vs pure helper if needed (max 8 agents) |

---

## 13. Done definition (P03 file complete when executing)

- [ ] All Task 00–09 checkboxes complete  
- [ ] CP-03 table all pass with paths  
- [ ] No competitor UI introduced  
- [ ] Browser proof present (not unit-only green)  
- [ ] Full P07 journey not falsely claimed  
- [ ] Owner can read `W3-ACCEPTANCE.md` and reproduce vitest + browser commands  

**Next phase after CP-03:** [P04-orbit-continuity.md](./P04-orbit-continuity.md) (W4). Do not start P04 implementation until CP-03 is green or owner reorders gates.

---

## Handover one-liner

**W3 = Feasibility select furniture + Delete/Backspace (preventDefault) + single-history delete + undo same id/pose; TDD unit pack then minimal browser under `03-select-delete/`; Approach A; inspiration not copy; superpowers; no worktrees; commit as you go.**

---

## Expert revision note — 2026-07-09

**Role:** Planning expert (trust-data / open3d W3).  
**Inputs:** Live path verify of `FeasibilityCanvas.tsx`, `canvasPicking.ts`, `OOPlannerWorkspace.tsx`, `useWorkspaceKeyboard.ts`, `useWorkspaceCanvas.ts`, `workspaceEntityHelpers.ts`, `store/history.ts`, `snapping.ts`, keyboard/feasibility/picking unit tests; design W3; CHECKPOINTS CP-03; MASTER W3; RESULTS-MAP; suggestions file `Plans/trustdata/reviews/P03-suggestions.md`.  
**Actions:** Plan-only revise in place. No product code. No TBD left in task body.

### Top 5 applied

1. **CP-03 browser hard gate (P0-1)** — Unit alone is insufficient. Design W3 + CHECKPOINTS + MASTER W3.4 require Playwright **or** chrome-devtools select→delete→undo under `03-select-delete/`. P07 keeps full journey pack only.
2. **Canonical `run.json` + HEAD.txt (P0-2)** — RESULTS-MAP contract; task logs secondary; Task 09 sign-off.
3. **Task 05 coordinate strategy (P0-3)** — `projectToScreen` + Feasibility `INITIAL_TRANSFORM`; no fit thrash; Task 01 owns pure hit math.
4. **History no-op identity (P0-4)** — `applySelectionDelete` returns same project reference when membership unchanged so undo stack stays clean.
5. **Furniture-only product bar (P0-5)** — Openings/first-class door-window select out of CP-03; wall/room side paths acknowledged.

### Also applied (supporting)

- Exact Delete/Backspace `preventDefault` gap (~L118–120).  
- Esc clears selection (Task 06) kept in W3 grammar.  
- Single-history multi-id pure path mandatory.  
- Dual selection type honesty (`CanvasSelection` runtime).  
- Fabric flag-off preferred for proof.  
- Properties panel single-id path OK.  
- Task 00 meta parity + PowerShell vitest commands from `site/`.  
- Cross-links to RESULTS-MAP / CHECKPOINTS / MASTER / design / suggestions.  
- Skills: verification-before-completion on browser pack.  

**Status after revision:** Planned (ready for owner unlock). Execution not started.
