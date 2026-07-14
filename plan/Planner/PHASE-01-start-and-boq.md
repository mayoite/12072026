# Planner Phase 1 — start and BOQ

## Outcome

Public visitors enter Planner, start a project, and get a deterministic branded BOQ after at most one blocking choice.

## Entry and marketing

- Site entry without hidden flags; guests need no account.
- State Planner outcome before setup.
- Marketing landing, feature hub, feature detail pages, and help explain the journey.
- Onboarding coach for catalog, tools, templates, 3D, and AI.
- Guest route supports optional `?id=` plan load.
- Session dialog and workspace error boundary for guest vs member.
- Offer template, scratch, and import or trace together — one setup gate, never a second gate with one choice only.
- Remove or wire dead `StartingPointStep.tsx`.
- Back and skip on non-essential steps.
- Protect member, Admin, and private routes.
- Emit full Site conversion contract: `PLANNER_ENTRY`, `PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED` (no private geometry).

## Project setup

- Prefill name, location, floor area, purpose, units; editable after workspace entry.
- Optional fields must not block exploration.
- Geometry only as required by the starting mode.
- Templates, scratch, and import/trace use documented formats (`ProjectSetupStep.tsx`).
- Doors, windows, columns, keep-outs in editor; mm authority; stable room IDs.
- Brief and room survive reload; keyboard-complete with visible focus.

## Deterministic BOQ

- One calculation authority across workspace and exports (`projectFurnitureBoq`; retire or unify `workstationBoqV0`, `buildBoq`).
- Product-backed placements only; isolated fixture when live catalog unavailable.
- Group by stable product, family version, options, commercial identity.
- Lines include description, options, qty, units, source object IDs.
- Exclude unsupported/unbranded items with visible reason.
- Identical inputs → identical lines, order, and hash.
- Unpriced branded BOQ without live pricing; formatting separate from calculation.

## Blockers

| Gap | Blocks only |
|---|---|
| Live Admin catalog | Live-catalog proof |
| Approved prices | Live pricing (not unpriced BOQ) |
| Analytics infra | End-to-end event receipt (not emission checks) |
