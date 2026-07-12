# PHASE-10 — 3D mesh quality

**Parallel:** yes · **Blocks on:** — · **Proof:** live browser + WebGL screenshots

---

## Outcome

Cabinet-v0 reads as toe, carcass, and door in the live Three viewer.

## Steps

1. Part names, order, size, and count match the saved option set.
2. Mesh height and 2D footprint stay dimensionally true.
3. Materials and lighting separate parts without wireframe labels.
4. 2D↔3D switching preserves identity and pose.
5. Capture WebGL screenshots at desktop and 375×812.

## Done when

Boxes in `plan/Planner/CHECKLIST.md` → PHASE-10.

## How to prove

```bash
pnpm --filter oando-site exec vitest run tests/unit/features/planner/modularCabinetV0.test.ts --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/open3d-mesh-symbol-live-verify.spec.ts tests/e2e/open3d-systems-v0-mesh-batch-shots.spec.ts -c config/build/playwright.config.ts
```

Report → `agents-work/reports/planner-phase-10.md`. Raw artifacts → `results/planner/phase-10/`.

## Guardrails

- No photoreal claim. No static designer GLB substitute.