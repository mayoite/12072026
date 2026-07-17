/**
 * GET /api/planner/catalog/svg-blocks
 *
 * Public read of published SVG block descriptors for the planner inventory.
 * Bridges on-disk inventory/descriptors/ to client-side catalog hydration.
 */

import type { NextRequest } from "next/server";

import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { success } from "@/features/shared/api/apiResponse";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { filterBuyerFacingCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";

export async function GET(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-catalog-svg-blocks:get",
    60,
  );
  if (rateError) return rateError;

  const descriptors = await loadBuyerVisibleDescriptorsWithDb();
  const items = filterBuyerFacingCatalogItems(
    mapDescriptorsToCatalogItems(descriptors),
  ).filter((item) => readSvgArtifactStatus(item.slug).state === "published");

  return success({
    items,
    source: items.length > 0 ? "svg-blocks" : "none",
    total: items.length,
  });
}
