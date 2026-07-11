# Planner-track — program board

> [Plans/INDEX.md](../INDEX.md) · [START](./START.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [EXECUTE](./EXECUTE.md) · [CHECKPOINTS](./CHECKPOINTS.md)

**W0:** UNLOCKED · Approach **A** · CP-00 process PASS — do not re-ask unlock.  
**CP-01…CP-09:** **REPROVE** — do not trust old PASS / checklist ticks. **CP-10:** OPEN.

Flat cards: `P01`…`P10` here. No `modules/` · `library/` · `research/`.

## Kill order — spine

| Order | Kill | CP | Card | Evidence |
|------:|------|-----|------|----------|
| 0 | Unlock | CP-00 | [START](./START.md) | `00-start/` |
| 1 | Product truth | CP-01 | [P01](./P01-product-truth.md) | `00-product-truth/` |
| 2 | Constraints | CP-02 | [P02](./P02-engine-lock.md) | `01-engine-lock/` |
| 3 | **W3** | CP-03 | [P03](./P03-select-delete.md) | `03-select-delete/` |
| 4 | **W1–W2** | CP-07 | [P07](./P07-draw-place-journey.md) | `02-browser-open3d-journey/` |
| 5 | **W5–W6** | CP-06 | [P06](./P06-save-honesty.md) | `06-save-honesty/` |
| 6 | W4 | CP-04 | [P04](./P04-orbit-continuity.md) | `04-orbit-continuity/` |
| 7 | W2 symbols | CP-05 | [P05](./P05-symbols-svg.md) | `05-symbols-svg/` |
| 8 | W7 | CP-08 | [P08](./P08-mesh-quality.md) | `08-mesh-quality/` |
| 9 | W8 | CP-09 | [P09](./P09-shortcuts-chrome.md) | `09-shortcuts-chrome/` |
| 10 | Pack | CP-10 | [P10](./P10-evidence-handover.md) | `10-handover/` |

```
CP-00 → CP-01 → CP-02 → CP-03 → CP-07 → CP-06 → CP-04 → CP-05 → CP-08 → CP-09 → CP-10
```

## W gates

| Gate | Bar |
|------|-----|
| W1 | Draw walls + door |
| W2 | Place ≥2 items; symbols readable |
| W3 | Select · delete · undo (unit **+** browser) |
| W4 | 2D↔3D + orbit |
| W5 | Save → reload → same ids |
| W6 | Honest local/cloud labels |
| W7 | Modular mesh readable |
| W8 | Labels match shortcuts |

**Evidence root:** `results/planner/world-standard-wave/` · each gate: `HEAD.txt` · `RUN-META.json` · `RAW-LOGS/` · `VERDICT.md`  
**Bar:** [03-QUALITY-BAR](../03-QUALITY-BAR.md) · **Agents:** [Agents-Plan](../../Agents/Agents-Plan.md)
