# 03 Catalog, Admin Boundaries, and Asset Identity — Revised

## Objective

Replace Open3D's static emoji-and-cm furniture catalog with a production-grade catalog system that imports OOFPLWeb planner data, preserves full product identity for BOQ/quote/export/AI traceability, supports search/filter/variants/favorites/recent, and survives missing assets with visible fallback geometry.

## Design research summary

### Wayfair taxonomy-decoupled architecture
* Visual similarity search separates object localization from category classification
* Multi-edge network models functional needs (e.g., "something to sit on") independently of product classes
* Product tags capture color, design, pattern, theme as structured attributes
* LLM-as-a-Judge evaluation for query-result relevance

### IKEA three-layer knowledge graph
* Concepts (hundreds, manually governed): Product, Category, Room
* Categories (thousands, decentralized SME ownership): bookcase, sofa, etc.
* Data (automated, test-driven): individual SKUs with dimensions, colors, sizes
* Git-versioned ontology with release tags and QA automation

### Furniture taxonomy best practices (LynkPIM, WISEPIM)
* Type-based primary hierarchy (Sofas, Beds, Tables) not room-based
* Room as a multi-value filterable attribute
* Dimensions (W×D×H, seat height, weight) are required structured fields, not description text
* Material: two-field approach — marketing name ("Smoked Oak") + normalized filter value ("Oak")
* Style as multi-select attribute, not category (Coastal + Boho on same product)
* Google/GS1/bol. channel mappings derived from canonical internal tree

### 3D asset resilience (Tripo, Style3D, Showroom, Nex GLB)
* Base geometry loads first; materials/textures lazy-loaded on demand
* KTX2/Basis Universal + Draco for 80-90% size reduction
* Progressive LOD: low-poly proxy → standard → high-res
* Client-side offline pre-caching via service workers
* Multi-CDN failover with health checks
* Explicit fallback geometry when mesh fails to load (colored procedural box)
* Content-addressed URLs with long TTLs

### Variant management (ThreeKit, commercetools, Fabric)
* Master variant + explicit variant array per product
* Variant attributes: color, size, material, configuration
* Each variant has unique SKU, pricing, images, 3D asset URL
* Invalid combinations disabled, not hidden
* Configuration state encoded in URL for shareability

## Revised checklist

### 03-CAT-01: Catalog domain model
- [ ] Define `Open3dCatalogItem` with: source catalog ID, slug, SKU, name, description, canonical category, display categories (multi-value), dimensions (widthMm, depthMm, heightMm, seatHeightMm, weightKg), units, preview image URL, mesh URL, material metadata (marketing + normalized), style tags, room tags, color info, price/quote metadata, availability status, assembly required, flat pack flag, variant references, and provenance metadata.
- [ ] Define `Open3dCatalogVariant` with: variantId, sku, parentProductId, variant attributes (color, size, material, finish), variant-specific dimensions, pricing, images, mesh URL, availability.
- [ ] Define `Open3dPlacedConfiguration` (immutable snapshot) with: placementId, timestamp, product identity, variant identity, overridden dimensions, rotation, position, scale, material override, color override, locked status, and source metadata for undo/AI/export traceability.
- [ ] Define `Open3dCatalogIndex` for client-side search: byId, bySlug, bySku, byCategory, byTag, byRoom, byStyle, and full-text search index.
- [ ] Define `Open3dCatalogSearchQuery` with: text, categoryFilter, roomFilter, styleFilter, materialFilter, colorFilter, dimensionFilter (min/max W/D/H), availabilityFilter, sortOrder, and pagination (cursor-based).
- [ ] Define `Open3dCatalogSearchResult` with: items, totalCount, cursor, hasMore, and search performance metadata.

### 03-CAT-02: Taxonomy and faceted classification
- [ ] Implement canonical type-based hierarchy (primary): Furniture > Sofas > 3-Seater Sofas; Furniture > Chairs > Office Chairs; Furniture > Tables > Dining Tables; Furniture > Storage > Wardrobes; Lighting > Ceiling Lights; Decor > Rugs; Outdoor > Patio Furniture; etc.
- [ ] Implement room as multi-value filterable attribute: Living Room, Bedroom, Kitchen, Bathroom, Office, Dining, Outdoor, Garage, Utility.
- [ ] Implement style as multi-select attribute: Modern, Scandinavian, Industrial, Traditional, Coastal, Boho, Mid-Century, Minimalist, Contemporary, Rustic.
- [ ] Implement material with two-field approach: marketingMaterial (display) + normalizedMaterial (filter/feed).
- [ ] Implement color as structured attribute with hex, name, and normalized family.
- [ ] Implement dimension validation and filtering with min/max width/depth/height/weight.
- [ ] Implement assembly type attribute: flat-pack, partial, fully-assembled.

### 03-CAT-03: Unit conversion and canonical dimensions
- [ ] Verify real source units for OOFPLWeb catalog dimensions (currently stored as cm in `widthMm`/`heightMm` fields despite name — legacy naming debt).
- [ ] Implement `canonicalMmFromCatalogFields` converter that reads the actual cm values and converts to canonical millimetres for Open3D geometry.
- [ ] Implement `displayCmFromCanonicalMm` and `displayInFromCanonicalMm` for UI display based on user-selected display unit.
- [ ] All conversions tested with fixture data covering metric, imperial, and edge cases (zero, negative, fractional).

### 03-CAT-04: Catalog mapping from OOFPLWeb APIs
- [ ] Implement `mapPlannerManagedProductToCatalogItem` mapping from `/api/planner/catalog` response to `Open3dCatalogItem`.
- [ ] Implement `mapConfiguratorProductToCatalogItem` mapping from `/api/planner/catalog/configurator` response to `Open3dCatalogItem` only if configurator products are currently used in the planner.
- [ ] Preserve all source identity fields: plannerSourceSlug, legacyProductId, categoryId, seriesId, and metadata provenance.
- [ ] Map admin category names to canonical workspace taxonomy using `mapAdminCategoryToWorkspace` from existing bridge.
- [ ] Map configurator parametric/discrete/fixed sizing to canonical dimensions with explicit unit conversion.
- [ ] Validate mapping performance: <50ms per item (measured via fixture).

### 03-CAT-05: Asset URL validation and fallback system
- [ ] Implement `validateAssetUrl` with allowed-origin allowlist (CSP-aligned), URL format validation, and protocol enforcement (https for external, relative for local CDN).
- [ ] Implement `isAssetUrlExpired` check with timestamp-based freshness validation (configurable TTL, default 24h for signed URLs).
- [ ] Implement `resolveAssetUrl` that returns validated URL or triggers fallback path.
- [ ] Implement `Open3dFallbackGeometry` with: type ("box" | "cylinder" | "plane"), color, material, accessible name, and dimension approximation.
- [ ] Implement `buildFallbackGeometry` that generates a colored procedural box matching catalog dimensions when image/mesh is missing or expired.
- [ ] Fallback geometry has ARIA-compatible label and visible border so missing assets are noticeable but safe.
- [ ] Asset validation performance: <10ms per asset (fixture-measured).

### 03-CAT-06: Catalog client with search, filtering, and caching
- [ ] Implement `Open3dCatalogClient` class with:
    * `load(source: "standard" | "configurator")` fetches from API, normalizes, builds index.
    * `search(query: Open3dCatalogSearchQuery)` returns faceted search results with ranking.
    * `getById(id)`, `getBySlug(slug)`, `getBySku(sku)` O(1) lookups via index.
    * `getByCategory(category)`, `getByRoom(room)`, `getByStyle(style)` filtered views.
- [ ] Implement full-text search with tokenized name, description, tags, and SKU.
- [ ] Implement ranking: exact SKU match > exact name match > tag match > description match > fuzzy match.
- [ ] Implement typo tolerance using normalized token comparison (3-char prefix matching).
- [ ] Implement zero-result recovery: visible message with suggested filter relaxation.
- [ ] Implement client-side caching: in-memory LRU cache with configurable max items (default 5000), TTL (default 5 minutes), and explicit `invalidate()` method.
- [ ] Implement stale-data handling: background revalidation on cache hit if data is >50% of TTL age; serve stale while revalidating.
- [ ] Pagination: cursor-based with page size 50 for initial load, 20 for search results.

### 03-CAT-07: Recent items and favorites
- [ ] Implement `Open3dRecentItems` with localStorage-backed persistence (schema versioned, max 50 items, deduplicated by SKU, timestamp-ordered).
- [ ] Implement `Open3dFavorites` with localStorage-backed persistence (max 200 items, category-filterable view).
- [ ] Implement `addRecent(item)`, `getRecent()`, `clearRecent()` operations.
- [ ] Implement `addFavorite(item)`, `removeFavorite(id)`, `isFavorite(id)`, `getFavorites()` operations.
- [ ] Schema migration support for localStorage data (version 1 → future versions).
- [ ] Recent/favorites display in catalog UI with quick-access panel.

### 03-CAT-08: Placement action layer
- [ ] Implement `placeCatalogItem` action that accepts `Open3dCatalogItem` or `Open3dCatalogVariant` and produces an `Open3dPlacedConfiguration` snapshot.
- [ ] Placement action writes to the same history/undo/redo path as all other mutations (reuses Phase 02 pure actions).
- [ ] Click-to-place and drag-to-place both call `placeCatalogItem` with the same parameters (only input method differs).
- [ ] Placement action generates deterministic placement ID using timestamp + random suffix.
- [ ] Placement action preserves source catalog ID, variant ID, SKU, and all provenance metadata in the placed object.
- [ ] Placement action performance: <5ms from action dispatch to state update (fixture-measured).
- [ ] Placement is observed by undo, autosave, AI, and export via the existing canonical document stream.

### 03-CAT-09: Admin boundaries and navigation
- [ ] Admin catalog CRUD links rendered as navigation only (anchor tags to `/admin/catalogs/*`).
- [ ] No edit/delete/create catalog controls inside the planner canvas or inventory panel.
- [ ] No admin API calls from planner runtime; all admin routes use server-authenticated `withAuth` middleware.
- [ ] Catalog read-only in planner; write paths isolated to admin routes.
- [ ] Verify `/api/admin/catalogs/[type]` route boundaries remain unchanged.

### 03-CAT-10: Asset provenance and classification
- [ ] Classify each Open3D static model in `open3d-floorplan/static/models/` and texture in `open3d-floorplan/static/textures/`.
- [ ] Record license/attribution in `open3d-next-staging/src/catalog/ASSET-PROVENANCE.md`.
- [ ] Mark demo GLB assets as "demo-only, not for production catalog" with explicit warnings.
- [ ] Separate runtime/editor assets from product/catalog assets: runtime assets may be copied to `site/public/cdn/` only after classification; product images/meshes stay R2/DB-backed.
- [ ] No new product/catalog assets added to git.

### 03-CAT-11: Tests and coverage
- [ ] Unit tests for `Open3dCatalogItem` normalization, validation, and edge cases (empty, missing fields, malformed dimensions).
- [ ] Unit tests for taxonomy mapping (admin category → canonical category, shape type resolution).
- [ ] Unit tests for unit conversion (cm→mm, mm→cm, mm→in, fractional, zero, negative, overflow).
- [ ] Unit tests for search and filtering (exact match, fuzzy match, typo tolerance, zero results, category filter, room filter, style filter, material filter, dimension range).
- [ ] Unit tests for asset URL validation (valid, invalid protocol, expired, wrong origin, malformed).
- [ ] Unit tests for fallback geometry generation (correct dimensions, visible color, accessible name).
- [ ] Unit tests for recent/favorites persistence (add, remove, deduplication, max limit, schema migration).
- [ ] Unit tests for placement action (identity preservation, snapshot immutability, undo/redo observation).
- [ ] Integration tests for catalog client (load, cache, invalidate, stale revalidation, pagination).
- [ ] Coverage target: ≥95% statements, branches, functions, lines globally and per file. Hard floor: 90%.

### 03-CAT-12: Evidence and exit documentation
- [ ] Mapping fixture for standard catalog item (input row → output `Open3dCatalogItem` with all fields asserted).
- [ ] Mapping fixture for configurator item if used (input Product → output `Open3dCatalogItem` with variant expansion).
- [ ] Missing image/mesh fallback fixture (missing URL → visible colored box with correct dimensions and accessible name).
- [ ] Proof that catalog/admin write paths remain server-authenticated and outside editor runtime (route test + auth boundary fixture).
- [ ] Performance fixture: measure mapping, asset validation, and placement action times with 1000-item dataset.
- [ ] Update `HANDOVER.md` with Phase 03 status, decisions, and known risks.
- [ ] Record any blockers or skipped items in `FAILURESPLAN.md`.

## Exit gate

- [ ] OOFPLWeb catalog item places as Open3D furniture with source product identity retained in every field.
- [ ] Missing asset fallback is visible, safe, and has accessible name.
- [ ] Admin CRUD ownership unchanged; no write paths in planner runtime.
- [ ] No new app-facing static data under `data/`.
- [ ] Phase 03A receives stable catalog identity, dimensions, taxonomy inputs, and asset provenance.
- [ ] Coverage ≥95% globally and per file; all four metrics (statements, branches, functions, lines) meet floor.

## Phase governance

### Forbidden actions

* Do not add new Supabase `.from()` CRUD for planner/catalog data.
* Do not move product/catalog assets into git.
* Do not add edit/delete/admin catalog controls inside planner canvas.
* Do not drop source catalog IDs from placed objects.
* Do not mix product identity with variant identity or placed configuration.
* Do not add app-facing static data under `data/`.
* Do not create a competing theme or token system in staging.
* Do not use explicit `any` in handwritten code.
* Do not use TypeScript/test/coverage ignore directives.

### Phase entry checklist

- [ ] Phase 02 domain model and actions verified in staging (114 tests pass, coverage meets gates).
- [ ] Catalog API contracts reviewed (`/api/planner/catalog`, `/api/planner/catalog/configurator`, `/api/admin/catalogs/[type]`).
- [ ] Admin CRUD boundaries understood (admin routes use `withAuth`, no client-side admin calls).
- [ ] Asset ownership clarified (R2/DB for product assets; classified runtime assets may go to `site/public/cdn/`).
- [ ] Research from leading websites (Wayfair, IKEA, Floorplanner, Planner 5D, RoomSketcher) synthesized into taxonomy and UX decisions.

### Rollback criteria

* If source IDs are lost in any placement test, abort and fix mapping.
* If admin CRUD leaks into planner runtime, abort and isolate.
* If asset URLs cannot be validated, abort and classify assets.
* If coverage cannot reach 90% floor, abort and reassess.
* If catalog search/filter p95 exceeds 200ms at 1,000 records, abort and optimize index.
* If fallback geometry is not visible or missing accessible name, abort and fix.

### Risk register

* **Risk:** Dropping source IDs breaks BOQ/quote/export workflows. **Impact:** critical. **Mitigation:** preserve source ID in every placed object; fixture tests for identity round-trip. **Owner:** catalog agent. **Status:** open.
* **Risk:** Demo GLB assets misrepresent real products. **Impact:** high. **Mitigation:** classify every asset before copying; use OOFPLWeb catalog as primary source; mark demo assets explicitly. **Owner:** catalog agent. **Status:** open.
* **Risk:** Asset moves violate CDN/R2 ownership. **Impact:** high. **Mitigation:** separate runtime/editor assets from product/catalog assets; never commit product assets to git. **Owner:** catalog agent. **Status:** open.
* **Risk:** Legacy `widthMm`/`heightMm` naming confusion (actually cm values) causes dimensional errors. **Impact:** high. **Mitigation:** explicit conversion functions with documented naming debt; fixture tests for known products. **Owner:** catalog agent. **Status:** open.
* **Risk:** Large catalog (200+ items) causes search/filter performance degradation. **Impact:** medium. **Mitigation:** client-side index with O(1) lookups; cursor-based pagination; lazy texture loading. **Owner:** catalog agent. **Status:** open.

### Success metrics

* OOFPLWeb catalog item places with source identity retained: target verified
* Missing asset fallback visible and safe: target verified
* Admin CRUD ownership unchanged: target verified
* No new static data under `data/`: target verified
* Coverage ≥95% globally and per file: target verified
* Catalog mapping <50ms per item: target verified
* Asset URL validation <10ms per asset: target verified
* Placement action <5ms: target verified
* Search/filter p95 <100ms at 1,000 records: target verified
* Catalog load p95 <500ms for 200 items: target verified

### Dependencies on external systems

* Phase 02 domain model (`src/model/types.ts`, `src/model/operations/pureActions.ts`, `src/model/operations/history.ts`).
* `/api/planner/catalog` and `/api/planner/catalog/configurator` API routes (read-only, public rate-limited).
* `/api/admin/catalogs/[type]` admin route (read-only verification from planner perspective).
* Drizzle schema: `catalog.ts`, `planner.ts` (reference only, no new CRUD).
* R2/DB-backed product images and 3D assets (URL references only).
* LocalStorage for recent/favorites persistence.

### Performance budgets

* Catalog mapping: <50ms per item (measured with fixture data).
* Asset URL validation: <10ms per asset (measured with fixture data).
* Placement action: <5ms from dispatch to state update.
* Search/filter: p95 <100ms at 1,000 records; p95 <200ms at 10,000 records.
* Catalog load: p95 <500ms for 200 items; background revalidation after initial load.
* Memory: catalog index + cache must not exceed 5MB for 1,000 items.

### Security considerations

* Admin CRUD stays under `/admin/*` and `/api/admin/catalogs/*`.
* No catalog write paths in planner runtime.
* Asset allowlist/CSP for images and meshes: only HTTPS URLs from approved origins (R2, configured CDN domains, local relative paths).
* Server-authenticated catalog admin writes; no client-side API keys or admin tokens.
* LocalStorage for recent/favorites is user-scoped and contains no PII beyond product references.

### Accessibility considerations

* Catalog items have accessible names derived from product name + category + dimensions (e.g., "Office Chair, 45 cm by 45 cm by 90 cm").
* Missing asset fallback has explicit `aria-label` and visible border/contrast.
* Search results announce count and filter state via restrained live region.
* Keyboard navigation for catalog grid: arrow keys, Enter to place, Tab for filters.
* Focus management: after placement, focus returns to catalog or moves to canvas with explicit announcement.

### Decision log

* **2026-07-03** — Decision: Type-based primary taxonomy (Furniture > Tables > Dining Tables) with room as filterable attribute, not top-level category. Reason: matches Google Shopping taxonomy, prevents cross-room product duplication, aligns with Wayfair/IKEA best practices. Alternatives: room-based hierarchy (rejected due to structural problems with multi-room products). Owner: catalog agent.
* **2026-07-03** — Decision: Two-field material approach (marketing + normalized). Reason: enables both customer-facing copy and functional filtering without fifteen marketing names breaking the filter. Alternatives: single field (rejected). Owner: catalog agent.
* **2026-07-03** — Decision: Cursor-based pagination with 50-item initial load and 20-item search pages. Reason: balances initial responsiveness with search granularity; avoids offset-based pagination performance degradation. Alternatives: offset pagination (rejected), infinite scroll (deferred to R3). Owner: catalog agent.
* **2026-07-03** — Decision: Client-side in-memory LRU cache with 5-minute TTL and background revalidation. Reason: reduces API calls, supports offline resilience, matches QUALITY-GATES.md provisional budgets. Alternatives: service worker cache (deferred to R3), no cache (rejected). Owner: catalog agent.
* **2026-07-03** — Decision: Fallback geometry is always a colored box with visible border and accessible name. Reason: simplest to generate, always visible, dimensionally accurate, safe for screen readers. Alternatives: 3D procedural mesh (deferred to R5), SVG icon (rejected for 3D context). Owner: catalog agent.
* **2026-07-03** — Decision: Preserve legacy `widthMm`/`heightMm` naming as-is in mapping layer but convert explicitly to canonical mm. Reason: avoid breaking existing API consumers and database schema; document debt in type comments. Alternatives: rename fields (rejected due to API contract stability). Owner: catalog agent.

## Risks and blockers

* Dropping source IDs breaks downstream business workflows (BOQ, quotes, export, AI). Mitigation: immutable snapshot with full provenance; fixture tests for every mapping path.
* Demo Open3D GLB assets may not represent real products. Mitigation: classify and document; never auto-select demo assets for real catalog items.
* Asset moves are unsafe. Mitigation: runtime assets separate from product assets; product assets remain R2/DB-backed.
* Legacy naming confusion (`widthMm` actually cm). Mitigation: explicit conversion layer with documented naming debt.
* Scale performance with large catalogs. Mitigation: indexed lookups, pagination, background revalidation, memory budget enforcement.

## File locations

* `open3d-next-staging/src/catalog/catalogTypes.ts` — domain model: Open3dCatalogItem, Open3dCatalogVariant, Open3dPlacedConfiguration, Open3dCatalogIndex, Open3dCatalogSearchQuery, Open3dCatalogSearchResult, Open3dFallbackGeometry.
* `open3d-next-staging/src/catalog/catalogTaxonomy.ts` — canonical taxonomy, category mapping, attribute normalization, material two-field logic, style/room tags.
* `open3d-next-staging/src/catalog/unitConversion.ts` — canonical mm conversion, display unit conversion, legacy naming debt documentation.
* `open3d-next-staging/src/catalog/catalogMapping.ts` — mapping from `/api/planner/catalog` and `/api/planner/catalog/configurator` to Open3dCatalogItem.
* `open3d-next-staging/src/catalog/assetValidation.ts` — asset URL validation, origin allowlist, expiration check, fallback resolution.
* `open3d-next-staging/src/catalog/fallbackGeometry.ts` — fallback geometry generation, accessible name construction, color assignment.
* `open3d-next-staging/src/catalog/catalogClient.ts` — catalog client class, search, filtering, indexing, caching, pagination.
* `open3d-next-staging/src/catalog/recentFavorites.ts` — recent items and favorites persistence, localStorage management, schema migration.
* `open3d-next-staging/src/catalog/placementAction.ts` — placeCatalogItem action, integration with pureActions/history, click-to-place and drag-to-place unification.
* `open3d-next-staging/src/catalog/ASSET-PROVENANCE.md` — classified asset inventory with license/attribution.
* `open3d-next-staging/tests/catalogTypes.test.ts` — domain model tests.
* `open3d-next-staging/tests/catalogMapping.test.ts` — mapping fixtures for standard and configurator items.
* `open3d-next-staging/tests/catalogSearch.test.ts` — search/filter tests with synthetic 1000-item dataset.
* `open3d-next-staging/tests/catalogFallback.test.ts` — fallback geometry tests.
* `open3d-next-staging/tests/catalogPlacement.test.ts` — placement identity and undo/redo tests.
* `open3d-next-staging/tests/catalogPerformance.test.ts` — performance assertions for mapping, validation, placement, search.

## Evidence targets

* Mapping fixture: `tests/catalogMapping.test.ts` with standard and configurator item fixtures.
* Fallback fixture: `tests/catalogFallback.test.ts` with missing URL, expired URL, invalid origin cases.
* Search fixture: `tests/catalogSearch.test.ts` with 1000-item synthetic dataset, exact/fuzzy/filter tests, performance assertions.
* Placement fixture: `tests/catalogPlacement.test.ts` with identity preservation, snapshot immutability, undo/redo observation.
* Auth boundary fixture: `tests/catalogAdminBoundary.test.ts` verifying no admin write paths in planner runtime.
* Performance fixture: `tests/catalogPerformance.test.ts` with timing assertions for mapping, validation, placement, search.
* Coverage report: `coverage/catalog/index.html` showing ≥95% per file.

## Handover notes for Phase 03A

Phase 03A receives:
* Stable `Open3dCatalogItem` identity with all source metadata preserved.
* Canonical dimensions in millimetres with documented conversion paths.
* Taxonomy inputs: category hierarchy, room tags, style tags, material normalization rules.
* Asset provenance: classified inventory with license/attribution for runtime assets.
* Search index and catalog client with known performance characteristics.
* Fallback geometry specification and implementation.
* Placement action layer integrated with history/undo/autosave.
* Test fixtures and coverage evidence.
