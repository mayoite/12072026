# P07 — Draw / place browser journey (W1–W2)

**Status:** OPEN / REPROVE — not complete. Old `02-browser-open3d-journey/` packs are clues only.

**Gate:** **W1–W2** / CP-07 — real browser: draw walls + door/opening · place ≥2 catalog items incl. **cabinet-v0**.  
**Evidence:** `results/planner/world-standard-wave/02-browser-open3d-journey/` only  
(optional alias `07-browser-journey/` with NOTES pointer — not a third root).  
**CP:** [CHECKPOINTS](./CHECKPOINTS.md) · [BOARD](./BOARD.md) · Approach **A**

**Goal:** Unaided buyer on `/planner/open3d` (or guest) draws then places with screenshots + `playwright-run.json` pass.

**Symbol quality** = [P05](./P05-symbols-svg.md). **Mesh** = [P08](./P08-mesh-quality.md). Do not claim W3 from this pack.

**Out of scope:** W3–W8 polish · Fabric cutover · cloud save · SSR · dumping under `results/tests/`.

---

## Binding gates

| Gate | Must prove |
|------|------------|
| **W1** | Walls metric **increases** after draw (not seed alone) + opening increases **objects** |
| **W2** | Furniture **+≥2** incl. `cabinet-v0` (+ second SKU e.g. `sample-desk-1`); 2D non-blank PNG ≠ P05 bar |

**Anti false-green:** capture before counts; assert **deltas**. Serial `test.describe.configure({ mode: "serial" })` — config is `fullyParallel`. No silent skip / filtered logs.

Unit-green alone ≠ CP-07. Seeded walls alone ≠ W1.

---

## Locked paths

| Role | Path |
|------|------|
| Spec | `site/tests/e2e/open3d-world-standard-journey.spec.ts` |
| Helpers | `guestProjectSetup.ts` · `plannerCanvasHelpers.ts` (+ `getFurnitureCount`) |
| Gold patterns | `admin-svg-publish-p01.spec.ts` · `planner-guest-workspace.spec.ts` |
| Catalog | `demoCatalogItems.ts` (`cabinet-v0`) |
| Config | `site/config/build/playwright.config.ts` |
| Script | `test:e2e:world-standard-w1w2` + `PLAYWRIGHT_BASE_URL` |

**Selectors (O&O only):** Wall/Opening tools · catalog search · Add to canvas · `[data-testid="planner-2d-canvas"]` · `.pw-status-bar`.

---

## Kill order (unchecked)

- [ ] Evidence dir; Playwright browsers; dev server reaches open3d/guest
- [ ] Spec scaffold serial; seed honesty (deltas)
- [ ] W1 red→green: walls Δ + objects Δ; PNGs
- [ ] W2 red→green: furniture ≥2 incl. cabinet-v0; PNGs
- [ ] `playwright-run.json` pass, failed=0; raw log retained
- [ ] Screenshots 01–N on disk under canonical folder
- [ ] Alias or NOTES for `07-browser-journey/` if used
- [ ] Honesty: do not mark W3–W8 or “planner works” from P07 alone

**Full story** still needs CP-03 + CP-05 not red unless owner WAIVE.  
**Next:** kill-order → [P06](./P06-save-honesty.md); fill streams per BOARD.
