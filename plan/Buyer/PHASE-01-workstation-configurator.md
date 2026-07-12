# PHASE-01 — Workstation configurator

**Parallel:** no · **Blocks on:** Planner P12 handover · UI P02 · Admin P04 · **Proof:** live browser

---

## Outcome

A buyer configures, places, and edits linear and L-shaped workstation runs.

## Build

Seats, topology, desk size, finish, screen, storage, and cable options. One released family version
drives 2D, 3D, and BOQ.

## UI gates

- Fast defaults first. Advanced options stay optional.
- Invalid choices are disabled with a reason.
- Live dimensions, preview, price state, and validation update together.
- Re-edit uses the same panel and preserves ID and pose.

## PASS gates

- Two-seat linear and four-seat L journeys pass in browser.
- Invalid combinations cannot be placed.
- Re-edit preserves run identity and placement.
- 2D, 3D, and BOQ use the same saved option set.
- Version replacement requires an explicit migration choice.

## Steps

1. Wire configurator panel to Admin P04 workstation-family JSON contract.
2. Implement UI gates above on `/planner/guest`.
3. Prove linear and L journeys with screenshots + trace.

## Done when

[UI-BAR.md](../UI-BAR.md) ticked · [CHECKLIST.md](./CHECKLIST.md) PHASE-01.

## How to prove

Browser: two-seat linear and four-seat L journeys on `/planner/guest`. Screenshots + trace.

Report → `agents-work/reports/buyer-phase-01.md`. Raw artifacts → `results/buyer/phase-01/`.