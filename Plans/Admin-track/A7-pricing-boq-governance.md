# A7 — Pricing and BOQ governance

**Status:** OPEN — priced BOQ is not built.  
**Kill order (addendum):** [A7a-pricing-boq-kills.md](./A7a-pricing-boq-kills.md) — slices only; **this card’s acceptance remains the done bar**.

**Outcome:** Authorized admins map released system modules to cost and sell-price rules without editing Planner code.

## Functional scope

- Price book versions with effective dates and currency.
- Component, material, finish, size, and quantity-break adjustments.
- Tax, freight, installation, and discount policy hooks.
- BOM line mapping from workstation options.
- Draft calculation preview against representative projects.
- Approval before activation. Past quotes keep their original price-book version.
- Clear “price unavailable” failure. Never silently emit zero.

## Acceptance

- [ ] An admin prices one workstation family end to end without editing Planner code.
- [ ] **Green when** each Planner BOQ line shows its quantity × unit price × adjustment breakdown — not just a total.
- [ ] **Green when** activating a new price-book version leaves every previously saved quote total byte-identical (past quotes pin their original version).
- [ ] **Green when** author, approver, and viewer permissions are enforced server-side — a viewer cannot activate, an author cannot self-approve.
- [ ] **Green when** a component with no applicable price rule surfaces "price unavailable" in the BOQ and blocks quote finalize — never emits or sums a silent zero.
- [ ] Browser proof covers draft, approve, activate, and rollback of a price book.

## Data-loss & failure states

- [ ] **Green when** a failed activation (validation error, mid-write interruption) leaves the prior active price book untouched — no partial price state.
- [ ] Rollback to a prior price-book version records a new audit event and never deletes the version rolled back from.
- [ ] Draft-preview calculation errors render a legible failure, not a zero or blank total.

## Evidence

`results/admin/pricing-boq-governance/`

## Dependency

A6 system BOM mapping.
