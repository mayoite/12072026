# 06 Uploads, AI, Export, And 3D

## Objective

Carry Open3D upload, AI, export, and 3D capabilities into OOFPLWeb through explicit adapters, preserving existing APIs and avoiding unsupported claims.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Upload, AI, export, and 3D controls must fit the established toolbar/panel system without obscuring the canvas or fragmenting workflow. Validate them in `open3d-next-staging/` before moving them into production.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

**Mandatory design research:** Execute `DESIGN-BENCHMARK-PROTOCOL.md` before designing upload, export, 2D/3D transition, or AI interaction surfaces.

## Current status

- **2026-07-03:** Phase 06 is started in `open3d-next-staging/` and copied to `OOPlanner/` for the JSON/SVG/DWG-preflight/lazy-3D contract slice.
- Phase 05 FeasibilityCanvas/model-action slice is implemented and target-tested, but Phase 05 acceptance remains blocked by coverage 58.14/57.52/59.69/57.68 and missing browser/visual/workflow gates.
- Phase 06 full acceptance and any production promotion remain blocked until predecessor gates and Phase 06 evidence are complete.

## Inputs to read

- Phase 03A SVG-generation contracts and evidence.
- `open3d-floorplan/src/lib/utils/export.ts`
- `open3d-floorplan/src/lib/utils/cadExport.ts`
- `open3d-floorplan/src/lib/utils/roomplanImport.ts`
- `open3d-floorplan/src/lib/components/viewer3d/ThreeViewer.svelte`
- `open3d-floorplan/src/lib/utils/furnitureModels3d.ts`
- `open3d-floorplan/src/lib/utils/furnitureModelLoader.ts`
- `site/features/planner/3d/*`
- `site/features/planner/ai/*`
- `site/app/api/planner/ai-advisor/route.ts`
- `site/app/api/planner/sketch-to-plan/route.ts`
- `site/features/planner/shared/export/*`
- `site/public/cdn/` asset conventions from `Readme.md`

## Scope

- Separate normal image upload, RoomPlan import, sketch-to-plan, AI advisor, export, and 3D preview.
- Reuse current OOFPLWeb APIs and existing dependencies where practical.
- Do not expose direct client API-key flows from Open3D source in production.
- Do not advertise DWG as real export unless a real DWG writer exists.

## Checklist

- [ ] Implement background/reference image import as the default image-upload behavior.
- [ ] Keep sketch-to-plan as an explicit command through `/api/planner/sketch-to-plan`.
- [ ] Port RoomPlan JSON/ZIP import with safe parsing and recoverable errors.
- [ ] Implement AI advisor summary from Open3D state: rooms, dimensions, walls, openings, furniture count, selected item, constraints, and available OOFPLWeb catalog IDs.
- [ ] Apply AI placement responses through the same action layer as manual placement.
- [ ] Remove or disable Open3D direct browser API-key image generation unless a server-owned OOFPLWeb API contract is created.
- [x] Implement JSON export first and require import round-trip for the starter slice.
- [ ] Implement release slices in order: JSON/SVG, PNG/PDF/DXF, 3D, then AI; later slices do not block an accepted earlier release.
- [ ] Define export jobs: preflight, settings, provenance, progress, cancel/retry, staleness, preview, multi-floor packaging, and retention.
- [ ] Define import size/depth/archive limits and rejection evidence.
- [ ] Treat AI output as untrusted proposals: validate, preview diff, confirm, transactionally apply, undo, and state privacy/retention.
- [x] Implement SVG export from current 2D geometry for the starter slice.
- [ ] Reuse the Phase 03A deterministic SVG geometry pipeline; do not create a second export-only symbol system.
- [ ] Implement PNG export from canvas or offscreen render.
- [ ] Ensure AI summaries and placement responses declare units explicitly and are converted through the canonical unit adapter.
- [ ] Implement PDF export with print-safe title block and the document-selected unit labels.
- [ ] Apply the selected display unit consistently to SVG, PNG annotations, PDF, and DXF metadata while preserving correct physical scale.
- [ ] Implement DXF export preserving walls, openings, furniture, dimensions, and layers enough for CAD handoff.
- [x] Treat DWG as unsupported or DXF alias with clear wording.
- [x] Port 3D view lazily; do not eager mount on default planner load for the starter slice.
- [ ] Reuse `three`, `@react-three/fiber`, and `@react-three/drei` where practical; avoid a second Three version unless proven necessary.
- [ ] Classify Open3D static models/textures before copying any runtime assets.

## Exit gate

- [ ] Upload image does not force AI.
- [ ] RoomPlan import is recoverable.
- [ ] JSON export/import round-trips.
- [ ] Exports retain the selected display unit and preserve canonical physical dimensions.
- [ ] AI applies changes through actions.
- [ ] 3D preview is lazy and does not own auth or direct secret/API-key flows.

## Evidence required

- Fixture/manual proof for image background, RoomPlan import, sketch command, AI placement, JSON round-trip, SVG/PNG/PDF/DXF export, and lazy 3D.
- Asset classification record.
- Unsupported DWG decision record.

## Phase governance

### Forbidden actions

- Do not expose direct client API-key flows from Open3D source.
- Do not advertise DWG as real export without a verified writer.
- Do not mount 3D eagerly on default planner load.
- Do not create a second export-only SVG symbol system.
- Do not apply AI output without validation/preview/confirm/undo.
- Do not add more formats before JSON/SVG/PNG/PDF/DXF pass round-trip gates.
- Do not inherit donor direct browser-key image generation.

### Phase entry checklist

- [ ] Phase 05 workspace UI and canvas port verified.
- [ ] Phase 01B staging feasibility verified.
- [ ] Design benchmark executed for upload/export/2D-3D/AI.
- [ ] Existing AI and export APIs reviewed.

### Rollback criteria

- If 3D mount regresses default load performance, abort and enforce lazy loading.
- If AI output is applied without validation, abort and add schema/preview/confirm/undo.
- If export round-trip fails for any format, abort and fix before adding more.
- If client API keys leak into production, abort immediately.
- If coverage cannot reach 90% floor, abort and reassess.

### Risk register

- **Risk:** Donor 3D viewer includes direct Gemini/OpenAI browser-key flows. **Impact:** critical. **Mitigation:** remove or disable; use server-owned API contracts. **Owner:** 3D/AI agent. **Status:** open.
- **Risk:** 3D performance regresses default load. **Impact:** high. **Mitigation:** lazy mount, no eager 3D initialization. **Owner:** 3D agent. **Status:** open.
- **Risk:** Export parity overclaimed without fixtures. **Impact:** high. **Mitigation:** import/export round-trip fixtures for every format. **Owner:** export agent. **Status:** open.

### Success metrics

- Upload image does not force AI: pending
- RoomPlan import is recoverable: pending
- JSON export/import round-trips: pending
- Exports retain display unit and physical dimensions: pending
- AI applies changes through actions: pending
- 3D preview is lazy, no auth/secrets: pending
- Coverage ≥95% globally and per file: pending

### Dependencies on external systems

- Phase 03A SVG generation pipeline.
- Phase 05 workspace UI.
- `/api/planner/ai-advisor` and `/api/planner/sketch-to-plan`.
- `three`, `@react-three/fiber`, `@react-three/drei`.
- `site/public/cdn/` asset conventions.
- Donor export/import/3D utilities.

### Performance budgets

- 3D code/renderer absent from default 2D load.
- First 3D activation: <3s.
- JSON export: <500ms for normal plans.
- SVG export: <200ms.
- No sustained heap growth after 10 2D/3D cycles.

### Security considerations

- No client-side API keys.
- AI payload schema validation.
- Privacy/retention for uploaded plan data.
- Import limits: MIME, bytes, pixels, archive entries, decompressed bytes, nesting depth, traversal rejection.
- SVG sanitization.

### Accessibility considerations

- Export format selection keyboard-accessible.
- 3D loading progress announced.
- AI proposals have accessible preview and confirm/cancel.
- Export errors have accessible messages.

### Decision log

- **2026-07-03:** User explicitly directed Phase 06 start before full Phase 05 acceptance. Kept scope to a copied, target-tested JSON/SVG/DWG-preflight/lazy-3D starter slice; full Phase 06 acceptance and production promotion remain blocked by missing predecessor gates.

## Risks/blockers

- Open3D 3D viewer includes direct Gemini/OpenAI browser-key flows; production OOFPLWeb should not inherit that.
- 3D performance and warnings can regress default planner load if mounted eagerly.
- Export parity is easy to overclaim without import/export fixtures.
