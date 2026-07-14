import { describe, expect, it } from "vitest";
import {
  dist,
  isPointOnSegment,
  projectT,
} from "@/features/planner/cloud-store/plannerStoreGeometry";

describe("plannerStoreGeometry", () => {
  it("computes Euclidean distance", () => {
    expect(dist({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(dist({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0);
  });

  it("projectT clamps to segment endpoints", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 10, y: 0 };
    expect(projectT({ x: 5, y: 2 }, a, b)).toBeCloseTo(0.5);
    expect(projectT({ x: -5, y: 0 }, a, b)).toBe(0);
    expect(projectT({ x: 50, y: 0 }, a, b)).toBe(1);
  });

  it("projectT returns 0 for zero-length segment", () => {
    expect(projectT({ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 2 })).toBe(0);
  });

  it("isPointOnSegment respects threshold", () => {
    const a = { x: 0, y: 0 };
    const b = { x: 100, y: 0 };
    expect(isPointOnSegment({ x: 50, y: 2 }, a, b, 5)).toBe(true);
    expect(isPointOnSegment({ x: 50, y: 10 }, a, b, 5)).toBe(false);
  });
});
