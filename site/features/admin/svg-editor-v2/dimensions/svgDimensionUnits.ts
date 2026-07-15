export type SvgDimensionUnit = "mm" | "cm" | "m" | "in" | "ft";

const MILLIMETRES_PER_UNIT: Record<SvgDimensionUnit, number> = {
  mm: 1,
  cm: 10,
  m: 1_000,
  in: 25.4,
  ft: 304.8,
};

export function convertMmToDisplay(valueMm: number, unit: SvgDimensionUnit): number {
  return valueMm / MILLIMETRES_PER_UNIT[unit];
}

export function convertDisplayToMm(value: number, unit: SvgDimensionUnit): number {
  return value * MILLIMETRES_PER_UNIT[unit];
}

export function formatDimensionValue(valueMm: number, unit: SvgDimensionUnit): string {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 4 }).format(convertMmToDisplay(valueMm, unit));
}
