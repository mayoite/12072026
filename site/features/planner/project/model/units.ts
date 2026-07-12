import type { Open3dDisplayUnit } from "./types";

export interface Open3dBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const MILLIMETRES_PER_INCH = 25.4;

export function mmToOpen3dCm(valueMm: number): number {
  return valueMm / 10;
}

export function open3dCmToMm(valueCm: number): number {
  return valueCm * 10;
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
  unit: Exclude<Open3dDisplayUnit, "ft-in">,
): number {
  if (unit === "mm") return value;
  if (unit === "cm") return value * 10;
  if (unit === "m") return value * 1000;
  return value * MILLIMETRES_PER_INCH;
}

export function mmToDisplayValue(
  valueMm: number,
  unit: Exclude<Open3dDisplayUnit, "ft-in">,
): number {
  if (unit === "mm") return valueMm;
  if (unit === "cm") return valueMm / 10;
  if (unit === "m") return valueMm / 1000;
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

export function boundsMmToOpen3dCm(bounds: Open3dBounds): Open3dBounds {
  return {
    minX: mmToOpen3dCm(bounds.minX),
    minY: mmToOpen3dCm(bounds.minY),
    maxX: mmToOpen3dCm(bounds.maxX),
    maxY: mmToOpen3dCm(bounds.maxY),
  };
}

export function boundsOpen3dCmToMm(bounds: Open3dBounds): Open3dBounds {
  return {
    minX: open3dCmToMm(bounds.minX),
    minY: open3dCmToMm(bounds.minY),
    maxX: open3dCmToMm(bounds.maxX),
    maxY: open3dCmToMm(bounds.maxY),
  };
}
