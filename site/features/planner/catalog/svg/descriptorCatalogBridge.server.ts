import "server-only";

import {
  catalogSlugSearchTags,
  humanizeCatalogSlug,
} from "../catalogLabelUtils";
import type { PlannerCatalogItem } from "../catalogTypes";
import { buildShortName } from "../catalogTaxonomy";
import {
  buildPublishedSvgApiUrl,
  buildSvgCatalogPublicUrl,
} from "./svgPreviewAssets";
import type { BlockDescriptor } from "./svgTypes";

export interface PlannerSvgCatalogDescriptor {
  readonly id: string;
  readonly slug: string;
  readonly sku?: string;
  readonly name?: string;
  readonly tags?: readonly string[];
  readonly geometry: {
    readonly widthMm: number;
    readonly depthMm: number;
    readonly heightMm: number;
  };
  /** Products DB pointer — prefer immutable revision API over disk catalog. */
  readonly publishedSvgRevisionId?: string;
}

type MappableDescriptor = BlockDescriptor | PlannerSvgCatalogDescriptor;

/** Map on-disk BlockDescriptors to planner catalog items (catalogue-first / BP-06). */
function isMappableDescriptor(
  descriptor: MappableDescriptor | null | undefined,
): descriptor is MappableDescriptor {
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

/**
 * Infer planner taxonomy from slug so Admin-published plan symbols
 * land in real furniture categories (not a generic Symbols dump).
 */
export function inferCatalogTaxonomyFromSlug(slug: string): {
  category: PlannerCatalogItem["category"];
  subCategory: string;
  taxonomyPath: string;
  typeTags: string[];
} {
  const s = slug.toLowerCase();
  if (/desk|workstation|bench-desk|linear|l-desk/.test(s)) {
    return {
      category: "Furniture",
      subCategory: "Desks & Workstations",
      taxonomyPath: "Furniture > Desks & Workstations",
      typeTags: ["desk", "workstation", "office"],
    };
  }
  if (/meeting|conference|table/.test(s) && !/side-table|coffee/.test(s)) {
    return {
      category: "Furniture",
      subCategory: "Tables",
      taxonomyPath: "Furniture > Tables",
      typeTags: ["table", "meeting", "office"],
    };
  }
  if (/side-table|coffee|ottoman/.test(s)) {
    return {
      category: "Furniture",
      subCategory: "Tables",
      taxonomyPath: "Furniture > Tables",
      typeTags: ["table", "occasional"],
    };
  }
  if (/chair|seat/.test(s) && !/sofa|sectional|chaise|bench/.test(s)) {
    return {
      category: "Furniture",
      subCategory: "Chairs",
      taxonomyPath: "Furniture > Chairs",
      typeTags: ["chair", "seating", "office"],
    };
  }
  if (/sofa|sectional|chaise|lounge|bench/.test(s)) {
    return {
      category: "Furniture",
      subCategory: "Sofas & Sectionals",
      taxonomyPath: "Furniture > Sofas & Sectionals",
      typeTags: ["sofa", "soft-seating"],
    };
  }
  if (/cabinet|pedestal|storage|locker/.test(s)) {
    return {
      category: "Storage & Organisation",
      subCategory: "Cabinets",
      taxonomyPath: "Storage & Organisation > Cabinets",
      typeTags: ["storage", "cabinet"],
    };
  }
  return {
    category: "Furniture",
    subCategory: "Plan symbols",
    taxonomyPath: "Furniture > Plan symbols",
    typeTags: ["symbol", "plan"],
  };
}

export function mapDescriptorToCatalogItem(
  descriptor: MappableDescriptor,
): PlannerCatalogItem {
  const slug =
    typeof descriptor.slug === "string" && descriptor.slug.trim() !== ""
      ? descriptor.slug
      : typeof descriptor.id === "string" && descriptor.id.trim() !== ""
        ? descriptor.id
        : "unknown";
  const revisionId =
    "publishedSvgRevisionId" in descriptor &&
    typeof descriptor.publishedSvgRevisionId === "string"
      ? descriptor.publishedSvgRevisionId.trim()
      : "";
  const svgUrl =
    revisionId && /^[a-z][a-z0-9-]{1,127}$/i.test(revisionId)
      ? buildPublishedSvgApiUrl(revisionId)
      : buildSvgCatalogPublicUrl(slug);
  const preferredName = "name" in descriptor ? descriptor.name : undefined;
  const descriptorTags = "tags" in descriptor ? descriptor.tags : undefined;
  const displayName =
    typeof preferredName === "string" && preferredName.trim() !== ""
      ? preferredName.trim()
      : humanizeCatalogSlug(slug);
  const shortName = buildShortName(displayName);
  const slugTags = catalogSlugSearchTags(slug);
  const taxonomy = inferCatalogTaxonomyFromSlug(slug);
  const widthMm = descriptor.geometry?.widthMm ?? 0;
  const depthMm = descriptor.geometry?.depthMm ?? 0;
  const heightMm = descriptor.geometry?.heightMm ?? 0;
  return {
    id: descriptor.id,
    slug,
    sku: descriptor.sku ?? `DESC-${slug}`,
    name: displayName,
    shortName,
    description: `Plan symbol · ${displayName} (${widthMm}×${depthMm} mm)`,
    category: taxonomy.category,
    subCategory: taxonomy.subCategory,
    taxonomyPath: `${taxonomy.taxonomyPath} > ${displayName}`,
    dimensions: {
      widthMm,
      depthMm,
      heightMm,
    },
    displayUnit: "mm",
    assets: {
      imageUrls: [svgUrl],
      previewImageUrl: svgUrl,
    },
    material: {
      marketingMaterial: "Plan SVG",
      normalizedMaterial: "svg-symbol",
    },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: Array.from(
      new Set([
        slug,
        ...slugTags,
        ...taxonomy.typeTags,
        ...(descriptorTags ?? []),
        "descriptor",
        "svg",
        "plan-symbol",
      ]),
    ),
    variants: [],
    provenance: { source: "descriptor-loader" },
    // Plan paint uses published SVG; not a marketing-only glyph.
    symbolOnly: false,
    license: "standard",
    animated: false,
    staffPicked: false,
    favourite: false,
    downloadable: true,
  };
}

export function mapDescriptorsToCatalogItems(
  descriptors: readonly MappableDescriptor[],
): PlannerCatalogItem[] {
  return descriptors
    .filter(isMappableDescriptor)
    .map(mapDescriptorToCatalogItem);
}
