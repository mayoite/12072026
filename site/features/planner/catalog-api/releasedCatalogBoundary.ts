/**
 * Planner Phase 2 — released catalog boundary.
 *
 * Loads a published product (ReleasedCatalogProductV1) for placement and plan paint.
 * Does not touch Products DB or disk catalogs; callers supply the product (API or fixture).
 *
 * Paint rule (matches fabricBlock2D createFabricFurnitureSymbol):
 * - Published SVG is the primary 2D plan symbol when loaded.
 * - Block2D only while SVG is loading or unavailable.
 */

import {
  parseReleasedCatalogProductV1,
  type ReleasedCatalogProductV1,
} from "@/features/planner/catalog-api/releasedCatalogContract";
import { cloneReleasedCatalogProductFixture } from "@/features/planner/catalog-api/fixtures/releasedCatalogProduct.fixture";
import {
  placementPolicyForLifecycle,
  type PlacementPolicy,
} from "@/features/admin/svg-editor/catalogRetirement";
import type { CatalogLifecycleState } from "@/features/admin/svg-editor/catalogLifecycle.shared";

/** Placement fields stamped from a released product onto a plan entity. */
export type PlannerReleasedPlacement = {
  readonly productId: string;
  readonly slug: string;
  readonly name: string;
  readonly boqIdentity: string;
  readonly sku: string | undefined;
  readonly widthMm: number;
  readonly depthMm: number;
  readonly heightMm: number | undefined;
  /** Primary 2D plan symbol — published SVG URL. */
  readonly planSvgUrl: string;
  readonly svgRevisionId: string;
  readonly svgChecksum: string;
};

export type PlanSymbolPaintMode = "svg" | "block2d";

/**
 * Load a released product through the Planner catalog boundary.
 * Production: parse API JSON. Tests: isolated fixture (no released-row I/O).
 */
export function loadReleasedProductFromCatalogPayload(
  payload: unknown,
): ReleasedCatalogProductV1 {
  return parseReleasedCatalogProductV1(payload);
}

/** Isolated fixture loader — never mutates released rows or catalog files. */
export function loadReleasedProductFixture(): ReleasedCatalogProductV1 {
  return loadReleasedProductFromCatalogPayload(
    cloneReleasedCatalogProductFixture(),
  );
}

/**
 * Map released product → placement identity, dimensions, BOQ, and plan SVG URL.
 * Dimensions match Admin mm footprint; BOQ identity is the commercial line key.
 */
export function placementFromReleasedProduct(
  product: ReleasedCatalogProductV1,
): PlannerReleasedPlacement {
  return {
    productId: product.productId,
    slug: product.slug,
    name: product.name,
    boqIdentity: product.boqIdentity,
    sku: product.sku,
    widthMm: product.dimensionsMm.width,
    depthMm: product.dimensionsMm.depth,
    heightMm: product.dimensionsMm.height,
    planSvgUrl: product.svg.resourceUrl,
    svgRevisionId: product.svg.revisionId,
    svgChecksum: product.svg.checksum,
  };
}

/**
 * Resolve plan paint mode for a placed product.
 * Block2D only while loading or when SVG is unavailable/failed.
 */
export function resolvePlanSymbolPaintMode(input: {
  readonly planSvgUrl: string | null | undefined;
  /** True when getSvgPlanImage returned a loaded image. */
  readonly svgImageReady: boolean;
  /** True after a failed load (cache null). */
  readonly svgLoadFailed: boolean;
}): PlanSymbolPaintMode {
  if (!input.planSvgUrl || input.planSvgUrl.trim() === "") {
    return "block2d";
  }
  if (input.svgLoadFailed) {
    return "block2d";
  }
  if (!input.svgImageReady) {
    return "block2d";
  }
  return "svg";
}

/** BOQ line identity after placement — must equal released product boqIdentity. */
export function boqIdentityFromPlacement(
  placement: PlannerReleasedPlacement,
): string {
  return placement.boqIdentity;
}

/**
 * Shape stamped onto PlannerFurnitureItem at place time (subset).
 * Aligns with placementAction identity + previewImageUrl fields.
 */
export function furnitureStampFromPlacement(
  placement: PlannerReleasedPlacement,
): {
  readonly sourceCatalogId: string;
  readonly sourceSlug: string;
  readonly sourceSku: string | undefined;
  readonly width: number;
  readonly depth: number;
  readonly height: number | undefined;
  readonly previewImageUrl: string;
  readonly boqIdentity: string;
} {
  return {
    sourceCatalogId: placement.productId,
    sourceSlug: placement.slug,
    sourceSku: placement.sku,
    width: placement.widthMm,
    depth: placement.depthMm,
    height: placement.heightMm,
    previewImageUrl: placement.planSvgUrl,
    boqIdentity: placement.boqIdentity,
  };
}

/** New placement blocked for retired/draft; existing designs keep identity. */
export function placementPolicyForReleasedSlug(
  lifecycle: CatalogLifecycleState,
): PlacementPolicy {
  return placementPolicyForLifecycle(lifecycle);
}
