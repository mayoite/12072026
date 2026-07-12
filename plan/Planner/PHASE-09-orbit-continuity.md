# PHASE-09 — 2D↔3D orbit continuity

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + unit tests

---

## Outcome

The same saved objects survive 2D, 3D, orbit, and return to 2D.

## Steps

1. Three viewer reads the live project.
2. Orbit controls work without mutating the project.
3. IDs, positions, rotations, and counts remain unchanged across 2D→3D→2D.
4. Loading and error states do not hide the return path.

## Done when

Boxes in `plan/Planner/CHECKLIST.md` → PHASE-09.

## How to prove

```bash
pnpm --filter oando-site exec playwright test tests/e2e/open3d-w4-orbit-continuity.spec.ts -c config/build/playwright.config.ts
```

Report → `agents-work/reports/planner-phase-09.md`. Raw artifacts → `results/planner/phase-09/`.

## Guardrails

- Lazy3D / orbit path only. No R3F rewrite.