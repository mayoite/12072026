import { describe, expect, it } from "vitest";
import * as THREE from "three";
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

  it("footprint scales with width/depth (odd and even mm)", () => {
    const odd = defaultCabinetV0Options({ widthMm: 450, depthMm: 333 });
    expect(generateCabinetV0Footprint(odd)).toBe(
      "M -225 -166.5 L 225 -166.5 L 225 166.5 L -225 166.5 Z",
    );
    const wide = defaultCabinetV0Options({ widthMm: 1200, depthMm: 400 });
    expect(generateCabinetV0Footprint(wide)).toBe(
      "M -600 -200 L 600 -200 L 600 200 L -600 200 Z",
    );
  });

  it("defaultCabinetV0Options fills slab/white defaults", () => {
    const d = defaultCabinetV0Options();
    expect(d).toEqual({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
    expect(countCabinetV0Parts(d)).toBe(2);
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

  it("adds pair of door leaves with named children", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "pair" });
    expect(countCabinetV0Parts(opts)).toBe(3);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children).toHaveLength(3);
    expect(group.children.map((c) => c.name)).toEqual([
      "carcass",
      "door-left",
      "door-right",
    ]);
  });

  it("part-count matrix matches mesh children for all door styles", () => {
    for (const doorStyle of ["none", "slab", "pair"] as const) {
      const opts = defaultCabinetV0Options({ doorStyle });
      const expected = countCabinetV0Parts(opts);
      const group = generateCabinetV0Mesh(opts);
      expect(group.children).toHaveLength(expected);
      expect(expected).toBe(doorStyle === "none" ? 1 : doorStyle === "slab" ? 2 : 3);
    }
  });

  it("stores options copy on userData and uses metres for carcass box", () => {
    const opts = defaultCabinetV0Options({
      widthMm: 800,
      depthMm: 500,
      heightMm: 900,
      doorStyle: "none",
      material: "oak",
    });
    const group = generateCabinetV0Mesh(opts);
    expect(group.name).toBe("modular-cabinet-v0");
    expect(group.userData.options).toEqual(opts);
    // Mutation of input after build must not alter stored snapshot
    opts.widthMm = 1;
    expect(group.userData.options).toMatchObject({ widthMm: 800 });

    const carcass = group.children[0];
    expect(carcass).toBeInstanceOf(THREE.Mesh);
    if (!(carcass instanceof THREE.Mesh)) return;
    const geom = carcass.geometry as THREE.BoxGeometry;
    const params = geom.parameters;
    expect(params.width).toBeCloseTo(0.8);
    expect(params.height).toBeCloseTo(0.9);
    expect(params.depth).toBeCloseTo(0.5);
    expect(carcass.position.y).toBeCloseTo(0.45);
  });

  it("oak and white materials produce distinct carcass colors", () => {
    const oak = generateCabinetV0Mesh(
      defaultCabinetV0Options({ material: "oak", doorStyle: "none" }),
    );
    const white = generateCabinetV0Mesh(
      defaultCabinetV0Options({ material: "white", doorStyle: "none" }),
    );
    const oakMesh = oak.children[0] as THREE.Mesh;
    const whiteMesh = white.children[0] as THREE.Mesh;
    const oakMat = oakMesh.material as THREE.MeshStandardMaterial;
    const whiteMat = whiteMesh.material as THREE.MeshStandardMaterial;
    expect(oakMat.color.getHexString()).not.toBe(whiteMat.color.getHexString());
  });
});
