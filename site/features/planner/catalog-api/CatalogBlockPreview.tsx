"use client";

import { useMemo, type CSSProperties } from "react";
import { blockToSvg } from "@/lib/catalog/blocks2d";
import { sanitizeInlineSvg } from "@/lib/security/sanitize";
import { resolveCatalogItemBlock2D } from "@/features/planner/catalog-api/catalogBlockBridge";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";

const PREVIEW_MAX_W = 52;
const PREVIEW_MAX_H = 36;
const PREVIEW_PADDING = 40;
/** Render SVG at 2x CSS size for retina clarity. */
const PREVIEW_RENDER_SCALE = 2;

interface CatalogBlockPreviewProps {
  item: CatalogItem;
}

type CatalogPreviewStyle = CSSProperties & {
  "--pw-catalog-preview-width": string;
  "--pw-catalog-preview-height": string;
};

function previewDimensions(footprintL: number, footprintD: number): { w: number; h: number } {
  const aspect = footprintL / Math.max(1, footprintD);
  if (aspect >= 1.4) {
    return { w: PREVIEW_MAX_W, h: Math.max(20, Math.round(PREVIEW_MAX_W / aspect)) };
  }
  if (aspect <= 0.75) {
    return { w: Math.max(24, Math.round(PREVIEW_MAX_H * aspect)), h: PREVIEW_MAX_H };
  }
  return { w: PREVIEW_MAX_W, h: PREVIEW_MAX_H };
}

function sizePreviewSvg(markup: string, width: number, height: number): string {
  return markup.replace(
    /(<svg\b[^>]*?)\s+width="[^"]*"\s+height="[^"]*"/,
    `$1 width="${width}" height="${height}"`,
  );
}

export function CatalogBlockPreview({ item }: CatalogBlockPreviewProps) {
  const block = useMemo(() => resolveCatalogItemBlock2D(item), [item]);
  const { w: previewW, h: previewH } = block
    ? previewDimensions(block.footprint.L, block.footprint.D)
    : { w: 40, h: 24 };

  const previewSvg = useMemo(() => {
    if (!block?.prims.length) return null;
    return sizePreviewSvg(
      blockToSvg(block, PREVIEW_PADDING),
      previewW * PREVIEW_RENDER_SCALE,
      previewH * PREVIEW_RENDER_SCALE,
    );
  }, [block, previewW, previewH]);

  if (!previewSvg) {
    return (
      <div
        aria-hidden
        className="pw-catalog-block-fallback rounded-sm border shadow-inner"
        style={{
          "--pw-catalog-preview-width": `${Math.min(item.widthMm * 0.12, 40)}px`,
          "--pw-catalog-preview-height": `${Math.min(item.heightMm * 0.12, 24)}px`,
        } as CatalogPreviewStyle}
      />
    );
  }

  return (
    <div
      className="pw-catalog-block-preview"
      style={{
        "--pw-catalog-preview-width": `${previewW}px`,
        "--pw-catalog-preview-height": `${previewH}px`,
      } as CatalogPreviewStyle}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: sanitizeInlineSvg(previewSvg) }}
    />
  );
}
