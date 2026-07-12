# PHASE-04 — Workstation family authoring (contract owner)

**Parallel:** yes · **Blocks on:** 01, 02 · **Proof:** live browser + emitted JSON

---

## In plain words
"Workstations" are configurable desk systems — 2-seat linear, 4-seat L-shaped, with options for
size, finish, screens, storage. The admin needs to author a **family** of these once, release a
version, and have that single definition drive the planner's 2D symbol, 3D model, and price
list. Today there's only a raw JSON textarea — not real authoring.

## Why this matters
Workstations are the core commercial product. This phase produces the **workstation-family JSON
contract** that **Buyer P01** consumes — Buyer can build against a fixture without waiting for
this phase to fully land.

## What exists today (grounded in code)
- `admin/.../AdminCatalogEditorDrawer.tsx` — has a `workstationJson` textarea (raw, not
  authored).
- `project/catalog/workstationSystemV0.ts` — the workstation model the planner already parses.

## What "good" looks like
Author a family (seats, topology, desk sizes, finishes, options) through a real form → release a
version → it emits the family JSON → one version drives 2D/3D/BOQ consistently.

## Steps
1. Replace the raw textarea with a real authoring form for the family + its options.
2. Add version release (one released version is the source of truth).
3. Emit the workstation-family JSON contract; document its shape so Buyer P01 can build to a
   fixture.

## Done when
Boxes in `plan/Admin/CHECKLIST.md` → PHASE-04.

## How to prove
Author a 2-seat linear + 4-seat L family, release a version, confirm the emitted JSON matches
the documented contract and Buyer P01 can load it. Live run is the proof; Raw artifacts → `results/admin/phase-04/` (gitignored dump). Report → `agents-work/reports/admin-phase-04.md`.

## Guardrails
- One released version drives everything — no divergent copies.
- Version replacement requires an explicit migration choice, not a silent overwrite.

## Out of scope
Buyer P01 configurator UI — built against this contract, not in this phase.