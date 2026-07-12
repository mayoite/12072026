# P13 — Layout at scale

**Status:** OPEN — single-item placement does not solve projects with hundreds or thousands of seats.

**Outcome:** A buyer lays out large workstation runs quickly while preserving precise editable geometry.

## Functional scope

- Duplicate, array, row, grid, align, distribute, and spacing controls.
- Aisle and perimeter offsets.
- Group and ungroup workstation runs.
- Multi-select with clear selection count and bounded operations.
- Performance budget for 100, 500, and 2,000 seats.
- Undo/redo treats one bulk operation as one history step.

## Acceptance

- [ ] Create 100 seats in under two minutes without repeated drag-and-drop.
- [ ] 2,000-seat document remains navigable within the recorded performance budget.
- [ ] Bulk edit and undo preserve IDs and option data.
- [ ] Collision/clearance feedback does not freeze interaction.
- [ ] Browser performance trace and screenshots are stored.

## Evidence

`results/planner/product-wave/13-layout-at-scale/`

## Dependency

P12.
