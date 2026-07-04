/**
 * Phase 03 Unit Conversion
 *
 * Canonical millimetre conversion for the Open3D catalog system.
 * Handles the legacy naming debt: OOFPLWeb catalog stores dimensions as cm
 * in fields named `widthMm`/`heightMm` despite the misleading suffix.
 *
 * All internal geometry uses canonical millimetres.
 * Display values are derived via centralized converters based on user-selected unit.
 */

import type { Open3dCatalogDimensions } from "./catalogTypes";

// ── Conversion constants ──

const MM_PER_CM = 10;
const MM_PER_M = 1000;
const MM_PER_INCH = 25.4;

const CONFIGURATOR_HEIGHT_MM_THRESHOLD = 300;

// ── Core converters ──

/**
 * Convert legacy OOFPLWeb catalog fields (stored as cm despite "Mm" suffix)
 * to canonical millimetres.
 *
 * NAMING DEBT: The OOFPLWeb `widthMm` and `heightMm` fields actually contain
 * centimetre values. This converter corrects for that. The naming is preserved
 * in the bridge layer to avoid breaking existing API consumers.
 */
export function canonicalMmFromCatalogCm(value: number): number {
  return Math.max(1, Math.round(value * MM_PER_CM));
}

/**
 * Configurator payloads currently mix units:
 * - footprint L/D values are supplied in centimetres
 * - H / heightMm values are supplied in millimetres despite the mixed contract
 *
 * Some callers may already normalize height to centimetres before mapping. To
 * stay resilient without mutating upstream contracts, values above the practical
 * furniture-height threshold are treated as millimetres and converted to cm.
 */
export function configuratorHeightCmFromMixedUnit(
  value: number | undefined,
  fallbackCm = 75,
): number {
  const numeric = value ?? null;
  if (numeric === null || !Number.isFinite(numeric) || numeric <= 0) {
    return fallbackCm;
  }

  if (numeric > CONFIGURATOR_HEIGHT_MM_THRESHOLD) {
    return numeric / MM_PER_CM;
  }

  return numeric;
}

/**
 * Build Open3dCatalogDimensions from legacy cm values.
 */
export function canonicalDimensionsFromCatalogCm(params: {
  widthCm: number;
  depthCm: number;
  heightCm?: number;
  seatHeightCm?: number;
  weightKg?: number;
}): Open3dCatalogDimensions {
  const seatHeightCm = params.seatHeightCm ?? null;
  return {
    widthMm: canonicalMmFromCatalogCm(params.widthCm),
    depthMm: canonicalMmFromCatalogCm(params.depthCm),
    heightMm: canonicalMmFromCatalogCm(params.heightCm ?? 75),
    seatHeightMm: seatHeightCm !== null ? canonicalMmFromCatalogCm(seatHeightCm) : undefined,
    weightKg: params.weightKg,
  };
}

/**
 * Convert canonical millimetres to display centimetres.
 */
export function displayCmFromCanonicalMm(mm: number): number {
  return Math.round(mm / MM_PER_CM);
}

/**
 * Convert canonical millimetres to display inches.
 */
export function displayInFromCanonicalMm(mm: number): number {
  return Math.round((mm / MM_PER_INCH) * 100) / 100;
}

/**
 * Convert canonical millimetres to display metres.
 */
export function displayMFromCanonicalMm(mm: number): number {
  return Math.round((mm / MM_PER_M) * 1000) / 1000;
}

/**
 * Convert canonical millimetres to feet-inches string.
 */
export function displayFtInFromCanonicalMm(mm: number): string {
  const totalInches = mm / MM_PER_INCH;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}' ${inches}"`;
}

/**
 * Format dimensions for display in the user's preferred unit.
 */
export function displayDimensions(
  dimensions: Open3dCatalogDimensions,
  unit: "mm" | "cm" | "m" | "in" | "ft-in",
): string {
  const converters: Record<string, (v: number) => string> = {
    mm: (v) => `${Math.round(v)} mm`,
    cm: (v) => `${displayCmFromCanonicalMm(v)} cm`,
    m: (v) => `${displayMFromCanonicalMm(v)} m`,
    in: (v) => `${displayInFromCanonicalMm(v)} in`,
    "ft-in": displayFtInFromCanonicalMm,
  };

  const fmt = converters[unit] ?? ((v: number) => `${displayCmFromCanonicalMm(v)} cm`);
  const parts: string[] = [`${fmt(dimensions.widthMm)} × ${fmt(dimensions.depthMm)}`];
  if (dimensions.heightMm > 0) {
    parts.push(`× ${fmt(dimensions.heightMm)}`);
  }
  return parts.join(" ");
}

/**
 * Build an accessible name for a catalog item including dimensions.
 * Example: "Office Chair, 45 cm by 45 cm by 90 cm"
 */
export function buildAccessibleName(name: string, dimensions: Open3dCatalogDimensions): string {
  const w = displayCmFromCanonicalMm(dimensions.widthMm);
  const d = displayCmFromCanonicalMm(dimensions.depthMm);
  const h = displayCmFromCanonicalMm(dimensions.heightMm);
  return `${name}, ${w} cm by ${d} cm by ${h} cm`;
}

// ── Validation ──

/**
 * Validate that dimensions are positive and within reasonable bounds.
 */
export function validateDimensions(dimensions: Open3dCatalogDimensions): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!Number.isFinite(dimensions.widthMm) || dimensions.widthMm <= 0) {
    errors.push("widthMm must be a positive finite number");
  }
  if (!Number.isFinite(dimensions.depthMm) || dimensions.depthMm <= 0) {
    errors.push("depthMm must be a positive finite number");
  }
  if (!Number.isFinite(dimensions.heightMm) || dimensions.heightMm <= 0) {
    errors.push("heightMm must be a positive finite number");
  }
  if (dimensions.widthMm > 100000) {
    errors.push("widthMm exceeds maximum reasonable value (100000 mm)");
  }
  if (dimensions.depthMm > 100000) {
    errors.push("depthMm exceeds maximum reasonable value (100000 mm)");
  }
  if (dimensions.heightMm > 100000) {
    errors.push("heightMm exceeds maximum reasonable value (100000 mm)");
  }
  const weightKg = dimensions.weightKg ?? null;
  if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0)) {
    errors.push("weightKg must be a non-negative finite number");
  }
  return { valid: errors.length === 0, errors };
}
