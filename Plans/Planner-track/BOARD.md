# Planner-track — program board

> [Plans/INDEX.md](../INDEX.md) · [START](./START.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [EXECUTE](./EXECUTE.md) · [CHECKPOINTS](./CHECKPOINTS.md) · [Bar](../00-QUALITY-BAR.md)

**Outcome:** a buyer can draw a room, place furniture, save it, reopen it unchanged, and hand off a priced layout — proven on the **live Fabric** stage, not on archived hosts.

**W0:** UNLOCKED · Approach **A** · CP-00 process PASS — do not re-ask unlock.  
**CP-01…CP-09:** **REPROVE** — code candidates may exist; **no PASS transfers** without fresh proof on this checkout. **CP-10:** OPEN (`10-handover/` missing).

## Honest scores (not goals)

| | Now | Blocker |
|--|-----|---------|
| Plan honesty | ~7.5 | Kill order is clear; some cards still soft on browser acceptance |
| Product / engine | ~4 | Browser proofs often count-only; buyer P11–P16 unbuilt |

**Do not claim 9.5.** Product rises only with id/pose browser evidence and buyer outcomes.

## Upgrade lock (reject downgrade)

| Live | Forbidden |
|------|-----------|
| Fabric `PlannerCanvasStage` / `data-testid="open3d-fabric-stage"` | Restore Feasibility · dual 2D host |
| Raise select / Block2D / draw **on Fabric** | Prove W3/W5/W8 on archive or `planner-2d-canvas` |
| Admin SVG = publish only | Claim `svg-catalog` is plan-draw |

Flat cards only: `P01`…`P16`. No `modules/` · `phases/`.

## Kill order — trust spine (one at a time)

| Order | Kill | CP | Status | Card | Evidence folder |
|------:|------|-----|--------|------|-----------------|
| 0 | Unlock | CP-00 | **PASS** process only | [START](./START.md) | `00-start/` |
| 1 | Product truth | CP-01 | **REPROVE** | [P01](./P01-product-truth.md) | `00-product-truth/` |
| 2 | Constraints | CP-02 | **WAIVE / REPROVE** | [P02](./P02-engine-lock.md) | `01-engine-lock/` |
| 3 | **W3** | CP-03 | **REPROVE** landed candidate | [P03](./P03-select-delete.md) | `03-select-delete/` |
| 4 | **W1–W2** | CP-07 | **REPROVE** landed candidate | [P07](./P07-draw-place-journey.md) | `02-browser-open3d-journey/` |
| 5 | **W5–W6** | CP-06 | **REPROVE** landed candidate | [P06](./P06-save-honesty.md) | `06-save-honesty/` |
| 6 | W4 | CP-04 | **REPROVE** residual pose | [P04](./P04-orbit-continuity.md) | `04-orbit-continuity/` |
| 7 | Symbols | CP-05 | **REPROVE** multiprim candidate | [P05](./P05-symbols-svg.md) | `05-symbols-svg/` |
| 8 | W7 mesh | CP-08 | **REPROVE** | [P08](./P08-mesh-quality.md) | `08-mesh-quality/` |
| 9 | W8 chrome | CP-09 | **REPROVE** | [P09](./P09-shortcuts-chrome.md) | `09-shortcuts-chrome/` |
| 10 | Pack | CP-10 | **OPEN** | [P10](./P10-evidence-handover.md) | `10-handover/` |

```
CP-00 → CP-01 → CP-02 → CP-03 → CP-07 → CP-06 → CP-04 → CP-05 → CP-08 → CP-09 → CP-10
```

### Next action (only)

**CP-03 / P03:** On live Fabric, select furniture → delete → undo → assert **same id + pose**.  
Unit green alone = **FAIL**. Count-only browser = **FAIL**.

## W gates (buyer-visible)

| Gate | Bar |
|------|-----|
| W1 | Draw walls + door **on Fabric** |
| W2 | Place ≥2 items; symbols readable **on Fabric** |
| W3 | Select · delete · undo on Fabric (unit **+** browser **id+pose**) |
| W4 | 2D↔3D + orbit; pose identity not count-only |
| W5 | Save → reload → same ids |
| W6 | Honest local/cloud labels |
| W7 | Modular mesh readable |
| W8 | Labels match shortcuts |

**Evidence root:** `results/planner/world-standard-wave/`  
Each gate: `HEAD.txt` · `RUN-META.json` · `RAW-LOGS/` · `VERDICT.md`

## Buyer product (after trust spine)

| Order | Outcome | Status | Card |
|------:|---------|--------|------|
| 1 | Project + room | **OPEN** | [P11](./P11-project-brief-room.md) |
| 2 | Workstation configure | **OPEN** — needs Admin A6 | [P12](./P12-workstation-configurator.md) |
| 3 | Layout at scale | **OPEN** | [P13](./P13-layout-at-scale.md) |
| 4 | Validation | **OPEN** | [P14](./P14-validation-clearances.md) |
| 5 | Priced BOQ | **OPEN** — needs Admin A7 | [P15](./P15-priced-boq-export.md) |
| 6 | Share / quote | **OPEN** | [P16](./P16-share-review-quote.md) |

**Kill list until CP-03 green:** opening P11–P16 as “the work”; Feasibility; claiming CP-10 ship.
