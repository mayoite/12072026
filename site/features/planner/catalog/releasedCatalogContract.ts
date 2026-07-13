/**
 * Planner boundary re-export of the shared released catalog product contract.
 * Planner catalog loaders and BOQ identity resolve against this versioned shape.
 */
export {
  RELEASED_CATALOG_PRODUCT_SCHEMA_VERSION,
  ReleasedCatalogProductV1Schema,
  ReleasedAvailabilitySchema,
  parseReleasedCatalogProductV1,
  releasedCatalogProductFromParts,
  type ReleasedCatalogProductV1,
  type ReleasedAvailability,
  type ReleasedCatalogProductParts,
} from "@/features/shared/catalog/releasedCatalogProductContract";
