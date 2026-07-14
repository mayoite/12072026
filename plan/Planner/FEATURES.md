# Planner features

Repo-sourced index: **plan phase → code path → honest gap**. Reconciled against `site/` on 2026-07-14.

| Doc | Role |
|---|---|
| `PHASE-01` … `PHASE-04` | What to build and prove |
| This file | Where it lives in code |
| `CHECKLIST.md` | Status only — verify in browser |

**Code roots:** `site/features/planner/` · `site/app/planner/` · `site/app/api/planner/` · `site/platform/drizzle/schema/planner.ts` · `site/block-descriptors/` · `site/public/svg-catalog/`

**Live host:** `editor/OOPlannerWorkspace.tsx` wires canvas, catalog, export, AI, validation. Parallel trees (`catalog/`, `shared/`, top-level `store/`, `persistence/`) still serve APIs, portal, and legacy paths.

---

## Phase 1 — start and BOQ

Plan: `PHASE-01-start-and-boq.md`

| Feature | Code | Gap |
|---|---|---|
| Guest / member routes | `app/planner/(workspace)/guest/`, `canvas/`, `ui/PlannerWorkspaceRoute.tsx` | Auth on protected routes not re-proved |
| Marketing, features, help | `landing/`, `help/`, `app/planner/(marketing)/` | Browser proof open |
| Setup gate (one gate) | `onboarding/ProjectSetupGate.tsx`, `ProjectSetupStep.tsx` | Optional fields block today; `StartingPointStep.tsx` dead |
| Onboarding coach | `onboarding/OnboardingCoach.tsx` | — |
| Guest permissions | `model/plannerPermissions.ts`, `project/lib/commands/plannerAccessContext.ts` | — |
| Session / errors | `ui/PlannerSessionDialog.tsx`, `editor/PlannerErrorBoundary.tsx` | — |
| Project document (mm) | `project/model/`, `project/model/units.ts` | — |
| Conversion events | `lib/analytics/siteEvents.ts`, `lib/analytics/conversionContract.ts` | Only `PLANNER_ENTRY` wired; no `PROJECT_START`, `FIRST_PLACEMENT`, `BOQ_GENERATED` |
| Primary BOQ | `project/shared/export/projectFurnitureBoq.ts` | Parallel: `workstationBoqV0.ts`, `shared/boq/buildBoq.ts` |
| Branded unpriced BOQ | `shared/export/brandedPdfExport.ts` | — |
| Quote cart (partial) | `shared/boq/quoteCartBridge.ts`, `OOPlannerWorkspace` | Workstation path only |

---

## Phase 2 — design workspace

Plan: `PHASE-02-design-workspace.md`

| Feature | Code | Gap |
|---|---|---|
| Shell | `editor/WorkspaceShell.tsx`, `TopBar.tsx`, `workspacePlanMetrics.ts` | UI-SHELL/MOB not browser-closed |
| Tools | `editor/canvasTool.ts`, `CanvasToolRail.tsx` | Room, dimension, text deferred |
| 2D canvas | `canvas/PlannerFabricStage.tsx`, `lib/geometry/` | — |
| Walls / openings | `useRoomElements.ts`, `useDoorWindowPlacement.ts` | Column/keep-out create tool missing |
| Edit / undo | `PropertiesPanel.tsx`, `project/store/history.ts`, `lib/geometry/alignDistribute.ts` | Row/array/grid/group/ungroup missing |
| Catalog UI | `editor/InventoryPanel.tsx`, `catalogSearch.ts`, `catalogBuyerVisibility.ts` | UI-CAT-* browser proof open |
| Workstation config | `WorkstationConfiguratorPanel.tsx`, `workstationConfiguratorV0.ts` | — |
| Catalog APIs | `app/api/planner/catalog/route.ts`, `.../configurator/`, `.../svg-blocks/` | `svg-blocks` → `loadBuyerVisibleDescriptors()` from disk (`catalogLifecycle.ts`) |
| SVG on canvas | `fabricBlock2D.ts`, `furnitureBlock2D.ts`, `svgPlanSymbolCache.ts` | Block2D fallback common; DB-SVG-* open |
| Asset publish | `asset-engine/`, `admin/svg-editor/publishDescriptorWithPipeline.ts` | PNG thumb stub; consumer still disk-first |
| 3D | `3d/ThreeLazyViewer.tsx`, `buildPlannerSceneNodes.ts`, `loadGeneratedGlbObject.ts` | GLB load partial |
| Persistence | `usePlannerWorkspaceAutosave.ts`, `store/plannerPersistence.ts`, `offlineStorage.ts`, `syncQueueProcessor.ts` | Save-state UI not browser-closed |
| Import / templates | `importUtils.ts`, `floorPlanImageImport.ts`, `templates/layoutTemplates.ts` | — |
| AI assist | `ai/AIAssistDrawer.tsx`, `workspaceAiBridge.ts`, `app/api/planner/ai-advisor/` | Browser proof open |
| Sketch-to-plan | `ai/sketchToPlan.ts`, `app/api/planner/sketch-to-plan/`, `project-sketch/` | — |
| Local versions | `lib/versioning.ts` | Not named revisions (Phase 3) |

---

## Phase 3 — scale, validate, and price

Plan: `PHASE-03-scale-validate-price.md`

| Feature | Code | Gap |
|---|---|---|
| Family / options | `catalog/productFamilyContract.ts`, configurator bridges | End-to-end through validation/BOQ thin |
| Bulk align/distribute | `lib/geometry/alignDistribute.ts` | Exact spacing, row/array/grid, group/ungroup missing |
| Validation UI | `editor/ValidationPanel.tsx`, `lib/validation/runValidation.ts` | Overlap stub only (`furnitureOverlap.ts`); `compliance.ts` returns `[]` |
| Live pricing (admin) | `admin/pricing/priceBookService.ts`, `AdminPriceBookPageView.tsx` | Not pinned in workspace BOQ |
| Workspace BOQ price display | `projectFurnitureBoq.ts` | Demo-list INR in CSV export path |
| Named revisions | — | `versioning.ts` is local snapshots only |
| Review links | `store/reviewPersistence.ts`, `schema/planner.ts` | No API routes or review UI |
| Portal / admin plans | `portal/PortalPlanPageView.tsx`, `admin/AdminPlansPageView.tsx`, `store/plannerPublish.ts` | Live-data proof open |

---

## Phase 4 — deliver and handoff

Plan: `PHASE-04-deliver-handoff.md`

| Feature | Code | Gap |
|---|---|---|
| Export menu | `editor/TopBar.tsx`, `OOPlannerWorkspace.handleExport` | Guest menu narrower — verify |
| Floor plan exports | `project/shared/export/exportUtils.ts` | JSON, SVG, PNG, PDF, DXF exist |
| BOQ exports | `projectFurnitureBoq.ts`, `exportPlannerFurnitureBoqToCsv` | Unify parallel BOQ builders |
| Export preflight | `exportPreflight.ts` | — |
| Send to Oando | — | Not implemented |
| Draft vs customer-ready | — | Not distinguished |
| Handoff events | `conversionContract.ts` (`HANDOFF_*`) | Not emitted |
| Handoff security | — | CSRF, rate-limit, idempotency open |

---

## Admin dependency (blocks live catalog / SVG / prices)

Not a customer phase. Publish is **disk-authoritative** today; optional DB dual-write on server action only.

| Area | Code | Gap |
|---|---|---|
| SVG publish | `admin/svg-editor/publishDescriptorWithPipeline.ts` | API route has no `dbRepository`; `block_descriptors` DB table never written |
| Planner read | `app/api/planner/catalog/svg-blocks/route.ts` → `loadBuyerVisibleDescriptors()` | Disk `block-descriptors/`; not DB artifact bytes |
| Catalog admin | `admin/AdminCatalogTable.tsx`, `admin/catalog/` | Live browser proof open |
| Price books | `admin/pricing/priceBookService.ts` | Filesystem store; workspace pin open |

---

## APIs

| Route | Code |
|---|---|
| `GET /api/planner/catalog` | `app/api/planner/catalog/route.ts` |
| `GET /api/planner/catalog/svg-blocks` | `app/api/planner/catalog/svg-blocks/route.ts` |
| `GET /api/planner/catalog/configurator` | `app/api/planner/catalog/configurator/route.ts` |
| `POST /api/planner/ai-advisor` | `app/api/planner/ai-advisor/route.ts` |
| `POST /api/planner/sketch-to-plan` | `app/api/planner/sketch-to-plan/route.ts` |
| `POST /api/planner/project-sketch` | `app/api/planner/project-sketch/route.ts` |
| `POST /api/planner/generated-glb` | `app/api/planner/generated-glb/route.ts` |

---

## Parallel paths (reconcile before ship)

- **BOQ:** `projectFurnitureBoq` vs `workstationBoqV0` vs `shared/boq/buildBoq` vs `buddyBoqAdapter.ts`
- **Catalog read:** disk `block-descriptors/` + `svg-blocks` vs Drizzle SVG revision tables
- **Catalog trees:** `project/catalog/` (live host) vs top-level `catalog/`
- **SVG compile:** `compileSvgForPublish` (publish) vs `svgCompiler.server.ts` (reference)

---

## Tests

`site/tests/unit/features/planner/` · `site/tests/unit/features/planner/asset-engine/` · `site/tests/integration/plannerPersistence.test.ts` · `site/tests/integration/planner-store-plannerPersistence.test.ts`

---

## Reference (not truth)

`CHECKLIST.md` · `PHASE-01` … `PHASE-04` · `docs/architecture/06-UI-BENCHMARK.md` · `docs/architecture/08-DATABASE-SVG-CONTRACT.md`
