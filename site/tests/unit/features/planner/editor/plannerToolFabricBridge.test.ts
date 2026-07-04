import { describe, it, expect } from "vitest";
import {
  plannerToolToFabricTool,
  plannerToolToToolId,
  fabricToolToPlannerSelection,
} from "@/features/planner/editor/plannerToolFabricBridge";

describe("plannerToolFabricBridge", () => {
  it("maps planner tool to fabric tool", () => {
    expect(plannerToolToFabricTool("pan")).toBe("pan");
    expect(plannerToolToFabricTool("wall")).toBe("wall");
    expect(plannerToolToFabricTool("room")).toBe("rectangle");
    expect(plannerToolToFabricTool("select")).toBe("select");
  });

  it("maps planner tool to tool ID", () => {
    expect(plannerToolToToolId("pan")).toBe("hand");
    expect(plannerToolToToolId("wall")).toBe("planner-wall");
    expect(plannerToolToToolId("door")).toBe("planner-door-window");
    expect(plannerToolToToolId("select")).toBe("select");
  });

  it("maps fabric tool to planner selection", () => {
    expect(fabricToolToPlannerSelection("pan")).toEqual({ toolId: "hand", plannerTool: "pan" });
    expect(fabricToolToPlannerSelection("wall")).toEqual({ toolId: "planner-wall", plannerTool: "wall" });
    expect(fabricToolToPlannerSelection("rectangle")).toEqual({ toolId: "planner-room", plannerTool: "room" });
    expect(fabricToolToPlannerSelection("select")).toEqual({ toolId: "select", plannerTool: "select" });
  });
});
