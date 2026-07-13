# Admin Phase 2 — catalog lifecycle, ingestion, and Planner handoff

## In plain words

This phase turns valid Admin products and approved external records into trusted public inventory.

It then proves that Planner receives the same identity, dimensions, availability, and SVG.

## Why this matters

Admin and Planner cannot maintain separate versions of a product.

The published catalog is their shared contract.

Primary delivery uses public static data and assets.

Cloud catalog storage comes later.

## Starting point

The repository already contains:

- Product descriptors.
- Public SVG catalog files.
- Admin publication routes.
- Planner catalog loaders.
- Planner SVG rendering with a `Block2D` fallback.

These paths require fresh integration verification.

## Work

### Core catalog contract

- Define one versioned record for a published product.
- Include stable identity, name, dimensions, availability, SVG location, and BOQ identity.
- Reject incomplete or contradictory records.
- Keep published output deterministic.
- Keep a clear future seam for cloud or object storage.

### Catalog lifecycle

- Support create, edit, draft, publish, and replace for core products.
- Keep stable identity when product details change.
- Show the current public version and the current Admin draft.
- Prevent edits from silently changing an already released product.
- Preserve prior public data when a replacement fails.

Advanced approval and retirement control is completed in Phase 4.

### External catalog ingestion

- Accept a documented external catalog input format.
- Validate every incoming row before changing live data.
- Report the exact row and field that failed.
- Prevent partial batch imports.
- Detect duplicate identifiers and slugs.
- Map accepted records into the same core catalog contract.
- Preview import changes before applying them.
- Record the source and time of the import.
- Keep imported assets subject to the same license and provenance rules.
- Keep bulk SVG JSON behind an advanced path.
- Preview additions, changes, conflicts, and rejected records before applying.

### Publication

- Publish the product record and SVG as one safe operation.
- Prevent partial publication.
- Preserve the previous product when any write fails.
- Make repeated publication of unchanged input idempotent.
- Record the Admin, product, action, and time.

### Planner handoff

- Load the published product through Planner’s catalog boundary.
- Render the published SVG as the primary 2D symbol.
- Use `Block2D` only while loading or when SVG is unavailable.
- Preserve identity and dimensions when the product is placed.
- Preserve the same identity for later BOQ generation.
- Keep an isolated fixture so Planner work does not wait for live Admin publication.

### Admin interface

- Show whether the current draft differs from the public product.
- Show preview, publication progress, success, and failure clearly.
- Make the published result easy to inspect.
- Keep keyboard access and visible focus for every action.
- Show the data source and read-only or editable state before a write starts.
- Support search, multiple filters, sorting, paging, and saved views.
- Expose identity, SKU, family, dimensions, lifecycle, availability, symbol state, and last change.
- Give every row action a visible or unambiguous accessible name.
- Group family variants for comparison.
- Support previewed bulk edit, validation, publication, retirement, and recovery.
- Report the exact record and field for batch failures.
- Use a deliberate phone review layout instead of a flattened desktop table.
- Declare unavailable phone authoring tools before work starts.

## Interface acceptance

This phase owns:

- `ADM-SVG-18`.
- `ADM-STATE-02`.
- `ADM-LIST-01` through `ADM-LIST-04`.
- `ADM-BULK-01` and `ADM-BULK-02`.
- `ADM-PUB-03`.
- `ADM-MOB-01` through `ADM-MOB-03`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

### Security

- Enforce Admin authorization on page and API boundaries.
- Protect state-changing browser requests from CSRF.
- Validate SVG type, size, structure, and names.
- Rate-limit expensive publication work.
- Keep secrets and private paths out of client output.

## Parallel execution

- Catalog-contract work may run with Admin publication UI work.
- Ingestion validation may run with publication work.
- Planner fixture integration may run before the live publication path is ready.
- Security checks run beside the boundary they protect.

## Limited blockers

- Phase 1 compilation blocks only publication of real SVG output.
- A missing live catalog does not block Planner fixture work.
- A missing external environment blocks only its direct runtime check.
- Other work continues.

## Done when

- One core product record is published with its SVG.
- One valid external batch enters the same catalog contract.
- One invalid batch leaves the catalog unchanged.
- No partial publication is possible.
- Repeating unchanged publication produces the same result.
- Planner loads the published product.
- Planner renders the published SVG first.
- Placed product identity remains available for BOQ.
- Failed publication preserves the previous public product.
- Authorization, CSRF, validation, and browser checks pass.

## Proof required

- Fresh contract and publication tests.
- Fresh valid and invalid ingestion tests.
- Fresh Planner catalog integration test.
- Fresh Admin browser publication journey.
- On-disk comparison of the public product and SVG.
- Focused authorization and malicious-SVG checks.
- Relevant unchecked items completed in `CHECKLIST.md`.

## Owned by later execution phases

- Product families and option compatibility are Phase 3.
- Price books, approval, and retirement are Phase 4.
- Cloud catalog migration is not required for primary delivery.
