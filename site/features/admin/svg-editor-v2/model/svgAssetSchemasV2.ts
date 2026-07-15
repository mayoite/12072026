import { z } from "zod";

import {
  SVG_ASSET_CAPABILITIES,
  SVG_ASSET_KINDS,
  SVG_ASSET_LIFECYCLES,
  SVG_ASSET_MANIFEST_VERSION,
  type SvgAssetManifestV2,
} from "./svgAssetManifestV2";

const PositiveFiniteNumberSchema = z.number().finite().positive();
const Sha256Schema = z.string().regex(/^[a-f0-9]{64}$/);

export const SvgAssetDimensionsMmV2Schema = z.object({
  width: PositiveFiniteNumberSchema,
  depth: PositiveFiniteNumberSchema,
  height: PositiveFiniteNumberSchema,
}).strict();

export const SvgAssetManifestV2Schema = z.object({
  version: z.literal(SVG_ASSET_MANIFEST_VERSION),
  assetId: z.string().uuid(),
  productId: z.string().uuid().nullable(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  name: z.string().trim().min(1).max(200),
  assetKind: z.enum(SVG_ASSET_KINDS),
  dimensionsMm: SvgAssetDimensionsMmV2Schema,
  sourceChecksum: Sha256Schema,
  lifecycle: z.enum(SVG_ASSET_LIFECYCLES),
  currentVersion: z.number().int().nonnegative(),
  capabilities: z.array(z.enum(SVG_ASSET_CAPABILITIES)).min(1).max(SVG_ASSET_CAPABILITIES.length),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
}).strict().superRefine((manifest, context) => {
  if (new Set(manifest.capabilities).size !== manifest.capabilities.length) {
    context.addIssue({
      code: "custom",
      path: ["capabilities"],
      message: "capabilities must be unique",
    });
  }
  if (Date.parse(manifest.updatedAt) < Date.parse(manifest.createdAt)) {
    context.addIssue({
      code: "custom",
      path: ["updatedAt"],
      message: "updatedAt must not precede createdAt",
    });
  }
});

export function parseSvgAssetManifestV2(input: unknown): SvgAssetManifestV2 {
  return SvgAssetManifestV2Schema.parse(input);
}
