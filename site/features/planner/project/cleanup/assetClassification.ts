/**
 * Phase 08 asset ownership classification.
 * @see plannnerplan/08-cleanup-archive-and-evidence-gates.md:45-47
 * @see docs/site/ARCHITECTURE.md (CDN / demo assets)
 */

export type AssetOwnershipClass =
  | "runtime-editor-cdn"
  | "product-catalog-r2"
  | "demo-donor-reference"
  | "generated-svg";

export type ClassifiedAsset = {
  id: string;
  path: string;
  ownership: AssetOwnershipClass;
  license: string;
  productionAllowed: boolean;
  cdnDestination?: string;
};

/** Runtime/editor textures — may copy to CDN after Phase 08 sign-off; never product catalog. */
export const RUNTIME_TEXTURE_ASSETS: readonly ClassifiedAsset[] = [
  {
    id: "texture-brick",
    path: "open3d-floorplan/static/textures/brick.jpg",
    ownership: "runtime-editor-cdn",
    license: "CC0-1.0 (ambientCG)",
    productionAllowed: false,
    cdnDestination: "/cdn/planner/canvas/textures/brick.jpg",
  },
  {
    id: "texture-wood-panel",
    path: "open3d-floorplan/static/textures/wood-panel.jpg",
    ownership: "runtime-editor-cdn",
    license: "CC0-1.0 (ambientCG)",
    productionAllowed: false,
    cdnDestination: "/cdn/planner/canvas/textures/wood-panel.jpg",
  },
] as const;

/** Donor GLB demos — reference sizing only; product meshes stay R2/DB. */
export const DEMO_MODEL_ASSETS: readonly ClassifiedAsset[] = [
  {
    id: "demo-glb-any",
    path: "open3d-floorplan/static/models/*.glb",
    ownership: "demo-donor-reference",
    license: "unknown-demo-only",
    productionAllowed: false,
  },
] as const;

export const PRODUCT_CATALOG_POLICY: ClassifiedAsset = {
  id: "catalog-api-assets",
  path: "/api/planner/catalog",
  ownership: "product-catalog-r2",
  license: "OOFPLWeb catalog terms",
  productionAllowed: true,
};

export const GENERATED_SVG_POLICY: ClassifiedAsset = {
  id: "inventory-svg-symbols",
  path: "site/features/planner/project/catalog/svg/svgSymbols.ts",
  ownership: "generated-svg",
  license: "OOFPLWeb",
  productionAllowed: true,
};

export function assertProductAssetsStayOffGit(asset: ClassifiedAsset): boolean {
  return asset.ownership !== "product-catalog-r2" || !asset.path.startsWith("site/public/");
}

export function listCdnEligibleRuntimeAssets(): ClassifiedAsset[] {
  return [...RUNTIME_TEXTURE_ASSETS].filter((a) => a.ownership === "runtime-editor-cdn");
}
