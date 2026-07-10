# P06 — Project, BOQ, and quote truth

## Buyer problem

A layout has business value only when O&O can turn it into a project discussion and quantity draft. A CRM demo store or a made-up total must never look like a live quote.

## Outcome

A saved plan can be attached to a client project and produce a traceable BOQ draft. Every line identifies the source system entity, configuration, quantity, and pricing status.

## Scope

1. Trace current CRM clients, projects, quotes, and planner-save links. Identify demo-only state.
2. Define the BOQ schema and line-item source: plan entity → system configuration → quantity → pricing basis.
3. Build a project view that links the plan and its generated BOQ draft.
4. Support reviewable export or share output only after the line-item trace is correct.
5. State whether pricing is demo, manually entered, or sourced from a real approved table.

## Evidence

`results/10072026/P06-boq-and-crm/` contains:

- one plan snapshot and its BOQ output;
- line-item trace table;
- browser proof of client → project → plan → BOQ flow;
- tests for quantity calculation and missing-price behavior;
- copy evidence showing the correct pricing label.

## Acceptance

- Every BOQ line can be traced back to one or more planner entities.
- Missing or demo pricing cannot be mistaken for an approved commercial quotation.
- The user can reopen the project and understand its plan and draft quantities.

## Non-goals

- Tax filing, invoicing, or ERP replacement.
- Multi-tenant commercial rules.
- Automatic final pricing without an approved price source.

## Handoff

P07 may assist this workflow only after the deterministic BOQ path is correct.
