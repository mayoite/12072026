import "server-only";

import { createHash } from "node:crypto";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

import {
  compileSvgBlockV1,
  type CompiledSvgBlockV1,
} from "@/features/planner/open3d/catalog/svg/svgCompiler.server";

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

export async function compileSvgArtifacts(
  input: unknown,
  thumbnailWidths: readonly number[] = [128, 256],
): Promise<CompiledSvgArtifacts> {
  const compiled = compileSvgBlockV1(input);
  const png = Buffer.from(new Resvg(compiled.svg, { fitTo: { mode: "width", value: 1024 } }).render().asPng());
  const widths = [...new Set(thumbnailWidths)].sort((left, right) => left - right);
  const thumbnails = await Promise.all(widths.map(async (width) => {
    if (!Number.isInteger(width) || width < 1 || width > 4096) {
      throw new RangeError(`thumbnail width must be an integer from 1 to 4096; received ${width}`);
    }
    const derivative = await sharp(png).resize({ width, withoutEnlargement: true }).png().toBuffer();
    return Object.freeze({ width, png: derivative, checksum: checksum(derivative) });
  }));
  return Object.freeze({
    ...compiled,
    png,
    pngChecksum: checksum(png),
    thumbnails: Object.freeze(thumbnails),
  });
}
