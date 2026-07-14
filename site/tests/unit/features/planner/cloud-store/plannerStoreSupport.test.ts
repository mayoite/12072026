import { describe, expect, it } from "vitest";
import {
  ROOM_COLORS,
  pushUndo,
  takeSnapshot,
} from "@/features/planner/cloud-store/plannerStoreSupport";
import type { PlannerState } from "@/features/planner/cloud-store/plannerTypes";

function minimalState(overrides: Partial<PlannerState> = {}): PlannerState {
  return {
    walls: [],
    rooms: [],
    furniture: [
      {
        id: "f1",
        catalogId: "c1",
        name: "Desk",
        x: 1,
        y: 2,
        width: 100,
        height: 50,
        rotation: 0,
        color: "#fff",
        shape: "rect",
        zIndex: 0,
      },
    ],
    doors: [],
    windows: [],
    measurements: [],
    zones: [],
    textLabels: [],
    structuralElements: [],
    undoStack: [],
    redoStack: [],
    ...overrides,
  } as PlannerState;
}

describe("plannerStoreSupport", () => {
  it("exposes room color palette", () => {
    expect(ROOM_COLORS.length).toBeGreaterThanOrEqual(4);
    for (const color of ROOM_COLORS) {
      expect(color.length).toBeGreaterThan(0);
    }
  });

  it("takeSnapshot deep-clones furniture", () => {
    const state = minimalState();
    const snap = takeSnapshot(state);
    expect(snap.furniture).toHaveLength(1);
    expect(snap.furniture[0]).toEqual(state.furniture[0]);
    snap.furniture[0]!.x = 999;
    expect(state.furniture[0]!.x).toBe(1);
  });

  it("pushUndo appends snapshot and clears redo", () => {
    const state = minimalState({
      redoStack: [
        takeSnapshot(minimalState()),
      ],
    });
    const result = pushUndo(state, 50);
    expect(result.undoStack).toHaveLength(1);
    expect(result.redoStack).toEqual([]);
    expect(result.undoStack[0]?.furniture[0]?.name).toBe("Desk");
  });

  it("pushUndo enforces maxUndo by dropping oldest", () => {
    let state = minimalState();
    for (let i = 0; i < 3; i++) {
      const pushed = pushUndo(state, 2);
      state = {
        ...state,
        undoStack: pushed.undoStack,
        redoStack: pushed.redoStack,
        furniture: [
          {
            ...state.furniture[0]!,
            name: `Desk-${i}`,
          },
        ],
      } as PlannerState;
    }
    expect(state.undoStack.length).toBeLessThanOrEqual(2);
  });
});
