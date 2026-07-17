/**
 * Portal / domain / API save document model + shared domain exports.
 *
 * Dual document types (both under this folder — do not conflate):
 * 1. `PlannerProject` + open3d `PlannerSceneEnvelope` (`types.ts` / `project.ts`)
 *    — live canvas plan geometry (`type: "open3d-floorplan-project"`).
 * 2. `PlannerDocument` + cad-suite `PlannerSceneEnvelope` (`plannerDocument.ts`)
 *    — save row / CRM / portal (`type: "cad-suite-planner-scene"` in sceneJson).
 *
 * Prefer aliases `Open3dPlannerSceneEnvelope` and `CadSuitePlannerSceneEnvelope`.
 * Do not treat `PlannerDocument` as the plan canvas host.
 * @see features/planner/CONTENTS.md — Dual trees
 */

export {
  PLANNER_DOCUMENT_SCHEMA_VERSION,
  assertPlannerDocument,
  createPlannerDocument,
  createEmptyPlannerDocument,
  isPlannerDocument,
  isPlannerSaveRow,
  normalizePlannerDocument,
  parsePlannerDocumentImport,
  plannerDocumentImportEnvelopeSchema,
  plannerDocumentSchema,
  plannerDocumentToSaveRow,
  plannerSaveRowSchema,
  plannerSaveRowToDocument,
  plannerSaveSummarySchema,
  plannerSaveWriteSchema,
  summarizePlannerDocument,
  validatePlannerDocument,
  validatePlannerDocumentSafe,
  validatePlannerDocumentImport,
  normalizePlannerDocumentId,
  getPlannerSceneEnvelope,
  isPlannerSceneEnvelope,
} from "./plannerDocument";

export { toPlannerJsonSafe } from "./plannerJsonSafe";

export type {
  PlannerDocument,
  PlannerDocumentDefaults,
  PlannerDocumentImportEnvelope,
  PlannerDocumentImportResult,
  PlannerLifecycleStatus,
  PlannerImportValidationResult,
  PlannerJsonPrimitive,
  PlannerJsonValue,
  PlannerMeasurementDisplayUnit,
  PlannerMeasurementSourceUnit,
  PlannerSaveRow,
  PlannerSaveSummary,
  PlannerSaveWrite,
  PlannerUnitSystem,
  CadSuitePlannerSceneEnvelope,
  PlannerSceneEnvelope,
  PlannerSceneItem,
  PlannerSceneRoom,
} from "./plannerDocument";

export {
  PlannerManagedProductSchema,
  canPlaceProduct,
  catalogItemToProduct,
  filterProductsByCategory,
  filterVisibleProducts,
  getProductAreaMm,
  getProductAreaSqM,
  getProductCategories,
  plannerManagedProductRowSchema,
  plannerManagedProductWriteSchema,
  productToCatalogItem,
  sortProductsByName,
} from "./plannerManagedProduct";

export type {
  CatalogItemRead,
  CatalogItemWrite,
  PlannerManagedProduct,
  PlannerManagedProductRow,
  PlannerManagedProductWrite,
  ProductCategory,
  ProductMeshType,
} from "./plannerManagedProduct";

export {
  plannerTransferEnvelopeSchema,
  validatePlannerTransferEnvelope,
  createPlannerTransferEnvelope,
  buildPlannerEnvelopeMetadata,
  normalizePlannerTransferSource,
  isPlannerTransferSource,
} from "./plannerEnvelope";

export type {
  PlannerTransferEnvelope,
  PlannerTransferEnvelopeMetadata,
  PlannerTransferSource,
} from "./plannerEnvelope";

export {
  plannerPlacementEnvelopeSchema,
  validatePlannerPlacementEnvelope,
  buildPlannerPlacementMetadata,
  createPlannerPlacementEnvelope,
} from "./plannerPlacement";

export type {
  PlannerPlacementDimensions,
  PlannerPlacementEnvelope,
  PlannerPlacementMetadata,
  PlannerPlacementPosition,
} from "./plannerPlacement";

export {
  planner3dSceneDocumentSchema,
  validatePlanner3DSceneDocument,
  collectPlanner3DSceneWarnings,
} from "./planner3dScene";

export type {
  Planner3DSceneDocument,
  Planner3DSceneItem,
  Planner3DScenePosition,
  Planner3DSceneRoom,
  Planner3DSceneSize,
  Planner3DSceneWarning,
  Planner3DSceneWarningSeverity,
  Planner3DSceneWarningsResult,
} from "./planner3dScene";

export {
  PLANNER_ACTION_PERMISSION_MATRIX,
  PLANNER_GUEST_BLOCKED_ACTIONS,
  getPlannerActionPermissions,
  plannerActionIsBlocked,
} from "./plannerPermissions";

export type {
  PlannerAccessContext,
  PlannerActionKey,
  PlannerActionPermissionMatrix,
  PlannerActionPermissionSet,
} from "./plannerPermissions";

export {
  PLANNER_IDENTITY_CONFIGS,
  getPlannerIdentityConfig,
  getPlannerWorkflowStages,
  listPlannerIdentityConfigs,
} from "./plannerIdentity";

export type {
  PlannerIdentityConfig,
  PlannerIdentityId,
  PlannerRouteContract,
  PlannerRouteStatus,
  PlannerWorkflowEngine,
  PlannerWorkflowStage,
} from "./plannerIdentity";
