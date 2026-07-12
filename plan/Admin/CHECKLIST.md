# Admin — CHECKLIST

Live run gates each tick (browser and/or on-disk bytes).

## PHASE-01 — Authoring quality
- [ ] Baseline reproof: `git rev-parse HEAD` + chaise HTTP pathish count recorded (RED baseline ok before fix)
- [ ] Inventory preview: catalog UI shows `img[src*="/svg-catalog/"]` for published symbol (preview ≠ plan paint)
- [ ] `publishMultipath.test.ts` green (≥2 pathish per block count; chaise `seat-block` + `backrest-block`)
- [ ] Publish pipeline emits per-block paths (`runSvgCompileStages` / `normalizeDescriptorForPipeline`) — not one merged difference path
- [ ] `chaise-lounge-001.svg` regenerated on disk with multipath output
- [ ] One symbol (desk) authored as layered geometry on the SVG.js stage
- [ ] Published `.svg` has ≥3 pathish elements (not one merged path)
- [ ] Correct mm footprint; legible at 100% and 25%
- [ ] `stages.ts` S7 text honest: publish authority + planner consumes catalog (not stale Block2D-only wording)
- [ ] `svgPackageBoundaries` + `makerJsPipeline`/`scenePublishAuthority` still green
- [ ] Remaining 4 symbols re-published to the same bar

## PHASE-02 — Catalog lifecycle
- [ ] Bulk import is atomic (one bad row → whole batch rolls back with clear error)
- [ ] Each item shows live/draft/retired state
- [ ] Edit preserves slug identity
- [ ] Retire hides from buyers without deleting history

## PHASE-03 — Studio tools
- [ ] Node inspector edits x/y/size/fill → canvas updates
- [ ] Create/move/resize/delete each reversible via named undo
- [ ] Dirty indicator + unsaved-exit guard
- [ ] Reset-to-published restores bytes

## PHASE-04 — Workstation family
- [ ] Family authored via real form (seats/topology/options)
- [ ] Version release works; one version drives 2D/3D/BOQ
- [ ] Emits documented workstation-family JSON contract
- [ ] Version replacement requires explicit migration choice

## PHASE-05 — Pricing / BOQ
- [ ] Price-book model + migration (versions, currency, effective dates)
- [ ] Versioned, reproducible released book; past quotes pin original version
- [ ] Emits documented price-book JSON contract
- [ ] BOQ lines show quantity × unit price × adjustment — not total only
- [ ] "Price unavailable" when no rule — never silent zero
- [ ] Author/approver/viewer permissions enforced server-side
- [ ] Failed activation leaves prior active book untouched; rollback audited
- [ ] Buyer P04 computes correct total against a fixture
- [ ] Browser: draft, approve, activate, rollback journey

## PHASE-06 — Release / audit / rollback
- [ ] Revision history visible per symbol
- [ ] Approve step before buyer-visible publish
- [ ] Rollback restores prior bytes; newer revision still on disk
- [ ] Audit log records who/when/what

## PHASE-07 — Studio disk proof
- [ ] `scenePublishAuthority.test.ts` green (parse → compile path, not raw-only)
- [ ] Open `/admin/svg-editor/side-table-001` → stage visible without scrolling past form wall
- [ ] Draw rect on stage → rectangle visible; live compile rail reflects drawn geometry
- [ ] Publish → status "Published"; POST succeeds
- [ ] `public/svg-catalog/side-table-001.svg` contains rect signature coords; byte size increases
- [ ] `admin-svg-scene-publish-a401.spec.ts` green on this checkout
- [ ] Evidence pack under `results/admin/phase-07/`
- [ ] Kill list respected until green: no minimap/pen/multi-select scored as done
