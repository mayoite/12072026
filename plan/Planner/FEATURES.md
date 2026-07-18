# Planner features

Repo-sourced index: **feature → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| This file | Current code map and known gaps |
| `CHECKLIST.md` | Open / partial work only |
| `docs/architecture/06-UI-BENCHMARK.md` | Planner UI acceptance contract |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | Target database SVG contract |

**Only two plan docs per track:** `CHECKLIST.md` + `FEATURES.md`.

**Code roots:** `site/features/planner/`  /  `site/app/planner/`  /  `site/app/api/planner/`  /  `site/platform/drizzle/schema/planner.ts`  /  `site/inventory/descriptors/`  /  `site/public/svg-catalog/`

Table paths are relative to `site/features/planner/` unless they start with `site/`. `app/...` means `site/app/...`.

**Live host:** `editor/OOPlannerWorkspace.tsx` wires canvas, catalog, export, AI, validation. Document kernel lives at planner root (`model/`, `store/`, `lib/`, `persistence/`, `catalog/`, `shared/`). Parallel trees (`catalog-api/`, `cloud-store/`) still serve APIs, portal, and legacy paths.

**Execution status (2026-07-18):** brand inventory + dual-write ahead; guest place / BOQ browser / PDF craft OPEN. See `CHECKLIST.md`.

---

## Phase 1  -  start and BOQ

| Feature | Code | Gap |
|---|---|---|
| Guest / member routes | `app/planner/(workspace)/guest/`, `canvas/`, `ui/PlannerWorkspaceRoute.tsx` | P1 PASS: UUID v7 guest drafts, scoped IndexedDB, bare URL = new draft, ID URL resumes matching draft, member owner scoping, enumeration blocked via owner-scoped API load, entry-state matrix in `tests/unit/features/planner/entry/entryStates.test.tsx` + browser `tests/e2e/planner-entry-states.spec.ts` (new / resume / malformed / two-UUID keys). Residual: guest→member migrate still unit-only (no full browser auth claim journey yet) |
| Marketing, features, help | `landing/`, `help/`, `app/planner/(marketing)/` | Browser proof open |
| Setup gate (one gate) | `onboarding/ProjectSetupGate.tsx`, `onboarding/ProjectSetupStep.tsx` | Project name is mandatory; no skip or edit-later path |
| Onboarding coach | `onboarding/OnboardingCoach.tsx` | Browser proof open |
| Guest permissions | `model/plannerPermissions.ts`, `lib/commands/plannerAccessContext.ts` |  -  |
| Session / errors | `ui/PlannerSessionDialog.tsx`, `editor/PlannerErrorBoundary.tsx` |  -  |
| Project document (mm) | `model/` (`types.ts`, `units.ts`, `actions/`, `operations/`) | P2 PARTIAL: mm canonical, display units (mm/cm/m/in/ft-in), linear/angular/area/quantity precision via `PLANNER_PRECISION`. Wall centreline/joins in `wallContract.ts`. Remaining: fail-visibly on unsupported versions; preserve unknown safe data when schema permits |
| Conversion events | `conversionContract.ts`, `OOPlannerWorkspace` | `BOQ_GENERATED`, `HANDOFF_INTENT` / `SUCCESS` / `FAILURE` emit from Review export and Send to Oando. `PROJECT_START` / `FIRST_PLACEMENT` still open |
| Primary BOQ | `shared/export/projectFurnitureBoq.ts` | Live Review/export/handoff path. Legacy `workstationBoqV0` specialty export remains; `shared/boq/buildBoq` unused by live host |
| Branded PDF BOQ library | `shared/export/brandedPdfExport.ts`, `furnitureBoqBridge.ts` | Wired from Review “Download branded BOQ PDF”; demo-list pricing labeled |
| Quote cart | `furnitureBoqBridge.ts`, `editor/OOPlannerWorkspace.tsx` | All placed furniture lines → quote cart (not workstation-only) |

---

## Phase 2  -  design workspace

| Feature | Code | Gap |
|---|---|---|
| Shell | `ModularPlannerShell`, `LayersPanel`, `TopBar` | Canvas-first Dockview; Layers from TopBar shows customer categories only (walls/doors/windows/furniture/rooms); 2D layer gates doors/windows |
| Tools | `editor/canvasTool.ts`, `CanvasToolRail.tsx` | Room (exact panel), wall, opening, dimension live; text deferred |
| 2D canvas | `canvas/PlannerFabricStage.tsx`, `canvas/installPlannerFabricExtensions.ts`, `lib/geometry/` | Fabric `AligningGuidelines` for furniture edge/center. Rooms paint as polygons; durable annotations paint as offset dim lines. Wall snaps in `lib/geometry/snapping.ts` |
| Walls / openings | `model/wallContract.ts`, `model/actions/walls.ts`, `model/actions/openings.ts`, `lib/geometry/wallGraph.ts`, `lib/geometry/roomOutline.ts`, `lib/geometry/dimensions.ts`, `lib/geometry/orthogonal.ts`, `lib/geometry/snapping.ts`, `lib/geometry/openingPlacement.ts`, `canvas/PlannerFabricStage.tsx`, `canvas/wallSnapMarker.ts`, `editor/ExactRoomPanel.tsx`, `editor/PropertiesPanel.tsx` | P2 PASS centreline/joins. P4 OPEN residual: exact room outline + auto wall/overall dims unit-landed (`roomOutline`/`dimensions`/ExactRoomPanel); sticky ortho OR Shift; dimension two-click tool; join-aware endpoint move (unit). Remaining: wall grips UI, opening drag reposition, browser proof (PF-05/PF-06) |
| Edit / undo | `PropertiesPanel`, `alignDistribute`, `gridLayout` | Align/distribute + multi-select array (row / grid / 5-col); group/ungroup still absent; wall orthogonal sticky lock on tool rail |
| Catalog UI | `editor/InventoryPanel.tsx`, `catalog/catalogSearch.ts`, `catalog/catalogBuyerVisibility.ts` | UI-CAT-* browser proof open |
| Workstation config | `editor/WorkstationConfiguratorPanel.tsx`, `catalog/workstationConfiguratorV0.ts` |  -  |
| Catalog APIs | `app/api/planner/catalog/route.ts`, `app/api/planner/catalog/configurator/route.ts`, `app/api/planner/catalog/svg-blocks/route.ts` | `svg-blocks` strictly dual-reads native and legacy DB rows and filters internal inventory; the live DB currently returns zero buyer-visible SVG items |
| SVG on canvas | `canvas/fabricBlock2D.ts`, `catalog/resolvePlanSvgUrl.ts`, `svgPlanSymbolCache.ts` | Place stamps `/svg-catalog/{slug}.svg` when preview missing; paint prefers published SVG then Block2D; sparse disk set remains |
| Asset publish | `asset-engine/`, `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts` | PNG thumb stub; consumer does not read committed revision artifact bytes |
| 3D | `3d/ThreeLazyViewer`, `buildPlannerSceneNodes`, `sceneParity`, `loadGeneratedGlbObject` | Generated GLB uploads to Supabase `catalog-assets/generated/*` when service role set (never site/public). Doors/windows as 3D nodes. `checkSceneParity` matrix for walls/furniture/openings |
| Persistence | `usePlannerWorkspaceAutosave`, `cloudPlanHydration`, `editor/PlannerSyncConflictDialog.tsx` | Conflict dialog (keep local / keep cloud) wired; pure `resolveConflict` remains source of truth. Immutable revisions + single save-state machine still open |
| Import / templates | `shared/export/importUtils.ts`, `lib/floorPlanImageImport.ts`, `lib/underlayCalibrate.ts` | Sketch accept preserves locked underlay; default 10 m width scale; Properties 5 m / 10 m calibrate; 2-point calibrate pure helpers ready |
| AI assist | `AIAssistDrawer`, `applyLayoutToWorkspace`, `workspaceAiBridge` | Apply only via WorkspaceAiBridge → `applyLayoutToWorkspace`. Legacy `applySuggestedLayout` fail-closed. Browser failure journey open |
| Sketch-to-plan | `ai/sketchToPlan.ts`, `ai/applySketchWallObjects.ts`, `editor/SketchToPlanDialog.tsx`, `app/api/planner/sketch-to-plan/` | Guest+CSRF wired; legacy `project-sketch` returns 410. Underlay preserve open |
| Local versions | `lib/versioning.ts` | Local snapshots can be labelled, but remain mutable localStorage data and pin no catalog, validation, or price version |

---

## Phase 3  -  scale, validate, and price

| Feature | Code | Gap |
|---|---|---|
| Family / options | `catalog-api/productFamilyContract.ts`, `catalog/workstationFamilyBuyer.ts`, configurator bridges | End-to-end through validation and BOQ remains thin |
| Bulk align/distribute | `lib/geometry/alignDistribute.ts`, `lib/geometry/gridLayout.ts`, `editor/OOPlannerWorkspace.tsx` | Align/distribute is wired; exact-spacing controls, row/array/grid workflow, group/ungroup, and bulk preview are absent |
| Validation UI | `editor/ValidationPanel.tsx`, `editor/ReviewQuotePanel.tsx`, `lib/validation/runValidation.ts`, `furnitureRoomBoundary.ts`, `furnitureClearance.ts` | P8 PARTIAL: OBB overlap + outside-room + 900 mm aisle clearance. `compliance.ts` is legacy stub pointing at `runFloorValidation`. Browser proof open |
| Live pricing (admin) | `site/features/admin/pricing/priceBookService.ts`, `site/features/admin/pricing/AdminPriceBookPageView.tsx` | Not pinned in workspace BOQ |
| Workspace BOQ price display | `shared/export/projectFurnitureBoq.ts` | JSON/CSV exports use demo INR list prices; no customer-ready price authority or workspace line-item price view |
| Named revisions | `lib/versioning.ts` | Labels exist on local snapshots only; revisions are not immutable or server-owned |
| Review links | `cloud-store/reviewPersistence.ts`, `site/platform/drizzle/schema/planner.ts` | Server helpers and schema exist; no API routes or review UI |
| Portal / admin plans | `portal/PortalPlanPageView.tsx`, `site/features/admin/plans/AdminPlansPageView.tsx`, `cloud-store/plannerPublish.ts` | Live-data proof open |

---

## Phase 4  -  deliver and handoff

| Feature | Code | Gap |
|---|---|---|
| Export menu | `TopBar`, `OOPlannerWorkspace` | Honest export toasts; empty floors blocked; **no GLB menu item** (preflight returns unsupported if forced). Interchange = JSON/DXF. Generated modular GLB **upload** path live when Supabase configured. Full scene GLB download still not implemented |
| Floor plan exports | `shared/export/exportUtils.ts`, `shared/export/exportPreflight.ts` | JSON, SVG, PNG, PDF, DXF exist; success is boolean-checked |
| BOQ exports | `shared/export/projectFurnitureBoq.ts`, `exportPlannerFurnitureBoqToCsv` | Unify parallel BOQ builders |
| Export preflight | `shared/export/exportPreflight.ts` | Blocks empty geometry; honest GLB unsupported |
| Send to Oando | `app/api/planner/handoff/route.ts`, `editor/ReviewQuotePanel.tsx`, `shared/handoff/` | Member Review form posts BOQ + contact; persists `customer_queries` (source `planner-handoff`); optional Resend staff email; 501 only when CRM admin client missing |
| Draft vs customer-ready | Review exports + handoff confirm | Demo pricing note + confirmDemoPricing; branded PDF BOQ distinct from draft JSON/SVG |
| Handoff events | `conversionContract.ts` (`HANDOFF_*`) | INTENT/SUCCESS/FAILURE emitted from workspace caller |
| Handoff security | `app/api/planner/handoff/route.ts`, `withAuth` | Member auth, CSRF, rate limit, idempotency key; commercial price authority still demo-list |

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
| `POST /api/planner/generated-glb` | `app/api/planner/generated-glb/route.ts`  -  Supabase `catalog-assets/generated/*` or 501 |
| `POST /api/planner/handoff` | `app/api/planner/handoff/route.ts` |

---

## Parallel paths (reconcile before ship)

- **BOQ:** `projectFurnitureBoq` vs `workstationBoqV0` vs `shared/boq/buildBoq`
- **Catalog read:** disk `inventory/descriptors/` + DB-aware `svg-blocks` definitions vs committed SVG revision artifact bytes
- **Catalog trees:** `catalog/` (live host) vs `catalog-api/` (API/store side)
- **SVG compile:** `compileSvgForPublish` (publish) vs `catalog/svg/svgCompiler.server.ts` (reference)

---

## Tests

`site/tests/unit/features/planner/` (incl. `cloud-store/`, `catalog-api/`)  /  `site/tests/integration/features/planner/`

---

## Reference (not truth)

`CHECKLIST.md`  /  `docs/architecture/06-UI-BENCHMARK.md`  /  `docs/architecture/08-DATABASE-SVG-CONTRACT.md`
