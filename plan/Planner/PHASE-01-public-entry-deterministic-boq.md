# Planner Phase 1 — public entry and deterministic BOQ

## Outcome

A public visitor can enter Planner, start a project, and generate a deterministic branded BOQ.

## Planner entry

- Accept entry from the public Site without hidden flags.
- Let guests start without a false account requirement.
- Explain the Planner outcome before project setup.
- Protect member, Admin, and private routes.
- Emit the agreed Site conversion events without owning analytics storage.

## Project setup

- Capture project name, customer, location, seat need, work mode, and units.
- Capture room dimensions, doors, windows, columns, and keep-out zones.
- Keep millimetres as document authority.
- Give every room object a stable identifier.
- Preserve the project brief and room through reload.
- Support keyboard completion and visible focus.

## Deterministic BOQ

- Build one BOQ calculation authority in this phase.
- Read canonical product-backed placements.
- Use an isolated product-backed fixture where live catalog data is unavailable.
- Group lines by stable product, family version, options, and commercial identity.
- Include description, options, quantity, units, and source object identifiers.
- Exclude unsupported or unbranded objects with a visible reason.
- Produce identical lines and ordering from identical inputs.
- Produce a stable calculation hash.
- Keep output formatting separate from calculation.
- Generate an unpriced branded BOQ without waiting for live pricing.

## Parallel work

- Planner entry and project setup can run together.
- BOQ calculation can run against an isolated fixture.
- Site event integration can run against the agreed event contract.

## Limited blockers

- Missing live Admin catalog blocks only live-catalog proof.
- Missing approved prices does not block the unpriced deterministic BOQ.
- Missing analytics infrastructure does not block Planner event emission checks.

## Required proof

- Public-to-Planner guest entry browser journey.
- Project and room persistence checks.
- Deterministic BOQ repeatability and hash tests.
- Unsupported-item exclusion tests.
- Conversion event contract tests.
- Guest and protected-route checks.

## Done when

- A public visitor starts a valid Planner project.
- Identical project inputs produce the same BOQ and hash.
- The branded unpriced BOQ is usable.
- Planner emits the agreed customer-journey events without private data.
