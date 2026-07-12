# PHASE-03 — Validation and clearances

**Parallel:** no · **Blocks on:** Buyer P02 · **Proof:** live browser

---

## Outcome

A buyer finds and fixes layout issues before export or quote.

## Build

Overlap, wall, opening, boundary, aisle, chair, and accessibility rules. One saved validation
authority serves UI, export, and quote.

## UI gates

- Summary shows severity, location, objects, and remedy.
- One action focuses the issue on canvas.
- Advisory waivers need a saved reason. Hard errors stay blocking.
- Empty and all-clear states are explicit.

## PASS gates

- Known invalid layouts create stable issue IDs.
- Detect → focus → fix → clear passes without reload.
- Waivers survive reload and remain auditable.
- Export and quote use the same result.
- Browser screenshots and accessibility checks pass.

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