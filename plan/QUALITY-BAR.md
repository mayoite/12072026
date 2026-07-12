# Quality bar — plan law (all tracks)

**Honesty > comfort.** Do not claim DONE without fresh proof on **this** checkout.

## Two scores (never merge)

| Score | Means |
|-------|--------|
| **Plan honesty** | Checklist boxes ticked only after live proof; evidence path named; blockers in `FAILURES.md` |
| **Product** | Buyer can finish the outcome on the live surface |

A plan can be honest while product is red. That is truth, not failure.

## Status language

| Status | Means |
|--------|--------|
| **OPEN** | Not done. Work remains. |
| **REPROVE** | Prior proof may exist — must re-run on this checkout before close |
| **DONE** | Outcome + checklist met; report in `agents-work/reports/` |
| **PASS slice** | Bounded slice only — not full phase / track complete |
| **WAIVE** | Owner-only, dated, residual named |

**PARTIAL** is not a close status. Anything partial stays reopenable until green-when is met.

## Locked product stack

| Layer | Live | Forbidden |
|-------|------|-----------|
| Document | UUID v7 + mm · `lib/newEntityId` | Non-v7 ids · dual unit record · dual plan host |
| 2D host | Fabric `planner-fabric-stage` only | Second canvas · removed `planner-2d-canvas` as proof · `_archive/fabric` as product host |
| Plan symbols | Published SVG primary on Fabric; Block2D fallback | Non-Fabric host proof |
| Select/delete | Fabric host | Removed host selectors (`planner-2d-canvas`) |
| Toolbar | React Aria + Phosphor · live vs deferred honest | Lucide swap · deferred tools scored as live |
| Admin SVG | SVG.js authors → `public/svg-catalog/` | Fabric `toSVG()` authoring · catalog bytes as room plan-draw |
| 3D | Three + orbit (`Lazy3DViewer`) | R3F rewrite as workspace substitute |
| Storage | Local until cloud save succeeds | Fake cloud / price / save / share labels |

## Proof rules

- UI PASS requires a real browser run. Units alone never close a buyer-facing phase.
- `results/` is a dump only — never PASS law (`AGENTS.md` §5).
- Reports → `agents-work/reports/<track>-phase-<nn>.md` (committed).
- Prior dumps are clues only. Fresh HEAD proof required.

## Raise order

1. Re-read `AGENTS.md` · tick only after live proof
2. One active buyer phase per track where sequence applies (Buyer P01→P05)
3. Fresh proof this session
4. Only then open the next gated phase

## Ethics

Research = ideas only. No competitor assets in `site/`. Paid assets = owner buys.