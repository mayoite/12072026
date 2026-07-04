import { describe, expect, it } from "vitest";
import { buildWallGraph, findEnclosedRooms, findJunctions } from "@/features/planner/lib/geometry/wallGraph";

describe("wallGraph", () => {
  it("should have function buildWallGraph defined", () => {
    expect(buildWallGraph).toBeTypeOf("function");
  });
  it("should have function findEnclosedRooms defined", () => {
    expect(findEnclosedRooms).toBeTypeOf("function");
  });
  it("should have function findJunctions defined", () => {
    expect(findJunctions).toBeTypeOf("function");
  });
});