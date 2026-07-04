# Reference Execution Benchmark 03A - Inventory System And SVG Generation - 2026-07-03

Status: advisory only. This file is immutable after creation under `DESIGN-BENCHMARK-PROTOCOL.md`. Recommendations become binding only if copied into a numbered phase file, `IMPLEMENTATION-DECISIONS.md`, or `QUALITY-GATES.md`.

Agent role: Agent 1, brainstormer + web surfer.

Access date for all URLs: 2026-07-03.

Scope: Phase 03 and 03A planner inventory, asset library, SVG/icon pipeline, search/filtering, favorites/recents, catalog UX, accessibility, and performance plan.

## Sources Reviewed

1. RoomSketcher, "Draw Your Floor Plan in 2D & 3D", https://www.roomsketcher.com/help/draw-floor-plans/
2. IKEA US furniture category page, https://www.ikea.com/us/en/cat/furniture-fu001/
3. Wayfair furniture category page, https://www.wayfair.com/furniture/sb0/furniture-c45974.html
4. SketchUp 3D Warehouse product page, https://www.sketchup.com/en/products/3d-warehouse
5. Figma Help, "Name and organize components", https://help.figma.com/hc/en-us/articles/360038663994-Name-and-organize-components
6. Figma Help, "Add images and videos to designs", https://help.figma.com/hc/en-us/articles/360040028034-Add-components-to-your-designs
7. Algolia Docs, "Faceting", https://www.algolia.com/doc/guides/managing-results/refine-results/faceting/
8. W3C WAI-ARIA Authoring Practices Guide, "Grid Pattern", https://www.w3.org/WAI/ARIA/apg/patterns/grid/
9. web.dev, "Virtualize large lists with react-window", https://web.dev/articles/virtualize-long-lists-react-window
10. MDN, "SVG as an image", https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image
11. SVGO repository README, https://github.com/svg/svgo

Fetch limitations: some product/help URLs returned 404, login, or rate-limit responses, including Floorplanner public feature URLs, older RoomSketcher help URLs, Planner 5D URLs, SketchUp help URLs, NNGroup filtering URL, and SVGRepo licensing. Those failed pages are not used as cited evidence.

## Observed Facts

### Floor-Planning And Interior-Design Products

RoomSketcher publicly documents a guided sequence: create or template a project, draw walls, add doors/windows, then use a Furniture tab to browse by room type or search for a specific item. It emphasizes drag-and-drop placement, resize, rotate, duplicate, branded furniture, exact wall length entry, wall measurements, preview before generated 2D/3D floor plans, and download/print output. Public imagery shows a large canvas with side tool/panel chrome, product/furniture thumbnails, wall measurements, and 2D/3D continuity in marketing examples.

IKEA category pages use a browse-first taxonomy with "Shop by category", "favorite families", product cards, visible product images, ratings, dimensions, variants/options, labels such as best seller/new/last chance, sort/filter controls, "showing 24 of 171 results", show-more pagination, favorites, recently viewed, and accessibility skip links. Public product-card imagery uses product photos and contextual room photos rather than abstract icons.

Wayfair's public category page exposes broad department navigation, shop-by-room and inspiration entry points, search, account/cart/favorites-oriented commerce chrome, category menus, promotional groupings, and many product result surfaces. The fetched page was large and partially truncated, but the observable page structure confirms heavy taxonomy navigation plus search-oriented large-catalog browsing.

### CAD, Spatial-Authoring, And Asset-Library Products

SketchUp 3D Warehouse positions itself as a large 3D model library with millions of models, text search, AI-powered image search, manufacturer catalogs, real-world purchasable products, download-into-model workflow, and product promotion. Its public imagery shows visual model browsing and a model/catalog search surface, but exact UI controls were not copied or inferred beyond the visible product claims.

Figma component organization mirrors file/page/frame structure in the Assets tab and recommends documented naming conventions, including slash-separated names such as `Component/State` and `Icon/Name`. Figma groups related components in swap-instance menus by naming and source arrangement.

Figma asset handling treats images/videos as fills, supports drag/drop, bulk placement, replacement while retaining crop/position settings, and enforces a 4096 x 4096 automatic scaling limit for oversized uploaded assets. It explicitly converts imported SVG into editable vector layers rather than treating SVG as a normal image asset.

### Search, Accessibility, SVG, And Performance Sources

Algolia distinguishes hidden filters from user-visible facets, supports contextual facet values and counts, hierarchical facets, conjunctive/disjunctive filtering, search within facet values, typo/prefix/exact behavior for facet value search, and warns that deeply nested hierarchical facets increase metadata and can hurt performance.

WAI-ARIA APG defines `grid` as a composite widget where one focusable element is in the tab sequence and arrow keys move within cells. It distinguishes data grids from layout grids. For layout grids grouping product-like widgets, it notes reduced tab stops are valuable for dynamically loaded product lists and that focus should land on either the cell or the single widget inside the cell depending on content. It also requires row/cell roles, `aria-rowcount`/`aria-colcount` and indexes when rows/columns are hidden or virtualized.

web.dev documents that rendering very large lists can significantly slow performance; virtualization renders only visible items, recycles DOM nodes, supports fixed/variable lists and grids, can combine with infinite loading, and needs careful overscan because too little causes blank flashes while too much hurts performance.

MDN documents SVG-as-image support in `img`, CSS background, SVG `image`, `feImage`, and Canvas `drawImage`. It also documents browser security restrictions for SVG used as an image: JavaScript disabled, external resources not loaded, `:visited` not rendered, and native widget styling disabled. These restrictions do not apply the same way when SVG is directly embedded or loaded as a document.

SVGO is a Node.js SVG optimizer that removes redundant information such as editor metadata, comments, hidden elements, default/suboptimal values, and other safely removable content. It supports CLI, API, recursive directory processing, configuration, plugin architecture, default preset overrides, `prefixIds`, and custom plugins.

## Cross-Product Comparison

| Product/source | Relevant strength | Observed pattern useful for 03/03A | Risk if copied literally |
|---|---|---|---|
| RoomSketcher | Floor-planner task flow | Browse/search furniture, drag/drop, resize/rotate/duplicate, preview before output | Could overfit to room-first browsing and visual marketing UI instead of OOFPL source identity |
| IKEA | Large furniture catalog UX | Category browsing, variants, dimensions, ratings/status labels, favorites, recently viewed, show-more pagination, accessible skip links | Commerce detail density may overwhelm an in-canvas planner panel |
| Wayfair | Very large taxonomy and commerce discovery | Department navigation, shop-by-room, inspiration, large search surface | Promo-heavy page chrome and retail campaigns are inappropriate in a focused planner |
| SketchUp 3D Warehouse | Spatial asset library | Text/image search, manufacturer catalogs, real-world products, insert/download into model | User-generated/manufacturer 3D model workflows exceed R2/R3 planner scope |
| Figma components | Design-system asset organization | Structured library naming, related swaps, reusable component taxonomy | Figma's design-system metaphor should not replace product catalog identity |
| Algolia | Faceted search mechanics | Contextual facet counts, search-within-facet, hierarchy with performance warnings | A full hosted search dependency is unnecessary unless local index fails budgets |
| WAI-ARIA APG grid | Accessible catalog grid behavior | Roving focus, row/column metadata for virtualized grid, clear grid-vs-list roles | Applying data-grid semantics to non-tabular cards could overcomplicate screen-reader output |
| web.dev virtualization | Large-list performance | Windowed grid/list, small overscan, measurement-first performance | Virtualization without focus restoration can break keyboard/screen-reader continuity |
| MDN SVG | SVG security boundaries | Prefer generated trusted SVG; treat external SVG image restrictions explicitly | Assuming image-context restrictions sanitize embedded SVG would be unsafe |
| SVGO | SVG optimization pipeline | Deterministic optimizer step and ID-prefix discipline | Default optimization may alter IDs/viewBox/geometry unless plugin config is pinned |

## Key Ideas

1. Treat the planner inventory as a commandable asset library, not a retail page and not a flat sidebar.
2. Separate product identity, variants, symbolic footprint, preview image, mesh, placement defaults, search index, collections, and UI state.
3. Use two navigation paths: type/category-first browsing for deliberate exploration and search-first placement for fast expert workflows.
4. Support room/use-context as facets, not as the only hierarchy, because the same object can belong in multiple rooms.
5. Include compatibility filters specific to planning: fits-in-room/clearance, physical dimensions, wall-mounted/floor-standing/ceiling-mounted, 2D-symbol availability, 3D-mesh availability, missing-asset fallback status, and source catalog availability.
6. Preserve navigation context after placement: query, selected category, scroll position, density, selected result, and active facet expansion must survive click-place, drag-place, tool switches, and undo/redo.
7. Define explicit quick-access collections: favorites, recents, frequently used, project collection, and maybe source/admin-curated collections. Keep these as workspace/user state, not canonical geometry.
8. Make search ranking deterministic and explainable: exact SKU, exact name, starts-with name, category/title token, tag/synonym, room/use, fuzzy, then deterministic tie-break by configured category order and stable product ID.
9. Virtualize inventory grids/lists from the start, but design accessibility and focus retention as first-class acceptance criteria, not as a later UI issue.
10. Build SVG symbols from trusted typed definitions instead of product-provided SVG markup. Product assets may supply images/meshes, but the 2D footprint/symbol contract should remain generated and deterministic.
11. Use a pinned SVG optimization/sanitization pipeline only after generation, with golden tests ensuring viewBox, dimensions, IDs, accessibility names, and geometry do not drift.
12. Add an asset-health dimension to catalog UX: users should see when a preview/mesh/SVG is missing or substituted, and placement should still work with a dimensional fallback.

## Recommended Binding Changes

These are precise changes recommended for incorporation into `03-catalog-admin-and-asset-identity.md` and `03a-inventory-system-and-svg-generation.md` by the primary implementation agent.

1. Add an `InventoryAssetDefinition` contract to Phase 03A that explicitly links `catalogItemId`, `variantId`, `placementDefinitionId`, `symbolDefinitionId`, `previewAssetId`, optional `meshAssetId`, physical dimensions in millimetres, placement anchors, default rotation, allowed orientations, and fallback policy. This prevents product records from directly owning SVG markup or canvas rendering concerns.

2. Add a `PlannerFacetDefinition` contract to Phase 03/03A with stable facet IDs, display labels, value normalization, multi-select behavior, count behavior, and search-within-facet support for high-cardinality facets. Mark `category`, `room`, `style`, `material`, `color`, `dimensions`, `mounting`, `assetAvailability`, and `availability` as initial facets.

3. Replace Phase 03's current typo-tolerance wording, "3-char prefix matching", with a deterministic ranking specification that covers exact SKU/name, prefix, token match, synonym match, fuzzy fallback, and stable tie-breaking. Three-character prefix matching alone is too weak for furniture names and SKU workflows.

4. Add zero-result recovery requirements: show active query/facets, provide one-click clear-all, one-click clear most restrictive facet, spelling/synonym suggestions when available, and a safe "show dimension-compatible fallbacks" option. This should be tested with empty, over-filtered, and misspelled searches.

5. Add a persistent inventory-navigation-state fixture covering search query, filters, category expansion, density, scroll index, selected item, favorites view, recents view, and project collection. Verify state survives placement, duplicate, undo/redo, tool switch, panel close/reopen, and viewport tier change.

6. Add a virtualized-grid accessibility acceptance item before Phase 05: roving focus strategy, `aria-rowcount`/`aria-colcount` or listbox alternative selected intentionally, item position announcements for virtual rows, focus restoration after recycling, and no keyboard trap in long result sets. Phase 05 can implement visuals, but Phase 03A must define the contract.

7. Add "asset health" as a first-class indexed field and UI state: `previewStatus`, `symbolStatus`, `meshStatus`, `fallbackReason`, and `lastValidatedAt`. Search filters should be able to include/exclude missing preview, missing symbol, missing mesh, and fallback-only items for testing and admin diagnosis.

8. Add a generated-SVG version field and cache key contract: `symbolKind`, `symbolVersion`, canonical dimensions, anchor set, theme mode, selection state, scale bucket, and generator version. Product identity must not be part of the symbol cache key unless it changes geometry.

9. Add an SVG pipeline gate: generated typed definition -> deterministic SVG AST/string -> sanitizer/validator -> pinned optimizer config -> structural validation -> golden fixture. Tests must prove stable viewBox, no scripts, no event handlers, no external references, no unsafe URLs, deterministic IDs, and unchanged physical bounds after optimization.

10. Add a warning to Phase 03A that MDN SVG image-context restrictions are not a sanitizer for embedded/editor SVG. Any SVG inserted into the DOM or exported as document markup still needs explicit validation.

11. Add performance fixtures at 100, 1,000, and 10,000 records for index build, first result render, search, filter toggle, facet-count update, virtualized scroll, preview lazy load, and placement acknowledgement. Current Phase 03A budgets cover search and SVG generation but not index build or virtualized render.

12. Add bounded storage policy for favorites/recents/project collections: schema version, max count, deterministic eviction, corrupt localStorage recovery, unavailable product handling, and privacy statement that only product references are stored. Phase 03 has limits for favorites/recents but should add corrupt data and unavailable product fixtures.

13. Add image/design observation acceptance language: use product photos where available for preview cards, but generated monochrome/semantic footprints for canvas/export; never copy competitor product-card layouts, proprietary imagery, icons, or trade dress.

14. Add a Phase 03A fixture gallery requirement with matrix rows for category, dimensions, rotation, theme, selected state, print/export mode, high contrast, missing preview, missing mesh, missing SVG, long label, and fallback symbol. The existing gallery requirement should become this explicit matrix.

15. Add a catalog UX handoff artifact for Phase 05: information architecture map for category navigation, search box, facet rail/sheet, grid/list density, item preview, variant selector, favorites/recents/project collection, placement actions, and asset-health indicators. This keeps Phase 03A from implementing final UI while preventing Phase 05 from guessing contracts.

## Rejected Ideas

1. Do not copy RoomSketcher's room-first Furniture tab as the primary taxonomy. Room-first browsing is helpful as a facet or quick path, but the OOFPL catalog needs type-based identity and products can belong to multiple rooms.
2. Do not import Wayfair/IKEA commerce density wholesale into the planner. Ratings, promos, financing, and retail merchandising are irrelevant to fast placement and would compete with canvas work.
3. Do not add hosted Algolia or another external search service in Phase 03A unless the local deterministic index fails the stated 10K-record budget. Current scope can be satisfied with local index contracts and fixtures.
4. Do not rely on external/user-provided SVG product icons as trusted planner symbols. Generate symbols from typed geometry and use product SVG only after explicit sanitization and provenance approval, if ever.
5. Do not treat SVGO's default preset as automatically safe. Pin configuration and prove optimizer output preserves IDs, viewBox, physical dimensions, accessibility nodes, and deterministic markup.
6. Do not defer virtualized-grid accessibility entirely to Phase 05. Visual implementation can wait, but focus and screen-reader contracts must be defined in Phase 03A because they affect state shape and item identity.
7. Do not persist favorites/recents/project collections in canonical plan geometry. They are user/workspace preferences; placed configurations remain canonical document data.
8. Do not make image search or AI visual similarity a Phase 03A requirement. SketchUp shows this is useful for huge libraries, but it is not necessary for R2/R3 unless catalog size and user evidence justify it.

## Image And Design Observations

Public product/help pages expose broad visual patterns only. RoomSketcher imagery shows a canvas-dominant floor-plan editor with side controls and furniture thumbnails. IKEA and Wayfair category pages show image-rich product cards, variant thumbnails, status badges, favorites/commerce affordances, and category carousels. SketchUp 3D Warehouse imagery shows visual model search/catalog browsing and model insertion into a spatial workflow. These observations support principles of visual browsing, variant visibility, and asset-health clarity; they do not justify copying exact layouts, colors, icons, imagery, or proprietary card composition.

## Impact On Current Plan

Phase 03 is already strong on source identity, variant preservation, admin boundaries, asset fallback, and local favorites/recents. It is weaker on facet definitions, search ranking explainability, asset-health indexing, corrupt localStorage recovery, unavailable favorites/recents, and query/filter state survival.

Phase 03A correctly separates inventory and SVG concerns, requires deterministic symbols, and defers final docking/UI to Phase 05. It needs more precise contracts for inventory asset definitions, virtualized accessibility, SVG cache keys, SVG optimizer safety, fixture gallery matrix, index-build/render performance, and Phase 05 UX handoff artifacts.

## Recommended Next Step

Primary implementation agent should copy accepted recommendations into the binding Phase 03 and 03A checklists before implementation. Minimum recommended binding set: items 1 through 12 under "Recommended Binding Changes". Items 13 through 15 are lower risk but useful to prevent Phase 05 ambiguity.
