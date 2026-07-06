# Site-Planner Integration — Goal

**Targets (measurable):**

- Clean separation: marketing CTAs thin; deep logic in features only (per MODULE-LAYOUT).
- 2D↔3D continuity + catalogue-first default on planner entry (GS §7 reference models: Planner 5D, Floorplanner).
- Portal svg-catalog uses ≤1 Puck Render per route; public read seam.
- E2E coverage for marketing-to-planner flows (test:e2e:nav + planner-catalog).
- Tech docs: site-workflows integration trio referenced from generator Workflows page.
- Industry: scoped commits, evidence artifacts always preserved (testing-handbook).
- GS: produce benchmark report against 5-product + UI/UX standards before "production ready" label.

**Verifiable metrics:**
- No new drift in locked current/proposed after integration edit.
- `pnpm run release:gate` green (includes site-ui + planner-catalog).
- Screenshots + run.json in results/site/site-planner-integration/.

Refer to `docs/Lockedfiles/site/proposed.md` and planner proposed for targets.
