# UI 01 — Admin shell & SVG studio

**Scope:** Admin chrome, dashboard, SVG editor (edit path), price books, high-risk actions.  
**Live UI this session:** **Not opened.** Claims from code + `docs/architecture/07-ADMIN-UI-BENCHMARK.md`.  
**One sentence each.**

1. Admin is not ready for production operator use as a professional no-code studio.  
2. The shell is relatively coherent, but SVG authoring is not a complete safe product workflow.  
3. Operators need one visible path from product identity to a verified Planner symbol.  
4. Units, footprint, draft state, validation, preview, publication, and recovery must stay visible together.  
5. JSON and pipeline knowledge must not be required for ordinary publish.  
6. Visual stage foundations exist (shapes, selection, layers, undo, zoom, preview services) but are incomplete as a journey.  
7. 3D previews (GLB extruder, model viewer) are partial and not acceptance-closed.  
8. Price-book page exposes raw storage values (minor units, basis points) instead of operator currency language.  
9. Approve, activate, and rollback can appear with equal visual weight despite unequal risk.  
10. High-risk actions lack enough consequence text, role context, confirmation, and recovery detail.  
11. Internal schema and compiler language still reaches the operator on inventory-adjacent surfaces.  
12. Draft versus public product difference is not always obvious before a write starts.  
13. Publication progress, success, and failure must be unambiguous and never invent success on partial failure.  
14. Keyboard access and visible focus are required for every studio action and are not fully browser-closed.  
15. Auth and high-risk confirmation UX must meet WCAG 2.2 AA and are not signed off.  
16. Desktop and phone Admin shells need fresh proof free of unexplained console and request errors.  
17. Feature flags, analytics, and settings pages exist as ops chrome but are outside primary SVG acceptance.  
18. CRM and customer-queries UIs are demo-grade and should not be presented as production Admin.  
19. Family authoring UI exists without a browser-proven 2D/3D/BOQ release journey.  
20. Studio a11y contracts in code are not a substitute for a real keyboard and assistive-technology pass.

## Routes to verify live

- `/admin` · `/admin/svg-editor/[slug]` · `/admin/price-books` · `/access` (no bypass)
