"use client";

import type { CSSProperties } from "react";
import type { CatalogItem } from "@/features/planner/catalog-api/catalogTypes";
import { CatalogBlockPreview } from "@/features/planner/catalog-api/CatalogBlockPreview";

interface CatalogDropGhostProps {
  item: CatalogItem;
  x: number;
  y: number;
  width: number;
  height: number;
  valid?: boolean;
}

type CatalogDropGhostStyle = CSSProperties & {
  "--pw-drop-x": string;
  "--pw-drop-y": string;
  "--pw-drop-preview-width": string;
  "--pw-drop-preview-height": string;
};

export function CatalogDropGhost({
  item,
  x,
  y,
  width,
  height,
  valid = true,
}: CatalogDropGhostProps) {
  return (
    <div
      className="pw-drop-ghost"
      data-valid={valid}
      style={{
        "--pw-drop-x": `${x}px`,
        "--pw-drop-y": `${y}px`,
        "--pw-drop-preview-width": `${width}px`,
        "--pw-drop-preview-height": `${height}px`,
      } as CatalogDropGhostStyle}
      aria-hidden
    >
      <div className="pw-drop-ghost-preview">
        <CatalogBlockPreview item={item} />
      </div>
      <p className="pw-drop-ghost-label">{item.shortName ?? item.name}</p>
    </div>
  );
}
