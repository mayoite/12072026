# Excalidraw Tier A — Fabric Annotations (Execution Plan)

> **Skill:** writing-plans · **Scope:** Tier A only (`roughjs` + `@excalidraw/math` + transitive `@excalidraw/common`) · **No commit without owner.**

**Goal:** Paint `PlannerAnnotation` / `PlannerTextAnnotation` on the sole Fabric host and promote M/T tools from deferred → live using Excalidraw MIT leaf packages — no second canvas, no Excalidraw UI chrome.

**Architecture:** `PlannerFabricStage` remains the only interactive plan host (`data-testid="planner-fabric-stage"`). Pure geometry in `annotationGeometry.ts` (`@excalidraw/math`); hand-drawn strokes via `roughAnnotationAdapter.ts` (`roughjs`); Fabric groups in `annotationFabricObjects.ts`. Pointer flow: `canvasTool.ts` → stage handlers → `pureActions` (same as walls).

**Stack:** Fabric `7.4.0` (locked) · `roughjs@4.6.4` · `@excalidraw/math@0.18.1` · `@excalidraw/common@0.18.1` · `PlannerAnnotation` types in `project/model/types.ts`.

**P11 sequencing:** Runs **in parallel** with [P11](../../Plans/Planner-track/P11-project-brief-room.md) — room brief does not block this slice and annotation work does not block P11 acceptance. `@excalidraw/element` export bridge deferred to P16. **P07 PASS** (current): safe to edit `PlannerFabricStage` for rebuild + M/T handlers.

**Evidence:** `results/planner/world-standard-wave/11-annotations-excalidraw/` (`SCOPE.md`, `VERDICT.md`, `HEAD.txt`, PNGs)

## File map

| Action | Path |
|--------|------|
| Create | `site/features/planner/canvas/annotationGeometry.ts` |
| Create | `site/features/planner/canvas/roughAnnotationAdapter.ts` |
| Create | `site/features/planner/canvas/annotationFabricObjects.ts` |
| Modify | `site/features/planner/canvas/PlannerFabricStage.tsx` |
| Modify | `site/features/planner/editor/canvasTool.ts` |
| Modify | `site/features/planner/editor/useRoomElements.ts` (M/T shortcut wiring if needed) |
| Create | `site/tests/unit/features/planner/canvas/annotationGeometry.test.ts` |
| Create | `site/tests/unit/features/planner/canvas/roughAnnotationAdapter.test.ts` |
| Modify | `docs/Lockedfiles/03-dependencies-engines-current.md` |
| Create | `site/public/licenses/excalidraw-MIT.txt` |

## Tasks 0–5

### Task 0: License + scope gate (docs only)
- [ ] `pnpm view roughjs license` + `pnpm view @excalidraw/math license` — expect `MIT` each.
- [ ] Write `11-annotations-excalidraw/SCOPE.md`: **Tier A only**; Fabric sole host; libs are render/math only; roughness **low**.
- [ ] Cite [P02](../../Plans/Planner-track/P02-engine-lock.md) / [CONSTRAINTS](../../Plans/Planner-track/CONSTRAINTS.md) in SCOPE. **Commit:** none

### Task 1: Install Tier A + license record
- [ ] `pnpm --filter oando-site add roughjs@4.6.4 @excalidraw/math@0.18.1 @excalidraw/common@0.18.1` (repo root).
- [ ] MIT rows in `03-dependencies-engines-current.md`; create `site/public/licenses/excalidraw-MIT.txt`.
- [ ] `pnpm --filter oando-site run build` exit 0; chunk delta in `VERDICT.md`. **Commit:** owner only

### Task 2: Failing unit — annotation geometry
- [ ] `annotationGeometry.ts` + test: (1) offset dimension parallel to wall segment (mm); (2) point-on-segment; (3) text anchor + rotation. `@excalidraw/math` only — no Fabric.
- [ ] `pnpm --filter oando-site exec vitest run tests/unit/features/planner/canvas/annotationGeometry.test.ts --reporter=verbose` — FAIL then PASS. **Commit:** owner only

### Task 3: Failing unit — roughjs → Fabric adapter
- [ ] `roughAnnotationAdapter.ts` + test: `PlannerAnnotation` → path data; theme stroke; deterministic seed from `annotation.id`.
- [ ] `vitest run tests/unit/features/planner/canvas/roughAnnotationAdapter.test.ts` PASS; `roughjs` client-boundary only. **Commit:** owner only

### Task 4: Wire Fabric rebuild — annotations layer
- [ ] `annotationFabricObjects.ts`: remove stale `data-planner-kind="annotation"` groups; paint when `layerVisibility.annotations`.
- [ ] Single `PlannerFabricStage` rebuild pass with walls/furniture — not a second canvas.
- [ ] Manual: `http://localhost:3000/planner/guest/?plannerDevTools=1` — seeded annotations visible. **Commit:** owner only

### Task 5: Promote M/T tools deferred → live
- [ ] `canvasTool.ts`: `dimension: "live"`, `text: "live"`; drop deferred guidance.
- [ ] M: two-click dimension → rough preview → `addAnnotation`. T: click → Textbox → `addTextAnnotation`.
- [ ] P09 23/23: `vitest run tests/unit/features/planner/editor/toolShortcutTruth.test.ts tests/unit/features/planner/editor/canvasToolRail.a11y.test.ts`
- [ ] `hostWiringP01.test.ts` 4/4 sole Fabric host. **Commit:** owner only

## PASS bar (Tasks 0–5)

| Layer | Command | Bar |
|-------|---------|-----|
| Geometry | `annotationGeometry.test.ts` | all pass |
| Adapter | `roughAnnotationAdapter.test.ts` | deterministic paths per id |
| Engine lock | `hostWiringP01.test.ts` | 4/4 |
| P09 honesty | `toolShortcutTruth` + `canvasToolRail.a11y` | 23/23 |
| Build | `pnpm --filter oando-site run build` | exit 0 |

**Stop-if-fail:** `Failures.md` on build break, second plan host, or live M/T without Fabric paint.

**Handoff:** E2E `open3d-annotations-m-t.spec.ts` + P06 reload-id proof follows after Tasks 0–5 green.