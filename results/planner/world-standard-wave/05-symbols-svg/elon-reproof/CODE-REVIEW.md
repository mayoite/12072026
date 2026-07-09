# CODE-REVIEW — P05 / CP-05 (W2 symbols + SVG honesty)

| | |
|--|--|
| **Date** | 2026-07-09 |
| **Checkout** | `D:\OandO07072026` |
| **Impl commit** | `141cca0` — `fix(open3d): readable cabinet-v0 Block2D plan symbol for W2 (P05)` |
| **HEAD** | `74d8fdc` (main ≈ origin) |
| **Scope** | `furnitureBlock2D.ts` modular cabinet path · honesty docs · unit pack · evidence |
| **Bar** | CHECKPOINTS CP-05 hard stop; P05 phase; no half claims |

## Independent re-run (this review)

```text
pnpm exec vitest run
  tests/unit/features/planner/open3d/catalog/furnitureBlock2D.cabinet-v0.test.ts
  tests/unit/lib/catalog/renderBlock2DToCanvas.test.ts
→ 2 files · 17 tests · EXIT 0
```

- Committed land (`141cca0` / elon-reproof log): **12/12** green.
- Worktree (dirty test strengthen): **17/17** green — extra cases for modularOptions dims, outer carcass, front≠back, dual handles, `doorStyle: "none"`.
- SVG smoke re-proof: `SVG-SMOKE.md` + `04-svg-honesty/svg-batch-raw-elon.log` — exit **0**, fixtures=4 ok=4; honesty unchanged (publish ≠ canvas).

---

## Strengths

1. **Modular symbol is real geometry, not empty-box theater**  
   `modularCabinetBlock` (`furnitureBlock2D.ts` ~47–164): outer carcass, inner carcass, front edge (+Y), back edge, doorStyle branch (pair mid stile + dual handles; slab single offset handle; none = open-shelf dashed lines). Prim dump matches (`05-visual/cabinet-v0-prims.json`: pair 7 / slab 5).

2. **centeredPath dead lie fixed**  
   Baseline noted `true` with top-left prims. Now always `false` with honest JSDoc. Canvas centers only via `renderBlock2DCentered` (FeasibilityCanvas ~590–610). Helper unused in production draw path — correct: no dual coordinate systems.

3. **Authority split is honest and repeated**  
   `04-svg-honesty/NOTES.md`, asset-engine `README.md` Canvas-vs-publish section, `CP-05.json` claims, SUMMARY “Not done”. Smoke green ≠ canvas claim. `generateCabinetV0Footprint` called out as mesh helper, not Block2D.

4. **Wire matches authority**  
   Feasibility: `furnitureBlock2DFromItem` → `renderBlock2DCentered`. No `/svg-catalog` load on plan canvas.

5. **Tests assert product jobs**  
   Footprint dims, ≥4 prims, bounds, pair stile vs slab, canvas fill+stroke, no `.glb`/`.svg`/svg-catalog in block JSON. Dirty strengthen (unlanded) adds real doorStyle/front-back/handle structure — purpose over vanity.

6. **Ethics**  
   Procedural O&O prims only. No competitor SVG in modular path.

---

## Issues

### Critical (Must Fix before ship)

**None.** CP-05 hard-stop rows are met by committed impl + evidence.

### Important (Should Fix / land soon)

#### I1 — Strengthened suite + CP-05 counts not landed

| | |
|--|--|
| **Files** | `furnitureBlock2D.cabinet-v0.test.ts` (dirty +156), `CP-05.json` / `CP-05-vitest-raw.log` (modified), `elon-reproof/*` untracked |
| **Issue** | Live pack is **17** tests; committed pack + `CP-05.json` still say **12**. SUMMARY claims 12/12. Re-proof log also freezes at 12. |
| **Why** | Evidence drift: scoreboard and on-disk CP pack lag the better tests already on disk. Not a product fail; is honesty hygiene. |
| **Fix** | Commit test strengthen; re-run pack → refresh `CP-05.json` counts + `CP-05-vitest-raw.log` + SUMMARY; commit `elon-reproof/` (this review + SVG-SMOKE + logs). |

#### I2 — No cabinet-v0 plan PNG under `05-visual/`

| | |
|--|--|
| **Files** | `05-visual/` = prim JSON + NOTES only |
| **Issue** | P05 prefers Playwright place PNG when place works; fell back to prim dump (allowed). |
| **Why** | Unit+JSON prove structure; human eye still needs browser for “readable at zoom.” Not a CP-05 hard fail (plan allows prim-JSON). |
| **Fix** | Optional follow: one PNG of placed cabinet-v0 2D in `05-visual/` when catalog place is stable (P07 ownership for place; symbol PNG is quality polish). |

### Minor

#### M1 — modularOptions vs item.width/depth desync

`modularCabinetBlock` prefers `opts?.widthMm` over `item.width`. If UI resizes furniture via item dims without updating `modularOptions`, plan symbol footprint can disagree with placement/hitbox. Default place path sets both; residual only on partial edits. Prefer one source of truth or sync on resize.

#### M2 — Ethics test is thin

`furnitureBlock2DFromItem.toString()` does not include `modularCabinetBlock` body. Real guard is `JSON.stringify(block)` no `.glb`/`.svg`. Fine as smoke; not a static analysis of the modular function.

#### M3 — Feasibility comment overclaim risk

`FeasibilityCanvas.tsx` ~584: “same prims as inventory SVG preview.” Plan authority is Block2D; inventory may still surface published SVG elsewhere. Comment should not imply SVG catalog is the canvas source.

#### M4 — `furnitureBlockUsesCenteredPath` is dead API

Only tested, never called from canvas. Keep as honesty lock **or** delete later with a single comment in render path. Do not reintroduce per-mode `true`.

---

## CP-05 hard stop (checklist)

| Check | Result |
|-------|--------|
| Unit cabinet-v0 green + log | **PASS** (12 committed / 17 live dirty) |
| Non-empty modular + box fallback | **PASS** (`renderBlock2DToCanvas.test.ts`) |
| Door style pair mid stile; slab none | **PASS** (+ dirty: none shelves) |
| `furnitureBlockUsesCenteredPath` false | **PASS** |
| Honesty NOTES Block2D canvas / SVG publish | **PASS** |
| SVG smoke (if claimed) | **PASS** exit 0; not claimed as canvas |
| Ethics no competitor SVG | **PASS** |
| Visual PNG or prim JSON + NOTES | **PASS** (prim JSON) |

---

## Recommendations

1. Land I1 (tests + CP-05 refresh + elon-reproof) in one commit — keeps PASS true under re-proof.
2. Do not reopen modular prim design for CP-05; mesh beauty is P08.
3. P07 must not re-claim full W2 from journey alone — symbol half already owned here; journey = place half.

---

## Assessment

### Verdict: **SHIP CP-05**

**Gaps (non-blocking):** I1 evidence/test land hygiene · I2 optional browser PNG · M1–M4 polish.

**Reasoning:** Modular cabinet-v0 Block2D is readable multi-prim geometry with doorStyle differentiation; centeredPath lie fixed; canvas wire is Block2D-only; SVG honesty docs and smoke do not overclaim; unit pack green. Committed hard stop is met. Land dirty stronger tests + refresh CP-05 counts so evidence matches HEAD.
)
