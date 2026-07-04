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
