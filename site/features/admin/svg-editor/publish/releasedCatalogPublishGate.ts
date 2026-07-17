/**
 * Admin Phase 2 — publish gate against ReleasedCatalogProductV1 readiness.
 *
 * Blocks incomplete or contradictory descriptors before SVG pipeline / persist.
 * Pure helpers; no catalog I/O.
 */

import { createHash } from "node:crypto";

import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import { BLOCK_DESCRIPTOR_SLUG_REGEX } from "@/features/planner/catalog/svg/svgTypes";
import {
  parseReleasedCatalogProductV1,
  type ReleasedAvailability,
  type ReleasedCatalogProductV1,
} from "@/features/admin/catalog/releasedCatalogContract";

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type PublishGateOk = { readonly ok: true };
export type PublishGateFail = {
  readonly ok: false;
  readonly error: string;
  readonly issues: readonly string[];
};
export type PublishGateResult = PublishGateOk | PublishGateFail;

/**
 * Pre-compile gate: identity, footprint, and viewBox must be publishable.
 */
export function assertDescriptorPublishable(
  descriptor: BlockDescriptor,
): PublishGateResult {
  const issues: string[] = [];

  if (!UUID_V4.test(descriptor.id)) {
    issues.push("product id must be a UUID v4");
  }
  if (!BLOCK_DESCRIPTOR_SLUG_REGEX.test(descriptor.slug)) {
    issues.push("slug is missing or invalid");
  }
  if (
    !Number.isFinite(descriptor.geometry.widthMm) ||
    descriptor.geometry.widthMm <= 0
  ) {
    issues.push("geometry.widthMm must be positive");
  }
  if (
    !Number.isFinite(descriptor.geometry.depthMm) ||
    descriptor.geometry.depthMm <= 0
  ) {
    issues.push("geometry.depthMm must be positive");
  }
  if (
    !Number.isFinite(descriptor.geometry.heightMm) ||
    descriptor.geometry.heightMm <= 0
  ) {
    issues.push("geometry.heightMm must be positive");
  }
  if (
    descriptor.viewBox.width !== descriptor.geometry.widthMm ||
    descriptor.viewBox.height !== descriptor.geometry.depthMm
  ) {
    issues.push(
      "viewBox width/height must match geometry widthMm/depthMm (contradiction)",
    );
  }
  if (descriptor.mounting.length === 0) {
    issues.push("at least one mounting plane is required");
  }

  const boq = (descriptor.sku?.trim() || descriptor.slug).trim();
  if (boq.length === 0) {
    issues.push("BOQ identity requires sku or slug");
  }

  if (issues.length > 0) {
    return {
      ok: false,
      error: `released_contract: incomplete or contradictory product — ${issues.join("; ")}`,
      issues,
    };
  }
  return { ok: true };
}

export type BuildReleasedProductInput = {
  readonly descriptor: BlockDescriptor;
  readonly svgMarkup: string;
  readonly revisionId: string;
  readonly definitionVersion?: number;
  readonly publishedAt: string;
  readonly availability: ReleasedAvailability;
};

export type BuildReleasedProductResult =
  | { readonly ok: true; readonly product: ReleasedCatalogProductV1 }
  | { readonly ok: false; readonly error: string };

/**
 * Post-compile gate: full ReleasedCatalogProductV1 must parse or publish aborts.
 */
export function buildReleasedProductFromPublish(
  input: BuildReleasedProductInput,
): BuildReleasedProductResult {
  const pre = assertDescriptorPublishable(input.descriptor);
  if (!pre.ok) {
    return { ok: false, error: pre.error };
  }

  const svgChecksum = createHash("sha256")
    .update(input.svgMarkup, "utf8")
    .digest("hex");
  const boqIdentity =
    input.descriptor.sku?.trim() || input.descriptor.slug.trim();

  try {
    const product = parseReleasedCatalogProductV1({
      schemaVersion: 1,
      productId: input.descriptor.id,
      slug: input.descriptor.slug,
      name: input.descriptor.slug,
      ...(input.descriptor.sku?.trim()
        ? { sku: input.descriptor.sku.trim() }
        : {}),
      boqIdentity,
      availability: input.availability,
      dimensionsMm: {
        width: input.descriptor.geometry.widthMm,
        depth: input.descriptor.geometry.depthMm,
        height: input.descriptor.geometry.heightMm,
      },
      svg: {
        revisionId: input.revisionId,
        checksum: svgChecksum,
        resourceUrl: `/api/planner/catalog/svg/${input.revisionId}`,
      },
      definitionTypeId: input.descriptor.slug,
      definitionVersion: input.definitionVersion ?? 1,
      publishedAt: input.publishedAt,
    });
    return { ok: true, product };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return {
      ok: false,
      error: `released_contract: cannot form released product — ${message}`,
    };
  }
}
