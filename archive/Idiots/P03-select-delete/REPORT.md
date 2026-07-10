# P03 — W3 Select / Delete / Undo — Exhaustive Brainstorm Report

**Agent:** BRAINSTORMER 03 of 10  
**Seat:** Idiots brainstorm (no product code)  
**Checkout:** `D:\OandO07072026` only — no worktrees  
**Write path:** `D:\OandO07072026\Idiots\P03-select-delete\REPORT.md`  
**Date of report:** 2026-07-10  
**Phase authority:** `Plans/phases/P03-select-delete/`  
**Skills posture:** `/using-superpowers` + brainstorming discipline; deliverable is design/analysis only (no site edits)  
**Ethics:** Patterns/ideas only from `D:\websites` — no competitor UI, assets, code, or trade dress into product  

---

## 0. Meta

### 0.1 What this report is

This is a **phase-deep brainstorm and critique pack** for **P03 / W3 / CP-03**: furniture select on 2D, Delete/Backspace remove, undo restore. It is written for the head agent and implementers so they do not re-discover:

- What the plan already locks
- What expert passes already fixed (or still lie about)
- What competitive research actually teaches (grammar, not chrome)
- What live code currently does
- Where false-green thrives
- How W3 links to P07 journey honesty and later module re-proof (`select-edit`)

**It is not:**

- Product code
- A second execute card
- Permission to mark INDEX/MASTER W3 green without evidence under `results/planner/world-standard-wave/03-select-delete/`
- A license to clone Floorplanner / Planner5D / RoomSketcher chrome

### 0.2 Sources consumed (honest inventory)

#### A. Entire phase folder (mandatory)

| Path | Role |
|------|------|
| `Plans/phases/P03-select-delete/P03-select-delete.md` | Execute card — TDD tasks 00–09, CP-03 table, architecture |
| `Plans/phases/P03-select-delete/P03-appendix.md` | Pure API, pick cases, keyboard cases, run.json shape, inventory, expert archive |
| `Plans/phases/P03-select-delete/P03-suggestions.md` | Plan review P0–P2 (browser hard gate, history identity, coords, openings out) |
| `Plans/phases/P03-select-delete/01-react-open3d.md` | React/workspace expert — FIX; W3 pure delete + degrees lock |
| `Plans/phases/P03-select-delete/02-canvas-2d.md` | Canvas/Fabric expert — SHIP Approach A; flag OFF proof |
| `Plans/phases/P03-select-delete/04-playwright-evidence.md` | Playwright/evidence expert — FIX; browser in `03-*`, false-green matrix |
| `Plans/phases/P03-select-delete/README.md` | Local index |

#### B. Consolidated expert + kill order

| Path | Role |
|------|------|
| `Plans/phases/EXPERT-PASS.md` | Merged P0 list; spine order; false-reverse top 5 |
| `Plans/INDEX.md` | Kill order: CP-00→01→02→**CP-03 W3**→CP-07 journey→CP-06 save |
| `Plans/Research/RESEARCH-MAP.md` | Pack routing; P03 → P5D select/edit job + Floorplanner checklist |
| `Plans/Research/RESULTS-MAP.md` | Evidence folder contract for `03-select-delete/` |
| `Plans/Research/STRUCTURE-REWRITE-NOTE.md` / `STRUCTURE-ADVICE.md` | One CP ownership; reject P03b browser split |
| `Plans/Research/Others/18-PRODUCT-CONTEXT.md` | Buyer / manufacturer planner context |

#### C. Design + later module truth

| Path | Role |
|------|------|
| `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md` | W3 definition: Unit + Playwright |
| `docs/superpowers/plans/2026-07-10-global-standard-modules.md` | **Old CP-03 PASS ≠ module complete** — re-prove under `modules/select-edit/` |

#### D. Competitive research (`D:\websites`) — reports first

| Pack | Used for W3 |
|------|-------------|
| `floorplanner.com/report/INSPIRATION.md` | Primary select/delete/Esc/undo grammar from editor manual |
| `planner5d.com/report/INSPIRATION_REPORT.md` | Core loop structure→furnish→3D; not pixel chrome |
| `planner5d.com/report/TOOLBARS.md` | Zone map; delete walls/construction as job |
| `planner5d.com/report/ETHICS_AND_INSPIRATION.md` | Binding ethics fence |
| `roomsketcher.com/report/INSPIRATION.md` | Select→properties→trash/delete; W3 mapping |
| `homestyler.com/report/INSPIRATION.md` | Shortcut discoverability (not full key table) |
| `research/2026-07-09-world-standard/SYNTHESIS.md` | Select + transform objects pattern → hit-test + Delete |
| `research/2026-07-09-world-standard/comparison/MASTER-CHART.md` | O&O ~2.0 overall; tools/inventory gaps |
| `research/2026-07-09-world-standard/comparison/02-toolbar/REPORT.md` | Toolbar gaps include broken select/delete on default 2D |
| `research/2026-07-09-world-standard/comparison/04-ease/REPORT.md` | Visible undo as ease/recovery |
| `research/2026-07-09-world-standard/comparison/07-oando-self/REPORT.md` | Brutal self-score: ease 1; select/delete incomplete vs world |
| `README.md` under `D:\websites` | Canonical research home; Firecrawl dead for routine |

Raw manuals/forums were not fully re-OCR’d line-by-line; **reports distill patterns**. Where this report quotes a pattern, the owning report path is given. Deep raw dumps (P5D bundles, editor HTML) are **stack study only — do not ship**.

#### E. Live repo facts (re-proved for this brainstorm, not trusted stale expert “MISSING” alone)

| Fact | Live path / status (2026-07-10) |
|------|----------------------------------|
| `pickFurnitureAtPoint` | `site/features/planner/open3d/lib/geometry/canvasPicking.ts` — degrees→rad for hit |
| Select tool hit order | `FeasibilityCanvas.tsx` ~L736–778: furniture → openings → wall → room → none |
| `applySelectionDelete` | `workspaceEntityHelpers.ts` — pure; same-ref no-op; multi-id one clone; wall cascades openings |
| `deleteSelection` | `OOPlannerWorkspace.tsx` — one `updateProject` + clear selection |
| Delete/Backspace + `preventDefault` | `useWorkspaceKeyboard.ts` L83–86 |
| Esc clears selection | cancel handlers set `{ type: "none", ids: [] }` (~L730–757) |
| Unit: pick | `canvasPicking.test.ts` describe `pickFurnitureAtPoint` |
| Unit: pure delete + multi-id undo | `applySelectionDelete.test.ts` |
| Unit: keyboard | `open3dWorkspaceKeyboard.test.tsx` Delete/Backspace/preventDefault + Escape |
| Browser spec | `site/tests/e2e/open3d-w3-select-delete.spec.ts` (serial, guest, place→select→Delete→Ctrl+Z) |
| Evidence folder `results/planner/world-standard-wave/` | **Absent on disk at report time** — entire `results/` tree missing |
| Appendix claim “CP-03 PASS” | **Stale relative to missing evidence tree** — code+tests landable; gate claim needs re-deposit of artifacts |

### 0.3 Epistemic rules for reading this report

1. **Plan text is not product green.** CP-03 green requires unit **and** browser artifacts under the canonical folder.
2. **Unit green is not buyer green.** Handlers can exist while default tool is wall and buyer never finds Select.
3. **Appendix post-land notes can rot.** If `results/` is gone, treat gate as **unproven for claim** until re-run.
4. **Expert essays were plan-time.** Several “MISSING” items in 01-react / P03-suggestions are now **code-present**. Re-verify at execute; this report dual-states “plan-time gap” vs “live 2026-07-10.”
5. **Research is not evidence.** Floorplanner Del/Backspace grammar does not prove O&O W3.
6. **Old CP-03 PASS ≠ module complete** per global-standard modules plan — later `modules/select-edit/` re-proof.

### 0.4 Approach lock (not reopened)

| Lock | Value |
|------|-------|
| Product approach | **A** — FeasibilityCanvas + document model first |
| 2D destination | Fabric.js v7 full stage **after** W gates |
| W3 proof engine | Feasibility; Fabric furniture flag **OFF** |
| Document rotation (furniture) | **Degrees** (pick converts for math) |
| Selection authority | `workspaceCanvas.selection` / `CanvasSelection` only — no dual store |
| Product bar P03 | **Furniture** select/delete/undo (not multi-select, not 3D pick, not openings-as-first-class gate) |
| Kill order | After CP-02; before celebrating full journey without W3 |

### 0.5 One-line product truth for W3

> Buyer on 2D (open3d or guest) switches to **Select**, clicks a furniture footprint, presses **Delete or Backspace**, sees it gone, presses **Ctrl/Cmd+Z**, gets the **same entity id and pose** back — proven by unit pack **and** browser pack under `03-select-delete/`, with Fabric furniture flag OFF.

### 0.6 Report map

| § | Title |
|---|--------|
| 0 | Meta (this section) |
| 1 | W3 product bar |
| 2 | Pure delete / single history / preventDefault / Esc |
| 3 | Hit-test / pickFurniture / Fabric flag OFF |
| 4 | Competitive select/delete/undo patterns (ideas only) |
| 5 | Browser proof requirements and false-green traps |
| 6 | Plan critique + expert pass alignment |
| 7 | Buyer journeys that die without W3 |
| 8 | Raised quality bar for select/edit UX |
| 9 | Approaches for implementation order |
| 10 | Tests matrix brainstorm (unit vs browser) |
| 11 | Failure modes |
| 12 | Linkage to P07 journey honesty |
| 13 | Appendix — path index |
| 14 | Appendix — quotes |
| 15 | Appendix — non-claims |
| 16 | Appendix — open questions (resolved stances, not TBD placeholders) |
| 17 | Appendix — residual risks |
| 18 | Appendix — recommended slices |

---

## 1. W3 product bar (furniture only, unit + browser hard)

### 1.1 Gate definition (binding)

From design spec W3 and execute card:

| Must | Not must for CP-03 |
|------|---------------------|
| Select furniture on 2D with Select tool | Multi-select marquee |
| Delete **or** Backspace removes selected furniture | Move/rotate handles as gate |
| Undo (Ctrl/Cmd+Z) restores **same id + pose** | Redo as hard gate (exists; not W3 spine) |
| Unit pack green | Full W1–W2 journey pack (that is P07) |
| **Minimal browser** select→delete→undo under `03-select-delete/` | 3D pick/delete |
| Fabric flag OFF preferred and documented | Fabric full-stage cutover |
| Esc clears **selection** (W3 grammar) | Full W8 chrome audit |
| Furniture-only product bar | Door/window first-class select as CP blocker |

**Proof layers (do not collapse):**

| Layer | Gate |
|-------|------|
| Unit / TDD (tasks 01–07) | Land code; commit as you go |
| CP-03 / W3 green | Unit **+** browser under `03-select-delete/` |
| P07 journey | Separate folder `02-browser-open3d-journey/` — may re-assert W3 but **must not substitute** |

**Hard rule:** unit-green alone = **FAIL**. Journey folder alone = **FAIL** for W3.

### 1.2 Furniture-only bar — why it is correct and incomplete

**Correct for P03:**

- Approach A pain was “furniture select/delete broken,” not “openings need multi-select.”
- CHECKPOINTS historically said “furniture (and openings where in scope)” — suggestions P0-5 correctly **scoped openings out of CP-03 product bar**.
- Live Feasibility already selects openings/walls/rooms on select tool; deleting walls via pure helper is **defensive shared path**, not the buyer story for W3.

**Incomplete by design (honest residual, not blocker):**

- Buyer who places a door then hits Delete has a path, but W3 acceptance screenshots center on **furniture**.
- Properties panel single-id delete remains a second path — OK.
- Multi-id pure helper is required for history safety even if UI is single-select — mandatory for undo integrity when selection.ids length > 1 (programmatic / future multi-select).

### 1.3 Acceptance table (CP-03) restated for agents

| # | Criterion | Honest proof |
|---|-----------|--------------|
| CP-03.1 | pickFurniture hit/miss/top-most/rotation | `01-*.log` + suite in `canvasPicking.test.ts` |
| CP-03.2 | Select tool sets furniture selection (unit) | Feasibility pointer unit (plan Task 05) |
| CP-03.3 | Delete removes selected furniture | pure + workspace |
| CP-03.4 | Delete + Backspace + preventDefault | keyboard unit |
| CP-03.5 | Undo same id + pose | pure history integration |
| CP-03.6 | Unit pack under evidence folder exit 0 | vitest raw unfiltered |
| CP-03.7 | `p0:unit` non-regression | `p0-unit-run.json` |
| CP-03.8 | Browser select→delete→undo | `browser-w3-raw.log` + PNGs or trace |
| CP-03.9 | `run.json` PASS + honest NOTES | map contract |
| CP-03.10 | Commits on main checkout | NOTES / git log |
| CP-03.11 | No false full journey / multi-select claim | NOTES |

### 1.4 What “furniture wins hit order” means

Live order on Select tool (Feasibility):

1. `pickFurnitureAtPoint` (padding scale-aware)
2. `pickOpeningAtPoint` (doors/windows)
3. `pickWallAtPoint`
4. Room via `pointInPolygon`
5. Else selection none

**Product implication:** When furniture overlaps a wall pick tolerance, furniture wins. That matches industry “decorate objects over structure” priority (Floorplanner marquee rule is multi-select version of the same priority idea). Do not reverse this without product decision.

### 1.5 What green looks like to a human (not a test runner)

1. Open planner (guest with `?plannerDevTools=1` preferred for clean IDB; or open3d).
2. Ensure at least one furniture item exists (place from inventory or configurator).
3. Press **V** or click **Select** on tool rail (default tool is often **wall** — failure if ignored).
4. Click the furniture symbol; selection ring / properties show selection (not “No Selection”).
5. Press **Delete** (or Backspace); furniture count drops; item gone from 2D.
6. Press **Ctrl+Z** (Cmd+Z on macOS); same piece returns at same position/rotation with same id.
7. Press **Esc** with something selected → selection cleared without deleting.

If step 3–6 only work in unit mocks, the product is not W3-green for buyers.

### 1.6 Evidence root contract

Canonical:

```
results/planner/world-standard-wave/03-select-delete/
  run.json
  HEAD.txt
  NOTES.md
  FILES-TOUCHED.md
  W3-ACCEPTANCE.md
  00-baseline-*
  01-pick-furniture-*
  02-delete-undo-*
  03-workspace-delete-*
  04-keyboard-delete-*
  05-canvas-select-*
  vitest-w3-raw.log
  p0-unit-raw.log
  browser-w3-raw.log   (or playwright-raw.log if named honestly in NOTES)
  w3-01-select.png | 02-deleted | 03-undone   (or 01-placed…04-undone per e2e)
```

**Forbidden:**

- Claiming W3 from `02-browser-open3d-journey/` alone
- Dumping under `site/results/` or `results/tests/` as file-of-record
- Filtering vitest/Playwright output to invent green
- Silent skip of browser because “units cover it”

### 1.7 Live code vs bar (dual truth)

| Bar item | Plan-time (expert 2026-07-09) | Live 2026-07-10 |
|----------|-------------------------------|-----------------|
| pure `applySelectionDelete` | Missing | **Present** |
| multi-history delete | Loop N× updateProject | **One updateProject** |
| preventDefault Del/Bksp | Gap | **Present** |
| Esc clears selection | Gap | **Present** |
| pickFurniture unit | Missing | **Present** |
| browser under `03-*` | Missing | Spec **present**; **evidence tree missing** |
| CP-03 claim | Open | Appendix says PASS; **disk evidence absent → do not claim in handover** |

**Brutal honesty:** Code path for W3 is largely landed. **Gate artifact proof is not currently depositable from disk.** Treat re-proof as mandatory before any “W3 green” language in SESSION-RECAP, INDEX ticks, or buyer demos.

### 1.8 Product bar vs raised module bar

P03 CP-03 is **minimal world-standard gate**. Later global modules `select-edit` raise:

- Move / edit as jobs (not only delete)
- Re-prove under `modules/select-edit/evidence/`
- Explicit residual list if only delete works

Do not expand CP-03 mid-spine into full edit suite unless owner changes goal. Do not pretend CP-03 is “select/edit complete.”

---

## 2. Pure delete / single history / preventDefault / Esc

### 2.1 Why purity matters

Selection delete is a **document mutation**. If it is implemented as N× `updateProject` in a loop:

- History gets N past frames for one user intent
- One undo restores only one id
- Multi-select (even accidental `ids: [a,b]`) becomes an undo footgun
- Properties-panel single delete remains fine; keyboard path must batch

Expert false-reverse (01-react / EXPERT-PASS): **“multi-history delete good enough”** is a buyer-facing lie when multi-id exists.

### 2.2 Pure API — plan design vs live shape

**Appendix design (return pair):**

```ts
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): { project: Open3dProject; selection: CanvasSelection }
```

**Live shape (return project only):**

```ts
export function applySelectionDelete(
  project: Open3dProject,
  selection: CanvasSelection,
): Open3dProject
```

Workspace wire (live):

1. Read `workspaceCanvas.selection`
2. If none / empty ids → return early
3. `updateProject((project) => applySelectionDelete(project, selection))` once
4. `setSelection({ type: "none", ids: [] })` always after attempt

**Assessment:** Live shape is **acceptable** if (a) selection clear is always paired, (b) updater uses pure function, (c) no-op same reference when membership unchanged. Plan’s return-pair is slightly cleaner for testing “selection always none after attempt” in pure land; not worth thrashing mid-green if workspace pairing is unit-covered. Prefer **not** to rewrite signature only for aesthetic alignment.

### 2.3 Rules that must stay true (regardless of return shape)

1. `selection.type === "none"` or empty ids → **same project reference**
2. Map types: wall→walls, door→doors, window→windows, furniture→furniture, room→rooms
3. Remove **all** listed ids from active floor in **one** clone
4. Skip locked entities; if nothing removed → same ref
5. History identity: `updateOpen3dProject` only pushes past when `updated !== history.present` (and updatedAt stamp rules)
6. Selection is **transient** — never pushed into history stack as document state
7. No `any`
8. Wall delete **cascades** doors/windows on that wall (live pure helper does this; matches `deleteEntityFromProject` / pureActions spirit)

### 2.4 History model interaction

Live history (`store/history.ts`):

- `updateOpen3dProject(history, updater)`: if updater returns same reference (or same updatedAt edge), no past push
- Undo pops past → present; restores previous project object graph including furniture ids

**W3 undo requirement:** After delete of furniture `furn-1` at pose P, undo restores **id `furn-1` and pose P**, not a new UUID clone. That requires:

- Delete removes entity from array without reassigning other ids
- Undo restores previous project snapshot (structural sharing OK)
- Place/delete must not rewrite ids on undo path

**Test that proves it:** pure delete into hand-built history past, then `undoOpen3dAction`, assert id + position + rotation + catalogId (appendix Task 02 case 4). Live multi-id test asserts all three furniture return after multi-delete of two.

### 2.5 Single-history multi-id

Even if UI is single-select today:

| Case | Required behavior |
|------|-------------------|
| ids: [a] | One past entry; one undo restores a |
| ids: [a,b] | One past entry; one undo restores a **and** b |
| ids: [locked] | No past entry; same project ref |
| ids: [missing] | No past entry; same ref |
| ids: [a locked, b free] | One past; only b removed; undo restores b |

**Anti-pattern:** loop:

```ts
for (const id of selection.ids) {
  updateProject(p => deleteEntityFromProject(p, collection, id));
}
```

Plan-time workspace did this (~L289–308 expert). Live `deleteSelection` does **not** loop. Guard with a regression unit that multi-id produces one past length +1.

### 2.6 Properties panel path (allowed dual)

`handleDeleteEntity(collection, id)`:

- single-id `deleteEntityFromProject`
- clear selection

**OK for P03.** Do not force panel through multi-id batch unless free. Keyboard path uses selection batch. Document in NOTES so agents do not “unify” into thrash.

### 2.7 Keyboard Delete / Backspace / preventDefault

Live (`useWorkspaceKeyboard.ts`):

```ts
if ((event.key === "Delete" || event.key === "Backspace") && !mod) {
  event.preventDefault();
  handlers.deleteSelection?.();
  return;
}
```

**Why preventDefault is non-negotiable:**

- Backspace navigates back in some browsers/history contexts when not prevented
- Delete can scroll or trigger browser chrome focus behaviors
- Other workspace shortcuts already preventDefault — asymmetry is a bug smell
- Unit must assert `defaultPrevented === true` on cancelable KeyboardEvents

**Skip cases:**

| Condition | Behavior |
|-----------|----------|
| Focus in INPUT/TEXTAREA/SELECT/contentEditable | Early return — **no** delete |
| Ctrl/Cmd+Backspace | Must **not** delete (`!mod` guard) |
| enabled=false | No listeners effect |
| deleteSelection handler omitted | Optional chain — no throw |

### 2.8 Esc clears selection

**W3 grammar (industry):** Esc exits mode / deselects. Floorplanner manual pattern: Esc = exit mode / deselect. RoomSketcher: selection-driven edit lifecycle.

**Plan-time gap:** cancel only cleared pending catalog + canvas drawing cancel — **not** selection.

**Live fix present:**

```ts
cancel: () => {
  setPendingCatalogItemId(null);
  canvasRef.current?.cancel();
  workspaceCanvas.setSelection({ type: "none", ids: [] });
},
```

Both paletteHandlers.cancel and keyboard cancel wire the same.

**Esc does not mean delete.** Esc never removes furniture. Undo is for recovery after Delete.

**Esc vs draw tools:** Canvas cancel should abort in-progress wall/room/dimension; selection clear is additive.

**Not full W8:** Do not expand Task 06 into entire shortcut map honesty (P09). But Esc must clear selection for W3.

### 2.9 Locked entities

Industry pattern (Floorplanner layers/locks): locked items resist edit/delete.

O&O pure path: locked stay in collection; if all selected locked/missing → same project ref → no history pollution.

Buyer UX residual (not CP-03): no toast “item locked” — optional P1. Silence is OK if properties show lock state.

### 2.10 Selection not in undo stack

Document truth: active floor `furniture[]`. Selection is UI chrome.

If undo restored selection, buyers would see ghost selection after undo of unrelated edits. Spec: after delete, selection none; after undo of delete, selection **may remain none** (item restored but not re-selected). That is acceptable W3; re-select-on-undo is polish (not gate).

Live undo:

```ts
const runUndo = useCallback(() => {
  workspaceCanvas.undo();
  canvasRef.current?.cancel();
}, [workspaceCanvas]);
```

Note: undo does **not** re-set selection to restored furniture. Browser proof must assert **metrics/presence**, not “still selected after undo.”

### 2.11 preventDefault + editable fields interaction matrix

| Focus | Key | Expected |
|-------|-----|----------|
| Canvas / body | Delete | deleteSelection + preventDefault |
| Canvas / body | Backspace | deleteSelection + preventDefault |
| Canvas / body | Ctrl+Z | undo + preventDefault |
| Canvas / body | Esc | cancel (clear selection) + preventDefault |
| Input in properties | Backspace | edit text; **no** deleteSelection |
| Input | Delete | edit text; **no** deleteSelection |
| Input | Esc | browser/input behavior; editable early-return means **no** workspace cancel — residual honesty: Esc-in-input may not clear selection until blur (document if true) |

**Residual:** If `isEditableTarget` early-returns before Escape handling, Esc while typing in properties will **not** clear selection. That is acceptable for W3; full “Esc always deselects” is P09-ish. Document actual behavior in NOTES.

Live code: editable check is first; Escape never runs when typing. Honest NOTES: “Esc clears selection only when focus not in editable.”

### 2.12 Recommended pure-function test names (stable)

1. `returns same project reference when selection is none`
2. `removes one furniture id and keeps other entities`
3. `removes multi-id furniture in one project revision (single history step)`
4. `returns same reference when ids do not match`
5. `skips locked furniture and returns same ref when only locked selected` (add if missing)
6. `deleting a wall cascades doors and windows` (shared path; not W3 bar but regression gold)

Live file covers 1–4 and wall cascade; locked-only case should be grepped at execute — if missing, add.

### 2.13 Wiring algorithm (workspace) — anti thrash

```
deleteSelection():
  selection = workspaceCanvas.selection
  if selection is empty/none: return
  workspaceCanvas.updateProject(p => applySelectionDelete(p, selection))  // once
  workspaceCanvas.setSelection(none)
```

**Do not:**

- Call updateProject inside pure helper
- Push selection into history
- Double-clear with setTimeout races
- Delete via Fabric object dispose as authority
- Re-place furniture with new id on “undo” fake path

### 2.14 Ctrl/Cmd+Z vs history empty

If past empty, undo is no-op. Browser test must place+delete first so past has content. Unit history tests construct past explicitly.

### 2.15 Redo (not W3 hard gate)

Redo exists (Ctrl+Y / Ctrl+Shift+Z). Optional assert after undo→redo re-deletes. Stretch only.

---

## 3. Hit-test / pickFurniture / Fabric flag OFF

### 3.1 pickFurnitureAtPoint contract

Location: `site/features/planner/open3d/lib/geometry/canvasPicking.ts`

Algorithm (live):

1. Iterate furniture **reverse** (last drawn = top-most wins)
2. Half-width/depth from width/depth with **default 600mm** if omitted
3. Expand by `paddingMm`
4. Transform point into local frame using **inverse** of item rotation
5. Rotation: `(-(item.rotation || 0) * Math.PI) / 180` — **document degrees**
6. Axis-aligned local AABB test
7. Return first hit id or null

### 3.2 Unit cases (Task 01) — non-negotiable

| Case | Intent |
|------|--------|
| Hit center axis-aligned | happy path |
| Miss outside footprint beyond padding | null |
| Padding expands hit box | scale-aware click forgiveness |
| Top-most wins overlapping | last array entry |
| Rotation 90° footprint | rotated hit math |
| Empty array | null |
| Default 600mm when width/depth omitted | catalog incomplete items still pickable |

Fixtures: minimal `Open3dFurnitureItem` (id, catalogId, position, rotation, scale, width, depth).

### 3.3 Degrees lock (false-reverse killer)

Expert P0: furniture **document rotation = degrees**. Pick converts for hit math. Pure actions use `% 360`. Mesh uses Three radians on nodes with intentional sign flips.

**Forbidden mid-W3:** “convert furniture document to radians for P04 wording.” That rewrites pick, pureActions, fabric mapper, fixtures, and breaks W3 tests.

### 3.4 Canvas select path (Task 05)

Select tool branch (live Feasibility ~L736+):

- Requires `activeTool === "select"` and `workspaceCanvas`
- Converts client → project via `screenToProject(canvasPoint(event), transform)`
- Padding: `Math.max(20, 40 / transform.scale)`
- Sets selection furniture single-id array

**Default tool is wall.** Select is not free on page load. Tests and browser must arm Select.

### 3.5 Coordinate strategy for unit pointer tests

Expert P0-3 / appendix Task 05:

1. Task 01 owns pure hit math (do not thrash canvas if pure green)
2. For canvas integration: seed furniture at known **project mm**
3. Compute screen with `projectToScreen(point, INITIAL_TRANSFORM)`
4. Feasibility `INITIAL_TRANSFORM`: origin `(-4000, -2500)`, scale `0.1`
5. Mock `getBoundingClientRect` (0,0) 800×600 → client ≈ screen
6. **Do not call `fitToView`** in unit unless reading live transform from status
7. Prefer one real FeasibilityCanvas + workspaceCanvas pointer case

**Why fit thrash kills tests:** fit changes origin/scale; click coords drift; false red or false green.

Match Fabric `DEFAULT_FABRIC_STAGE_TRANSFORM` numerically when both engines share mm space — but W3 proof still flag OFF.

### 3.6 Fabric furniture flag OFF (hard)

Flag: `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE === "1"` only → ON.

| Flag | What owns furniture paint | What owns select |
|------|---------------------------|------------------|
| OFF (default) | Feasibility Block2D draw | Feasibility pickFurniture |
| ON | FurnitureFabricLayer flat Rects | Fabric interactive when select tool |

**Why flag-ON is false-green for W3:**

- Dual hit surfaces
- Pan/zoom desync risk between Fabric overlay and Feasibility walls
- Expert: do not treat `firstFurnitureCenter` / `__plannerFabricView` as W3 proof
- Approach A break if agents “just enable Fabric to make select work”

**Keep** `canvas-fabric-stage/` code — destination, not delete. Do not ship cutover in P03.

### 3.7 Document selection only

Authority: `useWorkspaceCanvas` → `CanvasSelection`.

`store/selection.ts` `PlannerSelection` is optional align — **do not** dual-store migrate in P03.

Fabric object selection is not W3 authority.

### 3.8 Selection ring / visual feedback

Feasibility paints selection ring via `selectedFurnitureIds`. Browser proof can use:

- Absence of “No Selection” heading (live e2e pattern)
- Status metrics (furniture count)
- Screenshot of ring (human-readable evidence)

Do not require pixel-perfect ring golden images for CP-03.

### 3.9 Hit order vs product bar

Openings/walls are pickable on select tool. W3 bar still **furniture**. Browser can place furniture only and never touch openings. Unit may still cover furniture-only.

If browser click hits wall because furniture miss, test is wrong (coords), not product “needs Fabric.”

### 3.10 Empty click clears selection

Live: miss path sets wall or room or none. Empty space → none. Matches industry deselect-on-empty-click.

### 3.11 Padding policy

Padding grows as scale shrinks (`40/scale`) so zoomed-out furniture remains clickable. Unit padding case is pure; canvas uses dynamic padding. Browser at default zoom must still hit batch-placed seats (e2e clicks 0.5,0.5 center).

### 3.12 Rotation edge cases for brainstorm (tests optional stretch)

| Stretch | Notes |
|---------|-------|
| rotation 45° | not in minimal suite; math should work |
| rotation 360 / -90 normalize | depends on document normalizeDegrees elsewhere |
| scale ≠ 1 on item | pick uses width/depth fields, not scale vector alone — residual risk if scale used without width |
| very small width/depth | halfW max(1, …) floor |

If catalog items rely on scale with width=0, default 600mm may false-hit large boxes — residual risk for catalog honesty (P05-ish).

### 3.13 What not to implement in pick during P03

- 3D raycast pick
- Multi-select additive Shift-click (post-W3)
- Marquee
- Group pick
- Competitor-style “similar items” sidebar

---

## 4. Competitive select/delete/undo patterns (ideas only)

**Ethics fence (binding):** Inspiration only. Rebuild with O&O chrome (Phosphor, CSS modules, O&O SKUs). No manuals-as-copy, no icon theft, no layout trade dress.

### 4.1 Pattern library → O&O W3 translation

| Industry pattern | Source pack | O&O W3 translation |
|------------------|-------------|-------------------|
| Select object → properties | Floorplanner, RoomSketcher | `CanvasSelection` drives PropertiesPanel |
| Del / Backspace deletes selection | Floorplanner manual shortcuts | `useWorkspaceKeyboard` → `deleteSelection` |
| Esc deselect / exit mode | Floorplanner | cancel clears selection + drawing |
| Undo/Redo Ctrl/Cmd+Z/Y | Universal CAD-lite | open3d history |
| Furniture priority over structure | Floorplanner marquee rule | pick order furniture first |
| Trash control + keyboard | RoomSketcher trash bin | Keyboard sufficient for W3; trash button optional W8 |
| Structure then decorate loop | Planner5D FAQ workflow | W1/W2 before polish; W3 is edit loop middle |
| Visible undo as recovery | ease comparison | History must work; status optional |
| Help → shortcuts overlay | Homestyler forum | P09 discoverability; define **our** map |
| Manufacturer SKU truth | IKEA public planners | Delete/undo on **real O&O catalog ids**, not generic demo only |

### 4.2 Floorplanner (primary W3 grammar fuel)

From `D:\websites\floorplanner.com\report\INSPIRATION.md`:

**Always-on grammar:**

| Function | Keys | O&O adopt? |
|----------|------|------------|
| Exit / deselect | Esc | Yes W3 |
| Delete | Del / Backspace | Yes W3 |
| Undo / Redo | Cmd/Ctrl+Z / Y | Undo W3; redo existing |
| Rectangle multi-select | Shift+drag | Post-W3 stretch |
| Pan | Spacebar | Already open3d space pan |
| Rotate selected | r/l | Not W3 gate |

**Multi-select priority (idea only):** if furniture in marquee, furniture wins. O&O single-select already prioritizes furniture hit order.

**Explicit non-goals from Floorplanner depth:** named groups, walkthrough, photoreal export, 260k library chrome, magic layout.

**Approach A checklist item 3:** “Select furniture; Delete/Backspace removes; undo restores.”

### 4.3 Planner5D (loop, not delete-key table)

From inspiration + TOOLBARS:

- Core loop: template/scratch → 2D structure → furnish catalog → 3D → export/share
- Delete walls / edit construction appears in tutorials as construction job
- Zone map: top / left tools / canvas / right catalog / bottom status
- **O&O:** zone map is chrome inspiration for shell; W3 is the **edit job** after place

Do not scrape editor bundles into product. Ethics file is binding.

### 4.4 RoomSketcher (select → edit → delete)

From `roomsketcher.com/report/INSPIRATION.md`:

| Pattern | Strength | W3 map |
|---------|----------|--------|
| Select → Properties right | Strong | Properties on selection |
| Drag move | Strong | **Not CP-03**; raised bar §8 |
| Trash delete | Strong | Optional UI; keyboard required |
| Lock optional | Medium | Locked skip already in pure delete |
| Undo documented | Thin in pack | O&O must still prove undo |

Help article quality: door place/edit/delete strong; toolbar 404 gap — do not invent RoomSketcher toolbar truths.

### 4.5 Homestyler

- Full keyboard table **not** in scrape; SEO article is fluff
- Pattern: Help → Shortcut Keys category
- O&O: build own map (P09); W3 only needs Del/Bksp/Esc/Undo correct

### 4.6 Ease / recovery (comparison 04-ease)

Pattern: visible undo + recovery when something goes wrong.  
O&O: if delete has no undo, ease score stays catastrophic (self-score ease 1 was partly “select/delete incomplete”).

### 4.7 Toolbar comparison (02-toolbar)

Historical O&O gap callout: “furniture select/delete path broken on default 2D.” That is exactly W3. Fix is product path + proof, not chrome redesign.

Recommended abstract tool rail grammar (ideas): Select · Wall · Room · Door · Window · Measure · Delete — **Phosphor icons, our labels**. Delete as tool vs key-only is product choice; W3 keys are enough.

### 4.8 SYNTHESIS one-liner

> Select + transform objects → Hit-test furniture/openings; Delete wired; Fabric full stage per Plan A 2B

**P03 scope of that sentence:** hit-test furniture + Delete wired. Transform (move/rotate) and Fabric full stage are **not** CP-03 completion criteria.

### 4.9 What we refuse to “match”

| Competitor expression | Refuse |
|-----------------------|--------|
| Floorplanner Build/Decorate/Furnish mega-tabs | Already REJ in older UI research |
| P5D icon set / color / marketing copy | Ethics |
| Homestyler material brush as W3 | Wrong gate |
| IKEA brand/SKU names | Use O&O SKUs only |
| Pixel-match any editor | Fail visual review if “looks like X” |

### 4.10 Jobs-to-be-done for select/edit loop (P5D-class job)

Unaided buyer jobs:

1. **Correct a mistake** — placed wrong SKU → select → delete → place again  
2. **Iterate layout** — select → (later move) → undo if wrong  
3. **Clear a zone** — multi-delete (later) without undoing walls  
4. **Trust the tool** — Esc always safe; Delete not silent no-op; Undo restores identity  

Without job 1, place (W2) is a trap: every wrong place is permanent without page reload hacks.

---

## 5. Browser proof requirements and false-green traps

### 5.1 Minimal browser script (CP-03 Task 08)

Narrow scope — **not** P07 full journey:

1. Open `/planner/guest/?plannerDevTools=1` or `/planner/open3d` (Fabric OFF)
2. Place or seed **one** (or batch) furniture
3. Select tool → click furniture → Delete → Ctrl/Cmd+Z
4. Screenshots: select / deleted / undone (+ optional placed)
5. Deposit under `03-select-delete/` with raw log

Live spec: `site/tests/e2e/open3d-w3-select-delete.spec.ts`

- serial mode, 120s timeout  
- guest entry  
- `placeSeatsFromConfigurator(page, 4)` (systems batch — pragmatic place path)  
- Select button → click canvas center  
- assert not “No Selection”  
- Delete → furniture count decreases  
- Ctrl+z → count increases  
- PNGs 01–04 under evidence path relative to cwd  

### 5.2 Hard browser gate rules (04-playwright expert)

1. Unit alone = FAIL  
2. Journey folder must not substitute for W3  
3. No silent skip / filtered logs  
4. Fail → keep red artifacts; `status: "fail"` + blockers  
5. Canonical folder only: `03-select-delete/`  
6. Prefer Feasibility path; do not use Fabric-stage helpers as W3 proof  
7. Document `PLAYWRIGHT_BASE_URL` vs build+start webServer in proof  

### 5.3 False-green trap matrix (W3-specific)

| Trap | Why it lies | Hard assert |
|------|-------------|-------------|
| Unit-only W3 | Handlers exist | Browser artifacts on disk under `03-*` |
| Journey claims W3 | Draw/place ≠ select/delete/undo | Separate CP-03 browser |
| Fabric select e2e | Wrong engine | Flag OFF + Feasibility |
| `firstFurnitureCenter` | Fabric hook | Ban for W3 |
| Click without Select tool | Default wall tool | Explicit Select arm |
| Count ≥1 furniture residual | Prior IDB project | clear storage / deltas |
| Undo increases count but new UUID | Fake restore | Unit same-id; browser optional id assert via test hooks |
| Screenshot non-blank only | No delete proof | Metric delta after Delete |
| Parallel workers race PNGs | Invalid evidence | serial describe |
| Appendix “PASS” without results/ | Docs rot | Re-run; deposit run.json |
| Properties delete only | Keyboard unproven | Keyboard path in browser |
| preventDefault untested | Browser back on Backspace | Unit defaultPrevented |
| Multi-history still green single-id | Multi-id undo broken | Multi-id unit mandatory |
| Esc only cancels draw | Selection stuck | Esc + selection none unit/browser |
| Guest seed walls confusion | Wrong gate | W3 does not use wall counts as pass |
| “No Selection” flaky timeout | Click miss | Fix coords; do not weaken assert to always pass |
| placeSeatsFromConfigurator as only path | Systems dependency | Document fallback inventory place if systems red |

### 5.4 Live e2e critique (honest)

**Strengths:**

- Serial + timeout correct  
- Furniture **delta** style (before/after place, delete, undo)  
- Select tool explicit  
- Screenshots named  
- Evidence path aims at canonical folder  

**Weaknesses / residual risks:**

1. **Does not assert same entity id** after undo — only count. Unit must carry id/pose bar.  
2. **Click 0.5,0.5** may select wall/room/opening if furniture not under center — flaky.  
3. **Batch place 4 seats** then Delete once may delete one selected item only — count `toBeLessThan(afterPlace)` is weak (could be −1 of 4). Acceptable for smoke; stronger would assert exact −1 or selection-aware.  
4. **No Fabric flag assertion** in test env.  
5. **Evidence folder missing** now — running test would recreate path if parent exists; currently `results/` absent.  
6. **Relies on systems configurator** — if systems v0 red, W3 browser red for wrong reason; keep inventory place fallback.  
7. **No Backspace browser case** — unit covers Backspace; optional browser one-liner.  
8. **No Esc browser case** — unit/keyboard covers; optional.  
9. **macOS Cmd+Z** not covered if CI is Windows-only — document platform.  
10. **Status bar furniture regex** brittle if copy changes — prefer dedicated testid long-term (not CP-03 blocker if notes honest).

### 5.5 Recommended browser hardening (still minimal)

| Add | Why |
|-----|-----|
| `clearPlannerStorage` / guest clean | residual furniture false base |
| Assert Select active | tool rail state |
| Prefer single furniture place for delete −1 exact | stronger signal |
| NOTES: Fabric env OFF | expert requirement |
| `run.json` browser.exitCode | map contract |
| On fail keep 03-deleted attempt PNG | debug |

### 5.6 chrome-devtools alternative

Plan allows Playwright **or** chrome-devtools scripted. If Playwright infra red, agent may prove with DevTools protocol + PNGs, same assertions, same folder. Do not invent third evidence root.

### 5.7 What browser must not expand into (scope guard)

- Full wall draw journey  
- Orbit 3D  
- Save/reload  
- Symbol quality judgment (P05)  
- Mesh quality (P08)  
- Multi-select marquee  

Stop and re-phase if agent starts coding those “while we’re here.”

---

## 6. Plan critique + expert pass alignment

### 6.1 Structure rewrite verdict

Hybrid thin execute card + appendix is **correct**. One CP ownership (reject P03b) is **correct**. Browser hard gate is **correct**.

### 6.2 Suggestions P0 — alignment status

| P0 | Suggestion | Plan applied? | Live / residual |
|----|------------|---------------|-----------------|
| P0-1 | Browser required for CP-03 | Yes in execute card | Evidence tree missing today |
| P0-2 | Canonical run.json + HEAD | Yes in appendix | Re-deposit on re-proof |
| P0-3 | Task 05 coords strategy | Yes in appendix | Ensure unit canvas select exists |
| P0-4 | History no-op identity | Yes in pure rules | Live applySelectionDelete same-ref |
| P0-5 | Openings out of product bar | Yes furniture-only | Openings still pickable — OK |

### 6.3 Expert table alignment

| Expert | Verdict | W3-relevant must-fix | Posture for execute |
|--------|---------|----------------------|---------------------|
| React 01 | FIX | pure delete, single history, preventDefault, Esc, unit then browser, degrees | Code largely fixed; re-proof evidence |
| Canvas 02 | SHIP | flag OFF, document selection, Block2D authority, keep fabric-stage folder | Still binding |
| Playwright 04 | FIX | browser in 03-*, serial, no silent skip, no Fabric proof | Spec exists; artifacts missing |
| EXPERT-PASS merged | YES WITH FIXES | spine #3 W3 unit+browser first | Kill order still right |

### 6.4 Plan vs live signature drift

Appendix still documents return-pair API; live returns `Open3dProject` only. **Critique:** appendix “Current post-land” should note signature drift to avoid implementer thrash. Not a product bug.

### 6.5 Plan inventory “Missing” is historical

Appendix correctly marks historical inventory as pre-land. Agents must not re-implement from “Missing” lists without reading code.

### 6.6 Weak spots remaining in plan/docs

1. **Appendix PASS vs missing results/** — honesty debt; fix NOTES or re-run.  
2. **Task 05 canvas select unit** — grep found no furniture select cases in `open3dFeasibilityCanvas.test.tsx`; pure pick exists; canvas integration may still be thin.  
3. **E2E weak id/pose assert** — relies on unit for CP-03.5 spirit.  
4. **Global modules plan** says re-prove under `modules/select-edit/` — dual evidence worlds; do not confuse historical `03-select-delete/` with module complete.  
5. **README phase folder** lists 01/04 but not 02 in one bullet list order — minor; 02 exists.  
6. **Push rules:** execute card says “push only on ask”; AGENTS.md now allows agent push when right — follow **AGENTS.md user wins** for git ops, not stale plan line, unless owner overrides.

### 6.7 Kill-order critique

Spine: W3 → journey → save is **right**. Reasons:

- Journey without delete trains buyers into dead ends  
- Save without edit loop freezes mistakes  
- Orbit/symbols/mesh polish without select feels like a viewer, not a planner  

Do not let parallel agents steal W3 browser slot for mesh chrome.

### 6.8 What the plan gets brutally right

- Unit then browser hard gate  
- Single history multi-id  
- preventDefault  
- Fabric OFF  
- Furniture-only bar  
- Approach A  
- Evidence folder name stability  
- No competitor chrome  

### 6.9 What agents will still mess up (predictive)

1. Mark W3 green from unit CI on laptop without depositing `results/`  
2. Enable Fabric flag “to make tests pass”  
3. Use journey pack as W3  
4. Convert rotation to radians “for consistency”  
5. Skip Select tool in e2e  
6. Treat properties panel delete as keyboard proof  
7. Expand into move/rotate mid-P03  
8. Delete `canvas-fabric-stage` as “unused”  
9. Claim multi-select shipped  
10. Filter Playwright failures  

### 6.10 Expert false-reverse list (keep taped to monitor)

1. Furniture rotation → radians  
2. Fabric full-stage / flag-ON for W3  
3. Port 3D to R3F mid-gate (orbit phase, but same thrash class)  
4. Unit-only W3  
5. Multi-history delete / bare Saved-as-cloud / Dimension→D (shared lies class)

---

## 7. Buyer journeys that die without W3

### 7.1 Facilities buyer (north star)

North star: unaided facilities buyer lays out office, select/edit/delete, 2D↔3D, save, quote later.

**Without W3:**

- Misplaced cabinet is permanent → buyer reloads / abandons  
- Cannot correct catalog mistakes → inventory place is high anxiety  
- Trust collapses: “this is a demo, not a tool”  
- Ease self-score stays ~1  

### 7.2 Journey skeletons that require W3 mid-loop

| Journey | Break point without W3 |
|---------|------------------------|
| Draw room → place 6 seats → realize 1 wrong SKU | Cannot remove wrong seat |
| Place → select → check properties → delete → replace | Select/delete missing |
| Place → delete → undo “oops” | Undo/delete missing |
| Train internal sales on planner | Trainers blocked by stuck furniture |
| BOQ from placed set | Wrong items pollute quote forever |
| Guest trial “try then claim” | Trial ends in frustration |

### 7.3 Why place without delete is worse than no place

A product that can **add but not remove** creates irreversible entropy. Buyers prefer tools that refuse place over tools that trap mistakes. W3 is **error recovery infrastructure**, not a nice-to-have.

### 7.4 Sales demo script dependency

Demo script:

1. Draw walls (W1)  
2. Place cabinet + desk (W2)  
3. **Select desk, Delete, Undo** (W3) — shows professionalism  
4. Toggle 3D orbit (W4)  
5. Save/reload (W5–W6)  

Skip 3 and the demo feels like a catalog viewer.

### 7.5 Support burden

Without delete/undo, support hears:

- “How do I remove furniture?”  
- “I have to start over every time”  
- “Is there a trash button?”  

W3 + optional trash label (W8) kills that ticket class.

### 7.6 Competitive buyer expectation

Even free tiers of Floorplanner/P5D/RoomSketcher class tools treat delete/undo as table stakes. O&O self-score ease 1 explicitly called out select/delete incomplete. Meeting W3 is **table stakes**, not differentiation. Differentiation is O&O SKUs + BOQ + modular systems — but table stakes unlock the right to sell the wedge.

---

## 8. Raised quality bar for select/edit UX

CP-03 is the **floor**. Raised bar is what “select/edit module complete” should mean later (global modules `select-edit`), without expanding P03 execute without owner intent change.

### 8.1 Floor (CP-03 / W3)

- Select furniture  
- Delete/Backspace  
- Undo same id/pose  
- Esc clear selection (non-editable focus)  
- Unit + browser proof  

### 8.2 Raised bar (post-W3 / module select-edit)

| Capability | Why buyers feel it |
|------------|--------------------|
| Move drag on 2D | Correct layout without delete+replace |
| Rotate (keys or handle) | Orientation fixes |
| Duplicate | Speed layouts |
| Nudge arrows | Precision |
| Click-empty deselect (already) | Hygiene |
| Properties numeric pose edit | Exact mm |
| Trash control visible | Discoverability for non-keyboard users |
| Multi-select + single-history delete | Batch correct |
| Re-select after undo (optional) | Continuity |
| Locked feedback toast | Clarity |
| 3D select continuity (later) | Orbit phase adjacent |
| Status “Deleted / Undone” ephemeral | Confidence |

### 8.3 Explicitly not raised-bar blockers for CP-03

Marquee, groups, 3D authoring, materials, similar-items swap, favourites.

### 8.4 UX quality heuristics (original O&O, not competitor chrome)

1. **Select tool must be obvious** — default wall tool is OK if Select is one click/V and labeled.  
2. **Selection must be visible** — ring + properties heading not “No Selection.”  
3. **Delete must be undoable within one Z** for one user intent.  
4. **Backspace must not leave the page.**  
5. **Esc must feel safe** (no data loss).  
6. **Miss-click should deselect, not randomly select far wall** if padding insane — tune padding carefully.  
7. **After place, optional auto-switch to Select** — P1-9 out of CP-03; still good product idea.  
8. **Keyboard and pointer agree** on what is selected.  

### 8.5 A11y bar (minimal for W3)

- Delete/Backspace work when focus not trapped incorrectly  
- Select tool button name accessible (`/Select/i` e2e)  
- Do not require full a11y audit for CP-03 (P09/shell residual)  

### 8.6 Performance bar

Pick is O(n) reverse scan — fine for office furniture counts. No spatial index required for W3. Multi-thousand seats later may need structure — out of phase.

---

## 9. Approaches for implementation order

Even with much code landed, re-proof and residual work should follow a disciplined order. Three approaches:

### 9.1 Approach Alpha — Plan Task 00–09 as written (recommended for first land / re-proof)

Order:

0. Baseline evidence dir + vitest baseline  
1. pickFurniture unit  
2. pure applySelectionDelete + undo  
3. wire deleteSelection single update  
4. keyboard preventDefault  
5. canvas select furniture unit  
6. Esc clear selection  
7. unit evidence pack + p0:unit  
8. minimal browser  
9. run.json sign-off  

**Pros:** Matches plan; TDD; hard browser gate last after logic solid.  
**Cons:** Browser late — risk discovering coord/tool issues late.  
**When:** First land or full re-proof after evidence wipe.

### 9.2 Approach Beta — Browser-first spike then backfill units (not recommended)

**Pros:** Fast buyer truth.  
**Cons:** Violates TDD plan; false greens; harder root-cause; experts forbid unit-only but browser-first without units also fails discipline.  
**Verdict:** Reject for P03.

### 9.3 Approach Gamma — Re-proof only (recommended **now** given code landed)

Order for 2026-07-10 state:

1. Confirm Fabric flag OFF in env used for proof  
2. Run unit pack (pick, applySelectionDelete, keyboard, feasibility if select cases exist, modelOperations)  
3. Fill any missing unit cases (locked-only, canvas select pointer, same-id pose assert if thin)  
4. Run `open3d-w3-select-delete.spec.ts` with baseURL; deposit PNGs + raw log under `03-select-delete/`  
5. Write run.json + NOTES honesty (including any residual: e2e count-only undo, systems place dependency)  
6. Only then tick CP-03  

**Pros:** Matches reality; avoids re-implementing landed pure helpers.  
**Cons:** Temptation to skip unit re-run. Do not.

### 9.4 Parallelism rules

- Do not parallel two writers on `workspaceEntityHelpers` / keyboard / Feasibility select branch.  
- P04 orbit fill only after CP-02 and without stealing W3 browser slot.  
- P07 may proceed in parallel **only** if coordinated; full story honesty still wants CP-03 not red.

### 9.5 Commit slice grammar (from appendix)

1. docs baseline evidence  
2. test pickFurniture  
3. fix pick if needed  
4. feat pure applySelectionDelete  
5. fix single-history deleteSelection  
6. fix preventDefault + tests  
7. test Feasibility select  
8. fix Esc selection  
9. unit evidence pack  
10. browser evidence pack  

Re-proof may squash to: `test(open3d): re-deposit W3 unit+browser evidence CP-03`.

### 9.6 Recommendation

- **If greenfield:** Alpha  
- **If current main with helpers present:** Gamma  
- **Never:** Beta  

---

## 10. Tests matrix brainstorm (unit vs browser)

### 10.1 Unit matrix

| Area | File (expected) | Cases | Layer |
|------|-----------------|-------|-------|
| pick hit/miss/pad/top/rot/empty/default | `geometry/canvasPicking.test.ts` | Task 01 list | pure |
| pure delete single | `applySelectionDelete.test.ts` | remove one | pure |
| pure multi-id one history | same | two ids one undo | pure+history |
| pure no-op same ref | same | none/missing/locked | pure |
| wall cascade openings | same | regression shared path | pure |
| keyboard Del/Bksp preventDefault | `open3dWorkspaceKeyboard.test.tsx` | both keys | hook |
| keyboard skip mod/editable | same | Ctrl+Bksp, input | hook |
| keyboard Esc → cancel | same | Escape | hook |
| workspace deleteSelection once | optional workspace/integration | spy updateProject call count | wire |
| Feasibility select furniture | `open3dFeasibilityCanvas.test.tsx` | pointer select tool | canvas |
| Feasibility empty → none | same | miss | canvas |
| wall tool does not set furniture | same | tool isolation | canvas |
| modelOperations non-regression | `modelOperations.test.ts` | suite run | pack |
| p0:unit | monorepo gate | non-regression | pack |

### 10.2 Browser matrix

| Case | Required CP-03? | Notes |
|------|-----------------|-------|
| place ≥1 furniture | Yes | seed |
| arm Select | Yes | |
| click furniture → selection UI | Yes | |
| Delete → count down | Yes | |
| Ctrl/Cmd+Z → count up | Yes | |
| Screenshots 3–4 | Yes | |
| Backspace path | No (unit yes) | optional |
| Esc deselect | No (unit yes) | optional |
| Same id assert | Prefer unit | browser hard without hooks |
| Fabric ON path | No — must not be sole proof | |
| Multi-select marquee | No | |
| open3d auth route | Prefer guest | auth wall fallback |

### 10.3 What belongs only in unit

- Rotation 90° math  
- Padding mm exact  
- Top-most order  
- Locked same-ref  
- Multi-id single past  
- preventDefault boolean  
- Default 600mm  

### 10.4 What belongs only in browser (or both)

- Select tool discoverable  
- Real pointer → selection chrome  
- Real Delete key → document update → metrics  
- Undo key → restore visible  
- No browser-back on Backspace (manual/rare CI)  

### 10.5 Anti-patterns in tests

| Anti-pattern | Fix |
|--------------|-----|
| Mock deleteSelection and call it green for browser | Real path |
| Snapshot entire DOM | Metrics + role asserts |
| fitToView in unit without transform capture | INITIAL_TRANSFORM |
| `any` in tests | forbidden |
| Conditional skip on CI | fail or fix |
| Assert only screenshot file exists without content meaning | pair with count asserts |

### 10.6 Suggested command block (re-proof)

```powershell
Set-Location D:\OandO07072026\site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/applySelectionDelete.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose

# browser (dev server running; set base URL)
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3000"
npx playwright test -c config/build/playwright.config.ts tests/e2e/open3d-w3-select-delete.spec.ts --reporter=list
```

Deposit logs under `results/planner/world-standard-wave/03-select-delete/` (create tree first). Plan mentions `deleteSelection.test.ts` name; live file is `applySelectionDelete.test.ts` — use live names in NOTES.

### 10.7 Coverage honesty

Purpose over percentage. A 100% covered wrong multi-history loop is still FAIL. Multi-id undo case is higher value than CSS class snapshots.

---

## 11. Failure modes

### 11.1 Product failure modes

| Failure | Symptom | Root class | Fix class |
|---------|---------|------------|-----------|
| Cannot select furniture | Click does nothing | tool wrong / pick miss / flag ON desync | arm Select; fix pick; flag OFF |
| Select wall under furniture | Wrong selection type | hit order / padding | order already furniture-first; fix coords |
| Delete no-op | Item stays | selection none; locked; handler unbound | ensure selection; unlock; wire keyboard |
| Backspace leaves site | Navigation | missing preventDefault | keyboard fix |
| Undo does not restore | Item gone forever | history not pushed; wrong updater identity | pure same-ref rules; single update |
| Undo restores wrong id | New UUID | re-place on undo | use history present restore |
| Multi-delete needs N undos | Multi-history | loop updateProject | applySelectionDelete once |
| Esc leaves selection | Stuck props | cancel missing setSelection | wire clear |
| Delete while typing deletes furniture | Focus bug | editable guard missing | isEditableTarget |
| Fabric ON select broken vs Feasibility | Dual store | flag path | prove OFF; fix cutover later |
| After place still wall tool | UX friction | default tool | document V/Select; optional auto-select post-place |
| 3D view delete | No 2D selection | wrong view | W3 is 2D proof; 3D later |

### 11.2 Evidence failure modes

| Failure | Symptom | Fix |
|---------|---------|-----|
| results/ missing | cannot claim | recreate + re-run |
| unit green browser red | CP-03 FAIL | fix product or test; keep red artifacts |
| browser green unit red | still FAIL | fix unit; both required |
| journey green W3 claimed | false | separate packs |
| filtered logs | handbook FAIL | zero suppression |
| parallel PNG race | invalid | serial |
| NOTES claim multi-select | CP-03.11 fail | honest scope |

### 11.3 Process failure modes

| Failure | Fix |
|---------|-----|
| Re-open Approach B mid-W3 | stop; Approach A lock |
| Convert degrees | stop |
| Two agents edit keyboard + helpers | serialize |
| Skip TDD because “code exists” | re-proof still runs tests first |
| Push force | never without owner |

### 11.4 Data / persistence interaction

Delete then navigate away without save honesty (P06) can lose recovery beyond undo stack. W3 does not fix save. Undo stack is session memory; reload clears past. Buyer journey full story needs P06 after edit loop exists.

### 11.5 Security / abuse (low for W3)

No secrets. Delete is local document edit. Do not log PII in evidence screenshots if projects named with customer data — use synthetic names (“W3 select-delete”).

---

## 12. Linkage to P07 journey honesty

### 12.1 Separation of concerns

| Phase | Gate | Folder | Proves |
|-------|------|--------|--------|
| P03 | W3 | `03-select-delete/` | select→delete→undo |
| P07 | W1–W2 | `02-browser-open3d-journey/` | draw walls+opening; place ≥2 incl cabinet-v0 |

### 12.2 Honesty rules between them

1. P07 green does **not** imply W3.  
2. P03 green does **not** imply W1/W2.  
3. Full “planner works” story needs CP-03 + CP-07 (+ CP-05 symbols for full W2 quality) unless owner **WAIVE**.  
4. P07 must not dump W3 screenshots into journey folder as substitute.  
5. P07 may **re-assert** delete as optional step later — still keep `03-*` as file of record for W3.  

### 12.3 Shared infrastructure

| Shared | Notes |
|--------|-------|
| Guest entry helpers | `enterGuestPlannerWorkspace` / clear storage |
| Canvas click helpers | `clickOnCanvas`, `waitForPlannerCanvas` |
| Status metrics | walls/objects/furniture counts; `getFurnitureCount` for P07 |
| Feasibility engine | both prove flag OFF |
| Serial Playwright config discipline | both need serial when multi-step |

### 12.4 Order in kill spine

INDEX: **P03 before celebrate journey as complete product**, even if P07 can run parallel after CP-02.

Rationale: place without delete is a hostile journey. Prefer W3 green before marketing W1–W2 filmstrips.

### 12.5 False story combinations

| Claim | Reality |
|-------|---------|
| “Journey passed so select works” | Journey may never press Delete |
| “W3 passed so draw works” | W3 may use configurator place only |
| “Both unit packs green so ship” | Browser still required each |
| “Module select-edit closed from old CP-03” | global plan forbids; re-prove |

### 12.6 P07 failure table mentions P03

P07 execute card: scope creep (select/save/orbit) → stop — P03/P04/P06. Good fence. Brainstormers and implementers must obey.

### 12.7 Metrics coupling

W3 e2e uses furniture count regex. P07 needs `getFurnitureCount` helper. Prefer converging on one helper to reduce brittle dual parsers — residual improvement, not CP-03 blocker.

### 12.8 When journey should include a W3 micro-step

Optional later enhancement: after place in journey, select+delete+undo one item as regression. **Still** deposit or dual-write proof note; do not delete `03-select-delete/` ownership.

---

## 13. Appendix — path index

### 13.1 Phase / plan

- `D:\OandO07072026\Plans\phases\P03-select-delete\P03-select-delete.md`
- `D:\OandO07072026\Plans\phases\P03-select-delete\P03-appendix.md`
- `D:\OandO07072026\Plans\phases\P03-select-delete\P03-suggestions.md`
- `D:\OandO07072026\Plans\phases\P03-select-delete\01-react-open3d.md`
- `D:\OandO07072026\Plans\phases\P03-select-delete\02-canvas-2d.md`
- `D:\OandO07072026\Plans\phases\P03-select-delete\04-playwright-evidence.md`
- `D:\OandO07072026\Plans\phases\P03-select-delete\README.md`
- `D:\OandO07072026\Plans\phases\EXPERT-PASS.md`
- `D:\OandO07072026\Plans\INDEX.md`
- `D:\OandO07072026\Plans\phases\P07-draw-place-journey\P07-draw-place-journey.md`
- `D:\OandO07072026\Plans\Research\RESEARCH-MAP.md`
- `D:\OandO07072026\Plans\Research\RESULTS-MAP.md`
- `D:\OandO07072026\Plans\Research\STRUCTURE-ADVICE.md`
- `D:\OandO07072026\Plans\Research\STRUCTURE-REWRITE-NOTE.md`
- `D:\OandO07072026\Plans\Research\Others\18-PRODUCT-CONTEXT.md`

### 13.2 Design / modules

- `D:\OandO07072026\docs\superpowers\specs\2026-07-09-world-standard-planner-design.md`
- `D:\OandO07072026\docs\superpowers\plans\2026-07-10-global-standard-modules.md`

### 13.3 Live product (primary edit surface for W3)

- `D:\OandO07072026\site\features\planner\open3d\lib\geometry\canvasPicking.ts`
- `D:\OandO07072026\site\features\planner\open3d\canvas-feasibility\FeasibilityCanvas.tsx`
- `D:\OandO07072026\site\features\planner\open3d\editor\OOPlannerWorkspace.tsx`
- `D:\OandO07072026\site\features\planner\open3d\editor\useWorkspaceKeyboard.ts`
- `D:\OandO07072026\site\features\planner\open3d\editor\workspaceEntityHelpers.ts`
- `D:\OandO07072026\site\features\planner\open3d\store\history.ts`
- `D:\OandO07072026\site\features\planner\open3d\canvas-fabric-stage\` (do not delete; not W3 authority)

### 13.4 Live tests

- `D:\OandO07072026\site\tests\unit\features\planner\open3d\geometry\canvasPicking.test.ts`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\applySelectionDelete.test.ts`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\open3dWorkspaceKeyboard.test.tsx`
- `D:\OandO07072026\site\tests\unit\features\planner\open3d\open3dFeasibilityCanvas.test.tsx`
- `D:\OandO07072026\site\tests\e2e\open3d-w3-select-delete.spec.ts`
- `D:\OandO07072026\site\tests\unit\config\playwrightOpen3dWorldSpecs.test.ts` (maps W3 → e2e file)

### 13.5 Evidence (canonical — may need recreate)

- `D:\OandO07072026\results\planner\world-standard-wave\03-select-delete\` (**missing at report time**)

### 13.6 Research (ideas only)

- `D:\websites\README.md`
- `D:\websites\floorplanner.com\report\INSPIRATION.md`
- `D:\websites\planner5d.com\report\INSPIRATION_REPORT.md`
- `D:\websites\planner5d.com\report\TOOLBARS.md`
- `D:\websites\planner5d.com\report\ETHICS_AND_INSPIRATION.md`
- `D:\websites\roomsketcher.com\report\INSPIRATION.md`
- `D:\websites\homestyler.com\report\INSPIRATION.md`
- `D:\websites\research\2026-07-09-world-standard\SYNTHESIS.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\MASTER-CHART.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\02-toolbar\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\04-ease\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\07-oando-self\REPORT.md`
- `D:\websites\research\2026-07-09-world-standard\comparison\ENGINE-DECISION.md`

### 13.7 This deliverable

- `D:\OandO07072026\Idiots\P03-select-delete\REPORT.md`

---

## 14. Appendix — quotes (authority snippets, paraphrased locations)

> Exact wording may be lightly compacted; open path for full text.

### 14.1 Design W3

Source: `docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`  
**W3:** Select furniture + Delete/Backspace removes it; undo restores — **Unit + Playwright**.

### 14.2 Execute card goal

Source: `P03-select-delete.md`  
Buyer on open3d/guest can select furniture on 2D, Delete/Backspace remove, Ctrl/Cmd+Z restore **same entity id + pose**. Unit alone = FAIL.

### 14.3 EXPERT-PASS must-fix #1

Source: `Plans/phases/EXPERT-PASS.md`  
W3 select→delete→undo: pure helper → one updateProject; Del/Bksp preventDefault; Esc clears selection; unit then browser under `03-select-delete/`. Unit alone = FAIL.

### 14.4 Canvas expert flag OFF

Source: `02-canvas-2d.md`  
Prove W3/W2 with Fabric furniture flag OFF. Document selection only. No second selection store.

### 14.5 Playwright expert unit-only lie

Source: `04-playwright-evidence.md`  
Unit-only W3: handler exists / vitest green — hard assert browser artifacts under `03-select-delete/`.

### 14.6 Floorplanner shortcuts grammar

Source: `floorplanner.com/report/INSPIRATION.md` §2.7  
Esc exit/deselect; Del/Backspace delete; Cmd/Ctrl+Z/Y undo/redo.

### 14.7 Floorplanner O&O translation W3

Same report §3: Click select → props; Del/Backspace; Esc — gates W3/W8.

### 14.8 RoomSketcher W3 map

Source: `roomsketcher.com/report/INSPIRATION.md`  
W3: hit-test furniture; Delete/Backspace; undo restores; trash optional if keyboard works.

### 14.9 SYNTHESIS

Source: world-standard SYNTHESIS  
Select + transform objects → hit-test; Delete wired; Fabric full stage later.

### 14.10 Ethics

Source: `planner5d.com/report/ETHICS_AND_INSPIRATION.md`  
Study behavior and rebuild; do not ship their code/assets/UI chrome.

### 14.11 Global modules gate

Source: `2026-07-10-global-standard-modules.md`  
**GATE old CP-03 PASS ≠ module complete** — re-prove or list residual under `modules/select-edit/`.

### 14.12 Structure advice reject P03b

Source: `Plans/Research/STRUCTURE-ADVICE.md`  
Reject unit vs browser as two CPs — invites unit-PASS + browser later forever.

### 14.13 O&O self-score ease

Source: `07-oando-self/REPORT.md`  
Ease score 1 — unaided journey missing; furniture select/delete incomplete vs world gates.

### 14.14 Live pure helper comment

Source: `workspaceEntityHelpers.ts`  
“Remove all selected entities in **one** project revision (single history step). Locked entities stay. Returns the same project reference when membership is unchanged.”

### 14.15 Live keyboard delete

Source: `useWorkspaceKeyboard.ts`  
Delete or Backspace without mod → preventDefault + deleteSelection.

---

## 15. Appendix — non-claims

This brainstorm does **not** claim:

1. That CP-03 is currently depositable-green from disk evidence (results tree missing).  
2. That multi-select, marquee, or groups are in scope.  
3. That 3D pick/delete is done.  
4. That Fabric full stage is live.  
5. That P07 journey is green.  
6. That save/cloud honesty is green.  
7. That mesh/symbols meet manufacturer bar.  
8. That competitor parity on photoreal/catalog size is a goal.  
9. That appendix “PASS” is sufficient without re-proof.  
10. That e2e proves same entity id (it proves count recovery).  
11. That Esc clears selection while focus is in inputs (live early-return).  
12. That properties panel multi-id delete is required.  
13. That auto-switch to Select after place is required.  
14. That W8 shortcut map is complete.  
15. That any competitor UI was or should be copied.  
16. That Firecrawl should be re-run for this phase.  
17. That Approach B/C should reopen.  
18. That module `select-edit` is closed by historical W3.  
19. That BOQ/quote path is buyer-complete.  
20. That this report authorizes product code changes (head may execute separately).

---

## 16. Appendix — open questions (resolved stances — no TBD)

These are decisions with **recommended stances** so execute does not stall:

| # | Question | Stance |
|---|----------|--------|
| Q1 | Return-pair vs project-only pure API? | **Keep live project-only** if workspace always clears selection; update appendix note; no thrash rewrite. |
| Q2 | Guest vs open3d for browser proof? | **Prefer guest + plannerDevTools=1**; open3d OK if auth clear; document route in NOTES. |
| Q3 | Exact furniture count assert vs lessThan? | Prefer **exact −1** with single place; live lessThan acceptable if NOTES honest. |
| Q4 | Systems configurator place vs inventory place? | Prefer **inventory cabinet-v0** for W3 purity; systems batch OK fallback if documented. |
| Q5 | Must browser assert id equality? | **Unit mandatory**; browser optional via debug hook; do not block CP-03 if unit strong. |
| Q6 | Openings delete in browser? | **Out of CP-03 bar.** |
| Q7 | Include Backspace in browser? | **Optional**; unit required. |
| Q8 | Post-place auto Select? | **Out of CP-03**; good P1. |
| Q9 | Trash button? | **Out of CP-03**; W8 discoverability. |
| Q10 | Evidence path recreate if missing? | **Yes** — create `results/planner/world-standard-wave/03-select-delete/` on re-proof. |
| Q11 | Can journey folder host W3? | **No.** |
| Q12 | Fabric ON dual proof? | **Not as authority**; OFF only for claim. |
| Q13 | Degrees vs radians? | **Degrees document**; never convert mid-spine. |
| Q14 | Locked toast? | Optional; silent skip OK for W3. |
| Q15 | Re-select after undo? | Optional polish; not gate. |
| Q16 | Plan name `deleteSelection.test.ts` vs live `applySelectionDelete.test.ts`? | **Use live filename** in evidence NOTES. |
| Q17 | Push after land? | Follow **AGENTS.md** (agent may push when right); plan “ask” is outdated relative to AGENTS. |
| Q18 | Module re-proof required now? | For **W3 historical gate**, re-deposit `03-*`. For **global module complete**, separate `modules/select-edit/` later. |
| Q19 | Esc in editable fields? | Document: no workspace cancel while typing; OK for W3. |
| Q20 | Multi-id UI? | Not required; pure multi-id tests required. |

---

## 17. Appendix — residual risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| results/ wiped or never committed | **High** for claims | Re-run pack; commit evidence; P10 handover |
| E2E click miss / flaky center | Medium | Single known seed coords; Select + projectToScreen strategy |
| Systems place dependency | Medium | Inventory place fallback |
| Canvas select unit thin | Medium | Add Task 05 pointer case if missing |
| Same-id only in unit | Low-Med | Keep unit strong; optional browser hook |
| Flag ON accidental in CI | Medium | Document env; assert off in NOTES |
| Dual evidence worlds (wave vs modules) | Medium | Label historical vs module complete |
| Undo stack lost on reload | Accepted | P06 owns durability |
| Default tool wall | Low UX | Document Select/V; chrome labels P09 |
| Padding too large selects wrong item | Low | Unit + real layout tests |
| Wall delete cascade surprises | Low | Not W3 furniture bar; document |
| Agent reimplements pure helper differently | Medium | Read live code first |
| Competitor chrome creep | High ethics | Ethics fence + visual review |
| Parallel writers conflict | Medium | One package writer |
| Claiming ease fixed after W3 only | Medium | Still need journey+save |

---

## 18. Appendix — recommended slices

### 18.1 Slice R0 — Honesty baseline (docs/evidence only)

- Create `results/planner/world-standard-wave/03-select-delete/`  
- HEAD.txt + NOTES.md stating live code status vs missing prior artifacts  
- No product change  

### 18.2 Slice R1 — Unit re-proof pack

- Run pick + applySelectionDelete + keyboard + feasibility + modelOperations  
- Deposit vitest-w3-raw.log + task logs  
- Add any missing locked-only / canvas select cases if red gaps found  

### 18.3 Slice R2 — Browser re-proof pack

- Run `open3d-w3-select-delete.spec.ts`  
- Deposit PNGs + browser raw log  
- Harden if flaky (single furniture, exact counts)  
- NOTES: Fabric OFF, route, server baseURL  

### 18.4 Slice R3 — CP-03 sign-off

- run.json PASS only if unit+browser exit 0  
- W3-ACCEPTANCE.md checklist CP-03.1–03.11  
- FILES-TOUCHED.md  
- Commit; push/mirror per AGENTS  

### 18.5 Slice R4 — Optional harden (still W3-adjacent)

- Exact −1 furniture assert  
- Backspace browser once  
- Esc browser once  
- `getFurnitureCount` shared helper  

### 18.6 Slice R5 — Explicitly later (not P03 CP)

- Move/rotate/nudge  
- Multi-select marquee  
- Trash button  
- Auto Select after place  
- 3D select  
- Module `select-edit` raised bar ritual  

### 18.7 Implementation order recommendation (current main)

**R0 → R1 → R2 → R3** (Gamma). Only drop into product code slices if R1/R2 expose real reds.

### 18.8 Definition of done for “Idiots P03 complete”

This brainstorm report exists with sections 0–18, no product code modified by this agent, honest about evidence gap and live landings. **Product CP-03 green is a separate execute job.**

### 18.9 Handover one-liner for head agent

> W3 = Feasibility select (flag OFF) + Del/Bksp preventDefault + single-history `applySelectionDelete` + undo same id/pose; unit **then** browser under `03-select-delete/`; code largely present 2026-07-10; **re-deposit evidence before any PASS claim**; do not let journey or Fabric substitute; furniture-only bar; degrees stay degrees.

### 18.10 Anti-thrash card (print)

```
NO Fabric flag ON for W3 proof
NO unit-only PASS
NO journey folder as W3
NO furniture radians rewrite
NO multi-history delete loop
NO competitor chrome
NO worktrees
NO results under site/
YES Select tool before click
YES preventDefault
YES Esc clears selection (non-editable)
YES same project ref on no-op
YES commit evidence with run.json
```

---

## End matter

**Agent:** Brainstormer 03 / 10  
**Deliverable path:** `D:\OandO07072026\Idiots\P03-select-delete\REPORT.md`  
**Product code changed:** none  
**Next owner of execution:** head agent / P03 execute seat following Alpha or Gamma  
**Related brainstorm folders:** `Idiots/P07-draw-place-journey/` (journey honesty), `Idiots/P02-engine-lock/` (flag OFF / Fabric destination), `Idiots/P09-shortcuts-chrome/` (labels/map beyond Esc/Delete)

*End of exhaustive P03 W3 select/delete/undo brainstorm report.*
