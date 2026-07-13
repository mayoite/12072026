# Admin Phase 3 — configurable product families

## In plain words

Many products are not one fixed item.

They are families with sizes, layouts, finishes, accessories, and other choices.

This phase lets Admin define those choices once.

Planner then uses only valid combinations.

## Why this matters

A customer must see the same configuration in 2D, 3D, and the BOQ.

Separate option logic creates mismatched layouts and wrong quantities.

## Product outcome

An Admin can:

1. Create a product family.
2. Define its available options.
3. Define which options work together.
4. Preview a valid configuration.
5. Release a family version.
6. See which version Planner uses.

## Work

### Family identity

- Give each family a stable identifier.
- Give each released version an immutable version identifier.
- Keep family identity separate from a specific option selection.
- Preserve the exact released version used by a placed product.

### Option model

- Define option groups in plain Admin language.
- Support required and optional choices.
- Support single-choice and multi-choice groups where justified.
- Give every option a stable identifier and BOQ identity.
- Keep labels separate from machine identity.

### Compatibility

- Define valid and invalid option combinations.
- Explain why an invalid combination cannot be released or placed.
- Prevent incompatible options from reaching Planner.
- Keep compatibility rules versioned with the family.
- Do not silently replace an invalid choice with a default.

### Shared output

- Make one released configuration drive the 2D footprint.
- Make the same configuration drive 3D parts or model selection.
- Make the same configuration drive BOQ identity and quantities.
- Preserve the selected options through save and reload.

### Admin experience

- Provide a real form for family and option authoring.
- Preview representative valid configurations.
- Show unresolved compatibility errors before release.
- Show which family version is draft and which is released.
- Require an explicit migration choice when replacing a released version.
- Use plain language for options and compatibility rules.
- Preview matching 2D, 3D, and BOQ identity before release.

## Interface acceptance

This phase owns `ADM-FAM-01` and `ADM-FAM-02`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

## Parallel execution

- Family identity and option-form work may run together.
- Compatibility rules and 2D/3D/BOQ adapters may run together against fixtures.
- Planner may consume a released family fixture before live Admin release is ready.

## Dependencies

The core catalog identity from Phase 2 is required.

Missing 3D assets block only 3D verification.

They do not block option, 2D, or BOQ identity work.

## Done when

- Admin releases one configurable family version.
- Valid configurations can be selected.
- Invalid combinations are blocked with a reason.
- One option set produces matching 2D, 3D, and BOQ identity.
- Save and reload preserve the family version and options.
- Replacing a released version requires an explicit migration decision.

## Proof required

- Family contract tests.
- Compatibility tests for valid and invalid combinations.
- 2D, 3D, and BOQ parity tests.
- Admin browser authoring and release journey.
- Planner fixture-consumption test.
- Relevant unchecked items completed in `CHECKLIST.md`.

## Owned by later execution phases

- Price calculation.
- Price-book approval.
- Customer-facing live pricing.
- Sharing or quote handoff.
