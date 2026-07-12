# PHASE-05 — Pricing / BOQ governance (contract owner)

**Parallel:** yes · **Blocks on:** — (independent — start anytime) · **Proof:** live + emitted JSON

---

## In plain words
A "BOQ" (bill of quantities) is the priced list a buyer gets — every item, its quantity, its
price, a total. For that to exist, the admin needs a **price book**: what each catalog item and
option costs, versioned so old quotes stay reproducible. Today there's no pricing model at all.

## Why this matters
This is what unblocks the planner's priced export (P15) — a buyer can't get a quote without it.
It's independent of the SVG/authoring work, so it can run fully in parallel from day one.

## What exists today (grounded in code)
- Nothing yet — no price-book model or migration. This phase creates it.
- Admin DB migrations live under `platform/supabase/migrations.admin/`.

## What "good" looks like
A price book with versioning → each item/option has a price → it emits a **price-book JSON
contract** → the planner's BOQ reads it and produces a correct priced list.

## Steps
1. Design a price-book model (item/option → price) with a migration.
2. Add versioning so a released price book is reproducible.
3. Emit the price-book JSON contract; document its shape so Planner BOQ builds to a fixture.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-05.

## How to prove
Create a price book, price a few items, release a version, confirm the emitted JSON matches the
contract and the planner BOQ computes a correct total against it. Live run is the proof;
Raw artifacts → `results/admin/phase-05/` (gitignored dump). Report → `agents-work/reports/admin-phase-05.md`.

## Guardrails
- Prices are versioned — a released book is immutable so old quotes reproduce.
- Contract-first: Planner P15 builds to a fixture; don't couple the two into a blocking chain.

## Out of scope
The planner's BOQ export UI (Planner P15) and quote-cart/ERP integration.
