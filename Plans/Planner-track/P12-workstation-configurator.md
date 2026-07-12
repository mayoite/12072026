# P12 — Workstation configurator

**Status:** OPEN — one complete custom workstation family is not buyer-usable.

**Outcome:** A buyer configures and places linear and L-shaped workstation runs without understanding modules or code.

## Functional scope

- Seat count, topology, desk size, finish, screen, storage, and cable options.
- Only valid combinations are selectable.
- Live dimensions, 2D symbol, 3D preview, and estimated BOQ update together.
- Plain-language defaults for a fast path. Advanced options stay optional.
- Edit a placed run without losing identity or position.
- Replace a released family version through an explicit migration choice.

## Acceptance

- [ ] Two-seat linear and four-seat L scenarios complete in the browser.
- [ ] Invalid combinations cannot be added.
- [ ] Re-edit preserves run ID and placement.
- [ ] 2D, 3D, and BOM represent the same option set.
- [ ] No admin SVG artifact is misrepresented as Fabric plan paint.

## Evidence

`results/planner/product-wave/12-workstation-configurator/`

## Dependency

Admin A6 released workstation family.
