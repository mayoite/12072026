# Read-only audit: `site/features/`

**Date:** 2026-07-19  
**Scope:** `site/features/` (read-only; no code changes, no test runs)  
**Method:** Structure scan, architecture doc cross-check, pattern grep, size analysis, test mirror sampling, `Failures.md` alignment.

---

## Summary

**679 source files** across 6 domains:

| Domain | Files |
|--------|------:|
| planner | 450 |
| admin | 149 |
| shared | 40 |
| site | 24 |
| crm | 15 |
| ops | 1 |

---

## Critical / structural

### 1. Oversized “god” modules (maintainability risk)

Several core files far exceed a reasonable ~1k-line ceiling:

| File | Lines |
|------|------:|
| `planner/editor/OOPlannerWorkspace.tsx` | 2,399 |
| `planner/canvas/PlannerFabricStage.tsx` | 2,010 |
| `planner/editor/PropertiesPanel.tsx` | 1,599 |
| `planner/editor/InventoryPanel.tsx` | 1,484 |
| `site/data/routeCopy.ts` | 1,210 |
| `planner/catalog-api/generatedCatalogItemsPart1.ts` | 1,164 |
| `planner/catalog-api/generatedCatalogItemsPart2.ts` | 1,093 |
| `planner/model/operations/pureActions.ts` | 1,075 |
| `admin/svg-editor/views/AdminSvgEditorListView.tsx` | 1,004 |

These concentrate UI, state, and domain logic in single files. Refactors are high-risk; tests exist for some but coverage depth is unlikely to match complexity.

### 2. Dual catalog trees (boundary confusion)

Architecture (`docs/architecture/01-MODULE-LAYOUT.md`) positions `planner/catalog-api/` as the catalog API surface, but **`planner/catalog/` (47 files)** also owns search, client, SVG loader, hooks (`usePlannerWorkspaceCatalog`), and inventory. Two parallel catalog layers with overlapping concerns.

### 3. Near-duplicate modules (`cloud-store` vs `catalog-api`)

These pairs are effectively the same code with minor formatting/import differences:

- `planner/cloud-store/plannerManagedProducts.ts` ↔ `planner/catalog-api/plannerManagedProducts.ts`
- `planner/cloud-store/plannerManagedProducts.client.ts` ↔ `planner/catalog-api/plannerManagedProducts.client.ts`
- `catalog-api/plannerManagedProductsShared.ts` is only a re-export shim

Drift risk: fixes in one tree may not reach the other.

### 4. Node `fs` modules without `server-only` guard

These use `node:fs` but lack `import "server-only"`:

- `planner/catalog/svg/svgBlockDescriptorLoader.ts`
- `planner/catalog/svg/descriptorPointer.ts`
- Several `admin/svg-editor/storage/*` and `lifecycle/*` modules

`catalogClient.ts` mitigates with dynamic import, but `catalog/index.ts` re-exports `svgBlockDescriptorLoader` as a namespace — accidental client import could bundle fs code or fail at build time.

### 5. Active blockers touching features (from `Failures.md`)

- **DB-SVG cutover PARTIAL** — dual-write proven locally; C4 parametric factory Playwright journey, deploy env flip, and full DB-SVG matrix still **OPEN**
- **Admin hydration mismatch** on `/admin/plans` — **OPEN**
- **Seating card media** — **PARTIAL**

---

## High

### 6. Deprecated code still on live paths

Many `@deprecated` symbols remain wired:

- `planner/cloud-store/plannerStore.ts` — facade still used by `Toolbar`, geometry utils, floor templates, etc.
- `planner/ai/applySuggestedLayout.ts` — exported but fail-closed; live path is `applyLayoutToWorkspace`
- `planner/asset-engine/svg/parametric/drawLinearDeskFromTemplate.ts` — deprecated template pen; still exported from `asset-engine/index.ts`
- `planner/shared/document/types.ts`, `workstationBoqV0.ts`, `featureFlags.ts` localStorage overrides

### 7. Legacy catalog authority still mixed in

`planner/cloud-store/catalogData.ts` (`furnitureCatalog`) is still consumed by AI (`aiService.ts`, `aiStore.ts`), placement resolver, and admin handlers — alongside newer `catalog-api` / managed-products / SVG descriptor paths. Two catalog authorities in one product loop.

### 8. Hardcoded colors (theme-token bypass)

Many canvas/3D/parametric modules use literal hex instead of CSS tokens:

- `PlannerFabricStage.tsx` (15+ hex fallbacks)
- `fabricBlock2D.ts`, `createSceneObjectFromNode.ts`, `buildPlannerSceneNodes.ts`
- `drawLinearDesk.ts`, `drawDeskAssembly.ts`, `useThemeVariables.ts`

Inconsistent theming and harder dark/print parity.

### 9. `dangerouslySetInnerHTML` without uniform sanitization

| Location | Sanitized? |
|----------|------------|
| `catalog-api/CatalogBlockPreview.tsx` | Yes (`sanitizeInlineSvg`) |
| `catalog-api/renderBlockPrims.tsx` | Yes |
| `admin/svg-editor/parametric/LinearDeskParametricForm.tsx` | **No** (internal compile output) |
| `admin/svg-editor/publish/LiveCompiledSvgPreview.tsx` | **No** |
| `admin/svg-editor/views/edit-shell/AdminSvgPreviewRail.tsx` | **No** |
| `admin/svg-editor/publish/PublishedSvgPreview.tsx` | Trusted disk artifact only (documented) |

Admin previews trust compiler output; defense-in-depth is inconsistent.

### 10. Generated / ingest bloat in source tree

- **~2.3k lines** of generated catalog data split across `generatedCatalogItemsPart1/2.ts`
- **10 CSV variants** under `catalog-api/ingest/csv/` with overlapping names (`Workstation and basic storages website*.csv`)

Source noise and unclear canonical ingest input.

### 11. CRM UI styling debt

`results/tsx-hardcoded-audit.csv` flags CRM views heavily:

- `crm/ProjectDetailView.tsx` — 182 hardcoded-style matches
- `crm/ClientsView.tsx` — 171
- `crm/QuotesView.tsx` — 137

Heavy arbitrary Tailwind (`text-[0.625rem]`, `tracking-[0.2em]`, etc.) vs shared design tokens used elsewhere.

---

## Medium

### 12. `console.warn` / `console.error` in product paths

Present in: `exportUtils.ts`, `featureFlags.ts`, `usePlannerWorkspaceAutosave.ts`, `OOPlannerWorkspace.tsx`, `catalogStore.ts`, `plannerManagedProducts.ts`, admin preview components. Not suppressed, but noisy in production and against “no silent console” discipline.

### 13. Single `@ts-expect-error`

`planner/canvas/fabricAligningGuidelines.ts` — missing types for Fabric dist-extensions entry. Typed dependency or local declarations would be cleaner.

### 14. Monolithic non-planner UI

- `site/assistant/UnifiedAssistant.tsx` (880 lines)
- `planner/editor/TopBar.tsx` (833 lines)
- `ops/CustomerQueriesOpsPageView.tsx` (577 lines) — entire `ops` domain is this one file

### 15. Documented test coverage gaps

`tests/unit/features/planner/coverageGap.test.ts` explicitly targets branches still under-covered in `placementAction`, `svgFixtureGallery`, `catalogClient`, `inventoryState`, etc. Unit green ≠ full branch coverage for catalog/SVG paths.

### 16. Stale phase / PLAN-FAIL commentary

Many files (`catalogClient.ts`, `InventoryPanel.tsx`, `inventoryIndex.ts`) carry long inline PLAN-FAIL / BP-06 comments from earlier phases. Noise for new contributors; some may be outdated.

### 17. `portal/` subdomain thin

Only 3 files (`PortalPageView`, `GuestPortalPageView`, `PortalPlanPageView`) — minimal surface, unclear if fully exercised in E2E.

---

## Low / positive

**Strengths observed:**

- No handwritten `any` types in actual code (comments only)
- No `eslint-disable` / `@ts-nocheck` in features
- Strong test mirroring overall (~800+ unit tests under `site/tests/unit/features/`)
- `server-only` used on most `.server.ts` modules
- Pure helpers like `wallEndpointGrips.ts` are small, typed, and have a matching test
- `catalogClient` uses guarded dynamic import to keep `node:fs` out of client bundles
- Architecture cleanup artifacts (`importGraphProof.ts`) document the Fabric-only planner route graph

---

## Suggested priority order (if acting on findings)

1. Resolve **duplicate `plannerManagedProducts*`** — single canonical module + re-exports
2. Add **`server-only`** to fs-touching planner catalog modules
3. Plan **splits** for `OOPlannerWorkspace` / `PlannerFabricStage` (highest regression risk)
4. Clarify **`catalog/` vs `catalog-api/`** ownership in docs and imports
5. Finish **DB-SVG cutover** and **admin plans hydration** per `Failures.md`
6. Gradually retire **deprecated** `plannerStore` facade and template desk drawer
7. Normalize **CRM styling** to shared tokens

---

**Verdict:** OPEN (audit only — no fixes applied)  
**Evidence:** Static read of `site/features/`; no `pnpm run check:layout` or browser proof run.
