/**
 * Portal / domain / API save document model + shared domain exports.
 *
 * Dual document + dual scene envelopes (do not conflate names):
 *
 * 1. Live canvas plan geometry
 *    - Host: `PlannerProject` (`types.ts` / `project.ts`)
 *    - Envelope: `Open3dPlannerSceneEnvelope` alias of open3d `PlannerSceneEnvelope`
 *      (`type: "open3d-floorplan-project"`, `version: 1`, units mm)
 *    - Parse: `parsePlannerSceneEnvelope` / `importFromJson` / `migrateEnvelope`
 *
 * 2. Portal / save / CRM document
 *    - Host: `PlannerDocument` (`plannerDocument.ts`, `schemaVersion: 1`)
 *    - Scene in `sceneJson`: `CadSuitePlannerSceneEnvelope` alias of cad-suite
 *      `PlannerSceneEnvelope` (`type: "cad-suite-planner-scene"`, `version: 1`)
 *    - Transfer wrapper: `cad-suite-planner-transfer-envelope` (`plannerEnvelope.ts`)
 *    - Import wrapper: `type: "planner-document"` (`plannerDocumentImportEnvelopeSchema`)
 *
 * Prefer the aliases. Never treat `PlannerDocument` as the plan canvas host.
 * Unsupported schema/envelope versions must fail visibly (import + migration).
 * @see features/planner/CONTENTS.md — Dual trees
 */

export {
  PLANNER_DOCUMENT_SCHEMA_VERSION,
  assertPlannerDocument,
  createPlannerDocument,
  createEmptyPlannerDocument,
  describeUnsupportedPlannerSchemaVersion,
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

/** Live canvas open3d scene envelope alias (not the cad-suite portal scene). */
export type { Open3dPlannerSceneEnvelope } from "./types";

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
