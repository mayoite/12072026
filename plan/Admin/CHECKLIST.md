# Admin — CHECKLIST

Live run gates each tick (browser and/or on-disk bytes).

## PHASE-01 — Authoring quality
- [x] Baseline reproof: HEAD `216e8dc94c4ac0062855439c84dfccc9804047a4`
- [x] Inventory preview: catalog UI shows `img[src*="/svg-catalog/"]` for published symbol (thumb `admin-svg-preview-img`)
- [x] `publishMultipath.test.ts` green (chaise + desk multipath)
- [x] Publish pipeline emits per-block paths (maker + blocks union path)
- [x] `chaise-lounge-001.svg` + catalog set regenerated via `compileSvgForPublish`
- [x] Desk maker model ≥3 pathish (`desk-top`, `desk-body`, `desk-knee-space`)
- [x] Published desk `.svg` has ≥3 pathish elements on disk
- [x] Correct mm footprint; legible at 100% and 25% (browser) (`admin-footprint-mm-proof` + `admin-svg-inventory-preview-p01.spec.ts`)
- [x] `stages.ts` S7 text: planner consumes catalog SVG (primary)
- [x] `svgPackageBoundaries` + `makerJsPipeline` + `scenePublishAuthority` green
- [x] Remaining catalog symbols re-published via `scripts:generate-svg`

## PHASE-02 — Catalog lifecycle
- [x] Bulk import is atomic (one bad row → whole batch rolls back with clear error)
- [x] Each item shows live/draft/retired state
- [x] Edit preserves slug identity (bulk import rejects existing slugs; edit route keeps slug)
- [x] Retire hides from buyers without deleting history (`loadBuyerVisibleDescriptors`)

## PHASE-03 — Studio tools
- [x] Node inspector edits x/y/size/fill → canvas updates (rect + circle)
- [x] Create/move/resize/delete each reversible via named undo
- [x] Dirty indicator + unsaved-exit guard
- [x] Reset-to-published restores bytes (studio remount + form reseed)

## PHASE-04 — Workstation family
- [x] Family authored via real form (seats/topology/options) (`WorkstationFamilyAuthorFields`)
- [x] Version release works; one version drives 2D/3D/BOQ (`workstationFamilyDrive` + `workstationFamilyDrive.test.ts`)
- [x] Emits documented workstation-family JSON contract (`workstationFamilyContract` + fixture)
- [x] Version replacement requires explicit migration choice (`WorkstationFamilyAuthorFields` + `workstationFamilyRelease.test.ts`)

## PHASE-05 — Pricing / BOQ
- [x] Price-book model + migration (versions, currency, effective dates)
- [x] Versioned, reproducible released book; past quotes pin original version (`quotePriceBookPin` + `reproduciblePinnedTotal`)
- [x] Emits documented price-book JSON contract (`emitPriceBookContract` + fixture)
- [x] BOQ lines show quantity × unit price × adjustment — not total only (`lineTotalMinor`)
- [x] "Price unavailable" when no rule — never silent zero
- [x] Author/approver/viewer permissions enforced server-side (`priceBookService` role gate)
- [x] Failed activation leaves prior active book untouched; rollback audited (unit + in-memory store)
- [x] Buyer P04 computes correct total against a fixture (`emitPriceBookContract` test)
- [x] Browser: draft, approve, activate, rollback journey (`admin-pricing-pricebook-p05.spec.ts`)

## PHASE-06 — Release / audit / rollback
- [x] Revision history visible per symbol (`DescriptorRevisionPanel` + revisions API)
- [x] Approve step before buyer-visible publish (publish → draft; Approve for buyers → live)
- [x] Rollback restores prior bytes; newer revision still on disk (`rollbackDescriptorToVersion`)
- [x] Audit log records who/when/what (`_descriptor-audit.jsonl` + publish hook)

## PHASE-07 — Studio disk proof
- [x] `scenePublishAuthority.test.ts` + `publishFromStudio.test.ts` green
- [x] Open `/admin/svg-editor/side-table-001` → stage visible without scrolling past form wall
- [x] Draw rect on stage → rectangle visible; live compile rail reflects drawn geometry
- [x] Publish → status "Published"; POST succeeds
- [x] `public/svg-catalog/side-table-001.svg` contains rect signature coords; byte size increases
- [x] `admin-svg-scene-publish-a401.spec.ts` green on this checkout (turbopack dev + `select()` fix)
- [x] Evidence pack under `results/admin/no-code-svg-studio/a4-0-1-scene-publish-proof/`
- [x] Kill list respected until green: no minimap/pen/multi-select scored as done
