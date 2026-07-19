/**
 * GET /api/planner/catalog/svg-blocks
 *
 * Public read of published SVG block descriptors for the planner inventory.
 * Prefer Products DB descriptors + revision API paint URLs when dual-write has
 * set product pointers; disk `/svg-catalog` remains migration fallback.
 */

import type { NextRequest } from "next/server";
import { existsSync } from "node:fs";

import { enforcePublicApiRateLimit } from "@/app/api/_lib/public";
import { success } from "@/features/shared/api/apiResponse";
import { mapDescriptorsToCatalogItems } from "@/features/planner/catalog/svg/descriptorCatalogBridge.server";
import { filterGuestInventoryCatalogItems } from "@/features/planner/catalog/catalogBuyerVisibility";
import { loadBuyerVisibleDescriptorsWithDb } from "@/features/admin/svg-editor/lifecycle/catalogLifecycle.db.server";
import { clearLoaderCache } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import { readSvgArtifactStatus } from "@/features/admin/svg-editor/publish/svgArtifactStatus.server";
import { isDbSvgReleaseAuthority } from "@/features/admin/svg-editor/publish/svgReleaseAuthority";
import { isPublishedSvgApiUrl } from "@/features/planner/catalog/svg/svgPreviewAssets";
import { loadAll } from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import {
  isBuyerVisibleSlug,
} from "@/features/admin/svg-editor/lifecycle/catalogLifecycle";
import {
  readParametricFactoryLifecycle,
  resolveParametricFactoryE2eRoot,
  type ParametricFactoryE2eRoot,
} from "@/features/admin/svg-editor/parametric/parametricFactoryE2eRoot.server";

function isBuyerPublishedCatalogItem(item: {
  readonly slug: string;
  readonly assets?: { readonly previewImageUrl?: string };
}, runtime?: ParametricFactoryE2eRoot): boolean {
  if (runtime) return existsSync(runtime.svgPath(item.slug));
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
  const runtime = resolveParametricFactoryE2eRoot();
  const isolatedLifecycle = runtime
    ? readParametricFactoryLifecycle(runtime)
    : undefined;
  const descriptors = runtime
    ? loadAll({ dir: runtime.descriptorDir, forceReload: true }).filter(
        (descriptor) =>
          isBuyerVisibleSlug(descriptor.slug, isolatedLifecycle ?? {}),
      )
    : await loadBuyerVisibleDescriptorsWithDb();
  // Guest / buyer inventory = oando-* brand heroes only (P10); no OFL toys / demo junk.
  const mappedItems = filterGuestInventoryCatalogItems(
    mapDescriptorsToCatalogItems(descriptors),
  ).filter((item) => isBuyerPublishedCatalogItem(item, runtime));
  const items = runtime
    ? mappedItems.map((item) => {
        const previewUrl = runtime.previewUrl(item.slug);
        return {
          ...item,
          assets: {
            ...item.assets,
            imageUrls: [previewUrl],
            previewImageUrl: previewUrl,
          },
        };
      })
    : mappedItems;

  return success({
    items,
    source: items.length > 0 ? "svg-blocks" : "none",
    total: items.length,
  });
}
