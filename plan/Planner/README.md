# Planner track

## Outcome

Planner serves any external customer.

The customer creates a layout, receives a deterministic branded BOQ, and sends it to Oando.

## Four phases

1. `PHASE-01-start-and-boq.md` — entry, marketing, setup, conversion events, deterministic BOQ.
2. `PHASE-02-design-workspace.md` — shell, layout, catalog, SVG consumption, AI assist, 2D/3D, persistence, interface quality.
3. `PHASE-03-scale-validate-price.md` — bulk layout, validation, live pricing, named revisions, review links.
4. `PHASE-04-deliver-handoff.md` — exports, Send to Oando, handoff security, measurement events.

## Features

`FEATURES.md` maps each plan phase to code paths and known gaps.

## Status

`CHECKLIST.md` records open acceptance work and browser proof only.

## Start gate

Catalog-writing tests first satisfy Admin Step 0.

Only catalog-writing work waits.

Read-only and isolated Planner work continues.

## Blockers

| Gap | Blocks only |
|---|---|
| Live catalog blocks | Live catalog acceptance |
| Isolated fixture | — (core work continues) |
| Missing 3D assets | Affected 3D proof |
| Approved prices | Live-price proof |
| Delivery infrastructure | Live handoff proof |

## Completion

An external customer can design, validate, revise, price, export, and send the exact branded BOQ to Oando.
