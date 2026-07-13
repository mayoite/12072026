# Admin checklist

This file records status only.

Read `README.md` and the phase plan before execution.

Treat every item as not done.

## Step 0 — test isolation

Fresh verification on 2026-07-13 isolated both Admin SVG publication browser specs.

The focused sequential run passed two tests.

Canonical descriptor and SVG hashes were identical before and after.

- [x] Catalog-writing tests use temporary descriptors and SVG files.
- [x] Tests never write to the canonical public catalog.
- [x] Cleanup runs after success, failure, and timeout.
- [x] Focused Admin tests pass twice without changing canonical hashes.
- [x] Browser tests use normal controls without forced clicks.

## Phase 1 — authoring quality

Implementation is in progress.

- The editor now tracks all form and studio changes as one dirty state.
- Invalid or pending preview state blocks publication.
- Publication names the target and impact before execution.
- Successful publication links the artifact and Planner.
- Stage status exposes identity, footprint, view box, zoom, selection, draft, validation, revision, and layer count.
- Layer renaming and explained deletion are available without dragging.
- Validation has a linked summary and field-level messages.
- Fresh verification 2026-07-13: `pnpm --filter oando-site exec vitest run tests/unit/admin/svg-editor/AdminSvgEditorEditView.test.tsx tests/unit/admin/svg-editor/svgEditorDraftState.test.ts tests/unit/admin/svg-editor/authoringLifecycle.test.ts` exited 0 with 14 tests passing.
- Live code: `authoringLifecycle.ts` + `AdminSvgEditorEditView.tsx` (commits `36ff03d6`, `970a927d`) + stage status strip (`ADM-SVG-06`).
- Browser journey for authoring UI not re-run this session.

- [ ] Core product fields are clear and validated.
- [ ] Stable product identity survives editing.
- [x] Draft and published states are visibly different.
- [ ] SVG create, select, move, resize, edit, and delete work.
- [ ] Layers and object properties work.
- [ ] Undo and redo restore the expected state.
- [x] Unsaved changes and exit recovery work.
- [x] Reset restores the current published symbol.
- [ ] Preview and publication use one compiler authority.
- [ ] Product footprint remains correct in millimetres.
- [ ] Unsafe or invalid SVG input is rejected.
- [ ] Repeated valid compilation is deterministic.
- [ ] Failed compilation preserves the previous publication.
- [x] Failure never displays a false success state.
- [ ] Focused unit, API, and browser checks pass.

### SVG-first interface acceptance

- [ ] `ADM-SVG-01` No-code SVG authoring is the primary Admin journey.
- [ ] `ADM-SVG-02` SVG inventory exposes finding, identity, preview, state, validation, and last change.
- [ ] `ADM-SVG-03` Bulk JSON is an advanced path.
- [ ] `ADM-SVG-04` The stage receives at least 55 percent of the 1280-pixel content area.
- [ ] `ADM-SVG-05` Command, stage, layer, and property regions remain stable.
- [x] `ADM-SVG-06` Identity, footprint, view box, zoom, selection, draft, validation, and revision are visible.
- [ ] `ADM-SVG-07` Direct manipulation and numeric geometry remain synchronized.
- [ ] `ADM-SVG-08` The supported SVG feature subset is documented and enforced.
- [ ] `ADM-SVG-09` Layer selection, ordering, lock, visibility, and state work.
- [ ] `ADM-SVG-10` Named undo and redo preserve a valid document.
- [ ] `ADM-SVG-11` Reset, discard, delete, and rollback explain impact.
- [ ] `ADM-SVG-12` Preview and publication share one compiler authority.
- [ ] `ADM-SVG-13` Preview matches the Planner symbol, footprint, identity, validation, and fallback.
- [x] `ADM-SVG-14` Draft and published revisions have a field and visual diff.
- [ ] `ADM-SVG-15` One primary publish action names its target and versions.
- [ ] `ADM-SVG-16` Failure preserves the live artifact and never reports false success.
- [ ] `ADM-SVG-17` Success links to the released artifact and Planner verification.
- [ ] `ADM-SHELL-01` Each page exposes title, scope, source, state, and one primary action.
- [ ] `ADM-SHELL-02` Secondary and destructive actions do not compete with the primary action.
- [x] `ADM-STATE-01` One authoritative state covers the full authoring lifecycle.
- [ ] `ADM-FORM-01` Forms group fields by operator task.
- [x] `ADM-FORM-02` Field errors and a linked error summary work.
- [ ] `ADM-FORM-03` Dirty, save, discard, and recovery states are truthful.
- [x] `ADM-PUB-01` Errors block publication and warnings remain visible.
- [ ] `ADM-A11Y-01` The primary Admin journey meets WCAG 2.2 AA.
- [ ] `ADM-A11Y-02` SVG authoring through publication is keyboard-completable.
- [ ] `ADM-A11Y-03` Every drag action has a non-drag alternative.
- [ ] `ADM-A11Y-04` Focus and dynamic state announcements pass fresh checks.

## Phase 2 — catalog lifecycle, ingestion, and Planner handoff

Fresh unit evidence 2026-07-13:

- Contract: `pnpm --filter oando-site exec vitest run tests/unit/shared/catalog/releasedCatalogProductContract.test.ts` (7 pass).
- Publish gate + fail-closed pipeline: `pnpm --filter oando-site exec vitest run tests/unit/admin/svg-editor/releasedCatalogPublishGate.test.ts tests/unit/admin/svg-editor/publishDescriptorWithPipeline.test.ts` (16 pass; pipeline 13/13 including persist-after-pipeline rollback).
- Commits: `07b8cbe1` (contract), `0a0fc3b2` (publish gate), `504c5446` (checklist evidence).
- **Still open / not claimed:** Products DB SVG authority (`DB-SVG-*`), true database-transaction publish, Planner live SVG import API, bulk ingestion browser journey. Disk pipeline fail-closed is not full DB-SVG publication.

- [x] One versioned core product contract drives Admin and Planner.
- [x] The contract includes identity, dimensions, availability, SVG, and BOQ identity.
- [x] Incomplete or contradictory products cannot publish.
- [x] Product and SVG publish as one safe operation.
- [x] Partial publication is impossible.
- [ ] Repeated unchanged publication is idempotent.
- [ ] `DB-SVG-01` The Products database is the released SVG revision and pointer authority.
- [ ] `DB-SVG-02` Block definitions and drafts are private and version-locked.
- [ ] `DB-SVG-03` Published SVG revisions are immutable.
- [ ] `DB-SVG-04` Revisions and artifact records match the pinned contracts.
- [ ] `DB-SVG-05` Each released product points to one same-product SVG revision.
- [ ] `DB-SVG-06` Artifact upload, revision metadata, product pointer, and audit activate safely.
- [ ] `DB-SVG-07` Failed publication leaves the prior pointer live.
- [ ] `DB-SVG-08` Unchanged publication is idempotent.
- [ ] `DB-SVG-09` Stale draft versions are rejected without data loss.
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

### Catalog interface acceptance

- [ ] `ADM-SVG-18` SVG import previews every change and applies atomically.
- [ ] `ADM-STATE-02` Data-source editability is clear before a write.
- [ ] `ADM-LIST-01` Search, multi-filter, sort, paging, and saved views work.
- [ ] `ADM-LIST-02` Rows expose the required inventory and symbol data.
- [ ] `ADM-LIST-03` Row actions have clear visible or accessible names.
- [ ] `ADM-LIST-04` Family variants are grouped and comparable.
- [ ] `ADM-BULK-01` Previewed bulk edit, validation, publication, retirement, and recovery work.
- [ ] `ADM-BULK-02` Batch work is atomic and reports exact record and field errors.
- [ ] `ADM-PUB-03` Partial publication or release is impossible.
- [ ] `DB-SVG-17` Disk migration dry-runs every change, conflict, reject, footprint, and hash.
- [ ] `DB-SVG-18` Database and approved source parity passes before cutover.
- [ ] `DB-SVG-20` Database tests use isolated rows and never mutate releases.
- [ ] `ADM-MOB-01` Phone review works without page-level horizontal scrolling.
- [ ] `ADM-MOB-02` Unsupported phone authoring is declared before work begins.
- [ ] `ADM-MOB-03` Phone records use a deliberate compact layout.

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

### Family interface acceptance

- [ ] `ADM-FAM-01` Options and compatibility use plain language and precise errors.
- [ ] `ADM-FAM-02` One configuration previews matching 2D, 3D, and BOQ identity.

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

### Commercial interface acceptance

- [ ] `ADM-PUB-02` Release shows exact versions and impact before confirmation.
- [ ] `ADM-PRICE-01` Prices are formatted as currency.
- [ ] `ADM-PRICE-02` Commercial lifecycle states are visually distinct.
- [ ] `ADM-PRICE-03` High-risk actions show role, reason, version, impact, and confirmation.
- [ ] `ADM-ROLE-01` Server roles are enforced and unavailable actions are explained safely.
- [ ] `ADM-AUDIT-01` History shows actor, action, object, versions, reason, time, and result.

## Completion

- [ ] An Admin publishes a valid core product without editing code.
- [ ] Admin ingests a valid external catalog batch safely.
- [ ] Admin releases a valid configurable product family.
- [ ] Admin activates a reproducible price-book version.
- [ ] Admin retires and restores a product without losing history.
- [ ] Planner consumes the same released database product, SVG revision, and artifact.
- [ ] Failed publication preserves the previous public product.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active residual failures remain in `../../Failures.md`.
