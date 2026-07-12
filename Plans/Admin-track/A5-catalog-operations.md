# A5 — Catalog operations

**Status:** OPEN — current admin lists/editors are fragmented. There is no complete catalog operating workflow.  
**Kill order (addendum):** [A5a-catalog-operations-kills.md](./A5a-catalog-operations-kills.md) — execute slices there; **this card’s acceptance is still the done bar**.

**Outcome:** A catalog manager can create, classify, search, bulk-update, archive, restore, and inspect every sellable planner item without touching code or the database.

## Functional scope

- One catalog inbox across standard, configurable, and generated assets.
- Draft, active, hidden, archived, and invalid lifecycle states.
- Category, family, SKU, dimensions, materials, preview, 2D symbol, and 3D asset completeness.
- Bulk CSV import with dry-run, row errors, and downloadable rejection file.
- Bulk export of the current filtered set.
- Duplicate detection for SKU, slug, and asset checksum.
- Archive and restore. No hard delete from routine UI.
- Saved filters for “missing preview”, “missing price”, “invalid geometry”, and “unpublished”.

## Acceptance

- [ ] One route lists standard, configurable, and generated assets in a single queue — no per-type page hop.
- [ ] **Green when** every state change (draft→active, hide, archive, restore) is rejected server-side if invalid and writes an audit row naming actor, timestamp, and before/after state.
- [ ] **Green when** a bulk CSV import either commits all rows or commits none and returns a downloadable rejection file with the exact failing row and reason — never a silent partial write.
- [ ] **Green when** an invalid row (bad SKU, missing geometry) cannot reach `active`; it lands in `invalid` and is visible in the "invalid geometry" saved filter.
- [ ] **Green when** the queue filters a 10,000-item fixture to a saved view and returns the first page within a captured, logged latency — measured, not asserted.
- [ ] Browser proof covers create, bulk-import failure with rejection file, archive, and restore round-trip.

## Data-loss & failure states

- [ ] **Green when** an interrupted bulk import (network drop mid-commit) leaves the catalog at its pre-import state — no half-imported rows.
- [ ] Empty, loading, degraded (asset service down), and permission-denied states each render a designed, buyer-legible screen — not a blank page or raw error.
- [ ] Archive is reversible; routine UI exposes no hard delete, so a mis-click cannot destroy a sellable item.

## Dependency

A4 no-code interaction patterns (per [BOARD](./BOARD.md) A4→A5 order) and the A1–A3 publish/auth foundation.

## Evidence

`results/admin/catalog-operations/`

## Not done by

Three separate CRUD pages, a successful POST alone, or a CSV parser unit test.
