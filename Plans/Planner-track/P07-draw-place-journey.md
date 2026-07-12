# P07 — Draw / place browser journey (W1–W2)

**Status:** **PASS** (agent 2026-07-12 — `open3d-world-standard-journey.spec.ts` green on HEAD `4ddfa36a`).

**Gate:** **W1–W2** / CP-07 — real browser on **Fabric** stage: draw walls + door/opening · place ≥2 catalog items incl. **cabinet-v0**.  
**Proof command:** `pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts`  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Unaided buyer on `/planner/guest` or `/planner/canvas` draws then places; anti false-green deltas on walls, openings, furniture.

**Upgrade rule:** Host = `data-testid="planner-fabric-stage"` only. No archive `planner-2d-canvas`. No second plan host.

**Split:** Symbol quality = [P05](./P05-symbols-svg.md). Mesh = [P08](./P08-mesh-quality.md). Do not claim W3/W4 here.

---

## Kill order

- [x] Spec + helpers target `planner-fabric-stage`
- [x] W1: walls Δ + opening objects Δ
- [x] W2: furniture ≥2 incl. cabinet-v0 + second SKU
- [x] Journey e2e PASS on this checkout
- [x] No archive host theater

**Next (sequence):** [P10](./P10-evidence-handover.md) (numerical); [P08](./P08-mesh-quality.md) already PASS.