/**
 * GET /api/planner/catalog/svg-blocks
 *
 * Public read of published SVG block descriptors for the planner inventory.
 * Prefer Products DB descriptors + revision API paint URLs when dual-write has
 * set product pointers; disk `/svg-catalog` remains migration fallback.
 */

import type { NextRequest } from "next/server";

import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { success } from "@/features/shared/api/apiResponse";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { filterGuestInventoryCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { clearLoaderCache } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { isDbSvgReleaseAuthority } from "@/features/admin/svg-editor/publish/svgReleaseAuthority";
import { isPublishedSvgApiUrl } from "@/features/planner/catalog/svg/svgPreviewAssets";

function isBuyerPublishedCatalogItem(item: {
  readonly slug: string;
  readonly assets?: { readonly previewImageUrl?: string };
}): boolean {
  const preview = item.assets?.previewImageUrl?.trim() ?? "";
  if (preview && isPublishedSvgApiUrl(preview)) return true;
  // DB authority: only immutable revision API URLs count as published.
  if (isDbSvgReleaseAuthority()) return false;
  return readSvgArtifactStatus(item.slug).state === "published";
}

export async function GET(req: NextRequest) {
  const rateError = await enforcePublicApiRateLimit(
    req,
    "planner-catalog-svg-blocks:get",
    60,
  );
  if (rateError) return rateError;

  // Drop in-process descriptor cache so Admin publish is visible without restart.
  // (Server action clearLoaderCache does not share module state with this route.)
  clearLoaderCache();
  const descriptors = await loadBuyerVisibleDescriptorsWithDb();
  // Guest / buyer inventory = oando-* brand heroes only (P10); no OFL toys / demo junk.
  const items = filterGuestInventoryCatalogItems(
    mapDescriptorsToCatalogItems(descriptors),
  ).filter(isBuyerPublishedCatalogItem);

  return success({
    items,
    source: items.length > 0 ? "svg-blocks" : "none",
    total: items.length,
  });
}
