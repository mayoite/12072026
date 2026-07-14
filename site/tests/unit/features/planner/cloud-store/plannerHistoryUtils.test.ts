import { describe, expect, it } from "vitest";
import {
  buildRedoState,
  buildUndoState,
} from "@/features/planner/cloud-store/plannerHistoryUtils";
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

describe("plannerHistoryUtils", () => {
  it("returns null undo when stack empty", () => {
    expect(buildUndoState({ undoStack: [], redoStack: [] }, snap("cur"))).toBeNull();
  });

  it("pops undo and pushes current onto redo", () => {
    const prev = snap("prev");
    const cur = snap("cur");
    const result = buildUndoState({ undoStack: [prev], redoStack: [] }, cur);
    expect(result).not.toBeNull();
    expect(result!.snapshot.textLabels[0]?.text).toBe("prev");
    expect(result!.undoStack).toHaveLength(0);
    expect(result!.redoStack).toHaveLength(1);
    expect(result!.redoStack[0]?.textLabels[0]?.text).toBe("cur");
  });

  it("returns null redo when stack empty", () => {
    expect(buildRedoState({ undoStack: [], redoStack: [] }, snap("cur"))).toBeNull();
  });

  it("pops redo and pushes current onto undo", () => {
    const next = snap("next");
    const cur = snap("cur");
    const result = buildRedoState({ undoStack: [], redoStack: [next] }, cur);
    expect(result).not.toBeNull();
    expect(result!.snapshot.textLabels[0]?.text).toBe("next");
    expect(result!.redoStack).toHaveLength(0);
    expect(result!.undoStack[0]?.textLabels[0]?.text).toBe("cur");
  });
});
