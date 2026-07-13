# Planner Phase 3 — bulk layout and advanced validation

## Outcome

The customer can create large layouts efficiently and resolve real planning problems.

## Product configuration

- Consume released Admin product-family versions.
- Preserve the `UI-CAT-02` grouped-family model during configuration.
- Show only compatible options.
- Explain invalid combinations.
- Preserve family version and options through every edit.
- Require an explicit migration choice for newer family versions.
- Keep configuration identical in 2D, 3D, validation, and BOQ.

## Bulk layout

- Support multi-select, duplicate, row, array, and grid.
- Support align, distribute, and exact spacing.
- Support group and ungroup without losing identity.
- Preview bulk changes before application.
- Make one bulk operation one undoable command.
- Preserve identifiers, options, and BOQ identity through bulk edits and undo.
- Keep a 100-seat layout practical.
- Measure a representative 2,000-seat plan against recorded budgets.

## Advanced validation

- Detect product overlaps.
- Detect wall, opening, and room-boundary conflicts.
- Detect aisle and chair-clearance failures.
- Use only approved, versioned accessibility rules.
- Show severity, location, affected objects, and remedy.
- Focus affected objects on the canvas.
- Open only the contextual fields needed to resolve the issue.
- Keep focus visible when the issue moves or opens a panel.
- Allow advisory waivers only with a reason.
- Block quote readiness for hard errors.
- Recheck immediately after a fix.
- Give revisions, BOQ, and handoff the same validation result.

## Parallel work

- Product configuration and bulk commands can run together.
- Validation rules and issue presentation can run together.
- Performance profiling can run as each bulk operation becomes stable.

## Limited blockers

- Missing live product families block only live family acceptance.
- An isolated family fixture keeps implementation moving.
- A missing approved rule blocks only that rule.
- Other validation rules continue.

## Required proof

- Family compatibility and migration tests.
- Bulk operation, identity, and one-step undo tests.
- Fresh 100-seat and representative 2,000-seat measurements.
- Validation detection, focus, waiver, and clearing tests.
- BOQ repeatability after bulk operations.

## Done when

- Large layouts can be created without manual repetition.
- Bulk edits preserve identity and deterministic BOQ output.
- Every supported validation issue is visible and actionable.
- Hard errors prevent quote-ready status.
