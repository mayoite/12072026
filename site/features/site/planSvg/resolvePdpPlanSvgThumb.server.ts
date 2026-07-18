/**
 * Server-only disk existence for PDP plan SVG thumbs.
 * Live authority remains public/svg-catalog until cutover.
 */

import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";

import {
  resolvePdpPlanSvgThumb,
  type PdpPlanSvgThumbInput,
  type PdpPlanSvgThumbResult,
} from "./resolvePdpPlanSvgThumb";

export function diskPlanSvgExists(slug: string): boolean {
  const safe = slug.trim();
  if (!safe || safe.includes("..") || safe.includes("/") || safe.includes("\\")) {
    return false;
  }
  const svgPath = path.resolve(process.cwd(), "public", "svg-catalog", `${safe}.svg`);
  return existsSync(svgPath);
}

/** Resolve PDP plan thumb using on-disk published symbols (and optional revision id). */
export function resolvePdpPlanSvgThumbFromDisk(
  input: PdpPlanSvgThumbInput,
): PdpPlanSvgThumbResult | null {
  return resolvePdpPlanSvgThumb(input, { diskExists: diskPlanSvgExists });
}
