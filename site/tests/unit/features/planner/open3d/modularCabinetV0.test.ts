import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  DOOR_THICKNESS_MM,
  TOE_HEIGHT_MM,
  TOE_INSET_MM,
  countCabinetV0Parts,
  defaultCabinetV0Options,
  generateCabinetV0Footprint,
  generateCabinetV0Mesh,
} from "@/features/planner/open3d/catalog/modularCabinetV0";

const MM = 0.001;

function meshByName(group: THREE.Group, name: string): THREE.Mesh {
  const child = group.children.find((c) => c.name === name);
  expect(child).toBeInstanceOf(THREE.Mesh);
  return child as THREE.Mesh;
}

function boxParams(mesh: THREE.Mesh): {
  width: number;
  height: number;
  depth: number;
} {
  const geom = mesh.geometry as THREE.BoxGeometry;
  return geom.parameters;
}

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
    expect(countCabinetV0Parts(d)).toBe(3);
  });

  it("exports locked geometry constants for plan===mesh", () => {
    expect(TOE_HEIGHT_MM).toBe(100);
    expect(TOE_INSET_MM).toBe(50);
    expect(DOOR_THICKNESS_MM).toBe(18);
  });

  it("builds toe+carcass mesh for doorStyle none", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "none" });
    expect(countCabinetV0Parts(opts)).toBe(2);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children).toHaveLength(2);
    expect(group.children.map((c) => c.name)).toEqual(["toe", "carcass"]);
    expect(group.userData.modular).toBe("cabinet-v0");
  });

  it("adds slab door after toe and carcass", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "slab" });
    expect(countCabinetV0Parts(opts)).toBe(3);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children.map((c) => c.name)).toEqual([
      "toe",
      "carcass",
      "door-slab",
    ]);
  });

  it("adds pair of door leaves with named children after toe+carcass", () => {
    const opts = defaultCabinetV0Options({ doorStyle: "pair" });
    expect(countCabinetV0Parts(opts)).toBe(4);
    const group = generateCabinetV0Mesh(opts);
    expect(group.children).toHaveLength(4);
    expect(group.children.map((c) => c.name)).toEqual([
      "toe",
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
      expect(expected).toBe(
        doorStyle === "none" ? 2 : doorStyle === "slab" ? 3 : 4,
      );
    }
  });

  it("toe geometry uses locked height/inset (back-aligned recess)", () => {
    const opts = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "none",
    });
    const group = generateCabinetV0Mesh(opts);
    const toe = meshByName(group, "toe");
    const params = boxParams(toe);
    const toeH = TOE_HEIGHT_MM * MM;
    const inset = TOE_INSET_MM * MM;
    expect(params.width).toBeCloseTo(0.6);
    expect(params.height).toBeCloseTo(toeH);
    expect(params.depth).toBeCloseTo(0.58 - inset);
    expect(toe.position.x).toBeCloseTo(0);
    expect(toe.position.y).toBeCloseTo(toeH / 2);
    expect(toe.position.z).toBeCloseTo(-inset / 2);
  });

  it("carcass sits on toe and does not double-count height", () => {
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
    opts.widthMm = 1;
    expect(group.userData.options).toMatchObject({ widthMm: 800 });

    const toeH = TOE_HEIGHT_MM * MM;
    const carcassH = (900 - TOE_HEIGHT_MM) * MM;
    const carcass = meshByName(group, "carcass");
    const params = boxParams(carcass);
    expect(params.width).toBeCloseTo(0.8);
    expect(params.height).toBeCloseTo(carcassH);
    expect(params.depth).toBeCloseTo(0.5);
    expect(carcass.position.y).toBeCloseTo(toeH + carcassH / 2);
  });

  it("doors track carcass height and sit above the toe band", () => {
    const opts = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
    });
    const group = generateCabinetV0Mesh(opts);
    const toeH = TOE_HEIGHT_MM * MM;
    const carcassH = (opts.heightMm - TOE_HEIGHT_MM) * MM;
    const door = meshByName(group, "door-slab");
    const params = boxParams(door);
    expect(params.height).toBeCloseTo(carcassH * 0.92);
    expect(door.position.y).toBeCloseTo(toeH + carcassH / 2);
    const doorBottom = door.position.y - params.height / 2;
    expect(doorBottom).toBeGreaterThanOrEqual(toeH - 1e-9);
  });

  it("height integrity: Box3 Y span equals SKU height (no toe overshoot)", () => {
    const opts = defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
    });
    const group = generateCabinetV0Mesh(opts);
    const box = new THREE.Box3().setFromObject(group);
    const spanY = box.max.y - box.min.y;
    expect(spanY).toBeCloseTo(opts.heightMm * MM, 6);
    expect(box.min.y).toBeCloseTo(0, 6);
  });

  it("oak and white materials produce distinct carcass colors", () => {
    const oak = generateCabinetV0Mesh(
      defaultCabinetV0Options({ material: "oak", doorStyle: "none" }),
    );
    const white = generateCabinetV0Mesh(
      defaultCabinetV0Options({ material: "white", doorStyle: "none" }),
    );
    const oakMesh = meshByName(oak, "carcass");
    const whiteMesh = meshByName(white, "carcass");
    const oakMat = oakMesh.material as THREE.MeshStandardMaterial;
    const whiteMat = whiteMesh.material as THREE.MeshStandardMaterial;
    expect(oakMat.color.getHexString()).not.toBe(whiteMat.color.getHexString());
  });
});
