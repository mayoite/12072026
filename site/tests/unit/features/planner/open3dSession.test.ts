import { describe, expect, it } from "vitest";

import { createOpen3dProject } from "@/features/planner/project/model/project";
import { addOpen3dWall } from "@/features/planner/project/model/actions/walls";
import { addFurniture } from "@/features/planner/project/model/operations/pureActions";
import {
  buildOpen3dSessionEnvelope,
  parseOpen3dSessionSnapshot,
} from "@/features/planner/project/persistence/open3dSession";

function ids(...values: string[]) {
  let index = 0;
  return () => values[index++] ?? `generated-${index}`;
}

describe("open3dSession", () => {
  it("round-trips project data through the session envelope", () => {
    const base = createOpen3dProject({ name: "Saved plan" });
    const withWall = addOpen3dWall(
      base,
      { start: { x: 0, y: 0 }, end: { x: 3000, y: 0 } },
      () => "wall-1",
    );
    const envelope = buildOpen3dSessionEnvelope(withWall);
    const snapshot = JSON.stringify(envelope);
    const restored = parseOpen3dSessionSnapshot(snapshot);
    expect(restored?.name).toBe("Saved plan");
    expect(restored?.floors[0]?.walls).toHaveLength(1);
  });

  it("preserves wall + furniture UUIDs through flush payload (envelope → JSON → parse)", () => {
    let project = createOpen3dProject({
      idFactory: ids("floor-uuid-1", "project-uuid-1"),
      name: "Flush identity",
      now: "2026-07-10T12:00:00.000Z",
    });
    project = addOpen3dWall(
      project,
      { start: { x: 0, y: 0 }, end: { x: 4000, y: 0 } },
      () => "wall-uuid-a",
    );
    ({ project } = addFurniture(project, "cabinet-v0", { x: 1000, y: 500 }, {
      idFactory: ids("furn-uuid-b"),
    }));

    const envelope = buildOpen3dSessionEnvelope(project);
    const snapshot = JSON.stringify(envelope);
    // Same string createAutoSaver.flush would write to saveProject.snapshot
    const restored = parseOpen3dSessionSnapshot(snapshot);

    expect(restored).not.toBeNull();
    expect(restored!.id).toBe("project-uuid-1");
    expect(restored!.activeFloorId).toBe("floor-uuid-1");
    const floor = restored!.floors.find((f) => f.id === restored!.activeFloorId);
    expect(floor?.walls.map((w) => w.id)).toEqual(["wall-uuid-a"]);
    expect(floor?.furniture.map((f) => f.id)).toEqual(["furn-uuid-b"]);
  });
});
