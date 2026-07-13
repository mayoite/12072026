/**
 * Planner boundary re-export of the shared product family contract (Phase 3).
 */
export {
  PRODUCT_FAMILY_SCHEMA_VERSION,
  PRODUCT_FAMILY_V1_FIXTURE,
  ProductFamilyV1Schema,
  parseProductFamilyV1,
  getFamilyVersion,
  validateFamilyConfiguration,
  formatFamilyConfigError,
  previewFamilyConfiguration,
  type ProductFamilyV1,
  type ProductFamilyVersionV1,
  type FamilyConfigValidation,
  type FamilyConfigError,
  type FamilyConfigurationPreview,
  type FamilyConfigurationPreviewResult,
} from "@/features/shared/catalog/productFamilyContract";
