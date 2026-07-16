import { describe, expect, it } from "vitest";
import {
  formatAutosaveStatus,
  formatSelectionStatus,
  formatSnapStatus,
  formatToolStatus,
  plannerSaveStatusBarLabel,
  plannerSaveStatusLabel,
} from "@/features/planner/editor/workspaceStatusLabels";

describe("workspaceStatusLabels", () => {
  it("formats tool · shortcut · view compactly", () => {
    expect(formatToolStatus("wall", "2d")).toBe("Wall · W · 2D");
    expect(formatToolStatus("select", "3d")).toBe("Select · V · 3D");
  });

  it("formats snap and selection status", () => {
    expect(formatSnapStatus("none")).toBeNull();
    expect(formatSnapStatus("grid")).toBe("Snap: grid");
    expect(formatSelectionStatus({ type: "wall", ids: ["w1"] })).toBe("Wall selected");
    expect(formatSelectionStatus({ type: "furniture", ids: ["a", "b"] })).toBe(
      "2 furnitures selected",
    );
    expect(formatSelectionStatus({ type: "none", ids: [] })).toBeNull();
  });

  it("formats autosave and save labels honestly for local storage", () => {
    expect(formatAutosaveStatus("saved", true)).toBe("Draft saved locally");
    expect(formatAutosaveStatus("unsaved", false)).toBe("Unsaved changes");
    const idle = plannerSaveStatusLabel({
      status: "idle",
      storage: "local",
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: false,
    });
    expect(idle).toBe("Ready (local)");
    expect(idle.toLowerCase()).not.toContain("cloud");
    expect(
      plannerSaveStatusBarLabel({
        status: "saved",
        storage: "local",
        lastSavedAt: null,
        cloudEnabled: false,
        guestMode: true,
      }),
    ).toMatch(/local|draft/i);
  });

  it("never implies cloud save for guest local labels", () => {
    const guestIdle = plannerSaveStatusLabel({
      status: "idle",
      storage: "cloud",
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: true,
    });
    expect(guestIdle).toBe("Guest session (local)");
    expect(guestIdle.toLowerCase()).not.toMatch(/account|cloud/);

    const guestSaved = plannerSaveStatusLabel({
      status: "saved",
      storage: "local",
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: true,
    });
    expect(guestSaved).toBe("Draft saved locally");
  });
});
