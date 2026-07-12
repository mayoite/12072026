# Planner board

**Law:** [`AGENTS.md`](../../AGENTS.md) · [CONSTRAINTS](./CONSTRAINTS.md) · [CHECKPOINTS](./CHECKPOINTS.md)  
**HEAD:** `4ddfa36a` (2026-07-12) · Approach **A** · W0 unlocked

**Outcome:** Buyer draws, places, saves, reopens on **live Fabric** (`planner-fabric-stage`) — not archived hosts.

**Next:** [P11](./P11-project-brief-room.md) · or **CP-01 accept** (owner paperwork)  
**Open:** CP-01 · P11–P16  
**PASS:** CP-00 · CP-02–CP-10 (engineering + handover pack)  
**Locked:** Fabric sole · guest/canvas — [CONSTRAINTS](./CONSTRAINTS.md)

---

## Next (detail)

1. **[P11](./P11-project-brief-room.md)** — project brief / room setup (buyer; not built). Gap: `results/planner/product-wave/11-project-brief-room/GAP.md`
2. **Owner:** [P01](./P01-product-truth.md) / CP-01 — say inventory OK when ready (paperwork only)

Pack ≠ product ship. CP-00…CP-10 closed on engineering gates; **P11–P16 are the product work.**

---

## Card status

| Card | CP | Status |
|------|-----|--------|
| [P01](./P01-product-truth.md) | CP-01 | **REPROVE** — owner accept |
| [P01a](./P01a-dead-path-cleanup.md) | — | OPEN (stale test imports) |
| [P01b](./P01b-orphan-cleanup.md) | — | DONE slice |
| [P02](./P02-engine-lock.md) | CP-02 | **PASS** (owner 2026-07-12) |
| [P03](./P03-select-delete.md) | CP-03 W3 | **PASS** |
| [P04](./P04-orbit-continuity.md) | CP-04 W4 | **PASS** |
| [P05](./P05-symbols-svg.md) | CP-05 | **PASS** |
| [P06](./P06-save-honesty.md) | CP-06 W5–W6 | **PASS** |
| [P07](./P07-draw-place-journey.md) | CP-07 W1–W2 | **PASS** |
| [P08](./P08-mesh-quality.md) | CP-08 W7 | **PASS** slice |
| [P09](./P09-shortcuts-chrome.md) | CP-09 W8 | **PASS** |
| [P10](./P10-evidence-handover.md) | CP-10 | **PASS** (pack only) |
| [P11](./P11-project-brief-room.md) | — | **OPEN** |
| [P12](./P12-workstation-configurator.md) | — | **OPEN** (needs Admin A6) |
| [P13](./P13-layout-at-scale.md) | — | **OPEN** |
| [P14](./P14-validation-clearances.md) | — | **OPEN** |
| [P15](./P15-priced-boq-export.md) | — | **OPEN** (needs Admin A7) |
| [P16](./P16-share-review-quote.md) | — | **OPEN** |

Sequence: `P01 → … → P16`. One open **buyer** card at a time from **P11** onward.

---

## Locked (details → CONSTRAINTS.md)

Fabric **sole** 2D · `/planner/guest` + `/planner/canvas` · SVG catalog **publish only** · RAC toolbar · no second plan host.

---

## Proof (when unsure)

Run tests — do not read `results/` for “done.” Examples:

```bash
pnpm --filter oando-site exec playwright test tests/e2e/open3d-world-standard-journey.spec.ts -c config/build/playwright.config.ts
pnpm --filter oando-site exec vitest run tests/unit/features/planner/hostWiringP01.test.ts
```

Buyer gaps: `results/planner/product-wave/*/GAP.md` (audit only).