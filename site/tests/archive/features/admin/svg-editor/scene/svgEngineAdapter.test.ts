import { describe, expect, it, vi } from "vitest";
import { createHeadlessEngineAdapter } from "@/features/admin/svg-editor/scene/svgEngineAdapter";
import type { SvgSceneDocument } from "@/features/admin/svg-editor/scene/svgSceneDocument";

function emptyDoc(): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 100, height: 100 },
    metadata: {
      typeId: "desk",
      name: "Desk",
      category: "desk",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "o1",
      physicalDimensionsMm: { width: 100, depth: 100, height: 50 },
      accessibilityTitle: "Desk",
    },
    nodes: [],
  };
}

describe("createHeadlessEngineAdapter", () => {
  it("renders, updates viewport, serializes, and destroys", () => {
    const doc = emptyDoc();
    const adapter = createHeadlessEngineAdapter(doc);
    adapter.render(doc);
    adapter.setViewport({ zoom: 2, panX: 5, panY: 7 });
    expect(adapter.getViewport()).toMatchObject({ zoom: 2, panX: 5, panY: 7 });
    expect(adapter.serialize().typeId).toBe("desk");
    const listener = vi.fn();
    const off = adapter.on("viewport:change", listener);
    adapter.setViewport({ zoom: 1.5 });
    expect(listener).toHaveBeenCalled();
    off();
    adapter.destroy();
  });
});
