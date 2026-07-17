import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  addNodesToGroup,
  createSceneObjectFromNode,
  disposeAndRemoveObject,
} from "@/features/planner/3d/createSceneObjectFromNode";
import type { PlannerSceneNode } from "@/features/planner/3d/buildPlannerSceneNodes";
import { defaultCabinetV0Options } from "@/features/planner/catalog/modularCabinetV0";

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

describe("createSceneObjectFromNode", () => {
  it("builds a parametric-box furniture mesh with entity userData", () => {
    const obj = createSceneObjectFromNode(THREE, boxNode(), true);
    expect(obj).toBeDefined();
    expect(obj?.name).toBe("box-1");
    expect(obj?.userData.entityId).toBe("box-1");
    expect(obj?.userData.kind).toBe("furniture");
  });

  it("builds a wall mesh", () => {
    const obj = createSceneObjectFromNode(THREE, wallNode(), false);
    expect(obj).toBeDefined();
    expect(obj?.userData.kind).toBe("wall");
  });

  it("builds modular-cabinet-v0 multi-part group", () => {
    const options = defaultCabinetV0Options({ doorStyle: "slab", material: "white" });
    const node: PlannerSceneNode = {
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
    };
    const obj = createSceneObjectFromNode(THREE, node, true);
    expect(obj).toBeInstanceOf(THREE.Group);
    expect((obj as THREE.Group).children.length).toBeGreaterThan(0);
  });

  it("addNodesToGroup and disposeAndRemoveObject manage group membership", () => {
    const group = new THREE.Group();
    const nodes = [boxNode({ id: "a" }), wallNode({ id: "b" })];
    addNodesToGroup(THREE, group, nodes, true);
    expect(group.children.length).toBe(2);
    const first = group.children[0]!;
    disposeAndRemoveObject(THREE, first);
    expect(group.children.length).toBe(1);
  });
});
