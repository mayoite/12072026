import { describe, expect, it } from "vitest";
import { convertLegacyRectScene } from "@/features/planner/project/shared/document/legacyProject";

function ids(...values: string[]) {
  let i = 0;
  return () => values[i++] ?? `gen-${i}`;
}

describe("legacyProject", () => {
  it("converts a simple rect scene into planner project", () => {
    const { project, report } = convertLegacyRectScene(
      {
        type: "cad-suite-planner-scene",
        version: 1,
        room: { widthMm: 4000, depthMm: 3000 },
      },
      ids("floor", "project", "w1", "w2", "w3", "w4"),
    );
    expect(project.floors[0]!.walls).toHaveLength(4);
    expect(project.name).toBe("Migrated plan");
    expect(report.backupRequired).toBe(true);
    expect(report.preserved).toContain("room.widthMm");
  });
});
