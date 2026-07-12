# PHASE-08 — Select, delete, undo

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + unit tests

---

## Outcome

A buyer selects one Fabric object, deletes it, and restores it without identity or pose drift.

## Steps

1. Pointer selection resolves the correct entity ID on `planner-fabric-stage`.
2. Delete removes the selected entity from document and canvas.
3. Undo restores the same ID, position, rotation, and options.
4. Selection state and visible count stay accurate after each step.

## Done when

Boxes in `plan/Planner/CHECKLIST.md` → PHASE-08.

## How to prove

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/applySelectionDelete.test.ts --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/open3d-w3-select-delete.spec.ts -c config/build/playwright.config.ts
```

Report → `agents-work/reports/planner-phase-08.md`. Raw artifacts → `results/planner/phase-08/`.

## Guardrails

- Proof on `planner-fabric-stage` only. No removed hosts (`planner-2d-canvas`).