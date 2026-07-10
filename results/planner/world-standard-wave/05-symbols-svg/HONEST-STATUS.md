# HONEST-STATUS — CP-05 from-scratch re-baseline (Seat C)

**Date:** 2026-07-10  
**Role:** Seat C — kill paper PASS + baseline honesty  
**Checkout:** `D:\OandO07072026` main only (no worktrees)  
**Tip:** `cca98824` (git pull: already up to date with origin/main)

## Verdict (owner law)

# **FAIL — not CP-05 PASS**

Cabinet on the live plan is a **solid empty cream box**. That alone keeps CP-05 open/fail.  
S7 chaise multipath draw is real. Dual gate still fails.

| Gate | Required | Actual | Result |
|------|----------|--------|--------|
| Cabinet readable multiprim (not empty box) | Human-readable doors/stile/handles on plan | Cream/beige **solid empty rectangle** + thin dark outline | **FAIL** |
| S7 plan canvas draws published SVG | Multipath SVG paint after place | Chaise multipath symbol clearly painted on canvas | **TRUE** (`8ea2d558` + PNGs) |
| Dual gate | Both true | Cabinet fails | **FAIL overall** |

**No "PASS"** on this checkpoint.  
`CP-05.json` status is **`fail`**. Prior SUMMARY/JSON `"pass"` is **struck**.

---

## From-scratch baseline — what works

1. **Unit Block2D multiprim data exists**  
   - `modularCabinetBlock` builds outer rect + inner stroke + front/back + doorStyle handles/stile.  
   - `05-visual/cabinet-v0-prims.json`: pair=7, slab=5, none=6.  
   - Pair ≠ slab geometry asserted in unit history.

2. **Not a black blob anymore**  
   - Literal cream fill / dark stroke path; browser shows cream carcass, not unresolved CSS-var black.

3. **S7 hard path is on main** (`8ea2d558`)  
   - Inventory place stamps published `/svg-catalog/*.svg`.  
   - Plan canvas `drawImage` of published SVG for non–modular-cabinet-v0 items.  
   - Pixel proof: `browser/05-svg-plan-canvas-draw.png` — chaise multipath (seat/back/cushions) is unmistakable.

4. **Modular cabinet stays on Block2D**  
   - `geometryMode === "modular-cabinet-v0"` skips published SVG and uses Block2D — intentional; quality still fails visually.

5. **Unit / e2e harness historically green**  
   - Vitest packs and `open3d-cp05-symbols-s7.spec.ts` exit 0 in prior logs.  
   - **Does not equal CP-05 product PASS.**

---

## From-scratch baseline — what does not work

1. **Cabinet empty-box pixel gate (owner law) — FAIL**  
   - `01-cabinet-v0-placed.png`, `02-cabinet-v0-canvas.png`, `live-see-cabinet.png`: one cream filled square, optional blue selection ring, **no legible stile, shelves, dual doors, or handles**.  
   - Inventory Modular Cabinet thumb is also a simple box.

2. **Unit multiprim ≠ browser-readable multiprim**  
   - Prims exist at mm scale; at default plan zoom they collapse to a filled tile.  
   - Soft e2e diversity probe samples **whole center canvas after SVG place** — chaise multipath inflates diversity and **does not prove cabinet multiprim**.

3. **Paper PASS residue (struck this seat)**  
   - Old `CP-05.json` `"status":"pass"` with `cabinetV0Block2DReadable: true`, `notEmptyBox: true`, `browserVisualCp05: true` — **false-green relative to pixels**.  
   - Old `SUMMARY.md` **PASS** banner — **struck**; rewritten FAIL.  
   - E2e `browser/run.json` `"status":"pass"` remains harness self-label only.  
   - `elon-reproof/run.json` unit `"pass"` = unit pack only, not CP-05 dual gate.

4. **Uncommitted product delta (not this seat)**  
   - Working tree had dirty `furnitureBlock2D.ts` + browser PNG churn after A/B attempts.  
   - Seat C does **not** thrash product code. Honesty land only.  
   - Even if A/B later lands better strokes: **no PASS until multiprim browser YES is re-proved.**

---

## What screenshots show (honest pixels)

| File | What you actually see |
|------|------------------------|
| `browser/01-cabinet-v0-placed.png` | UI ok; plan **cream empty box** near wall; props `cabinet-v0` 600×580 cm; inventory thumb simple box |
| `browser/02-cabinet-v0-canvas.png` | Grid + L-wall + **one cream square** — no multiprim interior |
| `browser/live-see-cabinet.png` | Same empty cream box inside room rect; Zoom 100% |
| `browser/03-inventory-svg-preview.png` | Chaise inventory thumb is real SVG furniture |
| `browser/04-svg-catalog-item-placed.png` | **Chaise multipath** + cream cabinet box; 2 furniture |
| `browser/05-svg-plan-canvas-draw.png` | **SVG chaise clearly drawn**; cabinet remains empty box |
| `browser/run.json` | `furnitureAfter: 2`, diversity not pure solid, `status: "pass"` — **e2e self-label only** |

### Pixel call (Seat C)

- **Cabinet multiprim readable?** **NO.** Empty cream box.  
- **SVG drawn on plan canvas?** **YES** (chaise multipath).  
- **CP-05 dual gate?** **FAIL.**

---

## Authority order (this folder)

1. Pixels in `browser/*.png`  
2. This `HONEST-STATUS.md`  
3. `CP-05.json` (`status: fail`)  
4. `SUMMARY.md` (FAIL baseline)  
5. Unit logs / e2e harness JSON (supporting only)

Anything that says CP-05 **PASS** while cabinet is empty box is **wrong**.

---

## What would be required for a real PASS

1. Browser cabinet at default/reasonable zoom shows **distinct multiprim** (inner lines, stile/handles readable — not a filled tile).  
2. S7 SVG plan draw remains green on clean main (already landed as `8ea2d558`).  
3. Evidence PNGs re-shot; status upgraded only after re-prove — never flip SUMMARY/JSON first.

Until then: **CP-05 = FAIL / residual OPEN.**
