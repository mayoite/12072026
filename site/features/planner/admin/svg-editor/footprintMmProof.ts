/**
 * Admin P01 — verify descriptor mm geometry aligns with viewBox footprint.
 */

import type { BlockDescriptor } from "@/features/planner/project/catalog/svg/svgTypes";

export type FootprintProof = {
  readonly slug: string;
  readonly widthMm: number;
  readonly depthMm: number;
  readonly viewBoxWidth: number;
  readonly viewBoxHeight: number;
  readonly aligned: boolean;
};

export function proveDescriptorFootprintMm(descriptor: BlockDescriptor): FootprintProof {
  const widthMm = descriptor.geometry.widthMm;
  const depthMm = descriptor.geometry.depthMm;
  const viewBoxWidth = descriptor.viewBox.width;
  const viewBoxHeight = descriptor.viewBox.height;
  const aligned = viewBoxWidth === widthMm && viewBoxHeight === depthMm;
  return {
    slug: descriptor.slug,
    widthMm,
    depthMm,
    viewBoxWidth,
    viewBoxHeight,
    aligned,
  };
}