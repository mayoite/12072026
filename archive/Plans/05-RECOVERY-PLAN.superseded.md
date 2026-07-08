# 05-RECOVERY-PLAN.md

## 1. Authority
- **Revisions:** `00-REVISION.md`
- **Decisions:** `../../00-governance/01-phase1-execution/01-implementation-decisions.md`
- **Routing:** `../../00-governance/01-phase1-execution/00-handover-routing.md`
- **Gates:** `../../00-governance/01-phase1-execution/08-quality-gates.md`

## 2. Phase 1A: Open3D Shell Stabilization [ACTIVE]
- **Scope:** Lock the L1 shell frame and base planner command pipeline. 
- **Files:** `../../../site/app/planner/(workspace)/guest/page.tsx`, `../../../site/features/planner/open3d/lib/commands/**`, `../../../site/app/css/core/locked/planner/open3d-workspace.css`
- **Evidence:** `lint:ui:strict` PASS. `test:planner` PASS. E2E 100dvh check PASS (`results/site/phase1/ui-1/`).
- **Blocker:** No L3 module dev (Inventory/Layers) until Phase 1A passes.

## 3. Phase 1B: Admin SVG Pipeline [PENDING]
- **Scope:** Execute Option A SVG architecture. Wire Puck editor to Zod schema without `SVG.js`.
- **Files:** `../../../site/features/planner/admin/svg-editor/**`, `../../../site/features/planner/open3d/catalog/svg/svgTypes.ts`, `../../../scripts/generate-svg.mjs`
- **Evidence:** API 422 on compile fail. Zod round-trip validation. Golden fixtures match (`svgPhase1Completion.test.ts`).

## 4. Phase 1C: Auth & Persistence Matrix [PENDING]
- **Scope:** Member-gate admin routes, JSON-on-disk persistence, R2 PNG thumbnails.
- **Files:** `../../../site/app/api/admin/svg-editor/route.ts`, `../../../site/config/route-contract.json`, `../../../site/scripts/catalog_snapshot_upload_r2.ts`
- **Evidence:** 403 on unauthenticated POST. Read-then-equal round-trip test PASS. `tsc --noEmit` PASS.

## 5. Phase 1D: Final Verification & Route Swap [PENDING]
- **Scope:** Promote Open3D pilot behind feature flag. Cumulative E2E/A11Y soak.
- **Files:** `/planner/open3d` entry vs `/planner/guest` mirror.
- **Evidence:** `release:gate` full pass. WCAG AA PASS. 0 explicit `any`. 90% hard coverage.

## 6. Rules
- **Evidence First:** Moving from `Implemented` -> `Verified` requires live site validation logs securely stored in `results/`.
- **CSS Constraint:** Canonical Vanilla CSS/Tokens only. No parallel Tailwind allowed in `site/features/planner/open3d/**`.
