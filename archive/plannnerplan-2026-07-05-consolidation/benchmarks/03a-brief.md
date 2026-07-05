# Phase 03A Binding Inventory And SVG Design Brief

## Scope

This brief binds the Phase 03A inventory/SVG user-experience contract that Phase 05 must implement visually. It does not authorize production UI implementation, competitor visual copying, route replacement, or changes outside the staging-first conversion path.

## Target Users And Top Tasks

- Guest planners need to find a common item quickly, preview its footprint, place it, and continue drawing without losing catalog context.
- Member planners need repeatable access to favorites, recents, frequently used items, and project collections across longer sessions.
- Designers/admin-assisted users need trustworthy product identity, dimensions, availability/status, variant cues, and missing-asset recovery.
- Top tasks are search, browse by type, filter by room/use/style/size/status, compare footprint basics, choose a variant, click-place, drag-place, replace selected, favorite, reopen recent, and recover from missing previews/SVG/mesh.

## Information Architecture

- Primary navigation is type-based taxonomy: category -> subcategory -> product/result card. Room, style, material, size, availability, and asset-readiness are filters, not the primary hierarchy.
- Inventory has four persistent retrieval lanes: Browse, Search Results, Saved, and Project. Saved contains favorites and frequently used items. Project contains recents and project collections.
- Search is a first-class mode, not only a filter on the current category. Entering a query searches all compatible inventory unless the user pins category/filter scope.
- Result cards show, in priority order: preview or fallback footprint, name/short name, key dimensions, variant/status cue, source/SKU on expanded preview, and available actions.
- Variant selection stays inside the product card/detail preview; variants must not flood search results unless they materially differ in dimensions or asset readiness.
- Recents and favorites save product plus variant/configuration when available, not product ID alone.

## Interaction Model

- Inventory state must survive placement, active tool changes, panel collapse, docking changes, and viewport resize.
- Click-place and drag-place use the same typed placement command as duplicate, import, and AI placement. UI must not mutate document objects directly.
- Search results use deterministic ranking with visible sort/filter state. If zero results occur, the UI offers clear recovery: relax filters, show suggested query, clear scope, or browse nearest categories.
- Filters are applied as visible chips with one-click removal and a single reset action. Resetting filters must not clear favorites, recents, collections, or document geometry.
- Replace selected is allowed only when the selected item and candidate item have compatible placement semantics; it preserves position, rotation, and scale where valid and explains disabled reasons otherwise.
- Missing image, mesh, or SVG never blocks browsing or placement. The user sees a stable fallback footprint, a concise reason, and asset-readiness state.

## Desktop And Tablet Layout

- Desktop default: inventory docks left, properties/inspector docks right, command strip remains top, canvas keeps the largest uninterrupted area. Inventory default width may use the current staging contract of 340 px with a 280 px minimum, subject to Phase 05 canvas-minimum rules.
- Desktop supports constrained docking to left or right rails. Bottom docking is reserved for short review/collection strips, not the default inventory browse surface.
- Floating inventory is optional in Phase 05 and must be bounded, keyboard movable, resettable, and subordinate to a strong default docked layout.
- Tablet: inventory becomes one active edge sheet with compact command bar. It must preserve query, scroll anchor, focused item, and filters while opening/closing.
- Small viewport: review and deliberately limited editing only unless a specific authoring workflow is accepted. Use sheets and task steps, not miniature floating panels.

## Density And Preview States

- Comfortable density is the default for discovery; compact density is for experienced users and narrow panels. Density is a workspace preference, not document state.
- Every card supports loading, image-ready, SVG-ready, missing-image, missing-SVG, unavailable, selected-for-placement, favorite, disabled, and keyboard-focused states.
- Preview footprint must be dimensionally honest. Product imagery may aid recognition in cards, but canvas/SVG footprint remains simplified, stable, and semantic.
- Long names and large counts must not collapse action targets. Compact cards may truncate names only with accessible full names and a detail/preview route.

## Keyboard And Screen Reader Behavior

- Inventory exposes named regions for search, category navigation, filters, results, saved items, and project collections.
- Search input has a stable accessible name, reports result count changes through restrained live-region announcements, and does not announce on every keystroke if results are still pending.
- Category and filter controls use standard button/listbox/checkbox semantics as appropriate. Disabled controls expose disabled reasons.
- Results use a virtualized grid/list pattern with roving focus or `aria-activedescendant`; focus must remain on the same catalog identity when rows recycle, sorting changes, or placement returns focus.
- Keyboard operations include focus search, clear search, move through results, open preview/details, favorite/unfavorite, add to collection, click-place at a defined default/last target, start drag-place alternative, close sheet/panel, and reset filters.
- Screen-reader labels distinguish product identity, variant, dimensions, status, and fallback reason. SVG symbols include accessible names but decorative internal paths remain silent.

## Virtualized Grid Contract

- Virtualization must preserve stable item keys by catalog ID plus variant/configuration ID.
- Focus retention is by identity, not DOM index. If the focused item disappears after filtering, focus moves to the nearest remaining result and announces the change.
- Scroll position and active result are preserved when placing an item, toggling favorites, changing tools, docking/undocking, and returning from preview.
- Result count, loaded range, and pending state are available to UI tests without relying on visual pixels.

## Panel And Docking Contract For Phase 05

- Phase 05 owns visual docking and panel chrome, but must consume the Phase 03A inventory panel contract and extend it with layout preference schema versioning, viewport clamping, reset-layout, and safe default recovery.
- Required panel commands: toggle inventory, focus inventory search, reset inventory filters, toggle density, open saved items, open project collections, favorite focused item, place focused item, and close/collapse where the viewport grammar allows it.
- Docking must be keyboard-accessible. Move/dock commands announce new position and return focus to the invoking control after close/collapse.
- Inventory preferences are workspace preferences. They must never be written into canonical plan geometry.
- A corrupted or off-screen layout restores the default inventory position without changing document contents.

## SVG Visual And Token Contract

- SVG symbols are semantic plan footprints, not product illustrations. They must remain legible at minimum canvas size, rotated, selected, printed, and high-contrast.
- SVG preview, canvas footprint, and export geometry share canonical millimetre dimensions and stable viewBox.
- Geometry is separate from theme. Phase 05 must map visual styling through canonical `site/app/css/` tokens and planner bundles, not create a competing palette.
- Fallback SVG uses visible cross-hatched geometry and accessible reason text. It must be clear without relying on color alone.
- Technical symbols need export legend support in the Phase 06/export flow when symbol-only items appear.

## Accepted Inspirations

- Large-catalog products validate task-oriented retrieval: search, favorites, room/use filters, and recents must complement taxonomy.
- Spatial-planning tools validate stable 2D footprint placement with product imagery kept mostly in the catalog/card layer.
- Mature creative/CAD tools validate command discoverability, visible shortcuts, disabled reasons, and recovery/reset controls.
- Professional panel systems validate constrained docking with strong defaults over arbitrary window clutter.

## Rejected Inspirations

- Donor sidebar visual parity, donor styling, and donor information hierarchy are rejected as final UI direction.
- Competitor colors, icon shapes, exact panel geometry, wording, screenshots, and trade dress are rejected.
- Ecommerce-style product grids that prioritize marketing imagery over dimensional footprint are rejected for canvas placement tasks.
- Unlimited desktop-style free-floating panels are rejected unless Phase 05 proves bounds, keyboard movement, collision safety, and reset recovery.
- Search that is fast but opaque, non-deterministic, or poor at zero-result recovery is rejected.

## Intentional Differences

- OOFPLWeb inventory must favor dimensional trust, placement continuity, and recovery over storefront browsing.
- Missing assets are visible, placeable fallbacks rather than broken cards or hidden items.
- Product identity and placed configuration remain traceable through search, placement, save/load, BOQ, quote, AI, and export.
- The best default layout is required before personalization; movability is not a substitute for hierarchy.

## Testable Acceptance Criteria

- Users can search, browse, filter, favorite, reopen recent, use a project collection, preview dimensions, and place without losing inventory context.
- Search/filter p95 meets `QUALITY-GATES.md` budgets at 1,000 and 10,000 records, and relevance fixtures verify deterministic ranking and zero-result recovery.
- Keyboard-only users can perform search, filter, preview, favorite, place, and recover focus after virtualization and placement.
- Screen-reader users receive useful result count, focused item, dimensions, variant/status, fallback reason, and placement feedback without announcement flooding.
- Desktop, tablet, and small viewport capability matches `IMPLEMENTATION-DECISIONS.md` tiers.
- Missing image, mesh, and SVG states have visible and accessible fallbacks.
- Phase 05 can implement dock/move/resize/collapse/reset without adding document-state coupling or inventing new inventory command semantics.
