# Issues 02 — Planner

**Source:** Earlier major-issue audit + `plan/Planner/CHECKLIST.md` + FEATURES.  
**UI verified:** No.  
**One sentence each.**

1. SVG symbols still come primarily from disk descriptors, not committed DB artifact bytes by revision key.  
2. Released SVG is not reliably the primary 2D symbol; `Block2D` fallback remains a common path.  
3. Three BOQ paths mean quantity and price identity can disagree across export, quote cart, and workstation flows.  
4. Quote cart is workstation-skewed and does not clearly cover all placed catalog furniture.  
5. `StartingPointStep.tsx` is dead while setup still blocks optional metadata that should be skippable.  
6. Room outline, dimension, and text tools sit on the rail as deferred stubs that do not create real geometry.  
7. Columns and keep-outs cannot be created from the canvas as required tools.  
8. Row, array, and grid bulk placement, group/ungroup, exact spacing, and bulk preview are missing.  
9. Overlap validation is not rotate-aware; production validation for walls, aisles, chairs, and boundaries is incomplete.  
10. Accessibility and compliance rules are not versioned advisory rules with reason-required waivers.  
11. Live price-book version and currency are not pinned into workspace BOQ.  
12. Draft or demo prices can reach export paths without a clear customer-ready gate.  
13. Named immutable project revisions that bind catalog, family, validation, and price versions do not exist.  
14. Read-only review links with comments and revocation lack a complete API and UI.  
15. Send to Oando is not implemented as an explicit, recoverable, idempotent handoff.  
16. Customer-ready BOQ export is not distinguished from draft export.  
17. Conversion events `PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED`, and `HANDOFF_*` are not emitted from the workspace.  
18. One-hundred-seat and two-thousand-seat performance budgets are not recorded or met.  
19. Generated GLB load and AI assisted layout lack fresh browser proof without console or request errors.  
20. Desktop shell, phone layout, and a11y benchmarks are not closed with browser evidence.

## Depends on Admin

- DB-SVG authority cutover before live catalog/SVG claims.  
- Retired products blocked on live canvas (unit only today).
