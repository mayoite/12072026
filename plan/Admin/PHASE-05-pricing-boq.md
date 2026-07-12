# PHASE-05 — Pricing / BOQ governance (contract owner)

**Parallel:** yes · **Blocks on:** — (independent — start anytime) · **Proof:** live + emitted JSON

---

## In plain words
A "BOQ" (bill of quantities) is the priced list a buyer gets — every item, its quantity, its
price, a total. For that to exist, the admin needs a **price book**: what each catalog item and
option costs, versioned so old quotes stay reproducible. Today there's no pricing model at all.

## Why this matters
This unblocks **Buyer P04** priced export — a buyer can't get a quote without it. Independent of
SVG/authoring work; runs fully in parallel from day one.

## Functional scope

- Price book versions with effective dates and currency.
- Component, material, finish, size, and quantity-break adjustments.
- Tax, freight, installation, and discount policy hooks.
- BOM line mapping from workstation options.
- Draft calculation preview against representative projects.
- Approval before activation. Past quotes keep their original price-book version.
- Clear "price unavailable" failure. Never silently emit zero.

## What exists today (grounded in code)
- Nothing yet — no price-book model or migration. This phase creates it.
- Admin DB migrations live under `platform/supabase/migrations.admin/`.

## PASS gates

- Admin prices one workstation family end to end without editing planner code.
- Each BOQ line shows quantity × unit price × adjustment breakdown — not just a total.
- Activating a new price-book version leaves every previously saved quote total byte-identical.
- Author, approver, and viewer permissions enforced server-side.
- Component with no applicable price rule surfaces "price unavailable" — never a silent zero.
- Failed activation leaves prior active price book untouched.
- Rollback records audit event; rolled-back version remains on disk.
- Browser proof covers draft, approve, activate, and rollback.

## Steps
1. Design a price-book model (item/option → price) with a migration.
2. Add versioning so a released price book is reproducible.
3. Emit the price-book JSON contract; document its shape so Buyer P04 builds to a fixture.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-05.

## How to prove
Create a price book, price a few items, release a version, confirm the emitted JSON matches the
contract and Buyer P04 computes a correct total against it. Live run is the proof;
Raw artifacts → `results/admin/phase-05/` (gitignored dump). Report → `agents-work/reports/admin-phase-05.md`.

## Guardrails
- Prices are versioned — a released book is immutable so old quotes reproduce.
- Contract-first: Buyer P04 builds to a fixture; don't couple the two into a blocking chain.

## Out of scope
Buyer P04 export UI and quote-cart/ERP integration.