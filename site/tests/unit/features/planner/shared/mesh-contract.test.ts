import { describe, expect, it } from "vitest";
import type { MeshFamily } from "@/features/planner/shared/mesh-contract";

describe("mesh-contract", () => {
  it("enumerates expected mesh families for furniture and structure", () => {
    const families: MeshFamily[] = [
      "task-chair",
      "lounge-chair",
      "sofa",
      "desk-rect",
      "desk-l",
      "table-round",
      "table-rect",
      "storage-locker",
      "storage-cabinet",
      "screen",
      "column-round",
      "column-square",
      "plant",
      "door",
      "window",
      "utility-box",
    ];
    expect(new Set(families).size).toBe(16);
    expect(families).toContain("desk-rect");
    expect(families).toContain("door");
  });
});
