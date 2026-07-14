import { describe, expect, it } from "vitest";
import {
  SCENE_NUMERIC_PRECISION,
  loadSceneFromDefinition,
  normalizeNumber,
  serializeSceneToDefinition,
} from "@/features/admin/svg-editor/scene/svgSceneSerializer";
import type { SvgSceneDocument, SvgSceneNode } from "@/features/admin/svg-editor/scene/svgSceneDocument";

function rect(id: string): SvgSceneNode {
  return {
    kind: "rect",
    id,
    name: id,
    locked: false,
    hidden: false,
    style: { fillToken: "var(--color-surface-raised)" },
    x: 1.23456,
    y: 2,
    width: 10,
    height: 10,
  };
}

function baseDoc(nodes: SvgSceneNode[]): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 100, height: 100 },
    metadata: {
      typeId: "desk-basic",
      name: "Basic Desk",
      category: "desk",
      tags: ["desk"],
      lifecycleStatus: "draft",
      ownerId: "owner-1",
      physicalDimensionsMm: { width: 100, depth: 100, height: 50 },
      accessibilityTitle: "Basic desk",
    },
    nodes,
  };
}

describe("svgSceneSerializer", () => {
  it("normalizes and round-trips rect scenes", () => {
    expect(SCENE_NUMERIC_PRECISION).toBe(3);
    expect(normalizeNumber(1.23456)).toBe(1.235);
    const doc = baseDoc([rect("top")]);
    const def = serializeSceneToDefinition(doc);
    expect(def.schemaVersion).toBe(1);
    const back = loadSceneFromDefinition(def);
    expect(back.nodes.map((n) => n.id)).toEqual(["top"]);
    expect(serializeSceneToDefinition(back)).toEqual(def);
  });
});
