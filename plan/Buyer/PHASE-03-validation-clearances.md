# PHASE-03 — Validation and clearances

**Parallel:** no · **Blocks on:** Buyer P02 · **Proof:** live browser

---

## Outcome

A buyer finds and fixes layout issues before export or quote.

## Build

Overlap, wall, opening, boundary, aisle, chair, accessibility rules. One saved validation authority for UI, export, and quote.

## Steps

1. Render issue summary with severity, location, objects, remedy.
2. One action focuses issue on canvas.
3. Advisory waivers require saved reason; hard errors stay blocking.
4. Empty and all-clear states explicit.

## Done when

[UI-BAR.md](../UI-BAR.md) ticked · [CHECKLIST.md](./CHECKLIST.md) PHASE-03.

## How to prove

Known invalid layout → detect → focus → fix → clear without reload. Screenshots + a11y check.

Report → `agents-work/reports/buyer-phase-03.md`. Raw artifacts → `results/buyer/phase-03/`.