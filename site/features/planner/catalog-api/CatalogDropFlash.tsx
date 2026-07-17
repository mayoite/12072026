"use client";

import type { CSSProperties } from "react";

interface CatalogDropFlashProps {
  x: number;
  y: number;
}

type CatalogDropFlashStyle = CSSProperties & {
  "--pw-drop-flash-x": string;
  "--pw-drop-flash-y": string;
};

export function CatalogDropFlash({ x, y }: CatalogDropFlashProps) {
  return (
    <div
      className="pw-drop-flash"
      style={{
        "--pw-drop-flash-x": `${x}px`,
        "--pw-drop-flash-y": `${y}px`,
      } as CatalogDropFlashStyle}
      aria-hidden
    />
  );
}
