import { beforeEach, describe, expect, it } from "vitest";
import { usePlannerHistoryStore } from "@/features/planner/cloud-store/plannerHistoryStore";
import type { HistorySnapshot } from "@/features/planner/cloud-store/plannerStoreSupport";

function snap(tag: string): HistorySnapshot {
  return {
    walls: [],
    rooms: [],
    furniture: [],
    doors: [],
    windows: [],
    measurements: [],
    zones: [],
    textLabels: [{ id: tag, x: 0, y: 0, text: tag, fontSize: 12, color: "#000", rotation: 0 }],
    structuralElements: [],
  };
}

describe("plannerHistoryStore", () => {
  beforeEach(() => {
    usePlannerHistoryStore.setState({
      undoStack: [],
      redoStack: [],
      clipboard: null,
    });
  });

  it("pushSnapshot enables undo and clears redo", () => {
    usePlannerHistoryStore.getState().pushSnapshot(snap("a"));
    usePlannerHistoryStore.setState({ redoStack: [snap("stale")] });
    usePlannerHistoryStore.getState().pushSnapshot(snap("b"));
    expect(usePlannerHistoryStore.getState().canUndo()).toBe(true);
    expect(usePlannerHistoryStore.getState().redoStack).toEqual([]);
    expect(usePlannerHistoryStore.getState().undoStack).toHaveLength(2);
  });

  it("undo restores previous snapshot and enables redo", () => {
    usePlannerHistoryStore.getState().pushSnapshot(snap("prev"));
    const restored = usePlannerHistoryStore.getState().undo(snap("current"));
    expect(restored?.textLabels[0]?.text).toBe("prev");
    expect(usePlannerHistoryStore.getState().canRedo()).toBe(true);
    expect(usePlannerHistoryStore.getState().canUndo()).toBe(false);
  });

  it("redo restores next snapshot", () => {
    usePlannerHistoryStore.getState().pushSnapshot(snap("prev"));
    usePlannerHistoryStore.getState().undo(snap("current"));
    const redone = usePlannerHistoryStore.getState().redo(snap("after-undo"));
    expect(redone?.textLabels[0]?.text).toBe("current");
    expect(usePlannerHistoryStore.getState().canUndo()).toBe(true);
  });

  it("returns null when stacks empty", () => {
    expect(usePlannerHistoryStore.getState().undo(snap("x"))).toBeNull();
    expect(usePlannerHistoryStore.getState().redo(snap("x"))).toBeNull();
  });

  it("clipboard set and clear", () => {
    usePlannerHistoryStore.getState().setClipboard({
      type: "furniture",
      items: [],
    } as never);
    expect(usePlannerHistoryStore.getState().clipboard).not.toBeNull();
    usePlannerHistoryStore.getState().clearClipboard();
    expect(usePlannerHistoryStore.getState().clipboard).toBeNull();
  });
});
