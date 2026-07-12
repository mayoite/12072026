# P12 — Workstation configurator

**Status:** OPEN — blocked by Admin A6 · **Depends:** P11 + A6

## Outcome

A buyer configures, places, and edits linear and L-shaped workstation runs.

## Build

Seats, topology, desk size, finish, screen, storage, and cable options. One released family version drives 2D, 3D, and BOQ.

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

**Evidence:** `results/planner/product-wave/12-workstation-configurator/`

**Next:** P13.
