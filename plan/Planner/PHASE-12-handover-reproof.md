# PHASE-12 — Handover re-proof

**Parallel:** integration · **Blocks on:** Planner P01–P11 · UI P01–P02 · **Proof:** gate commands + browser journeys

---

## Outcome

Foundation is reproducible on the current checkout. Pack does not claim product ship.

## Steps

1. `pnpm run check:layout` exit 0 — no forbidden `site/results/`.
2. `pnpm --filter oando-site run typecheck` exit 0.
3. Targeted Planner units green on HEAD.
4. Required Fabric browser journeys green, including batch placement.
5. Foundation residuals closed or owner-waived in report:
   - Planner P01 catalog SVG render + Admin P01 publish multipath
   - Planner P10 mesh quality
   - Planner P11 theme mount + toolbar shortcuts reproof
   - All other Planner P01–P11 open items
6. Owner product-truth accept recorded or named open in `agents-work/reports/owner-product-truth-accept.md`.
7. Failures and missing proof named in report. HEAD recorded.

## Done when

Boxes in `plan/Planner/CHECKLIST.md` → PHASE-12.

## How to prove

```bash
pnpm run check:layout
pnpm --filter oando-site run typecheck
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts --reporter=verbose
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts tests/e2e/open3d-systems-v0-batch-place.spec.ts -c config/build/playwright.config.ts
```

Report → `agents-work/reports/planner-phase-12.md`. Raw artifacts → `results/planner/phase-12/`.

## Guardrails

- Pack ≠ product ship.
- Do not delete `site/results/` without owner approval. Fix or document waiver.