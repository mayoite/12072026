# P13 — Layout at scale

**Status:** OPEN — blocked by P12 · **Depends:** P12

## Outcome

A buyer lays out hundreds of seats without repeated drag-and-drop.

## Build

Duplicate, row, array, grid, align, distribute, spacing, offsets, group, multi-select, and one-step bulk undo.

## UI gates

- Selection count and affected scope are always visible.
- Bulk actions preview before apply.
- Keyboard and pointer flows share the same commands.
- Long work never freezes the UI without progress or cancel.

## PASS gates

- Create 100 seats in under two minutes.
- A 2,000-seat plan stays navigable within a recorded budget.
- Bulk edit and undo preserve IDs and option data.
- Validation feedback remains responsive.
- Browser trace and screenshots pass.

**Evidence:** `results/planner/product-wave/13-layout-at-scale/`

**Next:** P14.
