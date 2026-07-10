# HONEST-STATUS — CP-05 re-prove (Seat C)

**Date:** 2026-07-10  
**Role:** Seat C — honest re-prove after A+B land claim  
**Checkout:** `D:\OandO07072026` main only (no worktrees)  

**Timeline:**
- Seat C first pull tip: `c29dadf3` (cabinet literal colors only)
- Concurrent land during/after: `8ea2d558` S7 plan canvas SVG draw · `a485b597` docs pin · `a31f5d35` NO PAPER MOON
- This trustdata tip: `4dc318f1` (+ follow-up if amended)

## Verdict (owner law)

# **FAIL — not CP-05 PASS**

Owner law: solid empty box for cabinet = FAIL. Do not rewrite SUMMARY to pass.

| Gate | Required | Actual | Result |
|------|----------|--------|--------|
| Cabinet readable multiprim (not empty box) | Human-readable doors/stile/handles on plan | Cream/beige **solid empty rectangle** + thin dark outline | **FAIL** |
| S7 plan canvas draws published SVG | Multipath SVG paint after place | Chaise multipath symbol clearly painted on canvas | **TRUE** (`8ea2d558` + e2e) |
| Dual gate | Both true | Cabinet fails | **FAIL overall** |

**No "PASS"** on this checkpoint.

Prior `SUMMARY.md` / `CP-05.json` status `"pass"` is **over-claimed** relative to browser pixels. This file supersedes them for honesty.

---

## What was run (fresh)

```text
git pull origin main  → Already up to date (first pull at c29dadf3)
# later origin advanced with 8ea2d558 S7 hard path

cd site
pnpm exec vitest run \
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts \
  tests/unit/features/planner/open3d/catalog/s7CatalogConsume.test.ts \
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts
# → 25 passed / 3 files · exit 0  (log: seat-c-vitest-raw.log)

pnpm exec playwright test -c config/build/playwright.config.ts \
  tests/e2e/open3d-cp05-symbols-s7.spec.ts --reporter=list
# fabric default OFF (no NEXT_PUBLIC_OPEN3D_FABRIC_FURNITURE=1)
# → 1 passed · ~6.5s · exit 0
```

Tests green ≠ product gate green.

---

## Worktree / land timeline honesty

At **Seat C first pull**, tip was `c29dadf3` (colors only). Local worktree already had uncommitted S7 hard-path files (cache + Feasibility drawImage + e2e). E2E ran against that dirty tree.

**Post-hoc:** Seat B land `8ea2d558` put the same S7 hard path on main. Parent chain of this trustdata commit includes `8ea2d558`. S7 draw is **on origin** — that half of the dual gate is real.

**Still does not flip CP-05:** cabinet empty-box pixel gate remains FAIL.

See `seat-c-worktree-status.txt` (dirty snapshot at re-prove start).

---

## What is TRUE in code

1. **cabinet-v0 Block2D is multi-prim in data**  
   - `modularCabinetBlock` builds outer rect + inner stroke + front/back lines + doorStyle handles/stile.  
   - Dump `05-visual/cabinet-v0-prims.json`: pair=7, slab=5, none=6 prims.  
   - Unit pack asserts prim counts and pair≠slab geometry.

2. **Literal paint colors (c29dadf3)**  
   - Fill `#f3efe6`, stroke `#3f3a32`, detail `#5c564c` — no unresolved `var(--block-*)` black blob path for cabinet prims.  
   - Browser confirms: cabinet is **cream**, not solid black.

3. **Canvas authority still Block2D for modular cabinet**  
   - Feasibility path: `geometryMode === "modular-cabinet-v0"` **skips** published SVG and calls `renderBlock2DCentered`.

4. **S7 hard path on main (`8ea2d558`)**  
   - `svgPlanSymbolCache`: load `/svg-catalog/*.svg`, `drawSvgPlanSymbol` → `drawImage`.  
   - Feasibility: if `previewImageUrl` is published SVG and not modular-cabinet-v0 → draw SVG; else Block2D.  
   - Inventory still stamps published SVG URLs (S7 API + thumb).

5. **Unit packs green** — 25/25 (cabinet-v0 13 + s7 3 + renderBlock2DToCanvas 9).

6. **E2E green** — place cabinet + chaise; `canvasDiversity.notPureSolid=true` (driven mostly by chaise multipath, not cabinet detail).

---

## What is FALSE / still broken

1. **Cabinet is still an empty box on the plan (human pixel gate).**  
   - `01-cabinet-v0-placed.png` / `02-cabinet-v0-canvas.png`: single cream filled square, dark border, **no legible stile, shelves, dual doors, or handles**.  
   - Not black anymore — color fix landed — but **owner empty-box fail still applies**.  
   - Center-region sample of `02-cabinet-v0-canvas.png` (~716×619): cream-dominant filled rect; detail strokes do not read as multiprim furniture at 100% zoom.

2. **Unit multiprim ≠ browser-readable multiprim.**  
   - Prims exist at mm scale; at default plan zoom they collapse visually to a filled tile.  
   - Soft e2e diversity probe samples **whole center canvas after SVG place** — chaise multipath inflates diversity and **does not prove cabinet multiprim**.

3. **Prior SUMMARY/CP-05.json `"pass"`**  
   - False-green relative to owner pixel law. Do not treat as authority. `a31f5d35` (NO PAPER MOON) is the process ban that matches this finding.

4. **E2e `run.json` `"status":"pass"`** is the **test harness self-label**, not Seat C dual-gate verdict.

---

## What screenshots show (honest pixels)

| File | What you actually see |
|------|------------------------|
| `browser/01-cabinet-v0-placed.png` | UI ok; plan shows **cream empty box** near wall corner; properties `cabinet-v0` 600×580 cm; inventory Modular Cabinet thumb also simple box |
| `browser/02-cabinet-v0-canvas.png` | Grid + L-wall + **one cream square with blue selection ring** — no multiprim interior |
| `browser/03-inventory-svg-preview.png` | Chaise inventory thumb is real SVG furniture; cabinet on plan still empty box |
| `browser/04-svg-catalog-item-placed.png` | **Chaise multipath plan symbol** (seat/back/cushions/extension) + cream cabinet box beside it; 2 furniture |
| `browser/05-svg-plan-canvas-draw.png` | Same: **SVG chaise clearly drawn**; cabinet remains empty box |
| `browser/run.json` | `furnitureAfter: 2`, `canvasDiversity.uniqueQuantized: 45`, `status: "pass"` — e2e self-label only |

### Pixel call (Seat C)

- **Cabinet multiprim readable?** **NO.** Empty cream box.  
- **SVG drawn on plan canvas?** **YES** (chaise multipath).  
- **CP-05 dual gate?** **FAIL.**

---

## Evidence this seat wrote/refreshed

- `HONEST-STATUS.md` (this file)  
- `seat-c-vitest-raw.log`  
- `seat-c-worktree-status.txt`  
- Browser PNGs + `browser/run.json` from e2e run `2026-07-10T12:53:38.574Z`

---

## What would be required for a real PASS

1. Browser cabinet at default/reasonable zoom shows **distinct multiprim** (inner lines, stile/handles readable — not a filled tile).  
2. S7 SVG plan draw remains green on clean main (already landed as `8ea2d558`).  
3. Evidence PNGs re-shot; this file upgraded only after re-prove — never flip SUMMARY first.

Until then: **CP-05 = FAIL.**
