# UI 02 — Admin list only

**Scope:** SVG inventory list, catalog list/table, inventory paging/filters/actions.  
**Live UI this session:** **Not opened.** Claims from code + Admin UI benchmark + list components.  
**One sentence each.**

1. SVG inventory list source is local disk, not Products DB, and the UI says so.  
2. Lifecycle badges resolve from a gitignored file manifest, not durable DB lifecycle.  
3. Artifact badges reflect disk `public/svg-catalog` state, not immutable revision rows.  
4. Bulk JSON import is visually dominant on the SVG list entry page and should be advanced-only.  
5. Internal pipeline language competes with product-task language on the list.  
6. Catalog desktop list was previously measured very tall with ~60 local records.  
7. Catalog phone list was previously measured even taller as a flattened long scan.  
8. Many row actions are icon-only without unambiguous accessible names (`ADM-LIST-03`).  
9. Saved views for SVG inventory live in `localStorage` only and are not shared or durable.  
10. Catalog list still lacks proven saved views and deliberate bulk work at the benchmark bar.  
11. Family variant grouping and comparison are not acceptance-closed (`ADM-LIST-04`).  
12. Rows do not consistently expose SKU, commercial availability, and last authoritative release change.  
13. Lifecycle retire and restore from the list are not proven on live Planner placement.  
14. Lifecycle PATCH reloads the whole page instead of updating the row cleanly.  
15. Search, multi-filter, sort, and paging exist but are only partially browser-proven (`ADM-LIST-01`).  
16. Read-only versus editable data source is not always known before a list write.  
17. Missing, invalid, and published states can disagree with any future DB dual-write view.  
18. Phone review mode that hides authoring tools and declares unavailable tools is not closed (`ADM-MOB-*`).  
19. Bulk edit, validation, publication, and retirement lack previewed per-row failure reporting.  
20. List green unit tests for filters are not operator proof of a usable inventory workstation.

## Benchmark IDs

- `ADM-LIST-01` … `ADM-LIST-04`  
- `ADM-BULK-01` … `ADM-BULK-02`  
- `ADM-MOB-01` … `ADM-MOB-03`  
- `ADM-SVG-18` (inventory-related)

## Routes to verify live

- `/admin/svg-editor` · `/admin/catalog` · `/admin/inventory` (if present) at 1440 and 390
