# HONEST-STATUS — CP-05 re-prove (Seat C)

**Date:** 2026-07-10  
**Role:** Seat C — honest re-prove after A+B land claim  
**Checkout:** `D:\OandO07072026` main only (no worktrees)  
**`git pull origin main`:** Already up to date  
**HEAD (origin/main tip):** `c29dadf3b36fa82183cc61c04ad368fbe0127e48`  
`fix(open3d): cabinet-v0 plan symbol readable colors (W2)`  

## Verdict (owner law)

# **FAIL — not CP-05 PASS**

Owner law: solid empty box for cabinet = FAIL. Do not rewrite SUMMARY to pass.

| Gate | Required | Actual | Result |
|------|----------|--------|--------|
| Cabinet readable multiprim (not empty box) | Human-readable doors/stile/handles on plan | Cream/beige **solid empty rectangle** + thin dark outline | **FAIL** |
| S7 plan canvas draws published SVG | Multipath SVG paint after place | Chaise multipath symbol clearly painted on canvas | **TRUE (on dirty worktree)** |
| Dual gate | Both true | Cabinet fails | **FAIL overall** |

**No "PASS"** on this checkpoint.

Prior `SUMMARY.md` / `CP-05.json` status `"pass"` is **over-claimed** relative to browser pixels. This file supersedes them for honesty.

---

## What was run (fresh)

```text
git pull origin main  → Already up to date
git log -5 --oneline:
  c29dadf3 fix(open3d): cabinet-v0 plan symbol readable colors (W2)
  3d03229f feat(P05): S7 inventory place stamps published SVG + CP-05 browser
  ab41482d docs(planner): pin P03 W3 evidence HEAD aea4e76c
  aea4e76c test(planner): P03 W3 browser re-prove select-delete
  c6ea2ed1 trustdata(P05): CP-05 re-prove pack (units, prims, SUMMARY)

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

## Worktree honesty (A+B land incomplete on origin)

At re-prove time, **origin/main does not fully contain the S7 hard-path seats**:

| Path | On `c29dadf3` origin tip? | Local worktree |
|------|---------------------------|----------------|
| `furnitureBlock2D.ts` literal colors | **Yes** (c29dadf3) | clean vs HEAD for that fix |
| `catalog/svg/svgPlanSymbolCache.ts` | **No** (untracked) | present |
| `FeasibilityCanvas.tsx` SVG drawImage path | **No** (modified, uncommitted) | present |
| `asset-engine/stages.ts` | **No** (modified) | present |
| e2e S7 canvas diversity asserts | **No** (modified) | present |

**E2E was executed against this dirty worktree**, not a clean `c29dadf3` tree.  
S7 canvas-draw proof therefore validates **local hard-path code**, not a fully landed main alone.

See `seat-c-worktree-status.txt`.

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

4. **S7 hard path exists in worktree**  
   - `svgPlanSymbolCache`: load `/svg-catalog/*.svg`, `drawSvgPlanSymbol` → `drawImage`.  
   - Feasibility: if `previewImageUrl` is published SVG and not modular-cabinet-v0 → draw SVG; else Block2D.  
   - Inventory still stamps published SVG URLs (S7 API + thumb).

5. **Unit packs green** — 25/25 (cabinet-v0 13 + s7 3 + renderBlock2DToCanvas 9).

6. **E2E green (dirty tree)** — place cabinet + chaise; `canvasDiversity.notPureSolid=true` (driven mostly by chaise, not cabinet detail).

---

## What is FALSE / still broken

1. **Cabinet is still an empty box on the plan (human pixel gate).**  
   - `01-cabinet-v0-placed.png` / `02-cabinet-v0-canvas.png`: single cream filled square, dark border, **no legible stile, shelves, dual doors, or handles**.  
   - Not black anymore — color fix landed — but **owner empty-box fail still applies**.  
   - Center-region sample of `02-cabinet-v0-canvas.png` (~716×619): cream-dominant filled rect; detail strokes do not read as multiprim furniture at 100% zoom.

2. **Unit multiprim ≠ browser-readable multiprim.**  
   - Prims exist at mm scale; at default plan zoom they collapse visually to a filled tile.  
   - Soft e2e diversity probe samples **whole center canvas after SVG place** — chaise multipath inflates diversity and **does not prove cabinet multiprim**.

3. **S7 hard path not fully on origin/main.**  
   - Cache + Feasibility drawImage still uncommitted.  
   - Claiming “landed on main” for A+B hard path is **false** until commit+push.

4. **Prior SUMMARY/CP-05.json `"pass"`**  
   - False-green relative to owner pixel law. Do not treat as authority.

5. **Not proven on clean HEAD alone:**  
   - Whether clean `c29dadf3` (without dirty Feasibility SVG path) still draws multipath chaise on canvas, or only inventory thumb + Block2D fallback.

---

## What screenshots show (honest pixels)

| File | What you actually see |
|------|------------------------|
| `browser/01-cabinet-v0-placed.png` | UI ok; plan shows **cream empty box** near wall corner; properties `cabinet-v0` 600×580 cm; inventory Modular Cabinet thumb also simple box |
| `browser/02-cabinet-v0-canvas.png` | Grid + L-wall + **one cream square with blue selection ring** — no multiprim interior |
| `browser/03-inventory-svg-preview.png` | Chaise inventory thumb is real SVG furniture; cabinet on plan still empty box |
| `browser/04-svg-catalog-item-placed.png` | **Chaise multipath plan symbol** (seat/back/cushions/extension) + cream cabinet box beside it; 2 furniture |
| `browser/05-svg-plan-canvas-draw.png` | Same: **SVG chaise clearly drawn**; cabinet remains empty box |
| `browser/run.json` | `furnitureAfter: 2`, `canvasDiversity.uniqueQuantized: 45`, `status: "pass"` — **e2e self-label only; not Seat C gate** |

### Pixel call (Seat C)

- **Cabinet multiprim readable?** **NO.** Empty cream box.  
- **SVG drawn on plan canvas?** **YES** (chaise multipath; dirty hard path).  
- **CP-05 dual gate?** **FAIL.**

---

## Evidence this seat wrote/refreshed

- `HONEST-STATUS.md` (this file)  
- `seat-c-vitest-raw.log`  
- `seat-c-worktree-status.txt`  
- `HEAD.txt`  
- Browser PNGs + `browser/run.json` refreshed by e2e run `2026-07-10T12:53:38.574Z`

---

## What would be required for a real PASS

1. Browser cabinet at default/reasonable zoom shows **distinct multiprim** (inner lines, stile/handles readable — not a filled tile).  
2. S7 SVG plan draw committed **and** green on clean main (not only dirty tree).  
3. Evidence PNGs re-shot; this file upgraded only after re-prove — never flip SUMMARY first.

Until then: **CP-05 = FAIL.**
