import { describe, it, expect } from "vitest";
import { resolvePlannerToolKey } from "@/features/planner/editor/plannerKeyboardShortcuts";

describe("plannerKeyboardShortcuts", () => {
  it("resolves shortcut keys when target is not a text input", () => {
    const mockElement = document.createElement("div");
    const ev = new KeyboardEvent("keydown", { key: "w" });
    Object.defineProperty(ev, "target", { value: mockElement, enumerable: true });

    const binding = resolvePlannerToolKey(ev);
    expect(binding).toEqual({ toolId: "planner-wall", plannerTool: "wall" });
  });

  it("returns null if target is an INPUT", () => {
    const mockElement = document.createElement("input");
    const ev = new KeyboardEvent("keydown", { key: "w" });
    Object.defineProperty(ev, "target", { value: mockElement, enumerable: true });

    const binding = resolvePlannerToolKey(ev);
    expect(binding).toBeNull();
  });

  it("returns null if ctrlKey is pressed", () => {
    const mockElement = document.createElement("div");
    const ev = new KeyboardEvent("keydown", { key: "w", ctrlKey: true });
    Object.defineProperty(ev, "target", { value: mockElement, enumerable: true });

    const binding = resolvePlannerToolKey(ev);
    expect(binding).toBeNull();
  });

  it("handles Shift+D for window shortcut", () => {
    const mockElement = document.createElement("div");
    const ev = new KeyboardEvent("keydown", { key: "d", shiftKey: true });
    Object.defineProperty(ev, "target", { value: mockElement, enumerable: true });

    const binding = resolvePlannerToolKey(ev);
    expect(binding).toEqual({ toolId: "planner-door-window", plannerTool: "window" });
  });
});
