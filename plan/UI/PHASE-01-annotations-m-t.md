# PHASE-01 — Dimension (M) + Text (T) tools go live

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + unit tests + E2E

---

## In plain words
Two tools on the planner rail — the tape-measure (M / "dimension") and text label (T) — look
real but do nothing; they're marked "deferred." This phase makes them actually work: measure a
distance and drop a labelled dimension line, or click and type a text note — all painted on the
existing Fabric canvas, using small MIT drawing libraries (roughjs + Excalidraw's math package),
**not** a second canvas.

## Why this matters
These are two of the "lying buttons" — a rail tool that does nothing erodes trust (see Planner
PHASE-02). Measurements and labels are also genuinely needed to produce a readable plan.
**Planner PHASE-04 inherits the live M tool from this phase** — do not promote dimension twice.

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
| Create | `site/tests/e2e/open3d-annotations-m-t.spec.ts` |
| Modify | `docs/Lockedfiles/03-dependencies-engines-current.md` |
| Create | `site/public/licenses/excalidraw-MIT.txt` |

## What exists today (grounded in code)
- `editor/canvasTool.ts` — `dimension` and `text` are currently `deferred` and alias to select.
- `canvas/PlannerFabricStage.tsx` — the sole host; safe to add a rebuild pass for annotations.
- Libraries (MIT): `roughjs@4.6.4`, `@excalidraw/math@0.18.1`, `@excalidraw/common@0.18.1`.

## Steps
1. **Task 0 (license gate):** `pnpm view roughjs license` + `pnpm view @excalidraw/math license` → MIT.
   Write `results/planner/11-annotations-excalidraw/SCOPE.md` (Tier A only; Fabric sole host; roughness low).
2. **Task 1:** Install Tier A deps; MIT rows in Lockedfiles; `excalidraw-MIT.txt`; `pnpm run build` exit 0;
   record client chunk delta in report (baseline vs post-install).
3. **Task 2–3:** Failing units first — `annotationGeometry.ts` + `roughAnnotationAdapter.ts`.
4. **Task 4:** `annotationFabricObjects.ts` — remove stale `data-planner-kind="annotation"` groups; paint when
   `layerVisibility.annotations`; single `PlannerFabricStage` rebuild with walls/furniture.
5. **Task 5:** Promote `dimension`/`text` to `live` in `canvasTool.ts`; wire M/T via stage handlers →
   `pureActions`; update `useRoomElements.ts` shortcut wiring if needed.
6. **E2E:** `open3d-annotations-m-t.spec.ts` — M measures, T labels, both visible.
7. **Reload-ID:** Hard reload; annotation IDs unchanged (P06 parity).

## Done when
Boxes in `plan/UI/CHECKLIST.md` → PHASE-01.

## How to prove
On `/planner/guest`, measure a wall with M and add a note with T; hard reload and confirm both
persist with stable IDs. Run:

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/canvas/annotationGeometry.test.ts tests/unit/features/planner/canvas/roughAnnotationAdapter.test.ts tests/unit/features/planner/editor/toolShortcutTruth.test.ts tests/unit/features/planner/editor/canvasToolRail.a11y.test.ts tests/unit/features/planner/hostWiringP01.test.ts --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/open3d-annotations-m-t.spec.ts -c config/build/playwright.config.ts
```

Live run is the proof. Raw artifacts → `results/ui/phase-01/`. Report → `agents-work/reports/ui-phase-01.md`.

## Guardrails
- Fabric stays the only host — no second canvas, no Excalidraw UI chrome (math/render only).
- A tool marked `live` must actually paint — no faked geometry.
- **Stop-if-fail:** `Failures.md` on build break, second plan host, or live M/T without Fabric paint.

## Out of scope
- Tier B `@excalidraw/element` export bridge (deferred to P16 share/export).
- Tier C full `@excalidraw/excalidraw` UI on plan route — owner-gated never.