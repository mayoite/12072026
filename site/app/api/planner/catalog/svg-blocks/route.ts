/**
 * GET /api/planner/catalog/svg-blocks
 *
 * Public read of published SVG block descriptors for the planner inventory.
 * Bridges on-disk block-descriptors/ to client-side catalog hydration.
 */

import type { NextRequest } from "next/server";

import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { success } from "@/lib/api/apiResponse";
import { mapDescriptorsToCatalogItems } from "@/features/planner/open3d/catalog/svg/descriptorCatalogBridge.server";
import { loadAll } from "@/features/planner/open3d/catalog/svg/svgBlockDescriptorLoader";

export async function GET(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-catalog-svg-blocks:get",
    60,
  );
  if (rateError) return rateError;

  const descriptors = loadAll();
  const items = mapDescriptorsToCatalogItems(descriptors);

  return success({
    items,
    source: items.length > 0 ? "svg-blocks" : "none",
    total: items.length,
  });
}