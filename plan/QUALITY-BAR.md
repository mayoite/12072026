# Quality bar — plan law (all tracks)

Do not claim DONE without fresh proof on this checkout.

## Status language

| Status | Means |
|--------|--------|
| **OPEN** | Not done |
| **REPROVE** | Re-run proof on this checkout before close |
| **DONE** | Checklist met; report in `agents-work/reports/` |
| **PASS slice** | Bounded slice only |
| **WAIVE** | Owner-only, dated, residual named |

## Locked product stack

| Layer | Live | Forbidden |
|-------|------|-----------|
| Document | UUID v7 + mm · `lib/newEntityId` | Non-v7 ids · dual unit record · dual plan host |
| 2D host | Fabric `planner-fabric-stage` only | Second canvas · `planner-2d-canvas` · `_archive/fabric` as host |
| Plan symbols | Published SVG on Fabric; Block2D fallback | Non-Fabric proof |
| Toolbar | React Aria + Phosphor · live vs deferred honest | Deferred tools scored as live |
| Admin SVG | SVG.js → `public/svg-catalog/` | Fabric `toSVG()` authoring |
| 3D | Three + orbit | R3F substitute for workspace viewer |
| Storage | Local until cloud save succeeds | Fake cloud / price / save / share labels |

## Proof

- Buyer-facing phases need a live browser run.
- Blockers → `Failures.md`.
- Reports → `agents-work/reports/<track>-phase-<nn>.md`.