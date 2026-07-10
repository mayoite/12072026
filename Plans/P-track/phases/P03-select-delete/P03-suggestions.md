# P03 — Select/delete plan review (suggestions)

**Date:** 2026-07-09  
**Plan:** `Plans/trustdata/phases/P03-select-delete/P03-select-delete.md`  
**Reviewer role:** planning expert (trust-data / open3d W3)  
**Scope:** Plan + live path verification only. **No product code.**  
**Skills:** `/using-superpowers` (required); `Agents/Agents-Plan.md`; live path verification (no worktrees).  
**Constraints:** W3 select/delete/undo; TDD first; Approach A; inspiration not copy; plan-only until owner unlock.

---

## Live path verification (2026-07-09)

| Claim in plan | Live result |
|---------------|-------------|
| `site/features/planner/open3d/lib/geometry/canvasPicking.ts` → `pickFurnitureAtPoint` | **OK** — rotated local AABB; padding; top-most last-in-array (reverse scan); default width/depth **600** |
| `FeasibilityCanvas.tsx` select tool: furniture → wall → room | **OK** ~L735–761; padding `Math.max(20, 40/scale)` |
| Selection ring via `selectedFurnitureIds` | **OK** ~L202–207, paint ~L590 |
| `useWorkspaceCanvas.ts` `CanvasSelection` + `updateProject` → `executePlannerCommand` | **OK** — selection transient; not in history |
| `workspaceEntityHelpers.ts` `deleteEntityFromProject` (locked skip) | **OK** |
| `OOPlannerWorkspace.tsx` `deleteSelection` | **OK but multi-history** — loops `updateProject` per id (~L289–308) |
| `useWorkspaceKeyboard.ts` Delete/Backspace | **OK call; gap** — invokes `deleteSelection` without `preventDefault` (~L118–120) |
| Keyboard wired with `deleteSelection` | **OK** ~L501–507 |
| Esc `cancel` clears selection | **GAP** — cancel only `setPendingCatalogItemId(null)` + `canvasRef.cancel()` (~L508–511); **no** `setSelection(none)` |
| Default tool | **OK** — `useState<PlannerTool>("wall")` ~L150 |
| Fabric flag default | **OK** — `=== "1"` only; default OFF → Feasibility owns select |
| `canvasPicking.test.ts` furniture | **MISSING** — walls/polygons only |
| `open3dWorkspaceKeyboard.test.tsx` Delete/Backspace | **MISSING** — palette/undo/editable/disabled only |
| `deleteSelection.test.ts` / pure `applySelectionDelete` | **MISSING** |
| Feasibility select furniture unit case | **MISSING** (file exists; wall/dim/room cases only) |
| History API names `createOpen3dHistory` / `updateOpen3dProject` / `undoOpen3dAction` | **OK** in `store/history.ts` |
| `projectToScreen` / `screenToProject` | **OK** — `lib/geometry/snapping.ts` (use for Task 05 coords) |
| `INITIAL_TRANSFORM` Feasibility | **OK** — origin `(-4000,-2500)`, scale `0.1` |
| Evidence `03-select-delete/` | **Missing** (expected pre-exec) |
| Design W3 | **Unit + Playwright** (`docs/superpowers/specs/2026-07-09-world-standard-planner-design.md`) |
| CHECKPOINTS CP-03 | Requires unit **and** Playwright **or** chrome-devtools proof |
| MASTER W3.4 | Unit tests + **browser proof** in `03-select-delete/` |
| RESULTS-MAP `03-select-delete/` | `run.json`; vitest raw; unit; browser **when claimed** |
| Inspiration | Plan cites `D:\websites\floorplanner.com\report\INSPIRATION.md` — patterns only |

**Hooks path note:** Confirmed — no `open3d/editor/hooks/`; keyboard at `editor/useWorkspaceKeyboard.ts`.

---

## P0 — Must fix in plan (blockers / wrong truth)

### P0-1 — CP-03 must not waive browser proof against governance
- **Problem:** Plan goal + Task 08 + CP-03.9 treat Playwright as **non-blocker** for CP-03. Live governance disagrees:
  - Design W3 proof = **Unit + Playwright**
  - CHECKPOINTS CP-03 criterion (5) = Playwright **or** chrome-devtools select→delete→undo
  - MASTER W3.4 = unit + **browser proof** in `03-select-delete/`
  - Stop rule: unit-only without browser select = **W3 FAIL**
- **Fix:** Split proof layers without lying:
  1. **TDD / unit pack (Tasks 01–07)** — primary implementation path; can land commits.
  2. **CP-03 / W3 green** — requires **minimal** browser proof under `03-select-delete/` (Playwright **or** chrome-devtools scripted): Select tool → click furniture → Delete → Ctrl/Cmd+Z restore. Screenshots or trace required.
  3. **P07** keeps full draw/place **journey pack** (`02-browser-open3d-journey/`); P03 browser is **narrow W3**, not the full W1–W2 journey.
- Do **not** mark INDEX/MASTER W3 complete on unit alone.

### P0-2 — Canonical `run.json` + evidence naming
- **Problem:** RESULTS-MAP lists `run.json` for `03-select-delete/`. Plan only names `vitest-w3-run.json`, `00-baseline-run.json`, etc. Agents will miss the map contract.
- **Fix:** Require top-level `run.json` (phase, approach, HEAD, exit codes summary, unit vs browser status). Keep task logs as secondary. Add `HEAD.txt`. Prefer `browser-w3-raw.log` + screenshots when browser runs.

### P0-3 — Task 05 select-pointer strategy underspecified (anti thrash)
- **Problem:** “fire pointer at center after fit/default transform” invites flaky coords; fit changes transform (`fitToView` uses different origin/scale than `INITIAL_TRANSFORM`).
- **Fix:** Lock unit strategy:
  1. Prefer pure: `pickFurnitureAtPoint` suite (Task 01) is the hit math gate.
  2. Canvas integration: seed furniture at known **project mm**; compute screen via `projectToScreen(point, INITIAL_TRANSFORM)` from `snapping.ts` with Feasibility **default** transform (do **not** call fit unless test captures `onStatusChange.transform`); `clientX/Y` = rect.left + screen.x (rect 0,0 in existing mocks → screen coords).
  3. If pointer integration stays brittle, acceptable alternate: thin test of select branch algorithm (pick id → `setSelection`) without full paint — but prefer one real `FeasibilityCanvas` + `workspaceCanvas` pointer case.

### P0-4 — History no-op identity for pure delete
- **Problem:** Plan says “if `next.project !== project` then update once” but Task 02 does not force **same reference** when all locked/missing — `updateOpen3dProject` pushes past only when reference changes; a clone-no-op would pollute undo.
- **Fix:** Spec: `applySelectionDelete` must return **identical** `project` reference when membership unchanged; only clone when ≥1 entity removed.

### P0-5 — Openings “where in scope” vs furniture-only product bar
- **Problem:** CHECKPOINTS CP-03 says “Furniture (and openings where in scope)”. Plan is furniture-first (correct for Approach A pain) but never states openings are **out of P03 product bar**.
- **Fix:** Explicit: P03 CP-03 product bar = **furniture** select/delete/undo. Wall/room select already exist as side paths. Door/window as first-class select targets = stretch / not CP-03 blocker. Multi-id pure helper may still map types for shared delete path tests.

---

## P1 — Should fix (accuracy / anti-thrash)

### P1-1 — Exact preventDefault gap citation
- Live: lines ~118–120 call `deleteSelection` with **no** `preventDefault`. Other shortcuts already prevent. Task 04 must assert `defaultPrevented` for both Delete and Backspace.

### P1-2 — Esc clear selection is in-scope grammar (keep Task 06)
- Confirm cancel must call `workspaceCanvas.setSelection({ type: "none", ids: [] })` **plus** existing cancel. Editable fields still early-return. Do not expand to full W8 chrome audit.

### P1-3 — Single-history delete is required even for single-id
- Today one id = one history step (OK). Two ids = two steps (bug). Pure helper + one `updateProject` is the fix; Task 03 multi-id case is mandatory for the helper even if UI is single-select P0.

### P1-4 — Dual selection types honesty
- Document: runtime selection is `CanvasSelection` from `useWorkspaceCanvas`. `store/selection.ts` `PlannerSelection` / `createPlannerSelection` is optional align only — **do not** force a dual-store migration in P03.

### P1-5 — Fabric flag-on pointer ownership
- When `NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1`, `FurnitureFabricLayer` is `interactive={activeTool === "select"}`. W3 unit proof on **flag OFF**. Browser proof: document flag env in NOTES; prefer default OFF. No dual selection stores.

### P1-6 — Properties panel delete path
- `handleDeleteEntity` remains single-id `deleteEntityFromProject` + clear selection — OK for panel. Keyboard path uses `applySelectionDelete`. Do not require panel to batch multi-id in P03.

### P1-7 — Task 00 meta parity
- Add `HEAD.txt` (`git rev-parse HEAD` + `git status -sb`), structured `00-baseline-run.json` fields: phase `P03`, approach `A`, evidenceRoot, worktrees `false`, startedAt ISO.

### P1-8 — Cross-links
- Link `RESULTS-MAP.md`, `CHECKPOINTS.md` CP-03, `MASTER-CHECKLIST.md` W3, design gate W3, suggestions file, inspiration ethics one-liner at top.

### P1-9 — Optional post-place switch to select
- Keep **out** of CP-03 unless free; default tool stays `wall`. Select via `V` / rail is the documented path.

---

## P2 — Nice to have

### P2-1 — Evidence artifact table (filename → task) including browser assets  
### P2-2 — Note WAVE.md stale after CP-03; do not rewrite WAVE until evidence exists  
### P2-3 — ContentEditable already covered by `isEditableTarget` — one Backspace-in-input case enough  
### P2-4 — Playwright later steps remain as **narrow W3** seed for P07 re-assert, not only “later note”  
### P2-5 — Skills checklist: add verification-before-completion for browser pack  

---

## Suggested apply order (for plan revision)

1. P0-1 browser required for CP-03 / W3  
2. P0-2 `run.json` + HEAD.txt  
3. P0-3 Task 05 coordinate strategy  
4. P0-4 history identity  
5. P0-5 openings out of product bar  
6. P1-1…P1-8 accuracy + links  
7. Expert revision note + top 5  

---

## Out of scope (do not do in P03 plan or execution)

- Product code in this review pass  
- Fabric full-stage cutover  
- 3D pick/delete (P04)  
- Full W1–W2 draw/place journey pack (P07)  
- Multi-select marquee, groups, move/rotate handles  
- Competitor UI / Floorplanner chrome  
- Worktrees; push without owner ask  
