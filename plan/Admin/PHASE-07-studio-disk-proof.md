# PHASE-07 — Studio scene publish authority (disk proof)

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + on-disk bytes + unit test

---

## In plain words
The admin SVG studio already maps what you draw on the canvas into the publish pipeline in
code — but **unit green ≠ product green**. This phase closes the buyer-visible loop: draw a
rectangle on the stage, see it in live compile, hit Publish, and confirm the rectangle's
coordinates land in `public/svg-catalog/{slug}.svg` on disk. Until that browser+disk proof
passes, richer studio tools stay on the kill list.

## Why this matters
Without disk proof, we cannot trust that scene geometry is the sole publish authority. Form
metadata could silently win, or compile could diverge from the stage. Planner PHASE-01 depends
on honest catalog bytes — this is the admin seam that must be proven first.

## Product rule (owner lock)
- **Scene document** owns geometry. **Form** owns metadata only.
- Form `blocks` rows must **not** override a committed scene.
- Catalog SVG is **inventory only** — never Fabric plan-draw.

## What exists today (grounded in code)
| Piece | Path |
|-------|------|
| Scene → blocks bridge | `svgEditorFormAdapters.ts` (`formStateToDescriptorInput`, `scenePartsToBlocks`) |
| Open seeds scene | `sceneFromDescriptor.ts` |
| Canvas commits → form | `AdminSvgEditorEditView.tsx` (`onDocumentChange`) |
| Publish action | `publishSvgEditorAction.ts` |
| Unit: parse → compile | `tests/unit/admin/svg-editor/scenePublishAuthority.test.ts` |
| E2E disk proof (OPEN) | `tests/e2e/admin-svg-scene-publish-a401.spec.ts` (side-table-001 fixture) |

**Code landed · product OPEN** — unit green; browser+disk proof still required.

## Kill list until this phase is green
Do **not** score these as done (defer to PHASE-03+ or later):
minimap · pen/path node editing · multi-select/group · templates · command palette · GLB
polish as product work · a11y matrix theater · extra form fields beyond metadata.

## Steps
1. **Unit baseline:** `scenePublishAuthority.test.ts` green — includes parse → compile path, not
   raw-only.
2. **Browser — draw:** open `/admin/svg-editor/side-table-001` → stage visible (≥55vh) → click
   **Rect** → rectangle appears on stage.
3. **Browser — live compile:** rail shows compiled output reflecting the drawn rect (not stale
   form-only geometry).
4. **Browser — publish:** click **Publish** → status shows published → POST succeeds.
5. **Disk:** `public/svg-catalog/side-table-001.svg` contains rect signature coords
   (`225 225 L 225 375 L 375 375 L 375 225` per fixture) and byte size increases.
6. **Evidence pack:** screenshots + run log + published snippet under
   `results/admin/no-code-svg-studio/a4-0-1-scene-publish-proof/` on **this** checkout.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-07.

## How to prove
```bash
pnpm --filter oando-site exec vitest run tests/unit/admin/svg-editor/scenePublishAuthority.test.ts --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/admin-svg-scene-publish-a401.spec.ts -c config/build/playwright.config.ts
```

Live run is the proof. Raw artifacts → `results/admin/no-code-svg-studio/` (dump).
Report → `agents-work/reports/admin-phase-07.md`.

## Guardrails
- Vitest alone never closes this phase — browser+disk required.
- Evidence path must be this repo tree, not a foreign checkout.
- Restore fixture bytes after e2e (spec already does in `finally`).

## Out of scope
Canvas-first shell re-proof (1280×720 screenshots) — note in report if stage scroll is broken,
but shell polish is PHASE-03 prerequisite, not this card's PASS bar.
Node inspector, dirty/exit guard, reset-to-published → PHASE-03.