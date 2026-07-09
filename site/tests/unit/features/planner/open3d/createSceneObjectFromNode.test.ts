import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  addNodesToGroup,
  createSceneObjectFromNode,
  disposeAndRemoveObject,
} from "@/features/planner/open3d/3d/createSceneObjectFromNode";
import type { Open3dSceneNode } from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";
import {
  countCabinetV0Parts,
  defaultCabinetV0Options,
} from "@/features/planner/open3d/catalog/modularCabinetV0";

function modularNode(
  overrides: Partial<Open3dSceneNode> = {},
): Open3dSceneNode {
  const options = defaultCabinetV0Options({
    widthMm: 600,
    depthMm: 580,
    heightMm: 720,
    doorStyle: "slab",
    material: "white",
  });
  return {
    id: "cab-1",
    kind: "furniture",
    xMm: 1000,
    yMm: 500,
    widthMm: 600,
    depthMm: 580,
    heightMm: 720,
    rotation: 0,
    geometryMode: "modular-cabinet-v0",
    modularOptions: options,
    ...overrides,
  };
}

function boxNode(overrides: Partial<Open3dSceneNode> = {}): Open3dSceneNode {
  return {
    id: "box-1",
    kind: "furniture",
    xMm: 2000,
    yMm: 0,
    widthMm: 1600,
    depthMm: 800,
    heightMm: 750,
    rotation: 0,
    color: "#abcdef",
    ...overrides,
  };
}

function wallNode(overrides: Partial<Open3dSceneNode> = {}): Open3dSceneNode {
  return {
    id: "wall-1",
    kind: "wall",
    xMm: 2000,
    yMm: 0,
    widthMm: 4000,
    depthMm: 100,
    heightMm: 2700,
    rotation: 0,
    color: "#888888",
    ...overrides,
  };
}

describe("createSceneObjectFromNode — modular vs parametric-box vs wall", () => {
  it("modular-cabinet-v0 builds Group with multi-part mesh and floor origin", () => {
    const options = defaultCabinetV0Options({ doorStyle: "slab" });
    const object = createSceneObjectFromNode(
      THREE,
      modularNode({ modularOptions: options }),
      false,
    );

    expect(object.type).toBe("Group");
    expect(object.userData.entityId).toBe("cab-1");
    expect(object.userData.kind).toBe("furniture");
    expect(object.userData.geometryMode).toBe("modular-cabinet-v0");
    expect(object.userData.meshSource).toBe("procedural");
    expect(object.children).toHaveLength(countCabinetV0Parts(options));
    expect(object.position.x).toBeCloseTo(1);
    expect(object.position.y).toBe(0);
    expect(object.position.z).toBeCloseTo(0.5);
  });

  it("modular without modularOptions derives defaults from node W/D/H", () => {
    const object = createSceneObjectFromNode(
      THREE,
      modularNode({
        modularOptions: undefined,
        widthMm: 900,
        depthMm: 400,
        heightMm: 800,
        geometryMode: "modular-cabinet-v0",
      }),
      false,
    );
    expect(object.type).toBe("Group");
    expect(object.userData.geometryMode).toBe("modular-cabinet-v0");
    // default doorStyle slab → toe + carcass + door-slab
    expect(object.children).toHaveLength(3);
    expect(object.userData.options).toMatchObject({
      widthMm: 900,
      depthMm: 400,
      heightMm: 800,
      doorStyle: "slab",
    });
  });

  it("modular pair door style yields four children (toe+carcass+doors)", () => {
    const options = defaultCabinetV0Options({ doorStyle: "pair" });
    const object = createSceneObjectFromNode(
      THREE,
      modularNode({ modularOptions: options }),
      false,
    );
    expect(object.children).toHaveLength(4);
    expect(object.children.map((c) => c.name)).toEqual([
      "toe",
      "carcass",
      "door-left",
      "door-right",
    ]);
  });

  it("non-modular furniture with dimensions uses parametric-box Mesh", () => {
    const object = createSceneObjectFromNode(THREE, boxNode(), false);

    expect(object.type).toBe("Mesh");
    expect(object.userData.entityId).toBe("box-1");
    expect(object.userData.entitySource).toBe("parametric-box");
    expect(object.userData.meshSource).toBe("procedural");
    expect(object.userData.geometryMode).toBeUndefined();
    expect(object.children).toHaveLength(0);
    expect(object.position.y).toBeCloseTo(0.375);
    expect(object.position.x).toBeCloseTo(2);
  });

  it("wall builds BoxGeometry mesh at half height (not parametric-box)", () => {
    const object = createSceneObjectFromNode(THREE, wallNode(), true);

    expect(object.type).toBe("Mesh");
    expect(object.userData.entityId).toBe("wall-1");
    expect(object.userData.kind).toBe("wall");
    expect(object.userData.meshSource).toBe("procedural");
    expect(object.userData.entitySource).toBeUndefined();
    expect(object.userData.geometryMode).toBeUndefined();
    expect(object.position.x).toBeCloseTo(2);
    expect(object.position.y).toBeCloseTo(1.35);
    expect(object.position.z).toBeCloseTo(0);
    expect(object.castShadow).toBe(true);
    expect(object.receiveShadow).toBe(true);
  });

  it("furniture missing positive dimensions falls back to wall-style box", () => {
    const object = createSceneObjectFromNode(
      THREE,
      {
        id: "furn-fallback",
        kind: "furniture",
        xMm: 0,
        yMm: 0,
        widthMm: 0,
        depthMm: 800,
        heightMm: 750,
        rotation: 0,
      },
      false,
    );
    expect(object.type).toBe("Mesh");
    // Fallback path does not set parametric-box entitySource
    expect(object.userData.entitySource).toBeUndefined();
    expect(object.userData.meshSource).toBe("procedural");
    expect(object.userData.kind).toBe("furniture");
  });

  it("applies plan rotation about world Y (negated)", () => {
    const rot = Math.PI / 4;
    const modular = createSceneObjectFromNode(
      THREE,
      modularNode({ rotation: rot }),
      false,
    );
    const box = createSceneObjectFromNode(
      THREE,
      boxNode({ rotation: rot }),
      false,
    );
    const wall = createSceneObjectFromNode(
      THREE,
      wallNode({ rotation: rot }),
      false,
    );
    expect(modular.rotation.y).toBeCloseTo(-rot);
    expect(box.rotation.y).toBeCloseTo(-rot);
    expect(wall.rotation.y).toBeCloseTo(-rot);
  });

  it("distinguishes the three roots: Group vs parametric Mesh vs wall Mesh", () => {
    const modular = createSceneObjectFromNode(THREE, modularNode(), false);
    const box = createSceneObjectFromNode(THREE, boxNode(), false);
    const wall = createSceneObjectFromNode(THREE, wallNode(), false);

    expect(modular.type).toBe("Group");
    expect(box.type).toBe("Mesh");
    expect(wall.type).toBe("Mesh");
    expect(modular.userData.geometryMode).toBe("modular-cabinet-v0");
    expect(box.userData.entitySource).toBe("parametric-box");
    expect(wall.userData.kind).toBe("wall");
    expect(modular.children.length).toBeGreaterThan(1);
    expect(box.children.length).toBe(0);
  });
});

describe("addNodesToGroup / disposeAndRemoveObject", () => {
  it("adds one object per node into the group", () => {
    const group = new THREE.Group();
    addNodesToGroup(
      THREE,
      group,
      [wallNode(), boxNode(), modularNode()],
      false,
    );
    expect(group.children).toHaveLength(3);
    expect(group.children.map((c) => c.name).sort()).toEqual([
      "box-1",
      "cab-1",
      "wall-1",
    ]);
  });

  it("disposeAndRemoveObject removes from parent", () => {
    const group = new THREE.Group();
    const mesh = createSceneObjectFromNode(THREE, wallNode(), false);
    group.add(mesh);
    expect(group.children).toHaveLength(1);
    disposeAndRemoveObject(THREE, mesh);
    expect(group.children).toHaveLength(0);
  });
});
