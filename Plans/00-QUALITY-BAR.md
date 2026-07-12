# Quality bar — plan law (all tracks)

**Status:** OPEN · **Law:** flat cards under `Plans/*-track/` only · **Honesty > comfort**

Do **not** invent `modules/` plan mazes or second CP numbering.  
Do **not** claim DONE / PASS / PASS slice without **fresh** proof on **this** checkout under the card’s `results/` path.  
Do **not** add a second plan host. Do **not** use archive `planner-2d-canvas` to “prove” gates. Live canvas only: Fabric `planner-fabric-stage`.

**Product audit text does not live here.** Checkout snapshot / “what’s red today” → [00-PRODUCT-FLOOR.md](./00-PRODUCT-FLOOR.md).

## Two scores (never merge)

| Score | Lives in | Means |
|-------|----------|--------|
| **Plan honesty** | This file + track cards | Status enum matches rules; green-when falsifiable; evidence path named; owner sequence clear (Planner P01→P12) |
| **Product / engine** | PRODUCT-FLOOR + `results/` | Buyer can finish the outcome on the live surface |

A plan can be honest while product is red. That is truth, not failure.

## Status enum (Plans only)

| Status | Means |
|--------|--------|
| **OPEN** | Not done. Work remains. |
| **REPROVE** | Code or old pack may exist — **must re-run** on this checkout before DONE/PASS |
| **DONE** | Outcome + green-when met; evidence path present on this tree |
| **PASS slice** | Named bounded slice only — **not** full card / track complete |
| **WAIVE** | Owner-only, dated, residual named |

### PARTIAL is not a Plans status

| Word | Meaning | What to do |
|------|---------|------------|
| **PARTIAL** | Informal/review speak: some code or some proof, **outcome not finished** | **Reopen as NOT DONE** → **OPEN** or **REPROVE** |
| Never | Half-PASS, unit-only DONE, “good enough until later” without residual |

**Rule:** anything once called PARTIAL **stays reopenable work** until **you** accept the green-when (owner happy). No silent close. No score theater.

## Locked product stack (architecture — not a checkout audit)

| Layer | Live | Forbidden downgrade |
|-------|------|---------------------|
| 2D host | Fabric `PlannerCanvasStage` → `planner-fabric-stage` | Dual host · any second interactive plan canvas |
| Plan symbols | Block2D / multiprim **on Fabric** | Non-Fabric host “proof” |
| Select/delete | Fabric host | Archive `planner-2d-canvas` selectors |
| Admin SVG | Publish → `public/svg-catalog/` | Claim catalog SVG is plan-draw |
| 3D | Three + orbit | R3F rewrite as substitute |

## Evidence roots (dump only — not PASS law; `AGENTS.md` §5)

| Track | Path |
|-------|------|
| Planner W-spine | `results/planner/world-standard-wave/` |
| Admin | `results/admin/` (+ paths named on A1/A2 cards) |
| Site | `results/site/` |
| SEO | `results/seo/` |
| Security | `results/security/` |

Old packs = clues. Fresh HEAD only.

## Raise order (process)

1. Re-read `AGENTS.md` · status language honest on the card  
2. One next ID per track — **owner sequence** (Planner: P01→P12; no convenience skip)  
3. Fresh live proof this session; dump under `results/` if card asks (**not** PASS-by-old-dump)  
4. Only then open the next ID  

## Ethics

Research = ideas only. No competitor assets in `site/`. No foreign skill packs as law.
