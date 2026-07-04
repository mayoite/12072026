# 03A Inventory System And SVG Generation

## Objective

Replace the current weak inventory arrangement and ad-hoc SVG generation with coherent, extensible systems before building the final React workspace UI.

## Non-negotiable priorities and sequence

Treat these as co-dependent release dimensions: **workflow/data/auth integrity; drawing-tool/geometry correctness; UX/accessibility; UI/responsive layout; inventory architecture; recoverable dockable toolbars/panels; visual consistency/performance**. Every dimension is release-blocking. Use `open3d-next-staging/` as the validation lab, not as a holding area. Once a module meets source, test, benchmark, and safety gates, copy the reviewed module into `OOPlanner/` during this phase. Final route replacement and visible production wiring still wait for accepted visual, interaction, and promotion-manifest gates.

**Mandatory acceptance:** `QUALITY-GATES.md` applies to this phase.

**Governing decisions:** `IMPLEMENTATION-DECISIONS.md` applies to this phase.

**Mandatory design research:** Execute `DESIGN-BENCHMARK-PROTOCOL.md` before inventory information architecture, interaction, or visual implementation.

## Inputs to read

- Phase 03 catalog and identity evidence.
- `open3d-floorplan/src/lib/components/sidebar/BuildPanel.svelte`
- `open3d-floorplan/src/lib/utils/furnitureCatalog.ts`
- `open3d-floorplan/src/lib/utils/furnitureIcons.ts`
- `open3d-floorplan/src/lib/utils/furnitureThumbnails.ts`
- `open3d-floorplan/src/lib/utils/export.ts`
- `open3d-floorplan/src/lib/utils/cadExport.ts`
- `site/features/planner/catalog/*`
- `site/features/planner/shared/export/*`
- Existing catalog, icon, preview, SVG, and export tests/fixtures.

## Scope

- Replace the inventory browsing model, not merely restyle the existing sidebar.
- Separate catalog source data, taxonomy, search index, user collections, placement definitions, preview assets, and canvas rendering.
- Create one deterministic SVG pipeline for inventory symbols, canvas rendering, previews, and export where formats are compatible.
- Keep product identity and physical dimensions canonical in millimetres.
- Do not generate product SVGs from untrusted markup.
- Do not block inventory usability when image, mesh, or SVG assets are missing.

## Inventory system checklist

- [ ] Define an extensible taxonomy with stable category IDs, subcategories, tags, room/use context, and configurable ordering.
- [ ] Define inventory records separately from placed-object state.
- [ ] Preserve source catalog ID, slug, SKU, dimensions, image, mesh, material, pricing/quote metadata, and provenance.
- [ ] Build fast search with normalized terms, synonyms, tags, SKU, category, and recent queries.
- [ ] Add configurable category navigation, favorites, recent items, frequently used items, and project collections.
- [ ] Support grid/list density, preview size, sorting, filtering, and collapsed/expanded category state.
- [ ] Preserve inventory position and filters when users place an item or change tools.
- [ ] Define inventory panel state and command contracts; implement docking and final inventory UI in Phase 05.
- [ ] Use the same placement action for click-to-place, drag-to-place, duplicate, AI placement, and imported items.
- [ ] Add safe missing-image, missing-mesh, and missing-SVG fallbacks.
- [ ] Define index build/update, worker boundary if needed, deterministic ranking/tie-breaking, typo tolerance, zero-result recovery, and compatibility filters.
- [ ] Define virtualized-grid focus retention and screen-reader behavior for Phase 05 implementation.

## SVG generation checklist

- [ ] Define a typed SVG symbol contract using canonical millimetre dimensions and a stable viewBox.
- [ ] Generate deterministic symbols for every supported inventory shape.
- [ ] Separate geometry from theme so symbols work in light, dark, print, selection, and high-contrast states.
- [ ] Support rotation, scaling, labels, anchors, selection bounds, and placement origin consistently.
- [ ] Sanitize imported or generated SVG content; prohibit scripts, external execution, and unsafe attributes.
- [ ] Provide visible fallback geometry when a specialized symbol cannot be generated.
- [ ] Cache symbols by definition/version/theme without mixing product identity.
- [ ] Ensure SVG previews and canvas footprints represent the same physical dimensions.
- [ ] Reuse verified geometry in SVG export without leaking editor-only controls or hidden layers.
- [ ] Add an SVG fixture gallery for visual review across categories, dimensions, rotations, themes, and missing assets.

## Exit gate

- [ ] Users can find, compare, preview, and place inventory without losing navigation context.
- [ ] Inventory remains usable with hundreds or thousands of records.
- [ ] Docking and final visual acceptance are explicitly deferred to Phase 05; required state/command contracts are complete here.
- [ ] Every supported inventory type has a deterministic SVG or safe fallback.
- [ ] SVG preview, canvas footprint, and exported geometry agree in physical scale.
- [ ] Product identity survives search, placement, save/load, AI, BOQ, quote, and export flows.
- [ ] Reviewed source modules are copied into `OOPlanner/`; final visible production wiring waits for accepted visual/interaction evidence and a production promotion manifest.

## Evidence required

- Inventory taxonomy and state fixtures.
- Search, filter, favorites, recent, collection, and placement tests.
- Large-inventory performance evidence.
- Inventory state/command contracts for Phase 05 dock/move/resize/reset and keyboard implementation.
- SVG fixture gallery with expected dimensions and snapshots.
- Sanitization and unsafe-SVG rejection tests.
- Missing image/mesh/SVG fallback evidence.
- Staging screenshots for desktop and tablet layouts.

## Phase governance

### Forbidden actions

- Do not treat inventory as one flat component.
- Do not couple SVG markup to product records.
- Do not generate product SVGs from untrusted markup.
- Do not render every inventory preview eagerly.
- Do not wire modules into visible production routes before staging visual/interaction gates pass.
- Do not leave accepted modules only in `open3d-next-staging/` after source, test, benchmark, and safety gates pass; copy them into `OOPlanner/` as work proceeds.
- Do not block inventory usability when assets are missing.
- Do not mix product identity with canvas rendering concerns.

### Phase entry checklist

- [ ] Phase 03 catalog identity and mapping verified.
- [ ] Design benchmark executed (`DESIGN-BENCHMARK-PROTOCOL.md`).
- [ ] Inventory taxonomy requirements understood.
- [ ] SVG symbol contract requirements understood.

### Rollback criteria

- If inventory search cannot handle 1K records at <100ms p95, abort and redesign index.
- If SVG output is non-deterministic, abort and fix generation pipeline.
- If missing-asset fallback is not visible, abort and fix fallback geometry.
- If coverage cannot reach 90% floor, abort and reassess.

### Risk register

- **Risk:** Flat inventory component recreates current problem. **Impact:** high. **Mitigation:** separate taxonomy, search index, collections, placement definitions. **Owner:** inventory agent. **Status:** open.
- **Risk:** Non-deterministic SVG breaks snapshots and exports. **Impact:** high. **Mitigation:** deterministic generation, fixture gallery, snapshot tests. **Owner:** SVG agent. **Status:** open.
- **Risk:** Eager preview rendering degrades responsiveness. **Impact:** medium. **Mitigation:** virtualized grid, lazy loading, focus retention. **Owner:** inventory agent. **Status:** open.

### Success metrics

- Inventory usable with 1K+ records: pending
- Search p95 <100ms at 1K records: pending
- Every inventory type has deterministic SVG or safe fallback: pending
- SVG preview/canvas/export agree in physical scale: pending
- Coverage ≥95% globally and per file: pending

### Dependencies on external systems

- Phase 03 catalog identity and mapping.
- Existing catalog, icon, preview, SVG, and export tests/fixtures.
- Donor `BuildPanel.svelte`, `furnitureCatalog.ts`, `furnitureIcons.ts`, `furnitureThumbnails.ts`, `export.ts`, `cadExport.ts`.

### Performance budgets

- Inventory search/filter: p95 ≤100ms at 1K records, ≤200ms at 10K.
- SVG symbol generation: <10ms per symbol.
- Preview rendering: virtualized, lazy.

### Security considerations

- SVG sanitization: prohibit scripts, external execution, unsafe attributes.
- No product SVGs from untrusted markup.
- Asset allowlist for images and meshes.

### Accessibility considerations

- Inventory search has accessible name and live-region announcements.
- SVG symbols have accessible names.
- Missing asset fallback has accessible description.
- Virtualized grid preserves keyboard focus and screen-reader behavior.

### Decision log

- *(To be filled during implementation)*

## Risks/blockers

- Treating inventory as one flat component will recreate the current problem.
- Coupling SVG markup to product records will make themes and export fragile.
- Non-deterministic SVG output will break snapshots, caching, and downstream exports.
- Rendering every inventory preview eagerly will degrade workspace responsiveness.
- Wiring this work into visible production routes before staging approval will make later UI correction costly.
- Leaving accepted modules only in staging will block integration and create duplicate source ownership.
