# Planner features

Repo-sourced index: **feature → code path → honest gap**. Live code and fresh checks are authoritative.

| Doc | Role |
|---|---|
| This file | Current code map and known gaps |
| `FINISH-PLAN.md` | Required work and fresh verification status |
| `docs/architecture/06-UI-BENCHMARK.md` | Planner UI acceptance contract |
| `docs/architecture/08-DATABASE-SVG-CONTRACT.md` | Target database SVG contract |

**Code roots:** `site/features/planner/` · `site/app/planner/` · `site/app/api/planner/` · `site/platform/drizzle/schema/planner.ts` · `site/inventory/descriptors/` · `site/public/svg-catalog/`

Table paths are relative to `site/features/planner/` unless they start with `site/`. `app/...` means `site/app/...`.

**Live host:** `editor/OOPlannerWorkspace.tsx` wires canvas, catalog, export, AI, validation. Document kernel lives at planner root (`model/`, `store/`, `lib/`, `persistence/`, `catalog/`, `shared/`). Parallel trees (`catalog-api/`, `cloud-store/`) still serve APIs, portal, and legacy paths.

**Execution status (mirrors `FINISH-PLAN.md`, 2026-07-17):** P0 PARTIAL · P1 PASS · P2 PARTIAL · P3 PARTIAL · P4 IN PROGRESS · P5 PARTIAL · P6 PARTIAL · P7 PARTIAL · P8 PARTIAL · P9 PARTIAL · P10 FAIL · P11 PARTIAL (honest export failures; no scene GLB) · P12 PARTIAL (AI optional + bridge apply) · P13 PARTIAL (no silent conflict overwrite) · P14 PARTIAL (arrow nudge; journey axe open) · P15 PARTIAL (lazy 3D; host split/budgets open) · P16–P17 OPEN. Gap cells below reflect this status.

---

## Phase 1 — start and BOQ

| Feature | Code | Gap |
|---|---|---|
| Guest / member routes | `app/planner/(workspace)/guest/`, `canvas/`, `ui/PlannerWorkspaceRoute.tsx` | P1 PASS: UUID v7 guest drafts, scoped IndexedDB, bare URL = new draft, ID URL resumes matching draft, member owner scoping, enumeration blocked via owner-scoped API load, entry-state matrix in `tests/unit/features/planner/entry/entryStates.test.tsx` + browser `tests/e2e/planner-entry-states.spec.ts` (new / resume / malformed / two-UUID keys). Residual: guest→member migrate still unit-only (no full browser auth claim journey yet) |
| Marketing, features, help | `landing/`, `help/`, `app/planner/(marketing)/` | Browser proof open |
| Setup gate (one gate) | `onboarding/ProjectSetupGate.tsx`, `onboarding/ProjectSetupStep.tsx` | Project name is mandatory; no skip or edit-later path |
| Onboarding coach | `onboarding/OnboardingCoach.tsx` | Browser proof open |
| Guest permissions | `model/plannerPermissions.ts`, `lib/commands/plannerAccessContext.ts` | — |
| Session / errors | `ui/PlannerSessionDialog.tsx`, `editor/PlannerErrorBoundary.tsx` | — |
| Project document (mm) | `model/` (`types.ts`, `units.ts`, `actions/`, `operations/`) | P2 PASS: mm canonical, display units (mm/cm/m/in/ft-in), linear/angular/area/quantity precision via `PLANNER_PRECISION`, full calculation precision preserved during display rounding. Remaining: wall centreline/thickness/start/end/joins contract (FINISH-PLAN P2) |
| Conversion events | `site/lib/analytics/siteEvents.ts`, `site/lib/analytics/conversionContract.ts` | Only `PLANNER_ENTRY` has a call site; Planner does not emit project, placement, BOQ, or handoff events |
| Primary BOQ | `shared/export/projectFurnitureBoq.ts` | Parallel: `catalog/workstationBoqV0.ts`, `shared/boq/buildBoq.ts` |
| Branded PDF BOQ library | `shared/export/brandedPdfExport.ts`, `shared/export/pdfExport.ts` | Not wired into the live workspace; defaults to `One&Only`; rows may include unit prices |
| Quote cart (partial) | `catalog/workstationBoqV0.ts`, `shared/boq/quoteCartBridge.ts`, `editor/OOPlannerWorkspace.tsx` | Live workspace uses the workstation-only bridge; the generic bridge is not wired |

---

## Phase 2 — design workspace

| Feature | Code | Gap |
|---|---|---|
| Shell | `editor/WorkspaceShell.tsx`, `editor/dock/ModularPlannerShell.tsx`, `TopBar.tsx`, `workspacePlanMetrics.ts` | P3 PARTIAL: three steps, completion labels, forward warnings, Sketch-to-Plan, selection→properties, layout reset. Canvas % floors and save-authority remain; broader browser proof open |
| Tools | `editor/canvasTool.ts`, `CanvasToolRail.tsx` | Room, dimension, text deferred |
| 2D canvas | `canvas/PlannerFabricStage.tsx`, `canvas/installPlannerFabricExtensions.ts`, `lib/geometry/` | Fabric `AligningGuidelines` wired for furniture edge/center guides (theme `--color-primary`). Wall object snaps stay in `lib/geometry/snapping.ts` |
| Walls / openings | `model/wallContract.ts`, `model/actions/walls.ts`, `lib/geometry/wallGraph.ts`, `canvas/PlannerFabricStage.tsx`, `useDoorWindowPlacement.ts` | P2 PASS: centreline = start/end, thickness full width, joins within `WALL_JOIN_EPSILON_MM` (1 mm). P4 PASS: join-on-commit, connected chain continue, auto `Room N` on closed cycles. Remaining: grips, dimensions, opening polish, browser proof |
| Edit / undo | `editor/PropertiesPanel.tsx`, `store/history.ts`, `lib/geometry/alignDistribute.ts`, `lib/geometry/gridLayout.ts` | Align/distribute is wired; grid is a pure helper only; row/array/group/ungroup UI is absent |
| Catalog UI | `editor/InventoryPanel.tsx`, `catalog/catalogSearch.ts`, `catalog/catalogBuyerVisibility.ts` | UI-CAT-* browser proof open |
| Workstation config | `editor/WorkstationConfiguratorPanel.tsx`, `catalog/workstationConfiguratorV0.ts` | — |
| Catalog APIs | `app/api/planner/catalog/route.ts`, `app/api/planner/catalog/configurator/route.ts`, `app/api/planner/catalog/svg-blocks/route.ts` | `svg-blocks` strictly dual-reads native and legacy DB rows and filters internal inventory; the live DB currently returns zero buyer-visible SVG items |
| SVG on canvas | `canvas/fabricBlock2D.ts`, `catalog/furnitureBlock2D.ts`, `catalog/svg/svgPlanSymbolCache.ts` | Block2D fallback common; DB-SVG-* open |
| Asset publish | `asset-engine/`, `site/features/admin/svg-editor/publish/publishDescriptorWithPipeline.ts` | PNG thumb stub; consumer does not read committed revision artifact bytes |
| 3D | `3d/ThreeLazyViewer.tsx`, `buildPlannerSceneNodes.ts`, `loadGeneratedGlbObject.ts` | P7: generated-glb API returns 501 `not_configured` (no `site/public` write). Blob/object-storage path open |
| Persistence | `persistence/usePlannerWorkspaceAutosave.ts`, `persistence/cloudPlanHydration.ts`, `cloud-store/plannerPersistence.ts`, `cloud-store/offlineStorage.ts`, `cloud-store/syncQueueProcessor.ts` | P1 PASS: reload restores matching draft. P13 PARTIAL: divergent contentHash returns conflict (no silent overwrite); explicit `resolveConflict(choice)`. Conflict UI, immutable revisions, and one save-state machine remain. PF-20 FAIL |
| Import / templates | `shared/export/importUtils.ts`, `lib/floorPlanImageImport.ts`, `templates/layoutTemplates.ts` | P2 PASS: import validation before replacing state, supported-version migration, round-trip invariants. Remaining: visible fail on unsupported versions; preserve unknown safe data only when schema permits. P5 PARTIAL: Sketch-to-Plan TopBar + preview/accept; underlay calibrate open |
| AI assist | `ai/AIAssistDrawer.tsx`, `workspaceAiBridge.ts`, `app/api/planner/ai-advisor/` | P12 PARTIAL: optional overlay; apply only via bridge; dead applySuggestedLayout not called from drawer. Browser failure journey open |
| Sketch-to-plan | `ai/sketchToPlan.ts`, `ai/applySketchWallObjects.ts`, `editor/SketchToPlanDialog.tsx`, `app/api/planner/sketch-to-plan/` | Guest+CSRF wired; legacy `project-sketch` returns 410. Underlay preserve open |
| Local versions | `lib/versioning.ts` | Local snapshots can be labelled, but remain mutable localStorage data and pin no catalog, validation, or price version |

---

## Phase 3 — scale, validate, and price

| Feature | Code | Gap |
|---|---|---|
| Family / options | `catalog-api/productFamilyContract.ts`, `catalog/workstationFamilyBuyer.ts`, configurator bridges | End-to-end through validation and BOQ remains thin |
| Bulk align/distribute | `lib/geometry/alignDistribute.ts`, `lib/geometry/gridLayout.ts`, `editor/OOPlannerWorkspace.tsx` | Align/distribute is wired; exact-spacing controls, row/array/grid workflow, group/ungroup, and bulk preview are absent |
| Validation UI | `editor/ValidationPanel.tsx`, `editor/ReviewQuotePanel.tsx`, `lib/validation/runValidation.ts` | P8 PARTIAL: rotation-aware OBB overlap; ValidationPanel mounted in Review with focus. Outside-room / clearance rules remain; `compliance.ts` returns `[]` |
| Live pricing (admin) | `site/features/admin/pricing/priceBookService.ts`, `site/features/admin/pricing/AdminPriceBookPageView.tsx` | Not pinned in workspace BOQ |
| Workspace BOQ price display | `shared/export/projectFurnitureBoq.ts` | JSON/CSV exports use demo INR list prices; no customer-ready price authority or workspace line-item price view |
| Named revisions | `lib/versioning.ts` | Labels exist on local snapshots only; revisions are not immutable or server-owned |
| Review links | `cloud-store/reviewPersistence.ts`, `site/platform/drizzle/schema/planner.ts` | Server helpers and schema exist; no API routes or review UI |
| Portal / admin plans | `portal/PortalPlanPageView.tsx`, `site/features/admin/plans/AdminPlansPageView.tsx`, `cloud-store/plannerPublish.ts` | Live-data proof open |

---

## Phase 4 — deliver and handoff

| Feature | Code | Gap |
|---|---|---|
| Export menu | `editor/TopBar.tsx`, `editor/OOPlannerWorkspace.tsx` | P11 PARTIAL: failed PNG/SVG/DXF no longer toast as success; empty floors blocked; GLB unsupported message. Chromium download proof and scene GLB remain open |
| Floor plan exports | `shared/export/exportUtils.ts`, `shared/export/exportPreflight.ts` | JSON, SVG, PNG, PDF, DXF exist; success is boolean-checked |
| BOQ exports | `shared/export/projectFurnitureBoq.ts`, `exportPlannerFurnitureBoqToCsv` | Unify parallel BOQ builders |
| Export preflight | `shared/export/exportPreflight.ts` | Blocks empty geometry; honest GLB unsupported |
| Send to Oando | `app/api/planner/handoff/route.ts` | Returns 501 `not_configured` (no fake success); CSRF + rate limit on; no Planner caller and no delivery to Oando |
| Draft vs customer-ready | — | Not distinguished |
| Handoff events | `conversionContract.ts` (`HANDOFF_*`) | Not emitted |
| Handoff security | `app/api/planner/handoff/route.ts`, `site/features/shared/api/withAuth.ts` | Member auth, CSRF, and rate limiting exist; idempotency and commercial authorization are absent |

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
- **Catalog trees:** `catalog/` (live host) vs `catalog-api/` (API/store side)
- **SVG compile:** `compileSvgForPublish` (publish) vs `catalog/svg/svgCompiler.server.ts` (reference)

---

## Tests

`site/tests/unit/features/planner/` (incl. `cloud-store/`, `catalog-api/`) · `site/tests/integration/features/planner/`

---

## Reference (not truth)

`FINISH-PLAN.md` · `docs/architecture/06-UI-BENCHMARK.md` · `docs/architecture/08-DATABASE-SVG-CONTRACT.md`
