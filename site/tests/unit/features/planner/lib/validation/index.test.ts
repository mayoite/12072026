import { describe, expect, it } from "vitest";
import {
  detectFurnitureOverlaps,
  aabbsOverlap,
  detectFurnitureClearance,
  detectFurnitureOutsideRoom,
  detectFurnitureWallCollisions,
  detectOpeningClearanceConflicts,
  runFloorValidation,
} from "@/features/planner/lib/validation";

describe("lib/validation/index barrel", () => {
  it("re-exports overlap, clearance, boundary, wall, opening, and runFloorValidation", () => {
    expect(
      aabbsOverlap(
        { xMm: 0, yMm: 0, widthMm: 100, depthMm: 100 },
        { xMm: 50, yMm: 50, widthMm: 100, depthMm: 100 },
      ),
    ).toBe(true);
    expect(
      aabbsOverlap(
        { xMm: 0, yMm: 0, widthMm: 100, depthMm: 100 },
        { xMm: 200, yMm: 0, widthMm: 100, depthMm: 100 },
      ),
    ).toBe(false);

    const issues = detectFurnitureOverlaps([
      { id: "a", xMm: 0, yMm: 0, widthMm: 100, depthMm: 100 },
      { id: "b", xMm: 50, yMm: 0, widthMm: 100, depthMm: 100 },
    ]);
    expect(issues.length).toBeGreaterThan(0);

    expect(typeof detectFurnitureClearance).toBe("function");
    expect(typeof detectFurnitureOutsideRoom).toBe("function");
    expect(typeof detectFurnitureWallCollisions).toBe("function");
    expect(typeof detectOpeningClearanceConflicts).toBe("function");
    expect(typeof runFloorValidation).toBe("function");
  });
});
