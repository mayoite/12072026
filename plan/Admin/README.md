# Admin track

## What this track delivers

Admin is the internal inventory workspace.

It gives the Oando team one safe way to create, review, and publish products.

Published products become the inventory used by Planner customers.

## What the user can do when this track is complete

An Admin can:

1. Create a product record.
2. Enter its identity, dimensions, description, and availability.
3. Create or edit its 2D SVG symbol.
4. Preview the product before publication.
5. Publish the product to the public static catalog.
6. Confirm that Planner receives the same product and SVG.
7. Recover safely when validation or publication fails.

## Execution order

### Step 0 — test isolation

This happens before catalog-writing tests run.

It prevents tests from changing the real public catalog.

Read the first section of `CHECKLIST.md`.

### Phase 1 — authoring quality

Plan: `PHASE-01-authoring-quality.md`.

This makes product and SVG editing usable, deterministic, and safe.

### Phase 2 — catalog lifecycle, ingestion, and Planner handoff

Plan: `PHASE-02-catalog-lifecycle.md`.

This publishes trusted static inventory and proves Planner can consume it.

It also establishes catalog lifecycle and external ingestion.

### Phase 3 — configurable product families

Plan: `PHASE-03-product-families.md`.

This makes one released configuration drive 2D, 3D, and BOQ identity.

### Phase 4 — commercial governance and release

Plan: `PHASE-04-commercial-governance.md`.

This adds versioned price books, approval, retirement, rollback, and release control.

## Parallel execution

After Step 0:

- Product-form work can run with SVG-studio work.
- Server validation can run with Admin interface work.
- Planner can integrate against an isolated catalog fixture.
- Security checks run with the boundary they protect.

Two writers must not edit the same files at the same time.

## Limited blockers

- Failed test isolation blocks only catalog-writing tests.
- Missing SVG publication blocks only live SVG integration.
- Planner can continue against the agreed fixture.
- Missing external services block only their direct checks.
- Other Admin work continues.

## Primary scope

- Safe test fixtures.
- Core product records.
- SVG authoring.
- Preview and publication.
- Public static catalog output.
- External catalog ingestion.
- Planner catalog handoff.
- Configurable product families.
- Option compatibility.
- Versioned price books.
- Approval and retirement workflows.
- Admin authorization.
- Input and SVG safety.
- Publication and commercial audit.
- Fresh verification.

## Completion

The track completes only when Admin can govern a configurable, priced, approved catalog and Planner consumes the same released product safely.

The checklist records completion.

The phase plans explain the work.
