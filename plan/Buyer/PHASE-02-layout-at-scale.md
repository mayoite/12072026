# PHASE-02 — Layout at scale

**Parallel:** no · **Blocks on:** Buyer P01 · **Proof:** live browser + trace

---

## Outcome

A buyer lays out hundreds of seats without repeated drag-and-drop.

## Build

Duplicate, row, array, grid, align, distribute, spacing, offsets, group, multi-select, and one-step
bulk undo.

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

## Steps

1. Selection count and affected scope always visible.
2. Bulk actions preview before apply; keyboard and pointer share commands.
3. Long operations show progress or cancel — no frozen UI.

## Done when

[UI-BAR.md](../UI-BAR.md) ticked · [CHECKLIST.md](./CHECKLIST.md) PHASE-02.

## How to prove

Create 100 seats under two minutes; stress 2,000-seat navigation budget. Browser trace + screenshots.

Report → `agents-work/reports/buyer-phase-02.md`. Raw artifacts → `results/buyer/phase-02/`.