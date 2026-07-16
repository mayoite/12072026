# Admin Phases 1–2 — authoring and catalog lifecycle

## Phase 1 — Excalidraw-first authoring quality

### In plain words

This phase makes the Admin product editor reliable.

It is the primary Admin phase.

Excalidraw leads the visual authoring workflow; the server compiler and publish pipeline own released SVG bytes.

An Admin should not need to edit JSON or source code.

The Admin should see what will be published before publication occurs.

### Why this matters

Planner depends on the dimensions, identity, and SVG created here.

Bad Admin data becomes a bad customer layout and a bad BOQ.

The publication input must therefore be understandable and deterministic.

### Starting point

The repository already contains:

- Admin SVG editor routes.
- An Excalidraw-embedded visual studio (`ExcalidrawClient.tsx` in `AdminSvgEditorShell.tsx`).
- Descriptor-based product data with optional `excalidrawElements` and Excalidraw-exported SVG bytes.
- Server-side SVG compilation and validation (`sharedCompilerAuthority.ts`, `svgArtifactCompiler.server.ts`).
- A legacy `SvgSceneDocument` bridge for older descriptors (`sceneFromDescriptor`, `sceneParts`).
- Existing disk SVG output that must migrate to the database-backed revision contract.

These are starting points.

None are accepted without fresh verification.

Do not add SVG.js, SVG-Edit, or a second manual SVG engine.

### Work

#### Product authoring

- Provide clear fields for product identity, description, dimensions, and availability.
- Validate required fields before preview or publication.
- Keep stable product identity during edits.
- Show draft changes separately from published data.
- Show exact validation errors beside the failed field or action.
- Group identity, geometry, assets, availability, configuration, and commercial fields.
- Add a linked error summary without replacing field-level errors.
- Expose one truthful dirty, validation, save, and publication state.

#### Excalidraw visual studio

- Embed Excalidraw as the sole manual authoring surface; the Admin host wraps it, not the other way around.
- On edit, load persisted `excalidrawElements` when present; otherwise seed from the published SVG artifact.
- Export SVG on change through Excalidraw `exportToSvg`; treat that export as the draft geometry input to compile and publish.
- Persist both `excalidrawElements` and the latest exported SVG bytes with the descriptor draft.
- Support select, move, resize, edit, delete, undo, redo, and zoom through Excalidraw.
- Show unsaved changes.
- Warn before losing an unsaved draft.
- Restore the last published symbol when requested.
- Keep the stage visible and usable at supported Admin widths.
- Make the Excalidraw path primary.
- Move bulk JSON and legacy `sceneParts` editing behind an advanced or migration-only path.
- At 1280 pixels wide, give the initial stage at least 55 percent of the content area.
- Keep command rail, Excalidraw stage, dimension panel, and contextual properties as stable regions.
- Show identity, millimetre footprint, view box, zoom, selection, validation, and revision.
- Synchronize direct manipulation and exact numeric geometry through `DimensionPanel`, `DimensionLabels`, and `elementFactory`.
- Apply real-world grid snapping (`gridSnapping.ts`) with metric or imperial unit display.
- Reject unsafe or unsupported publish input in the server compiler even when Excalidraw allows broader drawing tools.
- Keep selection and zoom stable when panels change.
- Separate rare and destructive actions from frequent actions.

#### Preview and compilation

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

#### Failure safety

- Validate before replacing published state.
- Keep the previous publication when compilation fails.
- Never display “Published” after a failed operation.
- Return an actionable error to the Admin.
- Explain the effect of reset, discard, delete, and rollback before confirmation.
- Preserve focus and the draft after recoverable errors.

#### Accessibility

- Meet WCAG 2.2 AA for the author-to-publish journey.
- Complete the journey with a keyboard.
- Provide a non-drag alternative for every drag action.
- Keep focus visible and unobscured.
- Announce validation, save, publication, and error states.

### Phase 1 interface acceptance

- `ADM-SVG-01` through `ADM-SVG-17`.
- `ADM-SHELL-01` and `ADM-SHELL-02`.
- `ADM-STATE-01`.
- `ADM-FORM-01` through `ADM-FORM-03`.
- `ADM-PUB-01`.
- `ADM-A11Y-01` through `ADM-A11Y-04`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

### Phase 1 parallel execution

- Product-form work and Excalidraw-studio work may run together.
- Compiler tests and interface tests may run together.
- Authorization review may run with both.

### Phase 1 dependencies

Catalog-writing tests require Step 0 test isolation.

Read-only code review and unit work do not wait.

### Phase 1 done when

- An Admin creates and edits a core product without editing code.
- The Admin draws in Excalidraw and previews the exported SVG.
- Undo, redo, dirty state, and recovery work.
- Preview and publication use one compiler authority.
- Invalid input cannot replace the current publication.
- The same valid input produces the same output.
- Focused unit, API, and browser checks pass twice from clean state.

### Phase 1 proof required

- Fresh focused test commands.
- A browser journey through authoring and preview.
- Before-and-after canonical catalog hashes.
- A failed-publication test proving the previous publication survives.
- Relevant unchecked items completed in `CHECKLIST.md`.

---

## Phase 2 — catalog lifecycle, ingestion, and Planner handoff

### In plain words

This phase turns valid Admin products and approved external records into trusted public inventory.

It then proves that Planner receives the same identity, dimensions, availability, and SVG.

### Why this matters

Admin and Planner cannot maintain separate versions of a product.

The published catalog is their shared contract.

Primary delivery uses released Products database records.

SVG revision and artifact metadata live in that database.

Sanitized artifacts use immutable content-addressed storage keys.

Static files are migration inputs or isolated fixtures only.

### Starting point

The repository already contains:

- Product descriptors.
- Existing disk SVG catalog files that require migration.
- An existing Products database catalog table.
- Admin publication routes.
- Planner catalog loaders.
- Planner SVG rendering with a `Block2D` fallback.

These paths require fresh integration verification.

The target data contract is `../../docs/architecture/08-DATABASE-SVG-CONTRACT.md`.

The detailed database execution plan is `../../Plans/02-recovery/phases/06-database.md`.

### Work

#### Core catalog contract

- Define one versioned record for a published product.
- Include stable identity, name, dimensions, availability, SVG location, and BOQ identity.
- Reject incomplete or contradictory records.
- Keep published output deterministic.
- Use `PublishedRevisionV1` and `SvgArtifactRecord` as the live contract basis.
- Use Drizzle for catalog persistence.
- Do not add a new Supabase `.from()` catalog path.

#### Catalog lifecycle

- Support create, edit, draft, publish, and replace for core products.
- Keep stable identity when product details change.
- Show the current public version and the current Admin draft.
- Prevent edits from silently changing an already released product.
- Preserve prior public data when a replacement fails.

Advanced approval and retirement control is completed in Phase 4.

#### External catalog ingestion

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

#### Publication

- Upload immutable artifacts before activation.
- Insert revision and artifact metadata, point the product, and write audit in one transaction.
- Prevent partial publication.
- Preserve the previous product when any write fails.
- Make repeated publication of unchanged input idempotent.
- Record the Admin, product, action, and time.

#### Planner handoff

- Load the released product through Planner’s server catalog boundary.
- Import the exact SVG by committed revision and artifact storage key.
- Render the published SVG as the primary 2D symbol.
- Use `Block2D` only while loading or when SVG is unavailable.
- Preserve identity and dimensions when the product is placed.
- Preserve the same identity for later BOQ generation.
- Keep an isolated fixture so Planner work does not wait for live Admin publication.

#### Admin interface

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

### Phase 2 interface acceptance

- `ADM-SVG-18`.
- `ADM-STATE-02`.
- `ADM-LIST-01` through `ADM-LIST-04`.
- `ADM-BULK-01` and `ADM-BULK-02`.
- `ADM-PUB-03`.
- `ADM-MOB-01` through `ADM-MOB-03`.

The exact requirements are in `../../docs/architecture/07-ADMIN-UI-BENCHMARK.md`.

#### Security

- Enforce Admin authorization on page and API boundaries.
- Protect state-changing browser requests from CSRF.
- Validate SVG type, size, structure, and names.
- Rate-limit expensive publication work.
- Keep secrets and private paths out of client output.

### Phase 2 parallel execution

- Catalog-contract work may run with Admin publication UI work.
- Ingestion validation may run with publication work.
- Planner fixture integration may run before the live publication path is ready.
- Security checks run beside the boundary they protect.

### Phase 2 limited blockers

- Phase 1 compilation blocks only publication of real SVG output.
- A missing live catalog does not block Planner fixture work.
- A missing external environment blocks only its direct runtime check.
- Other work continues.

### Phase 2 done when

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

### Phase 2 proof required

- Fresh contract and publication tests.
- Fresh valid and invalid ingestion tests.
- Fresh Planner catalog integration test.
- Fresh Admin browser publication journey.
- Database row, artifact key, SVG bytes, checksum, footprint, and Planner-import comparison.
- Focused authorization and malicious-SVG checks.
- Relevant unchecked items completed in `CHECKLIST.md`.
