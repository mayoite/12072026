import { describe, expect, it } from "vitest";
import {
  buildOpen3dSceneNodes,
  mmToMeters,
} from "@/features/planner/open3d/3d/buildOpen3dSceneNodes";
import type { Open3dProject } from "@/features/planner/open3d/model/types";

function sampleProject(): Open3dProject {
  return {
    id: "proj-1",
    name: "Test",
    floors: [
      {
        id: "floor-1",
        name: "Ground",
        level: 0,
        walls: [
          {
            id: "wall-a",
            start: { x: 0, y: 0 },
            end: { x: 4000, y: 0 },
            thickness: 100,
            height: 2700,
            color: "#888888",
          },
        ],
        rooms: [],
        doors: [],
        windows: [],
        furniture: [
          {
            id: "furn-1",
            catalogId: "cabinet-v0",
            position: { x: 1000, y: 500 },
            rotation: 0,
            scale: { x: 1, y: 1, z: 1 },
            width: 600,
            depth: 580,
            height: 720,
          },
        ],
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      },
    ],
    activeFloorId: "floor-1",
    displayUnit: "mm",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("buildOpen3dSceneNodes", () => {
  it("maps walls and furniture with stable entity ids", () => {
    const nodes = buildOpen3dSceneNodes(sampleProject());
    expect(nodes).toHaveLength(2);

    const wall = nodes.find((n) => n.kind === "wall");
    const furn = nodes.find((n) => n.kind === "furniture");
    expect(wall?.id).toBe("wall-a");
    expect(wall?.widthMm).toBe(4000);
    expect(wall?.xMm).toBe(2000);
    expect(wall?.yMm).toBe(0);

    expect(furn?.id).toBe("furn-1");
    expect(furn?.xMm).toBe(1000);
    expect(furn?.yMm).toBe(500);
    expect(furn?.widthMm).toBe(600);
    expect(furn?.catalogId).toBe("cabinet-v0");
  });

  it("converts mm to metres for Three world", () => {
    expect(mmToMeters(1000)).toBe(1);
    expect(mmToMeters(600)).toBeCloseTo(0.6);
  });
});
