import { describe, expect, it } from "vitest";
import {
  SCENE_MAX_EXTENT,
  SCENE_MODEL_VERSION,
  addNode,
  applySceneNodeGeometryPatch,
  findNode,
  nodeIndex,
  removeNode,
  reorderNode,
  replaceNode,
  validateDocument,
  type SvgSceneDocument,
  type SvgSceneNode,
} from "@/features/admin/svg-editor/scene/svgSceneDocument";

function rect(id: string, over: Partial<SvgSceneNode> = {}): SvgSceneNode {
  return {
    kind: "rect",
    id,
    name: id,
    locked: false,
    hidden: false,
    style: {},
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    ...over,
  } as SvgSceneNode;
}

function baseDoc(nodes: SvgSceneNode[]): SvgSceneDocument {
  return {
    modelVersion: SCENE_MODEL_VERSION,
    viewBox: { x: 0, y: 0, width: 100, height: 100 },
    metadata: {
      typeId: "t",
      name: "T",
      category: "c",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "o",
      physicalDimensionsMm: { width: 100, depth: 100, height: 50 },
      accessibilityTitle: "T",
    },
    nodes,
  };
}

describe("svgSceneDocument", () => {
  it("mutates nodes immutably and validates", () => {
    expect(SCENE_MODEL_VERSION).toBe(1);
    expect(SCENE_MAX_EXTENT).toBe(100_000);
    let doc = baseDoc([rect("a"), rect("b")]);
    expect(findNode(doc, "a")?.id).toBe("a");
    expect(nodeIndex(doc, "b")).toBe(1);
    doc = applySceneNodeGeometryPatch(doc, "a", { x: 5 } as Partial<SvgSceneNode>);
    expect((findNode(doc, "a") as { x: number }).x).toBe(5);
    doc = replaceNode(doc, "b", (n) => ({ ...n, name: "B" }));
    expect(findNode(doc, "b")?.name).toBe("B");
    doc = addNode(doc, rect("c"));
    doc = reorderNode(doc, "c", 0);
    expect(doc.nodes.map((n) => n.id)).toEqual(["c", "a", "b"]);
    doc = removeNode(doc, "a");
    expect(doc.nodes.map((n) => n.id)).toEqual(["c", "b"]);
    expect(() => validateDocument(doc)).not.toThrow();
    expect(() => addNode(doc, rect("c"))).toThrow(/duplicate/);
  });
});
