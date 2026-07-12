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
export function mapDescriptorToCatalogItem(
  descriptor: BlockDescriptor,
): PlannerCatalogItem {
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
    category: "Symbols",
    subCategory: "SVG Catalog",
    taxonomyPath: `Symbols > SVG Catalog > ${displayName}`,
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
): PlannerCatalogItem[] {
  return descriptors.map(mapDescriptorToCatalogItem);
}