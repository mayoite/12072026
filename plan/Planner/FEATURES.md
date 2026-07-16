# Planner features

Repo-sourced index: **feature → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| This file | Current code map and known gaps |
| `CHECKLIST.md` | Required work and fresh verification status |
| `docs/architecture/06-UI-BENCHMARK.md` | Planner UI acceptance contract |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | Target database SVG contract |

**Code roots:** `site/features/planner/` · `site/app/planner/` · `site/app/api/planner/` · `site/platform/drizzle/schema/planner.ts` · `site/inventory/descriptors/` · `site/public/svg-catalog/`

Table paths are relative to `site/features/planner/` unless they start with `site/`. `app/...` means `site/app/...`.

**Live host:** `editor/OOPlannerWorkspace.tsx` wires canvas, catalog, export, AI, validation. Parallel trees (`catalog-api/`, `shared/`, `cloud-store/`, `persistence/`) still serve APIs, portal, and legacy paths.

---

## Phase 1 — start and BOQ

| Feature | Code | Gap |
|---|---|---|
| Guest / member routes | `app/planner/(workspace)/guest/`, `canvas/`, `ui/PlannerWorkspaceRoute.tsx` | Auth on protected routes not re-proved |
| Marketing, features, help | `landing/`, `help/`, `app/planner/(marketing)/` | Browser proof open |
| Setup gate (one gate) | `onboarding/ProjectSetupGate.tsx`, `onboarding/ProjectSetupStep.tsx` | Project name is mandatory; no skip or edit-later path |
| Onboarding coach | `onboarding/OnboardingCoach.tsx` | Browser proof open |
| Guest permissions | `model/plannerPermissions.ts`, `project/lib/commands/plannerAccessContext.ts` | — |
| Session / errors | `ui/PlannerSessionDialog.tsx`, `editor/PlannerErrorBoundary.tsx` | — |
| Project document (mm) | `project/model/`, `project/model/units.ts` | — |
| Conversion events | `site/lib/analytics/siteEvents.ts`, `site/lib/analytics/conversionContract.ts` | Only `PLANNER_ENTRY` has a call site; Planner does not emit project, placement, BOQ, or handoff events |
| Primary BOQ | `project/shared/export/projectFurnitureBoq.ts` | Parallel: `workstationBoqV0.ts`, `shared/boq/buildBoq.ts` |
| Branded PDF BOQ library | `shared/export/brandedPdfExport.ts`, `shared/export/pdfExport.ts` | Not wired into the live workspace; defaults to `One&Only`; rows may include unit prices |
| Quote cart (partial) | `project/catalog/workstationBoqV0.ts`, `shared/boq/quoteCartBridge.ts`, `editor/OOPlannerWorkspace.tsx` | Live workspace uses the workstation-only bridge; the generic bridge is not wired |

---

## Phase 2 — design workspace

| Feature | Code | Gap |
|---|---|---|
| Shell | `editor/WorkspaceShell.tsx`, `editor/dock/ModularPlannerShell.tsx`, `TopBar.tsx`, `workspacePlanMetrics.ts` | Production browser verified at 375px and 1440px; broader protected-route and full E2E proof remains open |
| Tools | `editor/canvasTool.ts`, `CanvasToolRail.tsx` | Room, dimension, text deferred |
| 2D canvas | `canvas/PlannerFabricStage.tsx`, `lib/geometry/` | — |
| Walls / openings | `useRoomElements.ts`, `useDoorWindowPlacement.ts` | Column/keep-out create tool missing |
| Edit / undo | `editor/PropertiesPanel.tsx`, `project/store/history.ts`, `lib/geometry/alignDistribute.ts`, `lib/geometry/gridLayout.ts` | Align/distribute is wired; grid is a pure helper only; row/array/group/ungroup UI is absent |
| Catalog UI | `editor/InventoryPanel.tsx`, `project/catalog/catalogSearch.ts`, `project/catalog/catalogBuyerVisibility.ts` | UI-CAT-* browser proof open |
| Workstation config | `editor/WorkstationConfiguratorPanel.tsx`, `project/catalog/workstationConfiguratorV0.ts` | — |
| Catalog APIs | `app/api/planner/catalog/route.ts`, `app/api/planner/catalog/configurator/route.ts`, `app/api/planner/catalog/svg-blocks/route.ts` | `svg-blocks` strictly dual-reads native and legacy DB rows and filters internal inventory; the live DB currently returns zero buyer-visible SVG items |
| SVG on canvas | `canvas/fabricBlock2D.ts`, `project/catalog/furnitureBlock2D.ts`, `project/catalog/svg/svgPlanSymbolCache.ts` | Block2D fallback common; DB-SVG-* open |
| Asset publish | `asset-engine/`, `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts` | PNG thumb stub; consumer does not read committed revision artifact bytes |
| 3D | `3d/ThreeLazyViewer.tsx`, `buildPlannerSceneNodes.ts`, `loadGeneratedGlbObject.ts` | GLB load partial |
| Persistence | `usePlannerWorkspaceAutosave.ts`, `cloud-store/plannerPersistence.ts`, `cloud-store/offlineStorage.ts`, `cloud-store/syncQueueProcessor.ts` | Save-state UI not browser-closed |
| Import / templates | `importUtils.ts`, `floorPlanImageImport.ts`, `templates/layoutTemplates.ts` | — |
| AI assist | `ai/AIAssistDrawer.tsx`, `workspaceAiBridge.ts`, `app/api/planner/ai-advisor/` | Browser proof open |
| Sketch-to-plan | `ai/sketchToPlan.ts`, `app/api/planner/sketch-to-plan/`, `project-sketch/` | — |
| Local versions | `lib/versioning.ts` | Local snapshots can be labelled, but remain mutable localStorage data and pin no catalog, validation, or price version |

---

## Phase 3 — scale, validate, and price

| Feature | Code | Gap |
|---|---|---|
| Family / options | `catalog-api/productFamilyContract.ts`, `project/catalog/workstationFamilyBuyer.ts`, configurator bridges | End-to-end through validation and BOQ remains thin |
| Bulk align/distribute | `lib/geometry/alignDistribute.ts`, `lib/geometry/gridLayout.ts`, `editor/OOPlannerWorkspace.tsx` | Align/distribute is wired; exact-spacing controls, row/array/grid workflow, group/ungroup, and bulk preview are absent |
| Validation UI | `editor/ValidationPanel.tsx`, `lib/validation/runValidation.ts` | Overlap stub only (`furnitureOverlap.ts`); `compliance.ts` returns `[]` |
| Live pricing (admin) | `site/features/admin/pricing/priceBookService.ts`, `site/features/admin/pricing/AdminPriceBookPageView.tsx` | Not pinned in workspace BOQ |
| Workspace BOQ price display | `project/shared/export/projectFurnitureBoq.ts` | JSON/CSV exports use demo INR list prices; no customer-ready price authority or workspace line-item price view |
| Named revisions | `lib/versioning.ts` | Labels exist on local snapshots only; revisions are not immutable or server-owned |
| Review links | `cloud-store/reviewPersistence.ts`, `site/platform/drizzle/schema/planner.ts` | Server helpers and schema exist; no API routes or review UI |
| Portal / admin plans | `portal/PortalPlanPageView.tsx`, `site/features/admin/plans/AdminPlansPageView.tsx`, `cloud-store/plannerPublish.ts` | Live-data proof open |

---

## Phase 4 — deliver and handoff

| Feature | Code | Gap |
|---|---|---|
| Export menu | `editor/TopBar.tsx`, `editor/OOPlannerWorkspace.tsx` | Guest gets JSON/SVG and BOQ JSON/CSV; member also gets PNG/PDF/DXF/workstation/quote; browser proof open |
| Floor plan exports | `project/shared/export/exportUtils.ts` | JSON, SVG, PNG, PDF, DXF exist |
| BOQ exports | `projectFurnitureBoq.ts`, `exportPlannerFurnitureBoqToCsv` | Unify parallel BOQ builders |
| Export preflight | `exportPreflight.ts` | — |
| Send to Oando | `app/api/planner/handoff/route.ts` | Member-only stub counts item SKUs and returns success; no Planner caller and no delivery to Oando |
| Draft vs customer-ready | — | Not distinguished |
| Handoff events | `conversionContract.ts` (`HANDOFF_*`) | Not emitted |
| Handoff security | `app/api/planner/handoff/route.ts`, `site/features/shared/api/withAuth.ts` | Member auth and rate limiting exist; CSRF is not enabled; idempotency and commercial authorization are absent |

---

## Admin dependency (blocks live catalog / SVG / prices)

Not a customer phase. Disk still supplies the live SVG bytes. Both Admin publish entrypoints also write Products DB records when configured. The DB stores artifact metadata, not artifact bytes.

| Area | Code | Gap |
|---|---|---|
| SVG publish | `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts`, `site/features/admin/svg-editor/storage/drizzleSvgPersistence.server.ts` | DB write is fail-closed and stores the released `BlockDescriptor`; revision id/version are still fixed at `r1`/`1` |
| Planner read | `app/api/planner/catalog/svg-blocks/route.ts` → `loadBuyerVisibleDescriptorsWithDb()` | Native `BlockDescriptor` and strict legacy rows are accepted; configured DB errors or incompatible rows return no SVG items; artifact bytes are never read |
| Catalog admin | `site/features/admin/catalog/AdminCatalogTable.tsx`, `site/features/admin/catalog/` | Live browser proof open |
| Price books | `site/features/admin/pricing/priceBookService.ts` | Filesystem store; workspace pin open |

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
| `POST /api/planner/handoff` | `app/api/planner/handoff/route.ts` |

---

## Parallel paths (reconcile before ship)

- **BOQ:** `projectFurnitureBoq` vs `workstationBoqV0` vs `shared/boq/buildBoq`
- **Catalog read:** disk `inventory/descriptors/` + DB-aware `svg-blocks` definitions vs committed SVG revision artifact bytes
- **Catalog trees:** `project/catalog/` (live host) vs top-level `catalog-api/`
- **SVG compile:** `compileSvgForPublish` (publish) vs `svgCompiler.server.ts` (reference)

---

## Tests

`site/tests/unit/features/planner/` (incl. `cloud-store/`, `catalog-api/`) · `site/tests/integration/features/planner/`

---

## Reference (not truth)

`CHECKLIST.md` · `docs/architecture/06-UI-BENCHMARK.md` · `docs/architecture/08-DATABASE-SVG-CONTRACT.md`
