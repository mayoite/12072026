# Fresh Execution Benchmark Phase 03A — 2026-07-03

Status: immutable after creation under `DESIGN-BENCHMARK-PROTOCOL.md`. Recommendations become binding only when copied into a numbered phase file, `IMPLEMENTATION-DECISIONS.md`, or `QUALITY-GATES.md`.

Access date: 2026-07-03

Scope: inventory system and SVG generation, including inventory browse/search UX, placement support, accessibility, symbol theming, and missing-asset behavior.

## Sources Reviewed

- RoomSketcher: category-first furniture library, favorites, templates, configurable placement fields
- Planner 5D: large catalog, image search, project-level recents
- HomeByMe: two-path catalog entry and configurable/generic filter
- SketchUp 3D Warehouse: scalable search, filters, sorting, image search
- Figma and W3C/ARIA guidance: canvas accessibility, announcements, keyboard patterns
- SVG/web standards sources: accessible names, `currentColor`, missing `<use>` fallback behavior

## Benchmark Takeaways

- Browse and search should be separate but connected inventory states.
- Large catalogs need recents, favorites, filters, sorting, zero-result recovery, and asset status visibility.
- Project-level recents and in-editor recently placed items are different systems.
- Configurable items need an explicit facet and schema support.
- Inventory SVGs need explicit accessible names and theme-safe color rules.
- Missing previews, symbols, or meshes must not hide items from search or browse.
- Large inventory grids need roving focus, not raw Tab traversal.
- Announcements should be coalesced and typed, not ad hoc.

## Binding Changes

1. Inventory navigation must expose two states:
   browse mode for category/subcategory and collections;
   search mode for query, facets, sorting, count, and zero-result recovery.

2. Add in-editor recents as its own system:
   dedupe by `catalogItemId + variantId`, move reused items to the top, use bounded LRU eviction, and define corrupt-storage recovery.

3. Add a `configurability` facet:
   `fixed` for manufacturer dimensions, `configurable` for bounded user-settable dimensions.

4. Keep project-level recents separate from recently placed items.

5. Require explicit SVG accessibility:
   every non-decorative SVG uses `role="img"` plus `aria-label` or `aria-labelledby`;
   decorative SVGs use `aria-hidden="true"`.

6. Require theme-safe SVG output:
   primary fills use `currentColor` or named semantic CSS variables, never hardcoded theme hex values.

7. Require explicit preview dimensions:
   every inventory thumbnail `<img>` has width, height, alt text, and an error fallback.

8. Define a missing-symbol fallback chain:
   build-time fallback for missing definitions, runtime fallback for broken `<use>` references, and dimensional preservation for layout stability.

9. Define roving-focus grid behavior now:
   one active `tabindex="0"`, arrow-key movement, proper virtualized-grid restoration, and full row/column metadata.

10. Define typed live-announcement categories:
    placement, filter-result count, undo/redo, and error announcements with polite/assertive rules and coalesce windows.

11. Add deterministic sorting state:
    `sortField` plus `sortDirection`, with stable tie-breaking.

12. Extend item anchoring rules:
    support `floor`, `wall`, `ceiling`, and `floating` mounting contracts.

13. First-run inventory state must show:
    featured collection, recents, category entry points, and search prompt.

14. Items with missing preview, symbol, or mesh must remain visible and searchable with a degraded-state indicator and placement fallback.

## Rejected Patterns

- Do not make image search a Phase 03A implementation requirement; keep it as a later candidate only.
- Do not use polygon count or file size as primary floor-plan catalog facets.
- Do not build a Figma-scale synthetic accessibility tree for ordinary HTML inventory UI.
- Do not rely on SVG `<title>` alone for accessible naming.
- Do not use `aria-live="assertive"` for ordinary catalog updates.
- Do not hide degraded assets from results.
- Do not ship `<use>` references without runtime fallback behavior.
- Do not rely on sequential Tab navigation for large grids.

## Research Limits

Public sources did not confirm strong keyboard or screen-reader behavior in competitor asset panels. That gap is a reason to exceed the market standard, not to lower the requirement.
