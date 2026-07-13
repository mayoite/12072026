# Buyer — CHECKLIST

Tick [UI-BAR.md](../UI-BAR.md) and the phase section below.

## PHASE-01 — Workstation configurator
- [x] Two-seat linear journey passes in browser
- [x] Four-seat L journey passes in browser
- [x] Invalid combinations cannot be placed (disabled with reason)
- [ ] Re-edit preserves run ID and placement
- [x] 2D, 3D, and BOQ use same saved option set
- [x] Version replacement requires explicit migration choice
- [x] Admin workstation-family contract consumed from Admin P04

## PHASE-02 — Layout at scale
- [ ] Duplicate, row, array, grid, align, distribute, spacing, group, multi-select work
- [ ] Bulk actions preview before apply; one-step bulk undo
- [ ] 100 seats in under two minutes
- [ ] 2,000-seat plan navigable within recorded budget
- [ ] Bulk edit and undo preserve IDs and option data
- [ ] Validation feedback stays responsive during bulk work

## PHASE-03 — Validation and clearances
- [ ] Overlap, wall, opening, boundary, aisle, chair, accessibility rules run
- [ ] Summary shows severity, location, objects, remedy
- [ ] Focus-on-canvas action per issue
- [ ] Advisory waivers saved with reason; hard errors block
- [ ] Detect → focus → fix → clear without reload
- [ ] Export and quote consume same validation authority

## PHASE-04 — Priced BOQ and export
- [ ] Totals show quantity, unit price, adjustment, tax, total
- [ ] Unpriced never shown as zero; lines link to placed object IDs
- [ ] Price-book version and calculation time visible
- [ ] Linear/L totals match Admin P05 price-book rules
- [ ] Buyer P03 hard errors block quote-ready status
- [ ] PDF, workbook, JSON share one calculation hash

## PHASE-05 — Share, review, and quote
- [ ] Named revision with read-only link, permission, expiry, revocation
- [ ] Reviewer cannot mutate owner plan; comments anchor to objects
- [ ] Quote names revision, validation result, BOQ version
- [ ] Revocation blocks future access; quote cannot drift to newer revision
- [ ] Permission and revocation journeys pass in browser
- [ ] Security P03 auth boundaries satisfied for anonymous share scope