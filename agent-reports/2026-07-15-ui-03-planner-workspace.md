# UI 03 — Planner workspace

**Scope:** Guest/member workspace shell, canvas tools, catalog UI, setup, export/BOQ UI, mobile.  
**Live UI this session:** **Not opened.** Claims from code + `docs/architecture/06-UI-BENCHMARK.md` + Planner FEATURES.  
**One sentence each.**

1. Setup gate still forces optional metadata that should be skippable and editable later.  
2. Dead `StartingPointStep` leaves onboarding language incomplete and confusing.  
3. Room, dimension, and text tools appear deferred on the rail and must not fake geometry.  
4. Columns and keep-outs cannot be created from normal canvas tools.  
5. Catalog presentation benchmarks (`UI-CAT-*`) are not browser-closed.  
6. Save states must be distinct; failed save must never show success (`UI-STATE-*`).  
7. Desktop shell benchmarks (`UI-SHELL-*`) are not closed with browser evidence.  
8. Phone layout benchmarks (`UI-MOB-*`) are not closed with browser evidence.  
9. Primary journey accessibility (`UI-A11Y-*`) is not verified end-to-end.  
10. Primary journeys still need proof free of unexplained console, request, and hydration errors.  
11. Block2D fallback is still common; released SVG as primary symbol is not UI-proven.  
12. Quote cart UI does not clearly cover all placed catalog furniture.  
13. Draft versus customer-ready BOQ export is not distinguished in the export menu.  
14. Send to Oando UI does not exist as an explicit, recoverable, status-bearing action.  
15. Workspace BOQ does not pin and display live price-book version and currency.  
16. Validation panel reflects thin rules and can under-warn operators and customers.  
17. AI assist and sketch-to-plan UIs lack fresh browser proof without errors.  
18. Marketing, help, coach, and guest-command behavior need browser verification.  
19. Review and portal plan UIs lack live-data proof for read-only review journeys.  
20. Bulk placement and group tools missing means large-layout UI workflows are incomplete.

## Routes to verify live

- `/planner` · `/planner/guest` · `/planner/canvas` · export menus · mobile 390
