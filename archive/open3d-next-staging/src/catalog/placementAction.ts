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
import type { Open3dProject } from "../model/types";
import type { PureActionResult } from "../model/operations/pureActions";
import { addFurniture } from "../model/operations/pureActions";

// ── Placement options ──

export interface PlacementOptions {
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

export type PlacementOverrides = Omit<PlacementOptions, "placedFrom">;

export interface ProjectPlacementResult {
  snapshot: Open3dPlacedConfiguration;
  result: PureActionResult;
}

// ── ID generation ──

const idSuffixChars = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomSuffix(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += idSuffixChars.charAt(Math.floor(Math.random() * idSuffixChars.length));
  }
  return result;
}

function randomIdSegment(): string {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID().replace(/-/g, "");
    }

    if (typeof crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(12);
      crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
  }

  return randomSuffix(24);
}

/**
 * Generate a collision-resistant placement ID for both interactive and batch placement.
 */
function generatePlacementId(): string {
  return `plc-${Date.now().toString(36)}-${randomIdSegment()}`;
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
 */
export function placeCatalogItemInProject(
  project: Open3dProject,
  item: Open3dCatalogItem,
  variant: Open3dCatalogVariant | null,
  options: PlacementOptions = { placedFrom: "click" },
): ProjectPlacementResult {
  const snapshot = placeCatalogItem(item, variant, options);
  const placed = addFurniture(project, item.id, snapshot.position, {
    idFactory: () => snapshot.placementId,
  });
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
