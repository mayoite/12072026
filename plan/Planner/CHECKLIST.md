# Planner checklist

This file records status only.

Treat every item as not done.

## Shared start gate

- [ ] Catalog-writing tests satisfy Admin Step 0 isolation.
- [ ] Planner fixtures never change canonical catalog files.
- [ ] Browser tests use normal controls without forced clicks.
- [ ] Each Planner command overwrites its stable results folder.

## Phase 1 — public entry and deterministic BOQ

- [ ] Public visitors can find and enter Planner.
- [ ] Guests do not face a false account requirement.
- [ ] No developer flag or hidden query is required.
- [ ] Member, Admin, and private routes remain protected.
- [ ] `UI-ENTRY-01` guest entry reaches useful canvas content after at most one blocking choice.
- [ ] `UI-ENTRY-02` entry offers template, scratch, and import or trace.
- [ ] `UI-ENTRY-03` optional metadata can be skipped and edited later.
- [ ] The second gate never presents only one available choice.
- [ ] Project brief and room geometry are editable and persistent.
- [ ] Millimetres remain document authority.
- [ ] Setup is keyboard-complete with visible focus.
- [ ] One BOQ calculation authority exists.
- [ ] BOQ uses only product-backed placements.
- [ ] BOQ groups stable product, family, option, and commercial identity.
- [ ] BOQ includes quantities, units, and source object identifiers.
- [ ] Unsupported and unbranded objects are visibly excluded.
- [ ] Identical inputs produce identical lines, order, and hash.
- [ ] A branded unpriced BOQ works without live pricing.
- [ ] Planner emits the agreed Site events without duplicates or private geometry.

## Phase 2 — core layout, catalog, and continuity

- [ ] Walls, doors, and windows can be created and edited.
- [ ] Selection and object editing preserve identity.
- [ ] Metric and imperial display keep stored millimetres unchanged.
- [ ] Primary tools work and silent no-op controls are removed.
- [ ] Numeric properties are keyboard-editable.
- [ ] One undo and redo authority covers document mutations.
- [ ] `UI-CAT-01` results show image or symbol, name, SKU, dimensions, family, and availability.
- [ ] `UI-CAT-02` family variants are grouped and comparable.
- [ ] `UI-CAT-03` search and filters cover commercial product attributes.
- [ ] `UI-CAT-04` catalog preview and placed 2D representation remain recognizable as the same product.
- [ ] Only published customer-visible inventory is exposed.
- [ ] Product, family, version, option, and commercial identity survive placement.
- [ ] `DB-SVG-10` Planner reads released SVG identity through a server catalog API.
- [ ] `DB-SVG-11` Planner imports exact SVG bytes through the committed revision and artifact key.
- [ ] `DB-SVG-12` SVG responses use the correct type, checksum ETag, and safe caching.
- [ ] `DB-SVG-13` Placed items pin product and SVG revision identity.
- [ ] `DB-SVG-15` Database, storage, and stale snapshot state are explicit.
- [ ] `DB-SVG-16` Disk files never override a database release.
- [ ] Released database SVG is the primary 2D symbol.
- [ ] Missing assets use an honest fallback without breaking the layout.
- [ ] One normalized document drives 2D, 3D, persistence, export, and BOQ.
- [ ] `UI-STATE-01` one authoritative save state is shown.
- [ ] `UI-STATE-02` loading, offline, saving, saved, unsaved, and error are distinct.
- [ ] Failed save never displays success.
- [ ] Save, reload, import, and export preserve canonical fields.
- [ ] 2D and 3D preserve object count, pose, rotation, and options.
- [ ] View actions do not mutate project data.
- [ ] `UI-SHELL-01` desktop header remains one row at supported widths.
- [ ] `UI-SHELL-02` default desktop canvas uses at least 65 percent of viewport area.
- [ ] `UI-SHELL-03` empty properties do not reserve a permanent panel.
- [ ] `UI-SHELL-04` panels collapse without losing work or selection.
- [ ] `UI-EDIT-01` selection opens only relevant properties.
- [ ] `UI-EDIT-02` dimensions and positions accept exact numeric input.
- [ ] `UI-EDIT-03` undo and redo communicate the affected action.
- [ ] `UI-MOB-01` phone chrome stays at or below 40 percent of initial viewport height.
- [ ] `UI-MOB-02` phone canvas receives at least 60 percent of initial viewport height.
- [ ] `UI-MOB-03` frequent phone actions use 44 by 44 pixel targets where practical.
- [ ] `UI-MOB-04` inventory and properties use mutually exclusive sheets.
- [ ] `UI-A11Y-01` the primary journey meets WCAG 2.2 AA.
- [ ] `UI-A11Y-02` every drag action has a keyboard and pointer alternative.
- [ ] `UI-A11Y-03` focus remains visible and unobscured.
- [ ] `UI-A11Y-04` dynamic save, sync, search, and export states are announced.
- [ ] Light and dark themes cover primary surfaces.
- [ ] Primary journeys have no unexplained console, request, or hydration errors.

## Phase 3 — bulk layout and advanced validation

- [ ] Released Admin family versions are consumed.
- [ ] Compatible options work and invalid combinations explain why.
- [ ] Configuration survives 2D, 3D, validation, and BOQ.
- [ ] Multi-select, duplicate, row, array, and grid work.
- [ ] Align, distribute, exact spacing, group, and ungroup work.
- [ ] Bulk changes preview before application.
- [ ] One bulk operation is one undoable command.
- [ ] Bulk edits preserve identity, options, and BOQ output.
- [ ] A 100-seat layout is practical within a recorded target.
- [ ] A representative 2,000-seat plan meets recorded navigation and edit budgets.
- [ ] Overlap, wall, opening, boundary, aisle, and chair rules work.
- [ ] Approved accessibility rules are versioned.
- [ ] Issues show severity, location, objects, and remedy.
- [ ] Issues can focus affected objects on the canvas.
- [ ] Advisory waivers require a reason.
- [ ] Hard errors block quote readiness.
- [ ] Validation clears after a correct fix without reload.
- [ ] Revisions, BOQ, and handoff use the same validation result.

## Phase 4 — live pricing, revisions, sharing, and review

- [ ] Approved price-book version and currency are pinned.
- [ ] Quantity, unit price, adjustment, tax, and line total are visible.
- [ ] Missing price is unavailable, never zero.
- [ ] Draft prices never reach customers.
- [ ] Historical priced outputs remain reproducible.
- [ ] Named revisions are immutable.
- [ ] Revisions record project, catalog, family, validation, and price versions.
- [ ] Later edits do not change an existing revision.
- [ ] BOQ and quote records cannot drift to a newer draft.
- [ ] Read-only review links support permission, expiry, and revocation.
- [ ] Reviewers cannot mutate the owner project.
- [ ] Comments preserve object anchor, reviewer, and time where supported.
- [ ] Revocation blocks future access.
- [ ] Private projects and commercial data remain private.

## Phase 5 — handoff and exports

- [ ] `UI-BOQ-01` product count and BOQ readiness are visible from the workspace.
- [ ] `UI-BOQ-02` customer-ready export is distinct from a draft export.
- [ ] `UI-BOQ-03` sending the BOQ to Oando is explicit and recoverable.
- [ ] Customer reviews the exact named revision before submission.
- [ ] BOQ, pricing, exclusions, and validation status are visible.
- [ ] Hard validation failures block handoff.
- [ ] Submission sends the exact revision, BOQ, price version, validation result, and hash.
- [ ] Consent, status, time, revision, and hash are recorded.
- [ ] Idempotency prevents duplicate requests.
- [ ] Failed submission supports safe retry.
- [ ] Successful records do not drift to later edits.
- [ ] PDF, workbook, JSON, and approved exports use one calculation authority.
- [ ] Every export preserves product, revision, price, validation, and hash identity.
- [ ] Handoff completion and failure events follow the Site event contract.
- [ ] Commercial authorization, CSRF, rate-limit, privacy, and provenance checks pass.

## Completion

- [ ] An external customer completes the full journey without developer help.
- [ ] The same product identity flows from discovery to BOQ and handoff.
- [ ] Oando receives the exact branded package reviewed by the customer.
- [ ] Every applicable UI benchmark ID has fresh browser evidence.
- [ ] Fresh commands and exit codes are recorded here.
- [ ] Only active failures remain in `../../Failures.md`.
