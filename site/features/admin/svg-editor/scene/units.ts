/**
 * units.ts
 *
 * Converts between real-world units (metric / imperial) and Excalidraw's
 * internal pixel coordinate system.
 *
 * All functions are pure. Negative values and zero are handled explicitly.
 */

// ─── Constants ────────────────────────────────────────────────────────────

export const PIXELS_PER_METER = 100 as const;

const INCHES_PER_METER = 39.3701;
const INCHES_PER_FOOT = 12;

// ─── Types ────────────────────────────────────────────────────────────────

export type UnitSystem = "metric" | "imperial";

/** Width and height expressed in Excalidraw canvas pixels. */
export interface DimensionPair {
  width: number;
  height: number;
}

// ─── Core conversions ─────────────────────────────────────────────────────

/**
 * Converts meters → canvas pixels.
 * Returns 0 for negative/zero input.
 */
export function metersToPixels(m: number): number {
  if (m <= 0) return 0;
  return m * PIXELS_PER_METER;
}

/**
 * Converts canvas pixels → meters.
 * Returns 0 for negative/zero input.
 */
export function pixelsToMeters(px: number): number {
  if (px <= 0) return 0;
  return px / PIXELS_PER_METER;
}

/**
 * Converts feet + inches → canvas pixels.
 * Negative values for either argument are treated as 0.
 */
export function feetInchesToPixels(feet: number, inches: number): number {
  const safeFeet = Math.max(0, feet);
  const safeInches = Math.max(0, inches);
  const totalInches = safeFeet * INCHES_PER_FOOT + safeInches;
  return totalInches * (PIXELS_PER_METER / INCHES_PER_METER);
}

/**
 * Converts canvas pixels → { feet, inches }.
 * Returns { feet: 0, inches: 0 } for negative/zero input.
 */
export function pixelsToFeetInches(px: number): { feet: number; inches: number } {
  if (px <= 0) return { feet: 0, inches: 0 };
  const totalInches = px / (PIXELS_PER_METER / INCHES_PER_METER);
  const feet = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = totalInches - feet * INCHES_PER_FOOT;
  return { feet, inches };
}

// ─── Display string ───────────────────────────────────────────────────────

/**
 * Formats a pixel value as a human-readable string in the requested unit.
 *
 * Examples:
 *   pixelsToDimensionString(250, "metric")   → "2.50 m"
 *   pixelsToDimensionString(250, "imperial") → "8 ft 2.5 in"
 */
export function pixelsToDimensionString(px: number, unit: UnitSystem): string {
  if (px <= 0) {
    return unit === "metric" ? "0.00 m" : "0 ft 0 in";
  }

  if (unit === "metric") {
    return `${pixelsToMeters(px).toFixed(2)} m`;
  }

  const { feet, inches } = pixelsToFeetInches(px);
  // Trim trailing zeroes from inches but keep at least one decimal when needed
  const inStr =
    inches % 1 === 0 ? String(inches) : parseFloat(inches.toFixed(4)).toString();
  return `${feet} ft ${inStr} in`;
}

// ─── Input parser ─────────────────────────────────────────────────────────

/**
 * Parses a user-typed dimension string and returns the equivalent pixel count,
 * or `null` if the string cannot be parsed.
 *
 * Supported metric formats   : "2.5", "2.5m", "2.5 m", "2.5 meters"
 * Supported imperial formats : "8", "8ft", "8'", "8ft 4.5in", "8'4.5\"",
 *                              "8 ft 4.5 in", "8ft4.5in", "4.5in", "4.5\""
 */
export function parseDimensionInput(
  value: string,
  unit: UnitSystem
): number | null {
  const raw = value.trim();
  if (!raw) return null;

  if (unit === "metric") {
    // Strip optional unit suffix and parse as a decimal number
    const m = raw.replace(/\s*m(eters?)?$/i, "");
    const n = parseFloat(m);
    if (isNaN(n) || n < 0) return null;
    return metersToPixels(n);
  }

  // ── Imperial ─────────────────────────────────────────────────────────

  // Try "8ft 4.5in" or "8' 4.5"" or "8ft4.5in" or "8'4.5\""
  const feetInchesPattern =
    /^(\d+(?:\.\d+)?)\s*(?:ft|feet|')\s*(\d+(?:\.\d+)?)\s*(?:in|inches?|")$/i;
  const feetInchesMatch = raw.match(feetInchesPattern);
  if (feetInchesMatch) {
    const feet = parseFloat(feetInchesMatch[1]);
    const inches = parseFloat(feetInchesMatch[2]);
    if (isNaN(feet) || isNaN(inches) || feet < 0 || inches < 0) return null;
    return feetInchesToPixels(feet, inches);
  }

  // Try "8ft" or "8'" — feet only
  const feetOnlyPattern = /^(\d+(?:\.\d+)?)\s*(?:ft|feet|')$/i;
  const feetOnlyMatch = raw.match(feetOnlyPattern);
  if (feetOnlyMatch) {
    const feet = parseFloat(feetOnlyMatch[1]);
    if (isNaN(feet) || feet < 0) return null;
    return feetInchesToPixels(feet, 0);
  }

  // Try "4.5in" or "4.5\""
  const inchesOnlyPattern = /^(\d+(?:\.\d+)?)\s*(?:in|inches?|")$/i;
  const inchesOnlyMatch = raw.match(inchesOnlyPattern);
  if (inchesOnlyMatch) {
    const inches = parseFloat(inchesOnlyMatch[1]);
    if (isNaN(inches) || inches < 0) return null;
    return feetInchesToPixels(0, inches);
  }

  // Bare number — interpret as feet
  const bareNumber = parseFloat(raw);
  if (!isNaN(bareNumber) && bareNumber >= 0) {
    return feetInchesToPixels(bareNumber, 0);
  }

  return null;
}
