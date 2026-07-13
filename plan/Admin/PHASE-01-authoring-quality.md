# Admin Phase 1 — SVG-first authoring quality

## In plain words

This phase makes the Admin product editor reliable.

It is the primary Admin phase.

SVG authoring leads the workflow.

An Admin should not need to edit JSON or source code.

The Admin should see what will be published before publication occurs.

## Why this matters

Planner depends on the dimensions, identity, and SVG created here.

Bad Admin data becomes a bad customer layout and a bad BOQ.

The publication input must therefore be understandable and deterministic.

## Starting point

The repository already contains:

- Admin SVG editor routes.
- A no-code SVG studio.
- Descriptor-based product data.
- Server-side SVG compilation.
- Existing disk SVG output that must migrate to the database-backed revision contract.

These are starting points.

None are accepted without fresh verification.

## Work

### Product authoring

- Provide clear fields for product identity, description, dimensions, and availability.
- Validate required fields before preview or publication.
- Keep stable product identity during edits.
- Show draft changes separately from published data.
- Show exact validation errors beside the failed field or action.
- Group identity, geometry, assets, availability, configuration, and commercial fields.
- Add a linked error summary without replacing field-level errors.
- Expose one truthful dirty, validation, save, and publication state.

### SVG studio

- Support create, select, move, resize, edit, and delete.
- Support layers and object properties.
- Support named undo and redo.
- Show unsaved changes.
- Warn before losing an unsaved draft.
- Restore the last published symbol when requested.
- Keep the stage visible and usable at supported Admin widths.
- Make the no-code SVG path primary.
- Move bulk JSON behind an advanced path.
- At 1280 pixels wide, give the initial stage at least 55 percent of the content area.
- Keep command, stage, layers, and contextual properties as stable regions.
- Show identity, millimetre footprint, view box, zoom, selection, validation, and revision.
- Synchronize direct manipulation and exact numeric geometry.
- Document and enforce the supported SVG feature subset.
- Support layer naming, ordering, locking, visibility, and selection.
- Keep selection and zoom stable when panels change.
- Separate rare and destructive actions from frequent actions.

### Preview and compilation

- Use the same server compiler for preview and publication.
- Preserve the product footprint in millimetres.
- Reject unsafe or invalid SVG content.
- Produce deterministic SVG bytes for the same valid input.
- Keep browser code separate from server-only compilation tools.
- Preview the exact Planner symbol and fallback state.
- Show a field and visual difference between draft and published revisions.
- Make publication one primary action.
- Name the target product, draft revision, live revision, and impact.
- Link a successful publication to the released artifact and Planner verification.

### Failure safety

- Validate before replacing published state.
- Keep the previous publication when compilation fails.
- Never display “Published” after a failed operation.
- Return an actionable error to the Admin.
- Explain the effect of reset, discard, delete, and rollback before confirmation.
- Preserve focus and the draft after recoverable errors.

### Accessibility

- Meet WCAG 2.2 AA for the author-to-publish journey.
- Complete the journey with a keyboard.
- Provide a non-drag alternative for every drag action.
- Keep focus visible and unobscured.
- Announce validation, save, publication, and error states.

## Interface acceptance

This phase owns:

- `ADM-SVG-01` through `ADM-SVG-17`.
- `ADM-SHELL-01` and `ADM-SHELL-02`.
- `ADM-STATE-01`.
- `ADM-FORM-01` through `ADM-FORM-03`.
- `ADM-PUB-01`.
- `ADM-A11Y-01` through `ADM-A11Y-04`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

## Parallel execution

- Product-form work and SVG-studio work may run together.
- Compiler tests and interface tests may run together.
- Authorization review may run with both.

## Dependencies

Catalog-writing tests require Step 0 test isolation.

Read-only code review and unit work do not wait.

## Done when

- An Admin creates and edits a core product without editing code.
- The Admin creates and previews its SVG.
- Undo, redo, dirty state, and recovery work.
- Preview and publication use one compiler authority.
- Invalid input cannot replace the current publication.
- The same valid input produces the same output.
- Focused unit, API, and browser checks pass twice from clean state.

## Proof required

- Fresh focused test commands.
- A browser journey through authoring and preview.
- Before-and-after canonical catalog hashes.
- A failed-publication test proving the previous publication survives.
- Relevant unchecked items completed in `CHECKLIST.md`.

## Owned by later execution phases

- Catalog ingestion and lifecycle are Phase 2.
- Product families and option compatibility are Phase 3.
- Price books, approval, and retirement are Phase 4.
