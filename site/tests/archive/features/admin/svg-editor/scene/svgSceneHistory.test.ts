import { describe, expect, it } from "vitest";
import {
  DEFAULT_HISTORY_LIMIT,
  canRedo,
  canUndo,
  commit,
  createHistory,
  redo,
  redoLabel,
  undo,
  undoLabel,
} from "@/features/admin/svg-editor/scene/svgSceneHistory";
import type { SvgSceneDocument } from "@/features/admin/svg-editor/scene/svgSceneDocument";

function doc(tag: string): SvgSceneDocument {
  return {
    modelVersion: 1,
    viewBox: { x: 0, y: 0, width: 10, height: 10 },
    metadata: {
      typeId: tag,
      name: tag,
      category: "c",
      tags: [],
      lifecycleStatus: "draft",
      ownerId: "o",
      physicalDimensionsMm: { width: 10, depth: 10, height: 10 },
      accessibilityTitle: tag,
    },
    nodes: [],
  };
}

describe("svgSceneHistory", () => {
  it("commits undo/redo with labels", () => {
    expect(DEFAULT_HISTORY_LIMIT).toBe(100);
    const d0 = doc("v0");
    const d1 = doc("v1");
    let h = createHistory(d0, "Open");
    expect(canUndo(h)).toBe(false);
    h = commit(h, "Edit", d1);
    expect(canUndo(h)).toBe(true);
    expect(undoLabel(h)).toMatch(/Edit/);
    h = undo(h);
    expect(h.present.document).toBe(d0);
    expect(canRedo(h)).toBe(true);
    expect(redoLabel(h)).toMatch(/Edit/);
    h = redo(h);
    expect(h.present.document).toBe(d1);
    expect(commit(createHistory(d0), "same", d0)).toBeDefined();
  });
});
