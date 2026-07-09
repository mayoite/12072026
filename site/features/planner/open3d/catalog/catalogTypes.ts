/**
 * Phase 03 Catalog Domain Model
 *
 * Research-backed types derived from Wayfair taxonomy-decoupled architecture,
 * IKEA three-layer knowledge graph, and furniture taxonomy best practices
 * (LynkPIM, WISEPIM). Implements type-based primary hierarchy with room/style/material
 * as filterable attributes, two-field material approach, and immutable placed-configuration
 * snapshot for BOQ/quote/export/AI traceability.
 */

// ── Display units (mirrors model/types.ts for catalog isolation) ──

export type Open3dCatalogDisplayUnit = "mm" | "cm" | "m" | "in" | "ft-in";

// ── Canonical taxonomy types ──

/**
 * Primary type-based category (e.g. "Sofas", "Tables", "Chairs").
 * This is the canonical organization axis, not room-based.
 */
export type Open3dCatalogCategory =
  | "Furniture"
  | "Lighting"
  | "Decor"
  | "Outdoor"
  | "Bedding & Textiles"
  | "Storage & Organisation"
  | "Kitchen & Dining"
  | "Symbols";

export type Open3dCatalogSubCategory = string;

/**
 * Full taxonomy path: Category > SubCategory > LeafCategory
 * Example: "Furniture > Sofas & Sectionals > 3-Seater Sofas"
 */
export type Open3dCatalogTaxonomyPath = string;

/**
 * Room as multi-value filterable attribute (not top-level category).
 * Matches Wayfair/IKEA best practice: type-based primary hierarchy.
 */
export type Open3dRoomTag =
  | "Living Room"
  | "Bedroom"
  | "Kitchen"
  | "Bathroom"
  | "Office"
  | "Dining"
  | "Outdoor"
  | "Garage"
  | "Utility"
  | "Kids & Nursery"
  | "Entryway & Hallway";

/**
 * Style as multi-select filterable attribute.
 * A product can carry multiple style tags (e.g., Coastal + Boho).
 */
export type Open3dStyleTag =
  | "Modern"
  | "Scandinavian"
  | "Industrial"
  | "Traditional"
  | "Coastal"
  | "Boho"
  | "Mid-Century"
  | "Minimalist"
  | "Contemporary"
  | "Rustic";

/**
 * Two-field material: marketing name for display, normalized value for filtering.
 * Example: marketingMaterial="Smoked Oak", normalizedMaterial="Oak"
 */
export interface Open3dCatalogMaterial {
  /** Customer-facing marketing name (e.g. "Smoked Oak", "Warm Walnut Veneer") */
  marketingMaterial: string;
  /** Normalized value for filtering and feed submission (e.g. "Oak", "Walnut") */
  normalizedMaterial: string;
}

/**
 * Structured color with hex, name, and normalized family.
 */
export interface Open3dCatalogColor {
  hex: string;
  name: string;
  /** Normalized color family for filtering (e.g. "Blue", "Neutral", "Red") */
  normalizedFamily: string;
}

export type Open3dAssemblyType = "flat-pack" | "partial" | "fully-assembled";

export type Open3dAvailabilityStatus = "in-stock" | "out-of-stock" | "discontinued" | "preorder" | "backorder";
export type Open3dConfigurability = "fixed" | "configurable";
export type Open3dMountingContract = "floor" | "wall" | "ceiling" | "floating";
export type Open3dAssetReadiness = "ready" | "missing-image" | "missing-mesh" | "missing-svg" | "degraded";

// ── Catalog item dimension metadata ──

/**
 * Canonical dimensions stored in millimetres.
 * The legacy OOFPLWeb catalog stores dimensions as cm in fields named `widthMm`/`heightMm`
 * (naming debt documented here). Converters in unitConversion.ts handle the mapping.
 */
export interface Open3dCatalogDimensions {
  /** Width in canonical millimetres */
  widthMm: number;
  /** Depth in canonical millimetres */
  depthMm: number;
  /** Height in canonical millimetres */
  heightMm: number;
  /** Seat height in millimetres (for chairs/sofas) */
  seatHeightMm?: number;
  /** Weight in kilograms */
  weightKg?: number;
}

// ── Variant identity ──

/**
 * A specific variant of a catalog product (e.g., different color, size, material).
 * Master variant + variant array pattern from ThreeKit/commercetools/Fabric.
 */
export interface Open3dCatalogVariant {
  /** Unique variant identifier */
  variantId: string;
  /** Stock-keeping unit for this variant */
  sku: string;
  /** Reference to parent catalog item */
  parentProductId: string;
  /** Human-readable variant label (e.g. "Oak / 180cm / 3-Seater") */
  label: string;
  /** Variant attributes that differentiate this from the master */
  variantAttributes: {
    color?: Open3dCatalogColor;
    size?: string;
    material?: Open3dCatalogMaterial;
    finish?: string;
  };
  /** Variant-specific dimensions if different from master */
  dimensions: Open3dCatalogDimensions;
  /** Variant-specific pricing */
  pricing?: Open3dCatalogPricing;
  /** Variant-specific preview image */
  imageUrl?: string;
  /** Variant-specific 3D mesh URL */
  meshUrl?: string;
  /** Availability for this specific variant */
  availability: Open3dAvailabilityStatus;
}

// ── Pricing metadata ──

export interface Open3dCatalogPricing {
  /** Price in smallest currency unit (e.g., cents, paise) */
  price: number;
  currencyCode: string;
  originalPrice?: number;
  /** Optional quote/BOQ metadata */
  quoteMetadata?: Record<string, string>;
}

// ── Asset URLs ──

export interface Open3dCatalogAssets {
  /** Preview/thumbnail image URL (validated against origin allowlist) */
  previewImageUrl?: string;
  /** Full-resolution or lifestyle image URLs */
  imageUrls: string[];
  /** 3D mesh/GLB URL for rendering */
  meshUrl?: string;
  /** App-specific AR format URL (USDZ for iOS) */
  arUrl?: string;
}

// ── Provenance metadata ──

export interface Open3dCatalogProvenance {
  /** Source catalog system (e.g. "planner_managed_products", "configurator_products") */
  source: string;
  /** OOFPLWeb legacy product ID if mapped from existing catalog */
  legacyProductId?: string;
  /** Planner source slug for cross-reference */
  plannerSourceSlug?: string;
  /** Category ID from source system */
  sourceCategoryId?: string;
  /** Series ID from source system */
  sourceSeriesId?: string;
  /** Original import timestamp */
  importedAt?: string;
  /** License classification for 3D assets */
  assetLicense?: string;
  /** Attribution required for runtime assets */
  assetAttribution?: string;
}

// ── Core catalog item ──

/**
 * Canonical catalog item definition.
 * This is the concept layer (IKEA three-layer model): product identity, taxonomy, metadata.
 * Individual variants carry variant-specific data.
 */
export interface Open3dCatalogItem {
  /** Unique catalog identifier (source system ID preserved) */
  id: string;
  /** Human-readable slug for URLs */
  slug: string;
  /** Stock-keeping unit (master SKU) */
  sku: string;
  /** Display name */
  name: string;
  /** Short display name (≤ 30 chars, for compact UI) */
  shortName: string;
  /** Description / marketing copy */
  description: string;
  /** Primary type-based category (canonical hierarchy axis) */
  category: Open3dCatalogCategory;
  /** Taxonomy subcategory */
  subCategory: Open3dCatalogSubCategory;
  /** Full taxonomy path string */
  taxonomyPath: Open3dCatalogTaxonomyPath;
  /** Canonical dimensions in millimetres */
  dimensions: Open3dCatalogDimensions;
  /** Display unit preference */
  displayUnit: Open3dCatalogDisplayUnit;
  /** Asset URLs */
  assets: Open3dCatalogAssets;
  /** Material (two-field: marketing + normalized) */
  material: Open3dCatalogMaterial;
  /** Room tags (multi-value filterable attribute) */
  roomTags: Open3dRoomTag[];
  /** Style tags (multi-select filterable attribute) */
  styleTags: Open3dStyleTag[];
  /** Structured color info */
  color?: Open3dCatalogColor;
  /** Pricing metadata */
  pricing?: Open3dCatalogPricing;
  /** Availability status */
  availability: Open3dAvailabilityStatus;
  /** Assembly type */
  assemblyType: Open3dAssemblyType;
  /** Whether dimensions are manufacturer-fixed or user-configurable within bounds */
  configurability?: Open3dConfigurability;
  /** Placement anchoring contracts supported by this item */
  mounting?: Open3dMountingContract[];
  /** Asset readiness for degraded-state search and UI indicators */
  assetReadiness?: Open3dAssetReadiness[];
  /** Whether product is flat-pack (redundant with assemblyType but explicit for filtering) */
  flatPack: boolean;
  /** Search/discovery tags */
  tags: string[];
  /** Number of seats (for chairs, sofas) */
  seatCount?: number;
  /** Maximum weight capacity in kg */
  weightCapacityKg?: number;
  /** Available variants (master variant at index 0 per convention) */
  variants: Open3dCatalogVariant[];
  /** Source provenance for identity traceability */
  provenance: Open3dCatalogProvenance;
  /** Whether this is a 2D-only architectural symbol (like electrical/plumbing symbols) */
  symbolOnly: boolean;
  /**
   * Optional geometry generation mode for placement → 3D.
   * When omitted, placement may still detect modular via id/slug `cabinet-v0`.
   */
  geometryMode?: "box" | "modular-cabinet-v0" | "workstation-v0";

  // Sketchfab search parity facets (added for catalogue-first; BP-06 / design §9-10 / REC-02/04 / PLAN-FAIL-0419)
  // license, animated, staffPicked, favourite, downloadable per search_models contract.
  license?: string;
  animated?: boolean;
  staffPicked?: boolean;
  favourite?: boolean;
  downloadable?: boolean;
}

// ── Immutable placed-configuration snapshot ──

/**
 * Immutable snapshot of a placed catalog item.
 * Captures the exact product identity, variant identity, and configuration
 * at placement time. Used for undo/AI/export/BOQ traceability.
 * Must not be mutated after creation; edits produce a new snapshot.
 */
export interface Open3dPlacedConfiguration {
  /** Unique placement identifier (deterministic, timestamp + random suffix) */
  placementId: string;
  /** ISO 8601 timestamp of placement */
  placedAt: string;
  /** Source catalog item identity */
  productIdentity: {
    catalogId: string;
    slug: string;
    sku: string;
    name: string;
  };
  /** Source variant identity (null if master variant placed) */
  variantIdentity: {
    variantId: string;
    sku: string;
    label: string;
  } | null;
  /** Overridden dimensions at placement time (if user resized) */
  overriddenDimensions?: Partial<Open3dCatalogDimensions>;
  /** Position in floor-plan coordinates */
  position: { x: number; y: number };
  /** Rotation in degrees */
  rotation: number;
  /** Scale factors (x, y, z) */
  scale: { x: number; y: number; z: number };
  /** Material override (if different from catalog default) */
  materialOverride?: string;
  /** Color override (if different from catalog default) */
  colorOverride?: string;
  /** Locked state (prevent accidental moves) */
  locked: boolean;
  /** Source provenance for full traceability */
  sourceMetadata: {
    catalogSource: string;
    catalogSourceId: string;
    legacyProductId?: string;
    plannerSourceSlug?: string;
    placedFrom: "click" | "drag" | "api" | "import";
  };
}

// ── Catalog index for client-side search ──

/**
 * Client-side search index for O(1) lookups and full-text search.
 * Built from normalized catalog data on load.
 */
export interface Open3dCatalogIndex {
  /** O(1) lookup by canonical ID */
  byId: Map<string, Open3dCatalogItem>;
  /** O(1) lookup by slug */
  bySlug: Map<string, Open3dCatalogItem>;
  /** O(1) lookup by SKU */
  bySku: Map<string, Open3dCatalogItem>;
  /** Indexed by category for filtered views */
  byCategory: Map<Open3dCatalogCategory, Open3dCatalogItem[]>;
  /** Indexed by tag for filtered views */
  byTag: Map<string, Open3dCatalogItem[]>;
  /** Indexed by room tag for filtered views */
  byRoom: Map<Open3dRoomTag, Open3dCatalogItem[]>;
  /** Indexed by style tag for filtered views */
  byStyle: Map<Open3dStyleTag, Open3dCatalogItem[]>;
  /** Full-text search index: token → item IDs */
  textIndex: Map<string, Set<string>>;
  /** All items in insertion order */
  all: Open3dCatalogItem[];
  /** Index build timestamp */
  builtAt: number;
}

// ── Search types ──

export type Open3dCatalogSortOrder = "relevance" | "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
export type Open3dCatalogSortField = "relevance" | "name" | "price" | "newest";
export type Open3dCatalogSortDirection = "asc" | "desc";

export interface Open3dCatalogDimensionFilter {
  minWidthMm?: number;
  maxWidthMm?: number;
  minDepthMm?: number;
  maxDepthMm?: number;
  minHeightMm?: number;
  maxHeightMm?: number;
}

export interface Open3dCatalogSearchQuery {
  /** Free-text search query */
  text?: string;
  /** Category filter */
  categoryFilter?: Open3dCatalogCategory;
  /** Room tag filter (items matching any of the given rooms) */
  roomFilter?: Open3dRoomTag[];
  /** Style tag filter (items matching any of the given styles) */
  styleFilter?: Open3dStyleTag[];
  /** Normalized material filter */
  materialFilter?: string[];
  /** Normalized color family filter */
  colorFilter?: string[];
  /** Dimension range filter */
  dimensionFilter?: Open3dCatalogDimensionFilter;
  /** Availability filter */
  availabilityFilter?: Open3dAvailabilityStatus[];
  /** Configurability filter from Phase 03A benchmark */
  configurabilityFilter?: Open3dConfigurability[];
  /** Mounting/anchoring filter from Phase 03A benchmark */
  mountingFilter?: Open3dMountingContract[];
  /** Asset readiness filter for degraded-state recovery */
  assetReadinessFilter?: Open3dAssetReadiness[];
  /** Sort order */
  sortOrder?: Open3dCatalogSortOrder;
  /** Deterministic sort field; preferred over legacy sortOrder when set */
  sortField?: Open3dCatalogSortField;
  /** Deterministic sort direction; used with sortField */
  sortDirection?: Open3dCatalogSortDirection;
  /** Cursor for pagination (opaque string from previous result) */
  cursor?: string;
  /** Page size (default 20 for search, 50 for browse) */
  pageSize?: number;

  // Sketchfab parity facets (BP-06 / design §9-10 / REC-02/04; search_models cursor + facets)
  // Catalogue-first (REC-04): these + cursor used in inventory via loader primary descriptors.
  licenseFilter?: string[];
  animatedFilter?: boolean;
  staffPicked?: boolean;
  favourite?: boolean;
  downloadable?: boolean;
}

export interface Open3dCatalogSearchResult {
  /** Matching items for the current page */
  items: Open3dCatalogItem[];
  /** Total matching items (across all pages) */
  totalCount: number;
  /** Opaque cursor for next page (null if no more results) */
  nextCursor: string | null;
  /** Whether more pages exist */
  hasMore: boolean;
  /** Server-side search duration in ms (for performance monitoring) */
  tookMs: number;
}

// ── Fallback geometry ──

export type Open3dFallbackGeometryType = "box" | "cylinder" | "plane";

/**
 * Visible fallback geometry used when an asset URL is missing, expired, or invalid.
 * Always a colored procedural shape with accessible name and visible border.
 */
export interface Open3dFallbackGeometry {
  /** Geometry type for fallback rendering */
  type: Open3dFallbackGeometryType;
  /** Fill color (hex) */
  color: string;
  /** Border color (hex) for visibility */
  borderColor: string;
  /** Material label for accessibility */
  material: string;
  /** Accessible name (e.g. "Missing asset: Office Chair (placeholder)") */
  accessibleName: string;
  /** Approximate dimensions matched to catalog item */
  dimensions: Open3dCatalogDimensions;
  /** Reason for fallback (for debugging/error reporting) */
  reason: string;
}

// ── Recent items and favorites ──

export interface Open3dRecentItemEntry {
  /** SKU of the catalog item */
  sku: string;
  /** Catalog item ID for lookup */
  catalogId: string;
  /** Human-readable name for display */
  name: string;
  /** ISO 8601 timestamp of last use */
  lastUsedAt: string;
}

export interface Open3dFavoriteEntry {
  /** Catalog item ID */
  catalogId: string;
  /** SKU */
  sku: string;
  /** Human-readable name for display */
  name: string;
  /** Category for filtered views */
  category: Open3dCatalogCategory;
  /** ISO 8601 timestamp when favorited */
  favoritedAt: string;
}

export interface Open3dRecentItemsData {
  /** Schema version for migration support */
  schemaVersion: number;
  /** Recent items in reverse-chronological order */
  items: Open3dRecentItemEntry[];
}

export interface Open3dFavoritesData {
  /** Schema version for migration support */
  schemaVersion: number;
  /** Favorite items */
  items: Open3dFavoriteEntry[];
}
