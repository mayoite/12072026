# P14 — Validation and clearances

**Status:** OPEN — the Planner does not yet provide a complete layout-quality check.

**Outcome:** A buyer sees actionable issues before sharing or requesting a quote.

## Functional scope

- Furniture overlap, wall collision, opening obstruction, and room-boundary checks.
- Configurable aisle, chair pull-back, and accessibility clearances.
- Severity, location, affected objects, and one-click focus.
- Explain the rule in plain language. Never block without a remedy.
- Waiver with reason for advisory rules. Hard errors remain blocking.
- Validation summary updates after edits and bulk operations.

## Acceptance

- [ ] Known invalid layouts produce stable, localized issues.
- [ ] Fixing geometry clears the issue without reload.
- [ ] Export/quote gates use the same validation authority.
- [ ] Waivers are saved and auditable.
- [ ] Browser proof covers detect → focus → fix → clear.

## Evidence

`results/planner/product-wave/14-validation-clearances/`

## Dependency

P13.
