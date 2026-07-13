# Admin UI benchmark

## Status

This is the interface benchmark for Admin work.

It is not an execution plan.

It was refreshed on 2026-07-13.

SVG authoring is the primary Admin workflow.

Catalog and commercial governance support it.

## Verdict

The current Admin is not ready for production use.

The shell is coherent.

The SVG area is not yet a professional no-code studio.

Bulk JSON dominates its entry page.

Internal schema and pipeline language reaches the operator.

The catalog becomes an extremely long phone page.

The price-book page exposes raw storage values.

High-risk actions lack enough consequence and recovery detail.

## Scope and evidence

The local check used fresh Chromium sessions.

It covered these routes:

- `/admin`
- `/admin/catalog`
- `/admin/svg-editor`
- `/admin/price-books`

It covered these viewports:

- Desktop: 1440 by 900 CSS pixels.
- Phone review: 390 by 844 CSS pixels.

The reviewed implementation includes:

- `site/features/planner/admin/svg-editor/AdminSvgEditorListView.tsx`
- `site/features/planner/admin/svg-editor/AdminSvgEditorEditView.tsx`
- `site/features/planner/admin/svg-editor/SvgEditorForm.tsx`
- `site/features/planner/admin/svg-editor/SvgStudioCanvas.tsx`
- `site/features/planner/admin/AdminCatalogTable.tsx`
- `site/features/planner/admin/pricing/AdminPriceBookPageView.tsx`

The routes returned a page.

No console error occurred during the checked loads.

That does not prove the workflows are correct.

The check did not publish canonical data.

It closed no plan item.

## Current baseline

### SVG inventory

The page exposes descriptor counts, variants, lifecycle state, and previews.

It also exposes Zod, atomic rename JSON, and SVG pipeline language.

Those are implementation facts.

They are not the operator's task.

The bulk import textarea is visually dominant.

Bulk JSON is an advanced migration tool.

It must not define the primary SVG experience.

### SVG editor

The code contains useful foundations:

- A visual stage.
- Rectangle and circle creation.
- Selection.
- Layer visibility and locking.
- Exact numeric geometry.
- Named undo and redo.
- Zoom to fit.
- Preview and publication services.
- Revision and rollback support.

The foundation is incomplete as a product workflow.

The operator needs one path from product identity to a verified Planner symbol.

Units, footprint, draft state, validation, preview, publication, and recovery must stay visible.

JSON and source knowledge must not be required.

### Catalog

The checked desktop catalog loaded 60 local records.

The page reported a read-only local source.

The desktop document was about 3812 pixels tall.

The phone document was about 6842 pixels tall.

The phone layout flattens a large table into a long scan.

Many row actions are icon-only.

Search, filters, paging, and useful record data exist.

Saved views, deliberate bulk work, and a compact phone review mode do not.

Read-only state must be known before an operator attempts a write.

### Commercial governance

The price-book page shows raw minor units and basis points.

It can show approve, activate, and rollback together.

These actions have different risk.

They must not have equal visual weight.

The page needs formatted currency, dates, impact, role, reason, confirmation, and recovery.

### Current score

`FAIL` means the checked surface misses this benchmark.

`PARTIAL` means useful behavior exists but the bar is not met.

| Area | Result | Reason |
|---|---|---|
| SVG inventory | PARTIAL | Status exists. Internal language and bulk JSON dominate. |
| No-code SVG authoring | PARTIAL | Visual tools exist. The full safe path is not established. |
| SVG stage priority | OPEN | Exact editor measurements remain unproved. |
| SVG recovery | PARTIAL | Services exist. Full browser recovery is unproved. |
| Catalog finding | PARTIAL | Search and filters exist. Saved views and bulk work do not. |
| Phone catalog review | FAIL | It becomes a 6842-pixel single-column scan. |
| Price-book comprehension | FAIL | Raw values and competing high-risk actions are exposed. |
| Role and release clarity | OPEN | Role journeys need fresh proof. |
| Accessibility | OPEN | Keyboard, focus, announcements, and recovery are unproved. |

## External benchmark

### Structured content operations

[Sanity document actions](https://www.sanity.io/docs/studio/document-actions-api) separates primary actions from secondary and destructive actions.

It supports conditional availability and confirmation.

[Sanity validation](https://www.sanity.io/docs/studio/validation) puts actionable errors at the failed field.

It distinguishes errors from warnings.

[Sanity content releases](https://www.sanity.io/docs/studio/content-releases) supports validation and preview before release.

The lesson is clear.

Draft, validation, release, and destructive actions need an explicit hierarchy.

### Catalog operations

[Shopify bulk editing](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing) combines selection, chosen properties, validation, and one save operation.

[Shopify product search](https://help.shopify.com/en/manual/products/searching-filtering) supports sorting, filtering, saved views, and bulk actions.

[Shopify variant grouping](https://help.shopify.com/en/manual/products/variants/searching-filtering) keeps variants searchable and grouped.

The lesson is repeated inventory work must be fast and reversible.

### Commercial product data

[Configura Catalogue Creator](https://www.configura.com/products/catalogue-creator) treats product data, categorization, graphics, and price lists as one source.

[CET Commercial Interiors](https://www.configura.com/products/cet/commercial-interiors) connects product data, configuration, graphics, specifications, and lists.

Oando's SVG cannot be a detached drawing.

It must stay linked to identity, dimensions, configuration, and BOQ truth.

### SVG and direct manipulation

[Figma interface guidance](https://help.figma.com/hc/en-us/articles/30925881896727-FD4B-Navigate-Figma-Design-files) keeps a dominant canvas with stable tools, layers, and contextual properties.

[Inkscape's manual](https://inkscape-manuals.readthedocs.io/en/latest/interface.html) separates canvas work, commands, tool controls, and status feedback.

Oando needs only the subset required for product symbols.

It still needs professional geometry, layers, zoom, history, and feedback.

### General usability and accessibility

[Nielsen Norman Group's heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) require visible state, user control, error prevention, and recovery.

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the conformance floor.

The authoring and release paths must work with a keyboard.

Focus must remain visible.

Status and validation changes must be announced.

Dragging must have a non-drag alternative.

## Package decision

No new UI package is approved.

The installed stack already covers the work:

| Need | Existing authority |
|---|---|
| Accessible controls, dialogs, menus, and focus | `react-aria-components` |
| Resizable desktop regions | `react-resizable-panels` |
| Narrow-screen sheets | `vaul` |
| SVG scene editing | Existing SVG.js adapter and scene document |
| Form and contract validation | Existing Zod contracts |
| Remote state | `@tanstack/react-query` |
| Icons | `@phosphor-icons/react` |
| Feedback | `sonner` |
| Browser and accessibility proof | `@playwright/test` and `@axe-core/playwright` |

Do not add a second SVG engine.

Do not add a second form system.

Do not add a component framework to hide weak hierarchy.

## Required interaction model

### Primary journey

The primary Admin journey is:

1. Find or create a product symbol.
2. Confirm identity and physical footprint.
3. Edit the symbol visually.
4. Resolve validation.
5. Preview the exact Planner result.
6. Compare draft and published output.
7. Publish deliberately.
8. Verify the release or recover.

This path must work without JSON or source editing.

### SVG inventory

The default page must prioritize:

- Search.
- Lifecycle filters.
- Product identity.
- Symbol preview.
- Draft or published state.
- Validation state.
- Last change.
- One clear `New symbol` action.

Bulk import belongs behind an advanced disclosure or separate route.

Import must preview additions, changes, conflicts, and rejected rows.

### SVG desktop studio

The supported authoring width starts at 1280 CSS pixels.

At that width, the initial stage must receive at least 55 percent of the content area.

Use four stable regions:

1. Compact command bar.
2. Dominant stage.
3. Layers.
4. Contextual properties.

Properties follow selection.

The stage stays visible during edits.

Zoom and selection survive panel changes.

Rare and destructive actions stay separated.

### SVG editing

Every symbol must expose:

- Product and symbol identity.
- Millimetre footprint.
- View box.
- Current zoom.
- Current selection.
- Draft state.
- Validation state.
- Published revision.

Direct manipulation and exact numeric input must stay synchronized.

The supported shape subset must be explicit.

Unsupported input must fail with a precise reason.

Locked and hidden layers must be visually distinct.

Delete, reset, rollback, and discard need consequence-aware confirmation.

### Preview and publication

Preview and publication must use the same compiler authority.

Preview must show:

- Exact 2D Planner symbol.
- Physical footprint.
- Product identity.
- Validation errors and warnings.
- Draft-to-published difference.
- Fallback behavior.

Publication is one primary action.

It names the product, draft revision, live revision, and expected impact.

A failed operation keeps the previous live asset.

Success links to the released artifact and Planner verification.

### Catalog support

Search, filters, saved views, and bulk actions support the SVG workflow.

The operator can find missing, invalid, and unpublished symbols.

Family variants stay grouped.

Read-only and editable sources are obvious before action.

### Narrow screens

Full SVG authoring is desktop-first.

Do not pretend a phone provides the full studio.

Phone Admin supports search, status review, preview, approval, and recovery.

Unavailable editing tools are declared before work starts.

Do not flatten a desktop table into an endless phone page.

### Commercial actions

Show currency values as currency.

Keep raw storage units in an advanced view.

Separate draft, approved, active, retired, and rolled-back states.

High-risk actions require role, reason, version, impact, confirmation, recovery, and audit.

## Acceptance contract

These IDs are stable.

All Admin work is one delivery phase.

Numbered plan files are workstreams inside it.

| ID | Requirement |
|---|---|
| ADM-SVG-01 | SVG authoring is the primary Admin journey and works without JSON or source editing. |
| ADM-SVG-02 | SVG inventory exposes search, filters, identity, preview, draft state, validation, and last change. |
| ADM-SVG-03 | Bulk JSON import is an advanced path and never dominates the default inventory. |
| ADM-SVG-04 | At 1280 pixels wide, the initial SVG stage receives at least 55 percent of the content area. |
| ADM-SVG-05 | The studio has stable command, stage, layer, and contextual-property regions. |
| ADM-SVG-06 | Identity, footprint, view box, zoom, selection, draft, validation, and revision are visible. |
| ADM-SVG-07 | Direct manipulation and exact numeric geometry stay synchronized. |
| ADM-SVG-08 | The supported SVG feature subset is documented and enforced. |
| ADM-SVG-09 | Layers support selection, ordering, lock, visibility, and clear state. |
| ADM-SVG-10 | Undo and redo name the affected action and preserve a valid document. |
| ADM-SVG-11 | Reset, discard, delete, and rollback explain impact and require deliberate confirmation. |
| ADM-SVG-12 | Preview and publication use one compiler authority and normalized input. |
| ADM-SVG-13 | Preview shows the exact Planner symbol, footprint, identity, validation, and fallback state. |
| ADM-SVG-14 | Draft and published revisions have a field and visual difference view. |
| ADM-SVG-15 | One primary publish action names the target and versions. |
| ADM-SVG-16 | Failed compile or publication preserves the prior live artifact and never shows false success. |
| ADM-SVG-17 | Successful publication links to the artifact and Planner verification. |
| ADM-SVG-18 | SVG import previews all changes and applies atomically. |
| ADM-SHELL-01 | Each page has a title, scope, source, state, and one primary action. |
| ADM-SHELL-02 | Secondary, rare, and destructive actions do not compete with the primary action. |
| ADM-STATE-01 | One state covers loading, dirty, validating, saving, saved, publishing, published, and error. |
| ADM-STATE-02 | Read-only and editable sources are explicit before a write begins. |
| ADM-LIST-01 | Catalog supports search, multi-filter, sort, paging, and saved views. |
| ADM-LIST-02 | Rows expose identity, SKU, family, dimensions, lifecycle, availability, symbol state, and last change. |
| ADM-LIST-03 | Row actions have visible or unambiguous accessible names. |
| ADM-LIST-04 | Family variants are grouped and comparable. |
| ADM-BULK-01 | Selection supports previewed bulk edit, validation, publication, retirement, and recovery. |
| ADM-BULK-02 | Batch work is atomic and reports exact record and field errors. |
| ADM-FORM-01 | Forms group identity, geometry, assets, availability, configuration, and commercial data. |
| ADM-FORM-02 | Field errors appear beside the field and in a linked summary. |
| ADM-FORM-03 | Dirty state, save state, discard, and recovery are truthful. |
| ADM-PUB-01 | Blocking errors prevent publication and warnings remain visible. |
| ADM-PUB-02 | Publication and release show exact versions and impact before confirmation. |
| ADM-PUB-03 | Partial publication or release is impossible. |
| ADM-FAM-01 | Family options and compatibility rules use plain language and precise errors. |
| ADM-FAM-02 | One configuration previews matching 2D, 3D, and BOQ identity before release. |
| ADM-PRICE-01 | Prices are formatted as currency and raw storage units are secondary. |
| ADM-PRICE-02 | Draft, approved, active, retired, and rolled-back states are distinct. |
| ADM-PRICE-03 | High-risk actions show role, reason, version, impact, and confirmation. |
| ADM-ROLE-01 | The server enforces roles and the UI explains unavailable actions safely. |
| ADM-AUDIT-01 | History shows actor, action, object, versions, reason, time, and result. |
| ADM-MOB-01 | Phone Admin supports review work without page-level horizontal scrolling. |
| ADM-MOB-02 | Unsupported phone authoring tools are declared before work starts. |
| ADM-MOB-03 | Phone lists use cards or priority columns instead of a flattened desktop table. |
| ADM-A11Y-01 | The primary Admin journey meets WCAG 2.2 AA. |
| ADM-A11Y-02 | The SVG author-to-publish path is keyboard-completable. |
| ADM-A11Y-03 | Every drag action has a non-drag alternative. |
| ADM-A11Y-04 | Focus stays visible and state changes are announced. |

## Verification standard

Do not close an ID from code review.

Use a fresh browser run.

Use isolated catalog fixtures.

Never mutate canonical catalog data in a test.

Check SVG authoring at 1440 by 900 and 1280 by 720.

Check phone review at 390 by 844.

Check keyboard completion and focus recovery.

Check loading, empty, read-only, dirty, invalid, saving, publishing, success, failure, and recovery.

Measure the rendered stage and controls.

Prove failed publication keeps the previous artifact hash.

Prove repeated valid compilation is deterministic.

Prove Planner receives the same identity, footprint, and SVG.

Record exact commands and failures.

Never use screenshots or `results/` as proof of completion.

Never copy competitor assets, code, or trade dress.
