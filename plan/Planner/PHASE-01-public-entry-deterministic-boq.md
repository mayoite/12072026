# Planner Phase 1 — public entry and deterministic BOQ

## Outcome

A public visitor can enter Planner, start a project, and generate a deterministic branded BOQ.

The visitor reaches useful canvas content after at most one blocking choice.

Interface authority: `../../docs/architecture/06-UI-BENCHMARK.md`.

## Planner entry

- Accept entry from the public Site without hidden flags.
- Let guests start without a false account requirement.
- Explain the Planner outcome before project setup.
- Meet `UI-ENTRY-01` through `UI-ENTRY-03`.
- Offer template, scratch, and import or trace together.
- Do not show a second gate with only one available choice.
- Provide back and skip where the step is not essential.
- Protect member, Admin, and private routes.
- Emit the agreed Site conversion events without owning analytics storage.

## Progressive project setup

- Prefill project name, location, floor area, purpose, and units.
- Let the customer edit metadata after entering the workspace.
- Do not block exploration on optional customer or project fields.
- Ask only for geometry required by the chosen starting mode.
- Let templates provide valid starting geometry.
- Let scratch mode use explicit dimensions or an honest editable default.
- Let import or trace accept the documented plan formats.
- Capture doors, windows, columns, and keep-out zones in the editor.
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

- 2026-07-13: Public Planner entry links and guest/member route shell verified with focused unit/integration tests, exit 0, 21 tests.
- 2026-07-13: Branded unpriced BOQ verified with focused unit/integration tests, exit 0, 14 tests.
- Public-to-Planner guest entry browser journey.
- Entry-step count at desktop and phone viewports.
- Template, scratch, and import or trace browser checks.
- Skip, back, and later metadata-edit checks.
- Project and room persistence checks.
- Deterministic BOQ repeatability and hash tests.
- Unsupported-item exclusion tests.
- Conversion event contract tests.
- Guest and protected-route checks.

## Done when

- A public visitor reaches useful canvas content after at most one blocking choice.
- Template, scratch, and import or trace are honest starting paths.
- Optional metadata never blocks initial exploration.
- Identical project inputs produce the same BOQ and hash.
- The branded unpriced BOQ is usable.
- Planner emits the agreed customer-journey events without private data.
