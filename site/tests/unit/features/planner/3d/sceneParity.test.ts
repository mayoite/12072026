import { describe, it, expect } from "vitest";
import { createPlannerProject } from "@/features/planner/model/project";
import { addWall } from "@/features/planner/model/operations/pureActions";
import { addFurniture } from "@/features/planner/model/operations/pureActions";
import { checkSceneParity } from "@/features/planner/3d/sceneParity";
import { buildPlannerSceneNodes } from "@/features/planner/3d/buildPlannerSceneNodes";

describe("sceneParity / 2D–3D matrix", () => {
  it("maps every wall and furniture id into scene nodes", () => {
    let project = createPlannerProject({ name: "parity" });
    project = addWall(project, { x: 0, y: 0 }, { x: 4000, y: 0 }).project;
    project = addFurniture(project, "desk-1", { x: 1000, y: 1000 }).project;

    const report = checkSceneParity(project);
    expect(report.ok).toBe(true);
    expect(report.wallIdsMissingInScene).toEqual([]);
    expect(report.furnitureIdsMissingInScene).toEqual([]);
    expect(report.wallNodeCount).toBe(1);
    expect(report.furnitureNodeCount).toBe(1);
  });

  it("includes door/window nodes for openings on host walls", () => {
    let project = createPlannerProject({ name: "openings" });
    project = addWall(project, { x: 0, y: 0 }, { x: 5000, y: 0 }).project;
    const wallId = project.floors[0]!.walls[0]!.id;
    project = {
      ...project,
      floors: project.floors.map((floor) => ({
        ...floor,
        doors: [
          {
            id: "door-1",
            wallId,
            position: 0.5,
            width: 900,
            height: 2100,
            type: "single" as const,
            swingDirection: "left" as const,
            flipSide: false,
          },
        ],
        windows: [
          {
            id: "win-1",
            wallId,
            position: 0.25,
            width: 1200,
            height: 1200,
            sillHeight: 900,
            type: "standard" as const,
          },
        ],
      })),
    };

    const nodes = buildPlannerSceneNodes(project);
    expect(nodes.some((n) => n.id === "door-1" && n.kind === "door")).toBe(true);
    expect(nodes.some((n) => n.id === "win-1" && n.kind === "window")).toBe(true);
    const report = checkSceneParity(project);
    expect(report.openingsRepresentedIn3d).toBe(true);
  });
});
