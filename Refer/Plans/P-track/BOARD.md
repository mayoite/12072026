# P track — program board

> [Plans/INDEX.md](../../INDEX.md) · [START.md](./START.md) · [CONSTRAINTS.md](./CONSTRAINTS.md) · [EXECUTE.md](./EXECUTE.md)

**W0:** UNLOCKED · Approach **A** · CP-00 PASS — do not re-ask unlock.

Stack/engine detail lives only in [CONSTRAINTS.md](./CONSTRAINTS.md) + `01-engine-lock/` evidence — not in phase cards.

---

## Kill order (one task at a time)

### Spine

| Order | Kill | CP | Card | Evidence |
|------:|------|-----|------|----------|
| 0 | Unlock recorded | CP-00 | [START.md](./START.md) | `00-start/` |
| 1 | Product truth | CP-01 | [P01](./phases/P01-product-truth/P01-product-truth.md) | `00-product-truth/` |
| 2 | Constraints reproof | CP-02 | [P02](./phases/P02-engine-lock/P02-engine-lock.md) | `01-engine-lock/` |
| 3 | **W3** select/delete/undo | CP-03 | [P03](./phases/P03-select-delete/P03-select-delete.md) | `03-select-delete/` |
| 4 | **W1–W2** journey | CP-07 | [P07](./phases/P07-draw-place-journey/P07-draw-place-journey.md) | `02-browser-open3d-journey/` |
| 5 | **W5–W6** save honesty | CP-06 | [P06](./phases/P06-save-honesty/P06-save-honesty.md) | `06-save-honesty/` |

```
CP-00 → CP-01 → CP-02 → CP-03 → CP-07 → CP-06 → CP-04 → CP-05 → CP-08 → CP-09 → CP-10
```

### Fill (after spine)

| Order | Gate | CP | Card | Evidence |
|------:|------|-----|------|----------|
| 6 | W4 | CP-04 | [P04](./phases/P04-orbit-continuity/P04-orbit-continuity.md) | `04-orbit-continuity/` |
| 7 | W2 symbols | CP-05 | [P05](./phases/P05-symbols-svg/P05-symbols-svg.md) | `05-symbols-svg/` |
| 8 | W7 | CP-08 | [P08](./phases/P08-mesh-quality/P08-mesh-quality.md) | `08-mesh-quality/` |
| 9 | W8 | CP-09 | [P09](./phases/P09-shortcuts-chrome/P09-shortcuts-chrome.md) | `09-shortcuts-chrome/` |
| 10 | Pack | CP-10 | [P10](./phases/P10-evidence-handover/P10-evidence-handover.md) | `10-handover/` |

---

## W gates (buyer language)

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

**Evidence map:** [archive/Plans/Research/RESULTS-MAP.md](../../archive/Plans/Research/RESULTS-MAP.md)  
**HOW:** [archive/Plans/phases/](../../archive/Plans/phases/) · **Full old cards:** [archive/museum/p-track-cards-full/](../../archive/museum/p-track-cards-full/)

---

## Claim rules

- W3: unit-only = **FAIL**
- CP-07: needs CP-03 + symbol honesty unless owner WAIVE
- W7 folder = `08-mesh-quality/` only · W8 = `09-shortcuts-chrome/` only
- GATE PASS ≠ product ship · module bar → [global-standard-revision](../global-standard-revision/)

**Checkpoints:** [museum `CHECKPOINTS`](../../archive/museum/p-track-archive/CHECKPOINTS.md) · **Agent contract:** [museum `AGENT-RULES`](../../archive/museum/p-track-archive/AGENT-RULES.md)
