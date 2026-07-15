import { describe, expect, it } from "vitest";
import { nudgeSceneNodePatch } from "@/features/admin/svg-editor/scene/nudgeSceneNode";
import type { SvgSceneNode } from "@/features/admin/svg-editor/scene/svgSceneDocument";

const base = { id: "n1", name: "n1", locked: false, hidden: false, style: {} };

describe("nudgeSceneNodePatch", () => {
  it("nudges rect, circle, and line; null for path/zero/NaN", () => {
    const rect = { ...base, kind: "rect", x: 10, y: 20, width: 5, height: 5 } as SvgSceneNode;
    expect(nudgeSceneNodePatch(rect, 3, -2)).toEqual({ x: 13, y: 18 });
    const circle = { ...base, kind: "circle", cx: 1, cy: 2, r: 4 } as SvgSceneNode;
    expect(nudgeSceneNodePatch(circle, 5, 6)).toEqual({ cx: 6, cy: 8 });
    const line = { ...base, kind: "line", x1: 0, y1: 0, x2: 10, y2: 10 } as SvgSceneNode;
    expect(nudgeSceneNodePatch(line, 1, 2)).toEqual({ x1: 1, y1: 2, x2: 11, y2: 12 });
    expect(nudgeSceneNodePatch({ ...base, kind: "path", d: "M0 0" } as SvgSceneNode, 1, 1)).toBeNull();
    expect(nudgeSceneNodePatch(rect, 0, 0)).toBeNull();
    expect(nudgeSceneNodePatch(rect, Number.NaN, 1)).toBeNull();
  });
});
