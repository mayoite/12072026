"use client";

import type { CSSProperties } from "react";
import { blockToSvg, type Block2D } from "@/lib/catalog/blocks2d";
import type { Prim } from "@/lib/catalog/blocks2d";
import { sanitizeInlineSvg } from "@/lib/security/sanitize";

interface RenderBlockPrimsProps {
  prims: Prim[];
  width: number;
  height: number;
  padding?: number;
  idPrefix?: string;
  footprint?: { L: number; D: number };
}

type CatalogBlockSizeStyle = CSSProperties & {
  "--pw-catalog-preview-width": string;
  "--pw-catalog-preview-height": string;
};

/**
 * Renders catalog block primitives via the canonical blockToSvg serializer
 * (paths, arcs, lines, gradients, resolved colors).
 * Markup is sanitized before DOM injection (same gate as CatalogBlockPreview).
 */
export function RenderBlockPrims({
  prims,
  width,
  height,
  footprint,
}: RenderBlockPrimsProps) {
  if (!prims.length) return null;

  const block: Block2D = {
    footprint: footprint ?? { L: width, D: height, H: 750 },
    prims,
    label: "preview",
  };

  const markup = sanitizeInlineSvg(
    blockToSvg(block).replace(
      /(<svg\b[^>]*?)\s+width="[^"]*"\s+height="[^"]*"/,
      `$1 width="${width}" height="${height}"`,
    ),
  );

  return (
    <div
      className="pw-catalog-block-preview"
      style={{
        "--pw-catalog-preview-width": `${width}px`,
        "--pw-catalog-preview-height": `${height}px`,
      } as CatalogBlockSizeStyle}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
