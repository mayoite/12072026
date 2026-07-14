import { describe, expect, it } from "vitest";
import { buildWallGraph, findEnclosedRooms, findJunctions } from "@/features/planner/lib/geometry/wallGraph";

describe("wallGraph", () => {
  it("should have function buildWallGraph defined", () => {
    expect(buildWallGraph).toBeTypeOf("function"); expect(String(buildWallGraph)).toContain('function');
  });
  it("should have function findEnclosedRooms defined", () => {
    expect(findEnclosedRooms).toBeTypeOf("function"); expect(String(findEnclosedRooms)).toContain('function');
  });
  it("should have function findJunctions defined", () => {
    expect(findJunctions).toBeTypeOf("function"); expect(String(findJunctions)).toContain('function');
  });
});