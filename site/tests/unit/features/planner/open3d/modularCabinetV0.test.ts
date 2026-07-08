import { describe, expect, it } from "vitest";
import {
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
  generateCabinetV0Mesh,
} from "@/features/planner/open3d/catalog/modularCabinetV0";

describe("modular cabinet-v0 (must-do generate path)", () => {
  it("emits stable centered footprint path", () => {
    const opts = defaultCabinetV0Options({ widthMm: 600, depthMm: 580 });
    const path = generateCabinetV0Footprint(opts);
    expect(path).toBe("M -300 -290 L 300 -290 L 300 290 L -300 290 Z");
  });

  it("builds carcass-only mesh for doorStyle none", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "none" });
    expect(countCabinetV0Parts(opts)).toBe(1);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children).toHaveLength(1);
    expect(group.children[0]?.name).toBe("carcass");
    expect(group.userData.modular).toBe("cabinet-v0");
  });

  it("adds slab door as second part", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "slab" });
    expect(countCabinetV0Parts(opts)).toBe(2);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children.map((c) => c.name)).toEqual([
      "carcass",
      "door-slab",
    ]);
  });

  it("adds pair of door leaves", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "pair" });
    expect(countCabinetV0Parts(opts)).toBe(3);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children).toHaveLength(3);
  });
});
