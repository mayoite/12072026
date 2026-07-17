import type { PlannerDisplayUnit } from "./types";

export interface PlannerBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const MILLIMETRES_PER_INCH = 25.4;
const MM_PER_CM = 10;
const MM_PER_M = 1000;
/** 1 ft² = 144 in² = 144 × 25.4² mm² */
const MM2_PER_SQ_FT = 92903.04;

export const PLANNER_PRECISION = {
  linearFractionDigits: {
    mm: 2,
    cm: 2,
    m: 3,
    in: 3,
    "ft-in": 2,
  },
  angleFractionDigits: 1,
  metricAreaFractionDigits: 2,
  imperialAreaFractionDigits: 1,
  quantityFractionDigits: 0,
} as const satisfies {
  linearFractionDigits: Record<PlannerDisplayUnit, number>;
  angleFractionDigits: number;
  metricAreaFractionDigits: number;
  imperialAreaFractionDigits: number;
  quantityFractionDigits: number;
};

export function mmToPlannerCm(valueMm: number): number {
  return valueMm / MM_PER_CM;
}

export function plannerCmToMm(valueCm: number): number {
  return valueCm * MM_PER_CM;
}

export function normalizeDegrees(value: number): number {
  return ((value % 360) + 360) % 360;
}

/** Plan / document rotation is degrees; Three scene nodes use radians. */
export function degreesToRadians(degrees: number): number {
  return (normalizeDegrees(degrees) * Math.PI) / 180;
}

export function displayValueToMm(
  value: number,
  unit: Exclude<PlannerDisplayUnit, "ft-in">,
): number {
  if (unit === "mm") return value;
  if (unit === "cm") return value * MM_PER_CM;
  if (unit === "m") return value * MM_PER_M;
  return value * MILLIMETRES_PER_INCH;
}

export function mmToDisplayValue(
  valueMm: number,
  unit: Exclude<PlannerDisplayUnit, "ft-in">,
): number {
  if (unit === "mm") return valueMm;
  if (unit === "cm") return valueMm / MM_PER_CM;
  if (unit === "m") return valueMm / MM_PER_M;
  return valueMm / MILLIMETRES_PER_INCH;
}

export function parseFeetAndInches(value: string): number {
  const match = value.trim().match(
    /^(-)?\s*(?:(\d+(?:\.\d+)?)\s*(?:'|ft))?\s*(?:(\d+(?:\.\d+)?)\s*(?:"|in)?)?$/,
  );
  if (!match || (!match[2] && !match[3])) {
    throw new Error("Use feet and inches, for example 5' 6\".");
  }
  const sign = match[1] ? -1 : 1;
  const feet = Number(match[2] ?? 0);
  const inches = Number(match[3] ?? 0);
  return sign * (feet * 12 + inches) * MILLIMETRES_PER_INCH;
}

export function formatFeetAndInches(valueMm: number, precision = 2): string {
  const sign = valueMm < 0 ? "-" : "";
  const totalInches = Math.abs(valueMm) / MILLIMETRES_PER_INCH;
  let feet = Math.floor(totalInches / 12);
  let inches = Number((totalInches - feet * 12).toFixed(precision));
  if (inches >= 12) {
    feet += 1;
    inches = 0;
  }
  return `${sign}${feet}' ${inches}"`;
}

/**
 * Format a canonical mm length for UI labels (status, inventory, readouts).
 * Always includes a unit token so mixed tools stay legible.
 */
export function formatLengthDisplay(
  valueMm: number,
  unit: PlannerDisplayUnit,
): string {
  if (!Number.isFinite(valueMm)) return "—";
  switch (unit) {
    case "mm":
      return `${trimTrailingZeros(valueMm, PLANNER_PRECISION.linearFractionDigits.mm)} mm`;
    case "cm":
      return `${trimTrailingZeros(mmToDisplayValue(valueMm, "cm"), PLANNER_PRECISION.linearFractionDigits.cm)} cm`;
    case "m":
      return `${trimTrailingZeros(mmToDisplayValue(valueMm, "m"), PLANNER_PRECISION.linearFractionDigits.m)} m`;
    case "in":
      return `${trimTrailingZeros(mmToDisplayValue(valueMm, "in"), PLANNER_PRECISION.linearFractionDigits.in)} in`;
    case "ft-in":
      return formatFeetAndInches(valueMm, PLANNER_PRECISION.linearFractionDigits["ft-in"]);
  }
}

/**
 * Format a length for property inputs.
 * Numeric units → plain number string; ft-in → feet/inches text.
 */
export function formatLengthInput(
  valueMm: number,
  unit: PlannerDisplayUnit,
): string {
  if (!Number.isFinite(valueMm)) return "";
  if (unit === "ft-in") {
    return formatFeetAndInches(valueMm, PLANNER_PRECISION.linearFractionDigits["ft-in"]);
  }
  const n = mmToDisplayValue(valueMm, unit);
  return trimTrailingZeros(n, PLANNER_PRECISION.linearFractionDigits[unit]);
}

/**
 * Parse a user-entered length in the active display unit → canonical mm.
 * Accepts optional unit suffixes (mm/cm/m/in/"/'). Returns null if invalid.
 */
export function parseLengthInput(
  raw: string,
  unit: PlannerDisplayUnit,
): number | null {
  const text = raw.trim().replace(/,/g, "");
  if (text.length === 0) return null;

  if (unit === "ft-in") {
    try {
      const mm = parseFeetAndInches(text);
      return Number.isFinite(mm) ? mm : null;
    } catch {
      // Bare number while in ft-in: treat as total inches (CAD habit).
      const bare = Number.parseFloat(text);
      if (!Number.isFinite(bare)) return null;
      return bare * MILLIMETRES_PER_INCH;
    }
  }

  const stripped = text
    .replace(/\s*(mm|cm|m|in|inch|inches|"|'|ft|feet)\s*$/i, "")
    .trim();
  const n = Number.parseFloat(stripped);
  if (!Number.isFinite(n)) return null;
  return displayValueToMm(n, unit);
}

/** Footprint pair for inventory / BOQ glance lines. */
export function formatFootprintDisplay(
  widthMm: number,
  depthMm: number,
  unit: PlannerDisplayUnit,
): string {
  return `${formatLengthDisplay(widthMm, unit)} × ${formatLengthDisplay(depthMm, unit)}`;
}

/** Room / floor area: metric → m², imperial-ish units → sq ft. */
export function formatAreaDisplay(
  areaMm2: number,
  unit: PlannerDisplayUnit,
): string {
  if (!Number.isFinite(areaMm2) || areaMm2 < 0) return "—";
  if (unit === "in" || unit === "ft-in") {
    return `${trimTrailingZeros(areaMm2 / MM2_PER_SQ_FT, PLANNER_PRECISION.imperialAreaFractionDigits)} sq ft`;
  }
  return `${trimTrailingZeros(areaMm2 / 1_000_000, PLANNER_PRECISION.metricAreaFractionDigits)} m²`;
}

export function formatAngleDisplay(valueDegrees: number): string {
  if (!Number.isFinite(valueDegrees)) return "—";
  return `${trimTrailingZeros(normalizeDegrees(valueDegrees), PLANNER_PRECISION.angleFractionDigits)}°`;
}

export function formatQuantityDisplay(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return Math.round(value).toFixed(PLANNER_PRECISION.quantityFractionDigits);
}

export function boundsMmToPlannerCm(bounds: PlannerBounds): PlannerBounds {
  return {
    minX: mmToPlannerCm(bounds.minX),
    minY: mmToPlannerCm(bounds.minY),
    maxX: mmToPlannerCm(bounds.maxX),
    maxY: mmToPlannerCm(bounds.maxY),
  };
}

export function boundsplannerCmToMm(bounds: PlannerBounds): PlannerBounds {
  return {
    minX: plannerCmToMm(bounds.minX),
    minY: plannerCmToMm(bounds.minY),
    maxX: plannerCmToMm(bounds.maxX),
    maxY: plannerCmToMm(bounds.maxY),
  };
}

function trimTrailingZeros(value: number, maxFractionDigits: number): string {
  const fixed = value.toFixed(maxFractionDigits);
  if (!fixed.includes(".")) return fixed;
  return fixed.replace(/\.?0+$/, "");
}
