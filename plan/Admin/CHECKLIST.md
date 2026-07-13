# Admin checklist

This file records status only.

Read `README.md` and the phase plan before execution.

## Step 0 — test isolation

- [x] Catalog-writing tests use temporary descriptors and SVG files.
- [x] Tests never write to the canonical public catalog.
- [x] Cleanup runs after success, failure, and timeout.
- [x] Focused Admin tests pass twice without changing canonical hashes.
- [x] Browser tests use normal controls without forced clicks.

## Phase 1 — authoring quality

Unit gate: `pnpm --filter oando-site exec vitest run tests/unit/admin/svg-editor/` (208 tests, exit 0 on 2026-07-13).

- [x] Core product fields are clear and validated.
- [x] Stable product identity survives editing.
- [x] Draft and published states are visibly different.
- [x] SVG create, select, move, resize, edit, and delete work.
- [x] Layers and object properties work.
- [x] Undo and redo restore the expected state.
- [x] Unsaved changes and exit recovery work.
- [x] Reset restores the current published symbol.
- [x] Preview and publication use one compiler authority.
- [x] Product footprint remains correct in millimetres.
- [x] Unsafe or invalid SVG input is rejected.
- [x] Repeated valid compilation is deterministic.
- [x] Failed compilation preserves the previous publication.
- [x] Failure never displays a false success state.
- [ ] Focused unit, API, and **browser** checks pass (browser residual).

### SVG-first interface acceptance

- [x] `ADM-SVG-01` through `ADM-SVG-17` (except browser-only residual).
- [x] `ADM-SVG-01` No-code SVG authoring is the primary Admin journey.
- [x] `ADM-SVG-02` SVG inventory exposes finding, identity, preview, state, validation, and last change.
- [x] `ADM-SVG-03` Bulk JSON is an advanced path.
- [x] `ADM-SVG-04` The stage receives at least 55 percent of the 1280-pixel content area.
- [x] `ADM-SVG-05` Command, stage, layer, and property regions remain stable.
- [x] `ADM-SVG-06` Identity, footprint, view box, zoom, selection, draft, validation, and revision are visible.
- [x] `ADM-SVG-07` Direct manipulation and numeric geometry remain synchronized.
- [x] `ADM-SVG-08` The supported SVG feature subset is documented and enforced.
- [x] `ADM-SVG-09` Layer selection, ordering, lock, visibility, and state work.
- [x] `ADM-SVG-10` Named undo and redo preserve a valid document.
- [x] `ADM-SVG-11` Reset, discard, delete, and rollback explain impact.
- [x] `ADM-SVG-12` Preview and publication share one compiler authority.
- [x] `ADM-SVG-13` Preview matches the Planner symbol, footprint, identity, validation, and fallback.
- [x] `ADM-SVG-14` Draft and published revisions have a field and visual diff.
- [x] `ADM-SVG-15` One primary publish action names its target and versions.
- [x] `ADM-SVG-16` Failure preserves the live artifact and never reports false success.
- [x] `ADM-SVG-17` Success links to the released artifact and Planner verification.
- [x] `ADM-SHELL-01` Each page exposes title, scope, source, state, and one primary action.
- [x] `ADM-SHELL-02` Secondary and destructive actions do not compete with the primary action.
- [x] `ADM-STATE-01` One authoritative state covers the full authoring lifecycle.
- [x] `ADM-FORM-01` Forms group fields by operator task.
- [x] `ADM-FORM-02` Field errors and a linked error summary work.
- [x] `ADM-FORM-03` Dirty, save, discard, and recovery states are truthful.
- [x] `ADM-PUB-01` Errors block publication and warnings remain visible.
- [x] `ADM-A11Y-01` The primary Admin journey meets WCAG 2.2 AA (**browser axe** on svg-list, svg-edit, price-books — run `2026-07-13T-admin-phases-final`).
- [x] `ADM-A11Y-02` SVG authoring through publication is keyboard-completable.
- [x] `ADM-A11Y-03` Every drag action has a non-drag alternative.
- [x] `ADM-A11Y-04` Focus and dynamic state announcements pass fresh checks.

## Phase 2 — catalog lifecycle, ingestion, and Planner handoff

- [x] One versioned core product contract drives Admin and Planner.
- [x] The contract includes identity, dimensions, availability, SVG, and BOQ identity.
- [x] Incomplete or contradictory products cannot publish.
- [x] Product and SVG publish as one safe operation (**disk path**).
- [x] Partial publication is impossible (**disk path**).
- [x] Repeated unchanged publication is idempotent (**disk path**).
- [ ] `DB-SVG-01` The Products database is the released SVG revision and pointer authority.
- [ ] `DB-SVG-02` Block definitions and drafts are private and version-locked.
- [ ] `DB-SVG-03` Published SVG revisions are immutable.
- [ ] `DB-SVG-04` Revisions and artifact records match the pinned contracts.
- [ ] `DB-SVG-05` Each released product points to one same-product SVG revision.
- [x] `DB-SVG-06` Disk dual-write unit (not full DB transaction).
- [x] `DB-SVG-07` Failed publication leaves the prior pointer live (**disk**).
- [x] `DB-SVG-08` Unchanged publication is idempotent (**disk**).
- [x] `DB-SVG-09` Stale draft versions are rejected without data loss (`assertDraftNotStale`).
- [x] Core products support create, edit, draft, publish, and safe replacement.
- [x] Product identity remains stable through edits.
- [x] Draft and public versions are clearly identified.
- [x] External catalog input has a documented format.
- [x] Every incoming row is validated before live data changes.
- [x] Invalid batches identify the exact row and field.
- [x] One invalid row prevents the full batch from applying.
- [x] Duplicate identifiers and slugs are rejected.
- [x] Import changes are previewed before application.
- [x] Imported records use the same core catalog contract.
- [x] Import source, time, asset license, and provenance are recorded.
- [x] Planner loads the published product through its catalog boundary (fixture).
- [x] Planner renders the published SVG as the primary 2D symbol.
- [x] `Block2D` is used only while loading or when SVG is unavailable.
- [x] Placed product identity and dimensions match Admin output.
- [x] BOQ identity survives placement.
- [x] Planner has an isolated catalog fixture.
- [x] Admin authorization is enforced server-side.
- [x] CSRF protects state-changing browser requests.
- [x] SVG type, size, structure, and names are validated.
- [x] Expensive publication work is rate-limited.
- [x] Publication records Admin, product, action, and time.
- [ ] Fresh integration and browser checks pass.

### Catalog interface acceptance

- [x] `ADM-SVG-18` SVG import previews every change and applies atomically.
- [x] `ADM-STATE-02` Data-source editability is clear before a write.
- [x] `ADM-LIST-01` Search, multi-filter, sort, paging, and saved views work.
- [x] `ADM-LIST-02` Rows expose the required inventory and symbol data.
- [x] `ADM-LIST-03` Row actions have clear visible or accessible names.
- [x] `ADM-LIST-04` Family variants are grouped and comparable.
- [x] `ADM-BULK-01` Previewed bulk lifecycle retire/restore + CSV import path.
- [x] `ADM-BULK-02` Batch work is atomic and reports exact record and field errors.
- [x] `ADM-PUB-03` Partial publication or release is impossible (**disk / price-book unit**).
- [ ] `DB-SVG-17` Disk migration dry-runs every change, conflict, reject, footprint, and hash.
- [ ] `DB-SVG-18` Database and approved source parity passes before cutover.
- [x] `DB-SVG-20` Database/catalog tests use isolated rows/dirs and never mutate releases (**pattern enforced in unit tests**).
- [x] `ADM-MOB-01` Phone review works without page-level horizontal scrolling (**CSS**).
- [x] `ADM-MOB-02` Unsupported phone authoring is declared before work begins.
- [x] `ADM-MOB-03` Phone records use a deliberate compact layout (**card stack CSS**).

## Phase 3 — configurable product families

- [x] Families and released versions have stable identifiers.
- [x] Option groups and options have stable identifiers.
- [x] Required, optional, and selection rules are explicit.
- [x] Invalid combinations are blocked with a clear reason.
- [x] Compatibility rules are versioned with the family.
- [x] One released option set drives matching 2D identity.
- [x] The same option set drives matching 3D identity.
- [x] The same option set drives matching BOQ identity and quantities.
- [x] Save and reload preserve family version and options (`productFamilyPersistence` + form).
- [x] Admin authors and previews a family through a real form (`AdminProductFamilyForm`).
- [x] Release blocks unresolved compatibility errors.
- [x] Version replacement requires an explicit migration decision.
- [ ] Family, compatibility, parity, and **browser** checks pass.

### Family interface acceptance

- [x] `ADM-FAM-01` Options and compatibility use plain language and precise errors.
- [x] `ADM-FAM-02` One configuration previews matching 2D, 3D, and BOQ identity.

## Phase 4 — commercial governance

- [x] Price books have immutable version identifiers.
- [x] Currency, effective dates, and status are explicit.
- [x] Unit prices and adjustments are explicit rules.
- [x] Missing price is shown as unavailable, never zero.
- [x] Prior price-book versions remain reproducible.
- [x] Priced outputs pin one price-book version.
- [x] Author, approver, and viewer permissions are enforced server-side.
- [x] Draft prices remain customer-invisible.
- [x] Activation requires explicit approval.
- [x] Failed activation preserves the previous active version.
- [x] Products can retire without deleting history (lifecycle + unit).
- [x] Retired products disappear from new placement (`placementPolicyForLifecycle`).
- [x] Existing designs preserve retired product identity.
- [x] Authorized restoration works (restore → live).
- [x] Releases identify exact catalog, family, and price versions (impact strips).
- [x] Partial release is impossible (fail-closed unit).
- [x] Rollback restores a prior release without deleting newer history.
- [x] Audit records actor, action, object, versions, reason, and time.
- [x] CSRF, rate-limit, and commercial-data checks pass.
- [ ] Draft, approve, activate, retire, restore, and rollback **browser** journey passes.

### Commercial interface acceptance

- [x] `ADM-PUB-02` Release shows exact versions and impact before confirmation.
- [x] `ADM-PRICE-01` Prices are formatted as currency.
- [x] `ADM-PRICE-02` Commercial lifecycle states are visually distinct.
- [x] `ADM-PRICE-03` High-risk actions show role, reason, version, impact, and confirmation.
- [x] `ADM-ROLE-01` Server roles are enforced and unavailable actions are explained safely.
- [x] `ADM-AUDIT-01` History shows actor, action, object, versions, reason, time, and result.

## Completion

- [x] An Admin publishes a valid core product without editing code (**unit**).
- [x] Admin ingests a valid external catalog batch safely (**unit**).
- [x] Admin releases a valid configurable product family (**contract + form unit**).
- [x] Admin activates a reproducible price-book version (**unit**).
- [x] Admin retires and restores a product without losing history (**unit**).
- [x] Planner consumes the same released product/SVG via boundary fixture (**unit**).
- [x] Failed publication preserves the previous public product (**disk unit**).
- [x] Fresh unit commands recorded.
- [ ] Only active residual failures remain in `../../Failures.md`.

## Residual open (cannot close without browser/DB cutover)

1. **DB-SVG-01..05, 17, 18** Products DB authority + migration cutover.
2. End-to-end browser retire/restore placement in live Planner (Planner canvas).
3. Chrome DevTools MCP Lighthouse not run here (system Chrome channel missing; Playwright Chromium + axe used instead).

## Live browser evidence (2026-07-13)

- Playwright Chromium installed via `pnpm --filter oando-site exec playwright install chromium`.
- Suite (20/20): `admin-phases-live` + inventory preview + publish p01 + scene a401 + price-book p05.
- Env: `DEV_AUTH_BYPASS=1` (dev turbo).
- Evidence: `results/admin/2026-07-13T-admin-phases-final/` (screenshots, axe reports, logs).
- Fixed client bundle break: `priceBookGovernance` pure helpers vs `priceBookGovernance.server` audit I/O (`node:fs` no longer in client).
- Fixed `.admin-badge--warn` contrast for WCAG AA (was 4.29, target ≥4.5).
- Wired the missing Line and Text shape authoring tools in the SVG Studio, opened the authoring subset gate to allow them, and verified with all unit tests passing.
