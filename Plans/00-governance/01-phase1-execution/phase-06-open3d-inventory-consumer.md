Execute Phase 06 only.

Primary path focus:
- site/features/planner/open3d/**
- features/planner/open3d/catalog/svg/svgTypes.ts
- **/svgBlockDescriptorLoader.ts
- site/config/route-contract.json
- results/**

Goal:
Finish descriptor-driven inventory consumption in the open3d workspace with catalogue-first UX and search parity.

Must complete:
- wire useOpen3dSvgCatalog into planner panel paths
- finish loader path integration
- preserve catalogClient.search resolver path
- enforce cursor-based pagination <= 24
- implement TTL stale UX
- prove corrupt / absent / present fallback behavior
- capture portal -> planner sync evidence
- meet coverage floor with artifacts

Check IDs:
- 06-INV-01
- 06-INV-05
- 06-TEST-01

Global Standard obligations:
- if UI-affecting choices change, create or update fresh dated benchmark evidence
- independent UI review is required
- anti-copy + pattern attestation required before claiming Implemented

Constraints:
- catalogue-first layout
- no package drift
- no parallel schema
- no bypasses
- preserve accessibility and performance budgets

Return exactly:
1. Scope executed.
2. Files changed.
3. Checks run.
4. Evidence paths.
5. Gate result by check ID.
6. Status recommendation.
7. Open blockers.
8. Next smallest safe slice.
