# Issues 03 — Admin

**Source:** Earlier major-issue audit + `plan/Admin/CHECKLIST.md` + FEATURES + `Failures.md`.  
**UI verified:** No.  
**One sentence each.**

1. Publish pipeline is disk-authoritative; Products DB cutover (`DB-SVG-01`…`05`) is still blocked.  
2. No migration dry-run or DB versus source parity tooling (`DB-SVG-17`/`18`) exists before removing disk authority.  
3. Dual-write injects a repository but still writes stub definition and version data.  
4. Lifecycle manifest and descriptor audit are file-based under `results/`, not transactional database audit.  
5. No `published_svg_revision_id` product pointer write closes release identity in Products DB.  
6. Admin list UI explicitly labels “Products DB not live,” so the product admits split authority.  
7. Full Admin coverage claim is invalid until a fresh full-tree coverage run hits the agreed floor.  
8. Production auth smoke skips when `DEV_AUTH_BYPASS` is on, so the production gate is unproven.  
9. Retire then restore then live Planner canvas is not browser-proven end-to-end.  
10. Price-book governance shows raw minor units and equal visual weight for unequal-risk actions.  
11. Price books are a file store, not multi-actor database governance with durable audit.  
12. Bulk JSON import dominates the SVG inventory entry experience instead of a primary no-code path.  
13. Internal pipeline language leaks into the operator UI.  
14. Catalog phone layout becomes an extremely tall scan with icon-only row actions.  
15. CRM and customer-queries Admin surfaces are demo localStorage, not production ops.  
16. Family authoring exists in code but 2D, 3D, and BOQ parity with released family fixtures is unproven in browser.  
17. High-risk publish, rollback, and retire actions still lack consequence, recovery, and role clarity at production bar.  
18. Step 0 automated canonical-descriptor hash gate is not in CI or `check:layout`.  
19. Chrome DevTools MCP Lighthouse a11y path is blocked when Google Chrome stable is missing.  
20. End-to-end publish to Planner consume under DB authority with failed publish preserving prior release is not closed.

## Active Failures.md items

- BLOCK DB-SVG-01…05, DB-SVG-17/18.  
- FAIL Admin coverage floor.  
- GAP unauthenticated Admin smoke.  
- OPEN Planner retire/restore placement.
