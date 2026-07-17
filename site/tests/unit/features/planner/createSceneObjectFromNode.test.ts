import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  addNodesToGroup,
  createSceneObjectFromNode,
  disposeAndRemoveObject,
} from "@/features/planner/3d/createSceneObjectFromNode";
import type { PlannerSceneNode } from "@/features/planner/3d/buildPlannerSceneNodes";
import {
  countCabinetV0Parts,
  defaultCabinetV0Options,
} from "@/features/planner/catalog/modularCabinetV0";
import {
  countWorkstationV0Parts,
  workstationOptionsFromConfig,
} from "@/features/planner/catalog/workstationMeshV0";
import {
  createWorkstationConfigV0,
  workstationConfigKey,
  workstationFootprintMm,
} from "@/features/planner/catalog/workstationSystemV0";

function modularNode(
  overrides: Partial<PlannerSceneNode> = {},
): PlannerSceneNode {
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

function boxNode(overrides: Partial<PlannerSceneNode> = {}): PlannerSceneNode {
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

function wallNode(overrides: Partial<PlannerSceneNode> = {}): PlannerSceneNode {
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

  it("wall with CSS var color does not throw and material color is parseable by THREE.Color", () => {
    // Model walls store themeColorRef("var(--text-inverse-body)") — must not hit THREE.Color raw.
    // 3D remaps theme refs → wallStroke token; unit env missing token → intentional hexFallback #182A40.
    let object: THREE.Object3D;
    expect(() => {
      object = createSceneObjectFromNode(
        THREE,
        wallNode({ color: "var(--text-inverse-body)" }),
        false,
      );
    }).not.toThrow();

    expect(object!.type).toBe("Mesh");
    const mesh = object! as THREE.Mesh;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    expect(mat.color).toBeInstanceOf(THREE.Color);

    const hex = mat.color.getHexString().toLowerCase();
    // Valid 6-digit hex (THREE.Color internal), not empty / NaN
    expect(hex).toMatch(/^[0-9a-f]{6}$/i);
    expect(Number.isFinite(mat.color.getHex())).toBe(true);
    // Theme-ref walls → wall mass fallback (NOT mid-gray #9ca3af, NOT white ffffff, NOT inverse-body e2e8f0)
    expect(hex).toBe("182a40");
    expect(hex).not.toBe("9ca3af");
    expect(hex).not.toBe("ffffff");
    expect(hex).not.toBe("e2e8f0");
    // Round-trip: hex string is legal input for THREE.Color constructor
    expect(() => new THREE.Color(`#${hex}`)).not.toThrow();
    expect(new THREE.Color(`#${hex}`).getHexString().toLowerCase()).toBe(hex);
  });

  it("wall theme-ref uses wallStroke when present (not washed inverse-body text color)", () => {
    document.documentElement.style.setProperty("--color-block-wall", "#224466");
    try {
      const object = createSceneObjectFromNode(
        THREE,
        wallNode({ color: "var(--text-inverse-body)" }),
        false,
      );
      const mat = (object as THREE.Mesh).material as THREE.MeshStandardMaterial;
      // Theme refs remap to wallStroke — intentional 3D mass, not --text-inverse-body
      expect(mat.color.getHexString()).toBe("224466");
    } finally {
      document.documentElement.style.removeProperty("--color-block-wall");
    }
  });

  it("wall with explicit user hex keeps paint (theme remap does not override)", () => {
    const object = createSceneObjectFromNode(
      THREE,
      wallNode({ color: "#ff00aa" }),
      false,
    );
    const mat = (object as THREE.Mesh).material as THREE.MeshStandardMaterial;
    expect(mat.color.getHexString().toLowerCase()).toBe("ff00aa");
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

  it("workstation-v0 builds Group with multi-part role meshes and floor origin", () => {
    const config = createWorkstationConfigV0({
      shape: "linear",
      size: { lengthMm: 1500, depthMm: 600 },
      modules: ["desk", "pedestal", "panel"],
    });
    const fp = workstationFootprintMm(config);
    const node: PlannerSceneNode = {
      id: "ws-1",
      kind: "furniture",
      xMm: 2000,
      yMm: 1000,
      widthMm: fp.widthMm,
      depthMm: fp.depthMm,
      heightMm: config.heightMm,
      rotation: 0,
      catalogId: workstationConfigKey(config),
      geometryMode: "workstation-v0",
      workstationOptions: workstationOptionsFromConfig(config),
    };
    const object = createSceneObjectFromNode(THREE, node, false);
    expect(object.type).toBe("Group");
    expect(object.userData.geometryMode).toBe("workstation-v0");
    expect(object.userData.meshSource).toBe("procedural");
    expect(object.children).toHaveLength(countWorkstationV0Parts(config));
    expect(object.children.map((c) => c.name).sort()).toEqual(
      [
        "desk",
        "leg-desk-0",
        "leg-desk-1",
        "leg-desk-2",
        "leg-desk-3",
        "panel",
        "pedestal",
        "stretcher-desk-back",
        "stretcher-desk-front",
      ].sort(),
    );
    expect(object.position.x).toBeCloseTo(2);
    expect(object.position.y).toBe(0);
    expect(object.position.z).toBeCloseTo(1);
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
