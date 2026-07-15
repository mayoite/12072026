export const SVG_ASSET_MANIFEST_VERSION = 2 as const;

export const SVG_ASSET_LIFECYCLES = ["draft", "review", "live", "retired"] as const;
export type SvgAssetLifecycleV2 = (typeof SVG_ASSET_LIFECYCLES)[number];

export const SVG_ASSET_KINDS = ["fixed", "configurable", "parametric"] as const;
export type SvgAssetKindV2 = (typeof SVG_ASSET_KINDS)[number];

export const SVG_ASSET_CAPABILITIES = [
  "geometry",
  "text",
  "transforms",
  "clipping",
  "masks",
  "gradients",
  "patterns",
  "managed-images",
] as const;
export type SvgAssetCapabilityV2 = (typeof SVG_ASSET_CAPABILITIES)[number];

export interface SvgAssetManifestV2 {
  readonly version: typeof SVG_ASSET_MANIFEST_VERSION;
  readonly assetId: string;
  readonly productId: string | null;
  readonly slug: string;
  readonly name: string;
  readonly assetKind: SvgAssetKindV2;
  readonly dimensionsMm: {
    readonly width: number;
    readonly depth: number;
    readonly height: number;
  };
  readonly sourceChecksum: string;
  readonly lifecycle: SvgAssetLifecycleV2;
  readonly currentVersion: number;
  readonly capabilities: readonly SvgAssetCapabilityV2[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
