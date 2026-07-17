import { describe, expect, it } from "vitest";
import {
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
} from "@/features/planner/catalog/modularCabinetV0";
import {
  ParametricBuilder,
  resolveFurniture2DFootprint,
} from "@/features/planner/catalog/parametricBuilder";
import type { BlockDescriptorParametric } from "@/features/planner/catalog/svg/svgTypes";

describe("resolveFurniture2DFootprint", () => {
  it("uses generateCabinetV0Footprint when modular-cabinet-v0 + modularOptions", () => {
    const modularOptions = defaultCabinetV0Options({
      widthMm: 800,
      depthMm: 560,
      doorStyle: "slab",
    });
    const path = resolveFurniture2DFootprint({
      width: 999,
      depth: 999,
      geometryMode: "modular-cabinet-v0",
      modularOptions,
    });
    expect(path).toBe(generateCabinetV0Footprint(modularOptions));
    expect(path).toBe("M -400 -280 L 400 -280 L 400 280 L -400 280 Z");
  });

  it("uses box width/depth when geometryMode is box or absent", () => {
    const boxPath = resolveFurniture2DFootprint({
      width: 1200,
      depth: 400,
    });
    expect(boxPath).toBe("M -600 -200 L 600 -200 L 600 200 L -600 200 Z");

    const explicitBox = resolveFurniture2DFootprint({
      width: 1200,
      depth: 400,
      geometryMode: "box",
    });
    expect(explicitBox).toBe(boxPath);
  });

  it("falls back to box when modular mode lacks modularOptions", () => {
    const path = resolveFurniture2DFootprint({
      width: 500,
      depth: 300,
      geometryMode: "modular-cabinet-v0",
    });
    expect(path).toBe("M -250 -150 L 250 -150 L 250 150 L -250 150 Z");
  });

  it("defaults missing width/depth to 600mm for box path", () => {
    expect(resolveFurniture2DFootprint({})).toBe(
      "M -300 -300 L 300 -300 L 300 300 L -300 300 Z",
    );
  });

  it("matches ParametricBuilder.generate2DFootprint for box sizes", () => {
    const descriptor = {
      geometry: { widthMm: 700, depthMm: 350, heightMm: 720 },
    } as BlockDescriptorParametric;
    expect(
      resolveFurniture2DFootprint({ width: 700, depth: 350 }),
    ).toBe(ParametricBuilder.generate2DFootprint(descriptor));
  });
});
