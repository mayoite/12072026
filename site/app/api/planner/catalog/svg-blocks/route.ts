/**
 * GET /api/planner/catalog/svg-blocks
 *
 * Public read of published SVG block descriptors for the planner inventory.
 * Bridges on-disk inventory/descriptors/ to client-side catalog hydration.
 */

import type { NextRequest } from "next/server";

import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { success } from "@/features/shared/api/apiResponse";
import { mapDescriptorsToCatalogItems } from "@/features/planner/project/catalog/svg/descriptorCatalogBridge.server";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/catalogLifecycle.db.server";

export async function GET(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-catalog-svg-blocks:get",
    60,
  );
  if (rateError) return rateError;

  const descriptors = loadBuyerVisibleDescriptorsWithDb();
  const items = mapDescriptorsToCatalogItems(descriptors);

  return success({
    items,
    source: items.length > 0 ? "svg-blocks" : "none",
    total: items.length,
  });
}