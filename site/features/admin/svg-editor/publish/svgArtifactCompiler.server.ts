import "server-only";

import { createHash } from "node:crypto";
import { Resvg } from "@resvg/resvg-js";

import {
  compileSvgBlockV1,
  type CompiledSvgBlockV1,
} from "@/features/planner/catalog/svg/svgCompiler.server";
import {
  SVG_RASTER_MASTER_WIDTH,
  SVG_THUMBNAIL_WIDTHS,
} from "@/features/planner/catalog/svg/svgPreviewAssets";

export interface SvgRasterDerivative {
  readonly width: number;
  readonly png: Buffer;
  readonly checksum: string;
}

export interface CompiledSvgArtifacts extends CompiledSvgBlockV1 {
  readonly png: Buffer;
  readonly pngChecksum: string;
  readonly thumbnails: readonly SvgRasterDerivative[];
}

function checksum(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function renderSvgPng(svg: string, width: number): Buffer {
  return Buffer.from(
    new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng(),
  );
}

export async function compileSvgArtifacts(
  input: unknown,
  thumbnailWidths: readonly number[] = SVG_THUMBNAIL_WIDTHS,
): Promise<CompiledSvgArtifacts> {
  const compiled = compileSvgBlockV1(input);
  const png = renderSvgPng(compiled.svg, SVG_RASTER_MASTER_WIDTH);
  const widths = [...new Set(thumbnailWidths)].sort((left, right) => left - right);
  const thumbnails = await Promise.all(widths.map(async (width) => {
    if (!Number.isInteger(width) || width < 1 || width > 4096) {
      throw new RangeError(`thumbnail width must be an integer from 1 to 4096; received ${width}`);
    }
    const derivative = renderSvgPng(compiled.svg, width);
    return Object.freeze({ width, png: derivative, checksum: checksum(derivative) });
  }));
  return Object.freeze({
    ...compiled,
    png,
    pngChecksum: checksum(png),
    thumbnails: Object.freeze(thumbnails),
  });
}
