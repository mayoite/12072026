# Planner-track — program board

> [Plans/INDEX.md](../INDEX.md) · [START](./START.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [EXECUTE](./EXECUTE.md) · [CHECKPOINTS](./CHECKPOINTS.md)

**Outcome:** a buyer can draw a room, place furniture, save it, reopen it unchanged, and hand off a priced layout — proven on the live Fabric stage, not on archived hosts.

**W0:** UNLOCKED · Approach **A** · CP-00 process PASS — do not re-ask unlock.  
**CP-01…CP-09:** **REPROVE** — several implementations landed, but no PASS transfers to this dirty checkout. **CP-10:** OPEN.

## Upgrade lock (reject downgrade)

| Live | Forbidden |
|------|-----------|
| Fabric `PlannerCanvasStage` / `data-testid="open3d-fabric-stage"` | Restore Feasibility · dual 2D host |
| Raise select / Block2D / draw **on Fabric** | Prove W3/W5/W8 on archive or `planner-2d-canvas` (archive-only) |
| Admin SVG = publish only | Claim `svg-catalog` is plan-draw |

Flat cards only: `P01`…`P10` here. No `modules/` · `library/` · `phases/`.

## Kill order — spine

| Order | Kill | CP | Status now | Card | Evidence |
|------:|------|-----|------------|------|----------|
| 0 | Unlock | CP-00 | **PASS** process only | [START](./START.md) | `00-start/` |
| 1 | Product truth | CP-01 | **REPROVE** | [P01](./P01-product-truth.md) | `00-product-truth/` |
| 2 | Constraints | CP-02 | **WAIVE / REPROVE** | [P02](./P02-engine-lock.md) | `01-engine-lock/` |
| 3 | **W3** | CP-03 | **REPROVE** landed candidate | [P03](./P03-select-delete.md) | `03-select-delete/` |
| 4 | **W1–W2** | CP-07 | **REPROVE** landed candidate | [P07](./P07-draw-place-journey.md) | `02-browser-open3d-journey/` |
| 5 | **W5–W6** | CP-06 | **REPROVE** landed candidate | [P06](./P06-save-honesty.md) | `06-save-honesty/` |
| 6 | W4 | CP-04 | **REPROVE** landed candidate | [P04](./P04-orbit-continuity.md) | `04-orbit-continuity/` |
| 7 | W2 symbols | CP-05 | **REPROVE** raised candidate | [P05](./P05-symbols-svg.md) | `05-symbols-svg/` |
| 8 | W7 | CP-08 | **OPEN / REPROVE** | [P08](./P08-mesh-quality.md) | `08-mesh-quality/` |
| 9 | W8 | CP-09 | **OPEN / REPROVE** | [P09](./P09-shortcuts-chrome.md) | `09-shortcuts-chrome/` |
| 10 | Pack | CP-10 | **OPEN** | [P10](./P10-evidence-handover.md) | `10-handover/` |

```
CP-00 → CP-01 → CP-02 → CP-03 → CP-07 → CP-06 → CP-04 → CP-05 → CP-08 → CP-09 → CP-10
```

## W gates

| Gate | Bar |
|------|-----|
| W1 | Draw walls + door **on Fabric** |
| W2 | Place ≥2 items; symbols readable **on Fabric** |
| W3 | Select · delete · undo on Fabric (unit **+** browser) |
| W4 | 2D↔3D + orbit |
| W5 | Save → reload → same ids |
| W6 | Honest local/cloud labels |
| W7 | Modular mesh readable |
| W8 | Labels match shortcuts |

**Evidence root:** `results/planner/world-standard-wave/` · each gate: `HEAD.txt` · `RUN-META.json` · `RAW-LOGS/` · `VERDICT.md`  
**Bar:** [00-QUALITY-BAR](../00-QUALITY-BAR.md) · **Agents:** [Agents-Plan](../../Agents/Agents-03-Plan.md)

## Buyer product roadmap

P01–P10 make the engine trustworthy. They do not make the product complete.

| Order | Buyer outcome | Status | Card |
|------:|---------------|--------|------|
| 1 | Start a real project and room | **OPEN** | [P11](./P11-project-brief-room.md) |
| 2 | Configure linear/L workstations | **OPEN** | [P12](./P12-workstation-configurator.md) |
| 3 | Lay out 100–2,000 seats efficiently | **OPEN** | [P13](./P13-layout-at-scale.md) |
| 4 | Detect collisions and clearance issues | **OPEN** | [P14](./P14-validation-clearances.md) |
| 5 | Produce a priced, traceable BOQ | **OPEN** | [P15](./P15-priced-boq-export.md) |
| 6 | Share, review, and request a quote | **OPEN** | [P16](./P16-share-review-quote.md) |

```
P11 project → P12 configure → P13 scale → P14 validate → P15 BOQ → P16 share/quote
```

**Commercial dependency:** P12 consumes Admin A6. P15 consumes Admin A7. Technical P10 is a foundation handover, not buyer ship.
