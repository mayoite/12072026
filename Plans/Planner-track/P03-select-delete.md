# P03 — Select furniture + Delete/Backspace + undo (W3)

## Structure rewrite 2026-07-09

**Hybrid thin:** This is the **execute card** (goal · architecture · file map · tasks · CP). Multi-page pure-API / keyboard / canvas detail and full expert essay → **[P03-appendix.md](./P03-appendix.md)**. Evidence folder name unchanged: `03-select-delete/`. One CP (unit **+** browser) — do not split.

### Expert pass P0 (2026-07-09)

- **Spine #3 hard gate:** unit **then** browser under `03-select-delete/` — unit-green alone = **FAIL**. Journey folder must not substitute.
- **Delete path:** pure `applySelectionDelete` (or equivalent) → **one** `updateProject` for multi-id (live loops N× = N history → undo cannot restore multi-select).
- **Keyboard:** Del/Bksp `preventDefault`; Esc clears **selection** (not only draw/place).
- **Prove with Fabric furniture flag OFF**; document selection only (`pickFurnitureAtPoint` / `workspaceCanvas.selection`) — no Fabric-stage / `firstFurnitureCenter` as W3 proof.
- **Furniture rotation stays degrees** in document (pick converts for hit math) — do not rewrite units mid-W3.
- Authority: [EXPERT-PASS.md](../EXPERT-PASS.md) · [01-react-open3d.md](./01-react-open3d.md) · [02-canvas-2d.md](./02-canvas-2d.md) · [04-playwright-evidence.md](./04-playwright-evidence.md).

> **For agentic workers:** REQUIRED: `/using-superpowers` (TDD, systematic-debugging, verification-before-completion).  
> **Approach A** — FeasibilityCanvas + document model first.  
> **W0 UNLOCKED** — execute product work per phase + evidence. Do not re-ask owner unlock.  
> **Ethics:** Inspiration only from Floorplanner report select/delete grammar. No competitor UI/assets.  
> **Reviews:** [P03-suggestions.md](./P03-suggestions.md)  
> **Governance:** [RESULTS-MAP](./BOARD.md#evidence-map-results-map-folded) · [CHECKPOINTS CP-03](./CHECKPOINTS.md) · [MASTER W3](./MASTER-CHECKLIST.md)

**Goal:** Buyer on `/planner/open3d` (or guest) can **select furniture on 2D**, press **Delete/Backspace** to remove it, **Ctrl/Cmd+Z** to restore same entity id + pose.

**Gate / CP:** **W3** / **CP-03** — unit pack **plus** minimal browser proof. Unit alone = **FAIL**.

**Evidence root (canonical):** `results/planner/world-standard-wave/03-select-delete/`  
Required: `run.json`, vitest raw logs, unit proof, browser screenshots or Playwright/chrome-devtools trace.

**Kill-order role:** Serial spine #3 after CP-00→01→02 ([INDEX week-1](./INDEX.md#week-1-kill-order-after-implementation-unlock)).

---

## Proof layers (do not collapse)

| Layer | What | Gate |
|-------|------|------|
| **Unit / TDD** (Tasks 01–07) | pick + pure delete + keyboard + canvas select + undo | Land code; commit as you go |
| **CP-03 / W3 green** | Unit pack **+** minimal browser select→delete→undo under `03-select-delete/` | **Hard gate** |
| **P07 journey** | Full draw/place pack in `02-browser-open3d-journey/` | Separate; may re-assert W3 |

---

## Goal / product intent (short)

| Intent | Behavior |
|--------|----------|
| Select | Select tool (`V`); pointer on furniture selects; empty clears; furniture wins hit order |
| Delete | Delete or Backspace removes selected furniture (single-id properties path OK) |
| Undo | Ctrl/Cmd+Z restores same `id` + pose via history |
| Esc | Clears draw/place **and** selection |
| CP-03 bar | **Furniture only** — no multi-select, 3D pick, Fabric cutover, openings as first-class targets |

---

## Architecture (short)

```
Select tool pointer → FeasibilityCanvas → pickFurnitureAtPoint
  → setSelection({ type: "furniture", ids })
Delete|Backspace → useWorkspaceKeyboard → applySelectionDelete (pure)
  → one updateProject when project changes → selection none
Ctrl/Cmd+Z → history.undo → furniture restored
```

**Document truth:** active floor `furniture[]`. Selection is transient (not in undo stack).  
**Engines:** Prove on Feasibility default (Fabric flag OFF). No dual selection stores.  
**Full pure API + wire algorithm:** [P03-appendix.md § Pure design](./P03-appendix.md#pure-design-applyselectiondelete).

---

## Tech stack

Next.js `site/` · FeasibilityCanvas · Vitest · Playwright **or** chrome-devtools (minimal W3 browser) · `newEntityId` · no `any` · no worktrees · `.` only.

---

## File map

### Primary (expect edits)

| File | Role |
|------|------|
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` | `pickFurnitureAtPoint` |
| `site/features/planner/open3d/canvas-feasibility/FeasibilityCanvas.tsx` | Select pointer path |
| `site/features/planner/open3d/editor/OOPlannerWorkspace.tsx` | `deleteSelection`, Esc |
| `site/features/planner/open3d/editor/useWorkspaceKeyboard.ts` | Delete/Backspace + `preventDefault` |
| `site/features/planner/open3d/editor/workspaceEntityHelpers.ts` | Pure `applySelectionDelete` |

### Tests

| File | Role |
|------|------|
| `…/geometry/canvasPicking.test.ts` | Add pickFurniture suite |
| `…/open3dWorkspaceKeyboard.test.tsx` | Delete/Backspace/preventDefault |
| `…/deleteSelection.test.ts` | **New** pure delete + undo + multi-id |
| `…/open3dFeasibilityCanvas.test.tsx` | Select-furniture pointer |

### Do not touch (P03)

Fabric cutover · Three orbit (P04) · autosave (P06) · full journey (P07) · chrome audit beyond Esc/Delete (P09).

**Inventory snapshot (gaps):** no pickFurniture unit tests; no Del/Bksp preventDefault coverage; Esc may not clear selection; multi-id delete may multi-history; no browser under `03-select-delete/`. Re-verify at execute — full inventory in [appendix](./P03-appendix.md#honest-inventory-summary).

---

## Tasks (TDD — checkboxes)

Every impl task: failing test first (except packaging after green unit). Skeletons/details → appendix.

### Task 00 — Setup / baseline

- [ ] **00.1** Read 00-START, this file, appendix, design W3, suggestions.
- [ ] **00.2** Confirm Approach **A** + implementation unlock (stop if plan-only).
- [ ] **00.3** Create `results/planner/world-standard-wave/03-select-delete/`; write `HEAD.txt` + `NOTES.md`.
- [ ] **00.4** Baseline vitest (record exitCode):

```powershell
Set-Location site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose
```

- [ ] **00.5** Save `00-baseline-vitest-raw.log` + `00-baseline-run.json` (phase P03, approach A, worktrees false).

### Task 01 — Unit: `pickFurnitureAtPoint`

- [ ] **01.1 RED** hit/miss/padding/top-most/rotation/empty/default 600mm — cases in [appendix](./P03-appendix.md#task-01-pick-cases).
- [ ] **01.2 GREEN** fix only genuine pick bugs.
- [ ] **01.3** Evidence `01-pick-furniture-vitest-raw.log` · commit `test(open3d): cover pickFurnitureAtPoint for W3 select`.

### Task 02 — Pure: `applySelectionDelete` + undo

- [ ] **02.1 RED** remove furniture; no-op same ref; locked; history undo same id/pose; multi-id one past — [appendix API](./P03-appendix.md#pure-design-applyselectiondelete).
- [ ] **02.2 GREEN** pure helper; one project clone when membership changes.
- [ ] **02.3** Evidence `02-delete-undo-vitest-raw.log` · commit pure helper.

### Task 03 — Wire workspace `deleteSelection`

- [ ] **03.1** Single `updateProject` when project changes; clear selection; multi-id one history entry.
- [ ] **03.2** Evidence `03-workspace-delete-vitest-raw.log`.

### Task 04 — Keyboard Delete / Backspace

- [ ] **04.1 RED** Delete + Backspace call `deleteSelection` + **`preventDefault`**; skip mod/editable.
- [ ] **04.2 GREEN** in `useWorkspaceKeyboard`.
- [ ] **04.3** Evidence `04-keyboard-delete-vitest-raw.log`.

### Task 05 — Canvas select furniture

- [ ] **05.1** Coord strategy: `projectToScreen` + Feasibility `INITIAL_TRANSFORM` (origin -4000,-2500; scale 0.1); no fit thrash — [appendix](./P03-appendix.md#task-05-coords).
- [ ] **05.2 RED→GREEN** select tool → furniture selection; empty → none; wall tool does not set furniture selection.
- [ ] **05.3** Evidence `05-canvas-select-vitest-raw.log`.

### Task 06 — Esc clears selection

- [ ] **06.1** Cancel path clears selection (W3 grammar; not full W8).
- [ ] **06.2** Commit Esc fix.

### Task 07 — Unit evidence pack

```powershell
Set-Location site
pnpm exec vitest run `
  tests/unit/features/planner/open3d/geometry/canvasPicking.test.ts `
  tests/unit/features/planner/open3d/deleteSelection.test.ts `
  tests/unit/features/planner/open3d/open3dWorkspaceKeyboard.test.tsx `
  tests/unit/features/planner/open3d/open3dFeasibilityCanvas.test.tsx `
  tests/unit/features/planner/open3d/modelOperations.test.ts `
  --reporter=verbose
pnpm run p0:unit
```

- [ ] **07.1** Save `vitest-w3-raw.log`, `p0-unit-raw.log` + run.json siblings. Zero suppression.
- [ ] **07.2** CP-03 still **open** until Task 08 browser green.

### Task 08 — Minimal browser (CP-03 hard gate)

Narrow scope (not P07 full journey):

1. Open `/planner/guest/?plannerDevTools=1` or `/planner/open3d` (prefer Fabric OFF).  
2. Place or seed one furniture.  
3. Select tool → click furniture → Delete → Ctrl/Cmd+Z.  
4. Screenshots: select / deleted / undone + raw log under `03-select-delete/`.

- [ ] **08.1** Playwright **or** chrome-devtools; deposit `browser-w3-raw.log` + PNGs.
- [ ] **08.2** Browser fail + unit green = **CP-03 FAIL**.

### Task 09 — CP-03 sign-off

- [ ] **09.1** Canonical `run.json` (phase P03, gate W3, unit + browser exitCodes, status PASS|FAIL) — shape in [appendix](./P03-appendix.md#runjson-shape).
- [ ] **09.2** `W3-ACCEPTANCE.md`, `FILES-TOUCHED.md`, final `NOTES.md`.
- [ ] **09.3** Commit evidence pack. Tick MASTER/CHECKPOINTS only when CP-03.6–03.9 green.

---

## Evidence layout

```
results/planner/world-standard-wave/03-select-delete/
  run.json  HEAD.txt  NOTES.md  FILES-TOUCHED.md  W3-ACCEPTANCE.md
  00-baseline-*  01-pick-furniture-*  02-delete-undo-*  03-workspace-delete-*
  04-keyboard-delete-*  05-canvas-select-*
  vitest-w3-raw.log  p0-unit-raw.log  browser-w3-raw.log
  w3-01-select.png  w3-02-deleted.png  w3-03-undone.png
```

---

## Checkpoint CP-03 (hard gate)

| # | Criterion | Proof |
|---|-----------|--------|
| CP-03.1 | pickFurniture covered (hit/miss/top-most/rotation) | `01-*.log` |
| CP-03.2 | Select tool sets furniture selection (unit) | `05-*.log` |
| CP-03.3 | Delete removes selected furniture | `02`/`03` logs |
| CP-03.4 | Delete+Backspace + preventDefault | `04-*.log` |
| CP-03.5 | Undo same id + pose | `02-delete-undo-vitest-raw.log` |
| CP-03.6 | Unit pack under evidence folder exit 0 | vitest logs |
| CP-03.7 | `p0:unit` non-regression | `p0-unit-run.json` |
| CP-03.8 | **Browser** select→delete→undo | `browser-w3-raw.log` + PNGs |
| CP-03.9 | `run.json` PASS + honest NOTES | `run.json` |
| CP-03.10 | Commits on main checkout | NOTES / git log |
| CP-03.11 | No false full journey / multi-select claim | NOTES |

**Stop if red.** Do not mark INDEX/MASTER W3 complete without CP-03.6–03.9.

---

## Implementation notes (anti-thrash)

1. Select tool required (default tool may be `wall`).  
2. Prefer Fabric flag OFF for proof.  
3. Locked items: no-op, same project reference.  
4. Undo restores **same id**, not new UUID.  
5. No competitor chrome.  
6. Commit as you go; push only on ask; no worktrees.  
7. Do not rewrite WAVE.md until evidence exists.

---

## Skills / done

| Skill | When |
|-------|------|
| `/using-superpowers` | Always |
| TDD | Tasks 01–06 |
| verification-before-completion | Task 07–09 |
| chrome-devtools / browser | Task 08 |

- [ ] Tasks 00–09 complete · CP-03 table green · browser present · no competitor UI · P07 not falsely claimed.

**Next:** [P04-orbit-continuity.md](../P04-orbit-continuity/P04-orbit-continuity.md) (fill) or kill-order spine → [P07](../P07-draw-place-journey/P07-draw-place-journey.md).

**Handover one-liner:** W3 = Feasibility select + Del/Bksp (preventDefault) + single-history delete + undo same id/pose; unit then minimal browser under `03-select-delete/`.

---

## Expert note summary (2026-07-09)

Applied from [P03-suggestions](./P03-suggestions.md): browser hard gate; canonical `run.json`; Task 05 coords; history no-op identity; furniture-only product bar. Full essay archived in [appendix](./P03-appendix.md#expert-revision-archive).
