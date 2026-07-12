# PHASE-01 — Workstation configurator

**Parallel:** no · **Blocks on:** Planner P12 handover · UI P02 · Admin P04 · **Proof:** live browser

---

## Outcome

A buyer configures, places, and edits linear and L-shaped workstation runs.

## Build

Seats, topology, desk size, finish, screen, storage, cable options. One released family version drives 2D, 3D, and BOQ.

## Steps

1. Wire configurator panel to Admin workstation-family JSON contract.
2. Fast defaults first; invalid choices disabled with reason.
3. Live dimensions, preview, price state, validation update together.
4. Re-edit uses same panel; preserves ID and pose.

## Done when

[UI-BAR.md](../UI-BAR.md) ticked · [CHECKLIST.md](./CHECKLIST.md) PHASE-01.

## How to prove

Browser: two-seat linear and four-seat L journeys on `/planner/guest`. Screenshots + trace.

Report → `agents-work/reports/buyer-phase-01.md`. Raw artifacts → `results/buyer/phase-01/`.