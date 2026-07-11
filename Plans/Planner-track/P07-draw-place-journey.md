# P07 — Draw / place browser journey (W1–W2)

**Status:** OPEN / REPROVE — not complete. Old journey packs + `planner-2d-canvas` selectors are **stale** (archive-only).

**Gate:** **W1–W2** / CP-07 — real browser on **Fabric** stage: draw walls + door/opening · place ≥2 catalog items incl. **cabinet-v0**.  
**Evidence:** `results/planner/world-standard-wave/02-browser-open3d-journey/` only  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Unaided buyer on `/planner/open3d` (or guest) draws then places; screenshots + pass JSON.

**Upgrade rule:** Host = `data-testid="open3d-fabric-stage"`. Do **not** target archive `planner-2d-canvas` / Feasibility. Raise wall-draw on Fabric if missing — that is the work, not a host rollback.

**Symbol quality** = [P05](./P05-symbols-svg.md). **Mesh** = [P08](./P08-mesh-quality.md). Do not claim W3 from this pack.

**Out of scope:** W3–W8 polish · Feasibility restore · cloud save · SSR · dumping under `results/tests/`.

---

## Binding gates

| Gate | Must prove |
|------|------------|
| **W1** | Walls metric **increases** after draw (not seed alone) + opening increases **objects** |
| **W2** | Furniture **+≥2** incl. `cabinet-v0` (+ second SKU); 2D non-blank PNG ≠ P05 bar |

**Anti false-green:** before counts; assert **deltas**. Serial describe. No silent skip.

Unit-green alone ≠ CP-07. Seeded walls alone ≠ W1.

---

## Locked paths

| Role | Path |
|------|------|
| Spec | `site/tests/e2e/open3d-world-standard-journey.spec.ts` (**update** selectors to Fabric) |
| Helpers | `guestProjectSetup.ts` · `plannerCanvasHelpers.ts` |
| Catalog | `demoCatalogItems.ts` (`cabinet-v0`) |
| Script | `test:e2e:world-standard-w1w2` + `PLAYWRIGHT_BASE_URL` |
| Canvas | `[data-testid="open3d-fabric-stage"]` |

**Honesty gap:** live Fabric stage may lack full wall-draw yet (pan/place/furniture Rects exist). Journey red until draw works **on Fabric** — not until Feasibility returns.

---

## Kill order (unchecked)

- [ ] Point helpers/spec at `open3d-fabric-stage` (drop archive testid)
- [ ] Evidence dir; Playwright; dev server reaches open3d/guest
- [ ] Raise wall/opening draw on Fabric if Δ walls impossible today
- [ ] W1 red→green: walls Δ + objects Δ; PNGs
- [ ] W2 red→green: furniture ≥2 incl. cabinet-v0; PNGs
- [ ] Pass JSON + raw log; screenshots on disk
- [ ] No Feasibility mount · no archive selector PASS theater

**Next:** [P06](./P06-save-honesty.md) per BOARD.
