import "server-only";

import {
  catalogSlugSearchTags,
  humanizeCatalogSlug,
} from "../catalogLabelUtils";
import type { PlannerCatalogItem } from "../catalogTypes";
import { buildShortName } from "../catalogTaxonomy";
import { buildSvgCatalogPublicUrl } from "./svgPreviewAssets";
import type { BlockDescriptor } from "./svgTypes";

/** Map on-disk BlockDescriptors to planner catalog items (catalogue-first / BP-06). */
function isMappableDescriptor(
  descriptor: BlockDescriptor | null | undefined,
): descriptor is BlockDescriptor {
  if (!descriptor || typeof descriptor !== "object") return false;
  const geometry = (descriptor as BlockDescriptor).geometry;
  if (!geometry || typeof geometry !== "object") return false;
  return (
    typeof geometry.widthMm === "number" &&
    Number.isFinite(geometry.widthMm) &&
    typeof geometry.depthMm === "number" &&
    Number.isFinite(geometry.depthMm)
  );
}

export function mapDescriptorToCatalogItem(
  descriptor: BlockDescriptor,
): PlannerCatalogItem {
  const slug =
    typeof descriptor.slug === "string" && descriptor.slug.trim() !== ""
      ? descriptor.slug
      : typeof descriptor.id === "string" && descriptor.id.trim() !== ""
        ? descriptor.id
        : "unknown";
  const svgUrl = buildSvgCatalogPublicUrl(slug);
  const displayName = humanizeCatalogSlug(slug);
  const shortName = buildShortName(displayName);
  const slugTags = catalogSlugSearchTags(slug);
  const widthMm = descriptor.geometry?.widthMm ?? 0;
  const depthMm = descriptor.geometry?.depthMm ?? 0;
  const heightMm = descriptor.geometry?.heightMm ?? 0;
  return {
    id: descriptor.id,
    slug,
    sku: descriptor.sku ?? `DESC-${slug}`,
    name: displayName,
    shortName,
    description: `SVG symbol · ${displayName}`,
    category: "Symbols",
    subCategory: "SVG Catalog",
    taxonomyPath: `Symbols > SVG Catalog > ${displayName}`,
    dimensions: {
      widthMm,
      depthMm,
      heightMm,
    },
    displayUnit: "mm",
    assets: {
      imageUrls: [],
      previewImageUrl: svgUrl,
    },
    material: {
      marketingMaterial: "SVG",
      normalizedMaterial: "svg-symbol",
    },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: Array.from(
      new Set([slug, ...slugTags, "descriptor", "symbol", "svg"]),
    ),
    variants: [],
    provenance: { source: "descriptor-loader" },
    symbolOnly: true,
    license: "standard",
    animated: false,
    staffPicked: false,
    favourite: false,
    downloadable: true,
  };
}

export function mapDescriptorsToCatalogItems(
  descriptors: readonly BlockDescriptor[],
): PlannerCatalogItem[] {
  return descriptors
    .filter(isMappableDescriptor)
    .map(mapDescriptorToCatalogItem);
}