# Admin checklist

This file records status only.

Read `README.md` and the phase plan before execution.

Treat every item as not done.

## Step 0 — test isolation

- [ ] Catalog-writing tests use temporary descriptors and SVG files.
- [ ] Tests never write to the canonical public catalog.
- [ ] Cleanup runs after success, failure, and timeout.
- [ ] Focused Admin tests pass twice without changing canonical hashes.
- [ ] Browser tests use normal controls without forced clicks.

## Phase 1 — authoring quality

- [ ] Core product fields are clear and validated.
- [ ] Stable product identity survives editing.
- [ ] Draft and published states are visibly different.
- [ ] SVG create, select, move, resize, edit, and delete work.
- [ ] Layers and object properties work.
- [ ] Undo and redo restore the expected state.
- [ ] Unsaved changes and exit recovery work.
- [ ] Reset restores the current published symbol.
- [ ] Preview and publication use one compiler authority.
- [ ] Product footprint remains correct in millimetres.
- [ ] Unsafe or invalid SVG input is rejected.
- [ ] Repeated valid compilation is deterministic.
- [ ] Failed compilation preserves the previous publication.
- [ ] Failure never displays a false success state.
- [ ] Focused unit, API, and browser checks pass.

## Phase 2 — catalog lifecycle, ingestion, and Planner handoff

- [ ] One versioned core product contract drives Admin and Planner.
- [ ] The contract includes identity, dimensions, availability, SVG, and BOQ identity.
- [ ] Incomplete or contradictory products cannot publish.
- [ ] Product and SVG publish as one safe operation.
- [ ] Partial publication is impossible.
- [ ] Repeated unchanged publication is idempotent.
- [ ] Public static catalog files remain the primary authority.
- [ ] A future cloud-storage seam is preserved.
- [ ] Core products support create, edit, draft, publish, and safe replacement.
- [ ] Product identity remains stable through edits.
- [ ] Draft and public versions are clearly identified.
- [ ] External catalog input has a documented format.
- [ ] Every incoming row is validated before live data changes.
- [ ] Invalid batches identify the exact row and field.
- [ ] One invalid row prevents the full batch from applying.
- [ ] Duplicate identifiers and slugs are rejected.
- [ ] Import changes are previewed before application.
- [ ] Imported records use the same core catalog contract.
- [ ] Import source, time, asset license, and provenance are recorded.
- [ ] Planner loads the published product through its catalog boundary.
- [ ] Planner renders the published SVG as the primary 2D symbol.
- [ ] `Block2D` is used only while loading or when SVG is unavailable.
- [ ] Placed product identity and dimensions match Admin output.
- [ ] BOQ identity survives placement.
- [ ] Planner has an isolated catalog fixture.
- [ ] Admin authorization is enforced server-side.
- [ ] CSRF protects state-changing browser requests.
- [ ] SVG type, size, structure, and names are validated.
- [ ] Expensive publication work is rate-limited.
- [ ] Publication records Admin, product, action, and time.
- [ ] Fresh integration and browser checks pass.

## Phase 3 — configurable product families

- [ ] Families and released versions have stable identifiers.
- [ ] Option groups and options have stable identifiers.
- [ ] Required, optional, and selection rules are explicit.
- [ ] Invalid combinations are blocked with a clear reason.
- [ ] Compatibility rules are versioned with the family.
- [ ] One released option set drives matching 2D identity.
- [ ] The same option set drives matching 3D identity.
- [ ] The same option set drives matching BOQ identity and quantities.
- [ ] Save and reload preserve family version and options.
- [ ] Admin authors and previews a family through a real form.
- [ ] Release blocks unresolved compatibility errors.
- [ ] Version replacement requires an explicit migration decision.
- [ ] Family, compatibility, parity, and browser checks pass.

## Phase 4 — commercial governance

- [ ] Price books have immutable version identifiers.
- [ ] Currency, effective dates, and status are explicit.
- [ ] Unit prices and adjustments are explicit rules.
- [ ] Missing price is shown as unavailable, never zero.
- [ ] Prior price-book versions remain reproducible.
- [ ] Priced outputs pin one price-book version.
- [ ] Author, approver, and viewer permissions are enforced server-side.
- [ ] Draft prices remain customer-invisible.
- [ ] Activation requires explicit approval.
- [ ] Failed activation preserves the previous active version.
- [ ] Products can retire without deleting history.
- [ ] Retired products disappear from new placement.
- [ ] Existing designs preserve retired product identity.
- [ ] Authorized restoration works.
- [ ] Releases identify exact catalog, family, and price versions.
- [ ] Partial release is impossible.
- [ ] Rollback restores a prior release without deleting newer history.
- [ ] Audit records actor, action, object, versions, reason, and time.
- [ ] CSRF, rate-limit, and commercial-data checks pass.
- [ ] Draft, approve, activate, retire, restore, and rollback browser journey passes.

## Completion

- [ ] An Admin publishes a valid core product without editing code.
- [ ] Admin ingests a valid external catalog batch safely.
- [ ] Admin releases a valid configurable product family.
- [ ] Admin activates a reproducible price-book version.
- [ ] Admin retires and restores a product without losing history.
- [ ] Planner consumes the same public product and SVG.
- [ ] Failed publication preserves the previous public product.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active residual failures remain in `../../Failures.md`.
