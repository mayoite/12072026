/**
 * Pure SVG extrude → parts plan (P1 skeleton).
 *
 * Mirrors GlbExtruderPreview inputs (svg path / rect, thicknessMm, material color)
 * without THREE or browser. Returns plan metadata + policy-safe relativePath under
 * catalog-assets/generated/ only. Binary GLB remains GlbExtruderPreview (admin island)
 * until a dedicated G5 binary export is extracted.
 *
 * @see site/features/admin/svg-editor/GlbExtruderPreview.tsx
 * @see site/features/planner/catalog/modularCabinetV0GlbExport.ts (same plan pattern)
 */

import {
  GENERATED_GLB_PATH_MARKER,
  assertNoDesignerStaticGlb,
} from "@/features/planner/lib/glbAssetPolicy";

/** Defaults match GlbExtruderPreview props. */
export const DEFAULT_EXTRUDE_THICKNESS_MM = 30;
export const DEFAULT_EXTRUDE_MATERIAL_COLOR = "#ffffff";

/**
 * plan-only: this pure helper never writes bytes.
 * binary: still GlbExtruderPreview (admin) until extract exportExtrudeSvgGlbBinary.
 */
export type ExtrudeSvgBinaryStatus = "plan-only";

/** Profile source: path `d` / SVG markup, or a simple axis-aligned rect in plan mm. */
export type ExtrudeSvgProfile =
  | {
      kind: "path";
      /**
       * SVG path `d` attribute, or full SVG markup containing path(s).
       * Same string family GlbExtruderPreview accepts as svgString.
       */
      svgPath: string;
    }
  | {
      kind: "rect";
      widthMm: number;
      heightMm: number;
    };

export interface ExtrudeSvgPlanInput {
  profile: ExtrudeSvgProfile;
  /** Extrusion depth in mm (GlbExtruderPreview thicknessMm / ExtrudeGeometry depth). */
  thicknessMm?: number;
  /** Hex (or CSS) material color. */
  materialColor?: string;
  /** Optional stable id for generated filename; otherwise derived from profile. */
  id?: string;
}

/** One extruded part in the plan (metadata only — no THREE). */
export interface ExtrudeSvgPartPlan {
  name: string;
  profileKind: "path" | "rect";
  thicknessMm: number;
  materialColor: string;
  /** Present when profile is rect (plan mm footprint). */
  sizeMm?: { x: number; y: number; z: number };
  /** Present when profile is path: length of source string + fingerprint. */
  pathMeta?: { charLength: number; fingerprint: string };
}

/**
 * Pure mesh metadata plan for SVG extrude (P1 / mesh-g7 skeleton).
 * Binary bytes remain admin GlbExtruderPreview until G5 extract.
 */
export interface ExtrudeSvgGlbPlan {
  kind: "extrude-svg";
  profile: ExtrudeSvgProfile;
  thicknessMm: number;
  materialColor: string;
  parts: ExtrudeSvgPartPlan[];
  partCount: number;
  /** Policy-safe path under catalog-assets/generated/ (no leading slash). */
  relativePath: string;
  binaryExportStatus: ExtrudeSvgBinaryStatus;
  /**
   * Pure plan never writes GLB. Use GlbExtruderPreview for browser binary today.
   */
  binaryExportNote: string;
}

export interface ExtrudeSvgGeneratedAssetPathResult {
  relativePath: string;
  partCount: number;
  thicknessMm: number;
  materialColor: string;
}

const BINARY_EXPORT_NOTE =
  "This plan is metadata only (P1 skeleton). Binary export today: " +
  "features/admin/svg-editor/GlbExtruderPreview.tsx (admin island). " +
  "Upload still must land under catalog-assets/generated/ only.";

/** FNV-1a 32-bit hex fingerprint for stable path slugs (no node:crypto). */
export function extrudeSvgFingerprint(source: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < source.length; i++) {
    h ^= source.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

function sanitizeColorSlug(color: string): string {
  const trimmed = color.trim().toLowerCase();
  const hex = trimmed.replace(/^#/, "");
  if (/^[0-9a-f]{3,8}$/.test(hex)) return hex;
  return extrudeSvgFingerprint(trimmed).slice(0, 8);
}

function normalizeThicknessMm(raw: number | undefined): number {
  if (raw === null || raw === undefined || !Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_EXTRUDE_THICKNESS_MM;
  }
  return raw;
}

function normalizeMaterialColor(raw: string | undefined): string {
  const t = raw?.trim();
  return t && t.length > 0 ? t : DEFAULT_EXTRUDE_MATERIAL_COLOR;
}

/**
 * Build a simple closed rect path `d` in plan mm (origin top-left of rect).
 * Useful when callers only have width/height.
 */
export function simpleRectPathD(
  widthMm: number,
  heightMm: number,
  xMm = 0,
  yMm = 0,
): string {
  const w = widthMm;
  const h = heightMm;
  const x = xMm;
  const y = yMm;
  return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
}

/**
 * Stable, filesystem-safe slug for generated extrude-svg GLB names.
 */
export function extrudeSvgGeneratedSlug(input: ExtrudeSvgPlanInput): string {
  const thicknessMm = normalizeThicknessMm(input.thicknessMm);
  const materialColor = normalizeMaterialColor(input.materialColor);
  const colorSlug = sanitizeColorSlug(materialColor);
  const idPart = input.id?.trim()
    ? input.id
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48)
    : null;

  if (input.profile.kind === "rect") {
    const { widthMm, heightMm } = input.profile;
    const base =
      idPart ??
      `rect-${Math.round(widthMm)}x${Math.round(heightMm)}x${Math.round(thicknessMm)}`;
    return ["extrude-svg", base, colorSlug].filter(Boolean).join("-");
  }

  const pathFp = extrudeSvgFingerprint(input.profile.svgPath);
  const base = idPart ?? `path-${pathFp}-t${Math.round(thicknessMm)}`;
  return ["extrude-svg", base, colorSlug].filter(Boolean).join("-");
}

/**
 * Policy-safe relative path for extrude export (catalog-assets/generated/… only).
 */
export function extrudeSvgGeneratedRelativePath(
  input: ExtrudeSvgPlanInput,
): string {
  return `${GENERATED_GLB_PATH_MARKER}${extrudeSvgGeneratedSlug(input)}.glb`;
}

/** Pure part list for extrude plan (no THREE dependency). */
export function buildExtrudeSvgPartPlans(
  input: ExtrudeSvgPlanInput,
): ExtrudeSvgPartPlan[] {
  const thicknessMm = normalizeThicknessMm(input.thicknessMm);
  const materialColor = normalizeMaterialColor(input.materialColor);

  if (input.profile.kind === "rect") {
    const { widthMm, heightMm } = input.profile;
    return [
      {
        name: "extruded-rect",
        profileKind: "rect",
        thicknessMm,
        materialColor,
        sizeMm: { x: widthMm, y: heightMm, z: thicknessMm },
      },
    ];
  }

  const svgPath = input.profile.svgPath;
  return [
    {
      name: "extruded-path",
      profileKind: "path",
      thicknessMm,
      materialColor,
      pathMeta: {
        charLength: svgPath.length,
        fingerprint: extrudeSvgFingerprint(svgPath),
      },
    },
  ];
}

function assertValidProfile(profile: ExtrudeSvgProfile): void {
  if (profile.kind === "rect") {
    if (
      !Number.isFinite(profile.widthMm) ||
      !Number.isFinite(profile.heightMm) ||
      profile.widthMm <= 0 ||
      profile.heightMm <= 0
    ) {
      throw new Error(
        "extrude SVG plan: rect widthMm and heightMm must be finite and > 0",
      );
    }
    return;
  }
  if (typeof profile.svgPath !== "string" || profile.svgPath.trim().length === 0) {
    throw new Error("extrude SVG plan: svgPath must be a non-empty string");
  }
}

/**
 * Convenience: plan from raw path string (GlbExtruderPreview-style svgString / path d).
 */
export function buildExtrudeSvgPlanFromPath(
  svgPath: string,
  options?: {
    thicknessMm?: number;
    materialColor?: string;
    id?: string;
  },
): ExtrudeSvgGlbPlan {
  return buildExtrudeSvgPlan({
    profile: { kind: "path", svgPath },
    thicknessMm: options?.thicknessMm,
    materialColor: options?.materialColor,
    id: options?.id,
  });
}

/**
 * Convenience: plan from simple rect (plan mm footprint + thickness extrusion).
 */
export function buildExtrudeSvgPlanFromRect(
  widthMm: number,
  heightMm: number,
  options?: {
    thicknessMm?: number;
    materialColor?: string;
    id?: string;
  },
): ExtrudeSvgGlbPlan {
  return buildExtrudeSvgPlan({
    profile: { kind: "rect", widthMm, heightMm },
    thicknessMm: options?.thicknessMm,
    materialColor: options?.materialColor,
    id: options?.id,
  });
}

/**
 * Build a pure GLB export plan for SVG extrude (P1 skeleton).
 * Prefer this for path/metadata; use GlbExtruderPreview for browser binary today.
 */
export function buildExtrudeSvgPlan(
  input: ExtrudeSvgPlanInput,
): ExtrudeSvgGlbPlan {
  assertValidProfile(input.profile);

  const thicknessMm = normalizeThicknessMm(input.thicknessMm);
  const materialColor = normalizeMaterialColor(input.materialColor);
  const normalized: ExtrudeSvgPlanInput = {
    ...input,
    thicknessMm,
    materialColor,
  };

  const parts = buildExtrudeSvgPartPlans(normalized);
  const relativePath = extrudeSvgGeneratedRelativePath(normalized);

  // Fail closed if path ever drifts off generated marker.
  assertNoDesignerStaticGlb(relativePath, "extrude SVG GLB plan path");

  return {
    kind: "extrude-svg",
    profile: input.profile,
    thicknessMm,
    materialColor,
    parts,
    partCount: parts.length,
    relativePath,
    binaryExportStatus: "plan-only",
    binaryExportNote: BINARY_EXPORT_NOTE,
  };
}

/**
 * Export skeleton: resolves a policy-safe generated asset path + summary.
 * Does not write a binary .glb file.
 */
export function exportExtrudeSvgToGeneratedAssetPath(
  input: ExtrudeSvgPlanInput,
): ExtrudeSvgGeneratedAssetPathResult {
  const plan = buildExtrudeSvgPlan(input);
  return {
    relativePath: plan.relativePath,
    partCount: plan.partCount,
    thicknessMm: plan.thicknessMm,
    materialColor: plan.materialColor,
  };
}
