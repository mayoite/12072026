/**
 * Post-compile quality gate for plan SVGs before S4 disk write.
 *
 * Hard fail only: empty SVG; image-unsafe fill (currentColor / var()).
 * Soft: under-structure warnings from partIds / makerPartCount / path ids.
 * Never auto-pass solely because difference + evenodd.
 *
 * Result dialect — never throws for quality fails.
 */

export type PlanSvgQualityResult =
  | { ok: true; warnings?: string[] }
  | { ok: false; error: string };

export type PlanSvgQualityContext = {
  readonly slug: string;
  readonly variant?: string;
  readonly partIds?: readonly string[];
  readonly makerPartCount?: number;
};

const PATH_ID_RE = /<path\b[^>]*\bid\s*=\s*["']([^"']+)["']/gi;

function countPathIds(svg: string): number {
  let count = 0;
  PATH_ID_RE.lastIndex = 0;
  while (PATH_ID_RE.exec(svg) !== null) count += 1;
  return count;
}

/**
 * Structure signal for multipath symbols.
 * Uses maker part ids, makerPartCount, or path ids in the SVG — never
 * difference+evenodd alone as a craft/structure claim.
 */
export function computeStructureSignal(
  svg: string,
  ctx: PlanSvgQualityContext,
): number {
  const fromPartIds = ctx.partIds?.filter((id) => id.trim().length > 0).length ?? 0;
  const fromMaker =
    typeof ctx.makerPartCount === "number" && Number.isFinite(ctx.makerPartCount)
      ? Math.max(0, Math.floor(ctx.makerPartCount))
      : 0;
  const fromPathIds = countPathIds(svg);
  return Math.max(fromPartIds, fromMaker, fromPathIds);
}

/**
 * Hard-fail empty / image-unsafe paint; soft-warn under-structure.
 */
export function assertPlanSvgQuality(
  svg: string,
  ctx: PlanSvgQualityContext,
): PlanSvgQualityResult {
  if (!svg.trim()) {
    return { ok: false, error: `empty svg for ${ctx.slug}` };
  }

  if (
    /fill\s*=\s*["']currentColor/i.test(svg) ||
    /fill\s*=\s*["']var\(/i.test(svg)
  ) {
    return { ok: false, error: `image-unsafe paint on ${ctx.slug}` };
  }

  const warnings: string[] = [];
  // Structure from partIds / makerPartCount / path ids only — never path-count alone.
  const structure = computeStructureSignal(svg, ctx);

  // Soft under-structure: single silhouette / no multipath signal.
  // difference+evenodd alone does NOT clear this warning.
  if (structure < 2) {
    const evenodd =
      ctx.variant === "difference" && /fill-rule\s*=\s*["']evenodd/i.test(svg);
    warnings.push(
      evenodd
        ? `under-structured symbol for ${ctx.slug}: difference+evenodd is not structure (signals=${structure})`
        : `under-structured symbol for ${ctx.slug}: structure signals=${structure}`,
    );
  }

  if (warnings.length > 0) {
    return { ok: true, warnings };
  }
  return { ok: true };
}
