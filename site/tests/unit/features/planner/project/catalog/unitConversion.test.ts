import { describe, expect, it } from "vitest";
import {
  canonicalMmFromCatalogCm,
  configuratorHeightCmFromMixedUnit,
  canonicalDimensionsFromCatalogCm,
} from "@/features/planner/project/catalog/unitConversion";

describe("unitConversion", () => {
  it("converts catalog cm fields to canonical mm", () => {
    expect(canonicalMmFromCatalogCm(120)).toBe(1200);
    expect(canonicalMmFromCatalogCm(0)).toBe(1);
  });

  it("configurator height treats large values as mm", () => {
    expect(configuratorHeightCmFromMixedUnit(75)).toBe(75);
    expect(configuratorHeightCmFromMixedUnit(750)).toBe(75);
    expect(configuratorHeightCmFromMixedUnit(undefined)).toBe(75);
    expect(configuratorHeightCmFromMixedUnit(-1, 80)).toBe(80);
  });

  it("builds dimension object from cm inputs", () => {
    const d = canonicalDimensionsFromCatalogCm({
      widthCm: 120,
      depthCm: 60,
      heightCm: 75,
      seatHeightCm: 45,
    });
    expect(d.widthMm).toBe(1200);
    expect(d.depthMm).toBe(600);
    expect(d.heightMm).toBe(750);
    expect(d.seatHeightMm).toBe(450);
  });
});
