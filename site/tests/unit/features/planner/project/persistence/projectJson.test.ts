import { describe, expect, it } from "vitest";
import {
  exportPlannerProjectJson,
  importPlannerProjectJson,
} from "@/features/planner/project/persistence/projectJson";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

describe("projectJson", () => {
  it("round-trips a rectangular project", () => {
    const project = createRectangularRoomProject({
      name: "RoundTrip",
      widthMm: 4000,
      depthMm: 3000,
    });
    const json = exportPlannerProjectJson(project);
    expect(json).toContain("RoundTrip");
    const imported = importPlannerProjectJson(json);
    expect(imported.name).toBe("RoundTrip");
    expect(imported.floors[0]!.walls.length).toBe(4);
  });
});
