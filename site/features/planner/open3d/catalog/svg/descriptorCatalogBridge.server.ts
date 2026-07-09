import "server-only";

import {
  catalogSlugSearchTags,
  humanizeCatalogSlug,
} from "../catalogLabelUtils";
import type { Open3dCatalogItem } from "../catalogTypes";
import { buildShortName } from "../catalogTaxonomy";
import { buildSvgCatalogPublicUrl } from "./svgPreviewAssets";
import type { BlockDescriptor } from "./svgTypes";

/** Map on-disk BlockDescriptors to planner catalog items (catalogue-first / BP-06). */
export function mapDescriptorToCatalogItem(
  descriptor: BlockDescriptor,
): Open3dCatalogItem {
  const svgUrl = buildSvgCatalogPublicUrl(descriptor.slug);
  const displayName = humanizeCatalogSlug(descriptor.slug);
  const shortName = buildShortName(displayName);
  const slugTags = catalogSlugSearchTags(descriptor.slug);
  return {
    id: descriptor.id,
    slug: descriptor.slug,
    sku: descriptor.sku ?? `DESC-${descriptor.slug}`,
    name: displayName,
    shortName,
    description: `SVG symbol · ${displayName}`,
    category: "Furniture",
    subCategory: "Symbols",
    taxonomyPath: `Furniture > Symbols > ${displayName}`,
    dimensions: {
      widthMm: descriptor.geometry.widthMm,
      depthMm: descriptor.geometry.depthMm,
      heightMm: descriptor.geometry.heightMm,
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
      new Set([descriptor.slug, ...slugTags, "descriptor", "symbol", "svg"]),
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
): Open3dCatalogItem[] {
  return descriptors.map(mapDescriptorToCatalogItem);
}