import { describe, expect, it } from "vitest";

import { createOpen3dProject } from "@/features/planner/open3d/model/project";
import { addOpen3dWall } from "@/features/planner/open3d/model/actions/walls";
import {
  buildOpen3dSessionEnvelope,
  parseOpen3dSessionSnapshot,
} from "@/features/planner/open3d/persistence/open3dSession";

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
});
