import { describe, expect, it } from "vitest";

import {
  formatAutosaveStatus,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
} from "@/features/planner/open3d/editor/workspaceStatusLabels";

describe("workspaceStatusLabels", () => {
  it("formats tool and view mode", () => {
    expect(formatToolStatus("wall", "2d")).toBe("Wall · 2D");
  });

  it("formats snap status only when active", () => {
    expect(formatSnapStatus("none")).toBeNull();
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
  });

  it("formats selection counts", () => {
    expect(formatSelectionStatus({ type: "wall", ids: ["w1"] })).toBe("Wall selected");
    expect(formatSelectionStatus({ type: "furniture", ids: ["a", "b"] })).toBe(
      "2 furnitures selected",
    );
    expect(formatSelectionStatus({ type: "none", ids: [] })).toBeNull();
  });

  it("formats autosave status for guest and member sessions", () => {
    expect(formatAutosaveStatus("saved", true)).toBe("Draft saved locally");
    expect(formatAutosaveStatus("unsaved", false)).toBe("Unsaved changes");
  });
});

// TDD addition for full switch/branch coverage on status labels
describe("workspaceStatusLabels full branches (TDD)", () => {
  it("covers all autosave statuses (honest local labels)", () => {
    expect(formatAutosaveStatus("saving", false)).toBe("Saving locally…");
    expect(formatAutosaveStatus("saved", false)).toBe("Saved locally");
    expect(formatAutosaveStatus("unsaved", true)).toBe("Unsaved draft");
    expect(formatAutosaveStatus("error", true)).toBe("Save failed");
    expect(formatAutosaveStatus("idle", false)).toBe("Ready (local)");
    expect(formatAutosaveStatus("idle", true)).toBe("Guest session (local)");
  });

  it("covers selection multi and snap variants", () => {
    expect(formatSelectionStatus({ type: "door", ids: ["d1", "d2"] })).toBe("2 doors selected");
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
    expect(formatSnapStatus("endpoint")).toBe("Snap: endpoint");
  });
});
