/**
 * Phase 03 Placement Action Layer
 *
 * Produces an immutable Open3dPlacedConfiguration snapshot from a catalog item
 * or variant. Integrates with the existing Phase 02 pureActions/history path
 * for undo/redo/autosave observation.
 *
 * Click-to-place and drag-to-place both call the same function — only the
 * input method parameter differs.
 *
 * Performance target: <5ms from action dispatch to state update.
 */

import type { Open3dCatalogItem, Open3dCatalogVariant, Open3dPlacedConfiguration } from "./catalogTypes";
import type {
  Open3dFurnitureGeometryMode,
  Open3dModularCabinetV0Options,
  Open3dProject,
} from "../model/types";
import type { PureActionResult, ApplyPureActionOptions } from "../model/operations/pureActions";
import { addFurniture } from "../model/operations/pureActions";
import { newEntityId } from "@/features/planner/lib/newEntityId";
import {
  defaultCabinetV0Options,
  type CabinetMaterialId,
} from "./modularCabinetV0";
import {
  parseWorkstationConfigKey,
  workstationConfigKey,
  workstationFootprintMm,
  type WorkstationConfigV0,
} from "./workstationSystemV0";

/** Catalog id/slug that maps to modular cabinet-v0 multi-part mesh. */
export const MODULAR_CABINET_V0_CATALOG_ID = "cabinet-v0";

function isModularCabinetV0CatalogItem(item: Open3dCatalogItem): boolean {
  if (item.geometryMode === "modular-cabinet-v0") return true;
  if (item.geometryMode === "box") return false;
  return (
    item.id === MODULAR_CABINET_V0_CATALOG_ID ||
    item.slug === MODULAR_CABINET_V0_CATALOG_ID
  );
}

function resolveCabinetMaterial(
  materialOverride: string | undefined,
  normalizedMaterial: string,
): CabinetMaterialId {
  const raw = (materialOverride ?? normalizedMaterial).trim().toLowerCase();
  if (raw === "oak") return "oak";
  return "white";
}

/**
 * Build serializable modular options from catalog dimensions + defaults.
 * doorStyle defaults to slab (defaultCabinetV0Options).
 */
export function modularOptionsFromCatalogItem(
  item: Open3dCatalogItem,
  materialOverride?: string,
): Open3dModularCabinetV0Options {
  return defaultCabinetV0Options({
    widthMm: item.dimensions.widthMm,
    depthMm: item.dimensions.depthMm,
    heightMm: item.dimensions.heightMm,
    material: resolveCabinetMaterial(
      materialOverride,
      item.material.normalizedMaterial,
    ),
  });
}

export function resolveFurnitureGeometryMode(
  item: Open3dCatalogItem,
): Open3dFurnitureGeometryMode | undefined {
  if (isModularCabinetV0CatalogItem(item)) return "modular-cabinet-v0";
  if (item.geometryMode === "box") return "box";
  return undefined;
}

// ── Placement options ──

export interface PlannerPlacementPayload {
  /** How the placement was triggered */
  placedFrom: "click" | "drag" | "api" | "import";
  /** Position override (defaults to {0,0} for API/import, center for click/drag) */
  position?: { x: number; y: number };
  /** Rotation in degrees (default: 0) */
  rotation?: number;
  /** Scale override (default: {x:1, y:1, z:1}) */
  scale?: { x: number; y: number; z: number };
  /** Material override */
  materialOverride?: string;
  /** Color override */
  colorOverride?: string;
  /** Locked state (default: false) */
  locked?: boolean;
}

export type PlacementOptions = PlannerPlacementPayload;
export type PlacementOverrides = Omit<PlannerPlacementPayload, "placedFrom">;

export interface ProjectPlacementResult {
  snapshot: Open3dPlacedConfiguration;
  result: PureActionResult;
}

// ── ID generation ──

/**
 * Placement entity id — crypto.randomUUID() only (no plc- / stripped-hex variants).
 */
function generatePlacementId(): string {
  return newEntityId();
}

function finite(value: number, field: string): number {
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite.`);
  return value;
}

export function validatePlannerPlacementPayload(
  payload: PlannerPlacementPayload,
): PlannerPlacementPayload {
  const position = payload.position ?? { x: 0, y: 0 };
  const scale = payload.scale ?? { x: 1, y: 1, z: 1 };
  finite(position.x, "position.x");
  finite(position.y, "position.y");
  finite(payload.rotation ?? 0, "rotation");
  for (const [axis, value] of Object.entries(scale)) {
    finite(value, `scale.${axis}`);
    if (value <= 0) throw new Error(`scale.${axis} must be greater than zero.`);
  }
  return {
    ...payload,
    position: { ...position },
    scale: { ...scale },
  };
}

// ── Placement action ──

/**
 * Create an immutable placed-configuration snapshot from a catalog item or variant.
 *
 * This is the canonical placement function. Both click-to-place and drag-to-place
 * call this with the same logic — only `placedFrom` changes to distinguish input method.
 *
 * The returned snapshot preserves:
 * - Product identity (catalog ID, slug, SKU, name)
 * - Variant identity if a variant was placed
 * - Source provenance (catalog source, legacy ID, planner source slug)
 * - Placement metadata (position, rotation, scale, overrides, locked state)
 *
 * The snapshot is immutable by design. Edits to a placed item produce a NEW snapshot.
 */
export function placeCatalogItem(
  item: Open3dCatalogItem,
  variant: Open3dCatalogVariant | null,
  options: PlacementOptions = { placedFrom: "click" },
): Open3dPlacedConfiguration {
  options = validatePlannerPlacementPayload(options);
  const placementId = generatePlacementId();
  const placedAt = new Date().toISOString();

  const effectiveVariant = variant ?? item.variants[0] ?? null;

  return {
    placementId,
    placedAt,
    productIdentity: {
      catalogId: item.id,
      slug: item.slug,
      sku: item.sku,
      name: item.name,
    },
    variantIdentity: effectiveVariant
      ? {
          variantId: effectiveVariant.variantId,
          sku: effectiveVariant.sku,
          label: effectiveVariant.label,
        }
      : null,
    overriddenDimensions: undefined,
    position: options.position ?? { x: 0, y: 0 },
    rotation: options.rotation ?? 0,
    scale: options.scale ?? { x: 1, y: 1, z: 1 },
    materialOverride: options.materialOverride,
    colorOverride: options.colorOverride,
    locked: options.locked ?? false,
    sourceMetadata: {
      catalogSource: item.provenance.source,
      catalogSourceId: item.id,
      legacyProductId: item.provenance.legacyProductId,
      plannerSourceSlug: item.provenance.plannerSourceSlug,
      placedFrom: options.placedFrom,
    },
  };
}

/**
 * Create a placement snapshot for click-to-place interaction.
 */
export function clickToPlace(
  item: Open3dCatalogItem,
  variant: Open3dCatalogVariant | null,
  position: { x: number; y: number },
): Open3dPlacedConfiguration {
  return placeCatalogItem(item, variant, {
    placedFrom: "click",
    position,
  });
}

/**
 * Create a placement snapshot for drag-to-place interaction.
 */
export function dragToPlace(
  item: Open3dCatalogItem,
  variant: Open3dCatalogVariant | null,
  position: { x: number; y: number },
): Open3dPlacedConfiguration {
  return placeCatalogItem(item, variant, {
    placedFrom: "drag",
    position,
  });
}

/**
 * Create a placement snapshot for API/programmatic placement.
 */
export function apiPlace(
  item: Open3dCatalogItem,
  variant: Open3dCatalogVariant | null,
  options: PlacementOverrides = {},
): Open3dPlacedConfiguration {
  return placeCatalogItem(item, variant, {
    ...options,
    placedFrom: "api",
  });
}

/**
 * Verify that a placed configuration snapshot contains the expected product identity.
 * Returns true if the snapshot preserves all required identity fields.
 */
export function verifyPlacementIdentity(
  snapshot: Open3dPlacedConfiguration,
  item: Open3dCatalogItem,
): boolean {
  return (
    snapshot.productIdentity.catalogId === item.id &&
    snapshot.productIdentity.slug === item.slug &&
    snapshot.productIdentity.sku === item.sku &&
    snapshot.productIdentity.name === item.name &&
    snapshot.sourceMetadata.catalogSourceId === item.id &&
    snapshot.placementId.length > 0 &&
    snapshot.placedAt.length > 0
  );
}

/**
 * Apply a catalog placement to the Phase 02 project mutation shape.
 *
 * The base furniture insertion goes through `addFurniture` so undo/autosave
 * consumers observe the same project stream as other mutations. The inserted
 * furniture is then enriched with immutable source identity from the placement
 * snapshot for BOQ/quote/export/AI traceability.
 *
 * Modular cabinet-v0: stamps `geometryMode` + `modularOptions` only.
 * Leaves `generatedGlbUrl` unset so the product default stays procedural mesh.
 * Open3d inventory: cabinet-v0 only routes to placeModularWithGeneratedGlbBrowser
 * (G5 → POST /api/planner/generated-glb → stamp). Other items use this path.
 * Node/tests: placeModularWithGeneratedGlbPlan. Manual stamp: stampFurnitureGeneratedGlb.
 */
export function placeCatalogItemInProject(
  project: Open3dProject,
  item: Open3dCatalogItem,
  variant: Open3dCatalogVariant | null,
  options: PlacementOptions = { placedFrom: "click" },
): ProjectPlacementResult {
  const snapshot = placeCatalogItem(item, variant, options);

  // Systems v0 workstation — route through placeWorkstationConfigOnProject so
  // footprint/modules/action type stay consistent with pure rules.
  const workstationConfig =
    parseWorkstationConfigKey(item.id) ?? parseWorkstationConfigKey(item.slug);
  if (workstationConfig) {
    const pure = placeWorkstationConfigOnProject(
      project,
      workstationConfig,
      snapshot.position,
      { idFactory: () => snapshot.placementId },
    );
    return { snapshot, result: pure };
  }

  const placed = addFurniture(project, item.id, snapshot.position, {
    idFactory: () => snapshot.placementId,
  });
  const geometryMode = resolveFurnitureGeometryMode(item);
  const modularOptions =
    geometryMode === "modular-cabinet-v0"
      ? modularOptionsFromCatalogItem(item, snapshot.materialOverride)
      : undefined;
  const projectWithIdentity: Open3dProject = {
    ...placed.project,
    floors: placed.project.floors.map((floor) => ({
      ...floor,
      furniture: floor.furniture.map((furniture) => (
        furniture.id === snapshot.placementId
          ? {
              ...furniture,
              rotation: snapshot.rotation,
              scale: snapshot.scale,
              width: item.dimensions.widthMm,
              depth: item.dimensions.depthMm,
              height: item.dimensions.heightMm,
              material: snapshot.materialOverride ?? item.material.normalizedMaterial,
              color: snapshot.colorOverride ?? item.color?.hex,
              locked: snapshot.locked,
              sourceCatalogId: snapshot.productIdentity.catalogId,
              sourceSlug: snapshot.productIdentity.slug,
              sourceSku: snapshot.variantIdentity?.sku ?? snapshot.productIdentity.sku,
              ...(geometryMode !== undefined ? { geometryMode } : {}),
              ...(modularOptions !== undefined ? { modularOptions } : {}),
              // generatedGlbUrl intentionally omitted — procedural default;
              // stamp after G5 export via stampFurnitureGeneratedGlb.
            }
          : furniture
      )),
    })),
  };

  return {
    snapshot,
    result: {
      project: projectWithIdentity,
      action: {
        type: "PLACE_CATALOG_ITEM",
        payload: {
          placementId: snapshot.placementId,
          catalogId: snapshot.productIdentity.catalogId,
          variantId: snapshot.variantIdentity?.variantId ?? null,
          sku: snapshot.variantIdentity?.sku ?? snapshot.productIdentity.sku,
          placedFrom: snapshot.sourceMetadata.placedFrom,
        },
        description: `Placed ${snapshot.productIdentity.name}`,
        timestamp: Date.parse(snapshot.placedAt),
      },
    },
  };
}

/**
 * Systems v0 — place one workstation config on the open3d document via pure actions.
 *
 * Footprint width/depth come from workstationFootprintMm; catalogId is the
 * stable workstationConfigKey (`ws-v0-…`). geometryMode is box until modular
 * workstation mesh is wired.
 */
export function placeWorkstationConfigOnProject(
  project: Open3dProject,
  config: WorkstationConfigV0,
  position: { x: number; y: number },
  options?: ApplyPureActionOptions,
): PureActionResult {
  const catalogId = workstationConfigKey(config);
  const footprint = workstationFootprintMm(config);
  const placed = addFurniture(project, catalogId, position, options);
  const furnitureId = placed.action.payload?.id;
  if (typeof furnitureId !== "string" || furnitureId.length === 0) {
    throw new Error("placeWorkstationConfigOnProject: addFurniture did not return id");
  }

  const projectWithDims: Open3dProject = {
    ...placed.project,
    floors: placed.project.floors.map((floor) => ({
      ...floor,
      furniture: floor.furniture.map((furniture) =>
        furniture.id === furnitureId
          ? {
              ...furniture,
              width: footprint.widthMm,
              depth: footprint.depthMm,
              height: config.heightMm,
              geometryMode: "box" as const,
              sourceCatalogId: catalogId,
            }
          : furniture,
      ),
    })),
  };

  return {
    project: projectWithDims,
    action: {
      type: "PLACE_WORKSTATION_V0",
      payload: {
        id: furnitureId,
        catalogId,
        position: { ...position },
        shape: config.shape,
        size: { ...config.size },
        modules: [...config.modules],
        widthMm: footprint.widthMm,
        depthMm: footprint.depthMm,
        heightMm: config.heightMm,
      },
      description: `Placed workstation ${catalogId}`,
      timestamp: Date.now(),
    },
  };
}
