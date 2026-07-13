# Planner track

## Outcome

Planner serves any external customer.

The customer creates a layout, receives a deterministic branded BOQ, and sends it to Oando.

## Five phases

1. `PHASE-01-public-entry-deterministic-boq.md`
   Planner entry, project setup, and deterministic BOQ.
2. `PHASE-02-core-layout-catalog.md`
   Core layout, Planner catalog, persistence, 2D, 3D, and interface quality.
3. `PHASE-03-bulk-layout-validation.md`
   Configurable products, bulk layout, scale, and advanced validation.
4. `PHASE-04-pricing-revisions-sharing.md`
   Live pricing, named revisions, sharing, and review.
5. `PHASE-05-handoff-exports.md`
   Quote handoff and external exports.

## Start gate

Catalog-writing tests first satisfy Admin Step 0.

Only catalog-writing work waits.

Read-only and isolated Planner work continues.

## Parallel execution

- Phase 1 entry, setup, and BOQ can run as separate lanes.
- Phase 2 editor, catalog, persistence, 3D, and interface work can run in parallel.
- Phase 3 bulk commands and validation rules can run in parallel.
- Phase 4 pricing and revision-sharing can run in parallel against stable contracts.
- Phase 5 handoff and exports can run in parallel.
- Security is implemented with each boundary.

Two writers do not edit the same file at the same time.

## Limited blockers

- Missing live catalog blocks only live catalog acceptance.
- An isolated fixture keeps Planner work moving.
- Missing 3D assets block only affected 3D proof.
- Missing approved prices block only live-price proof.
- Missing delivery infrastructure blocks only final submission proof.
- Every unrelated item continues.

## Status

`CHECKLIST.md` is the only Planner status record.

Every item starts unchecked.

The phase files explain execution.

## Completion

An external customer can design, validate, revise, price, export, and send the exact branded BOQ to Oando.
