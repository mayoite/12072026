import { describe, it, expect, vi } from "vitest";
import { computePlanMetrics, getPageMetrics } from "@/features/planner/editor/planMetrics";
import { getPlannerFabricRuntimeState } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntimeState: vi.fn(),
}));

describe("planMetrics", () => {
  it("returns empty metrics if shape list is empty", () => {
    const metrics = computePlanMetrics([]);
    expect(metrics.shapeCount).toBe(0);
    expect(metrics.roomAreaSqm).toBe(0);
  });

  it("computes wallCount, furnitureCount, and roomArea", () => {
    const shapes = [
      { name: "CORNER", left: 0, top: 0 },
      { name: "CORNER", left: 100, top: 0 },
      { name: "CORNER", left: 100, top: 100 },
      { name: "CORNER", left: 0, top: 100 },
      { name: "WALL:1" },
      { name: "GENERIC:Chair", width: 50, height: 50 },
    ];

    const metrics = computePlanMetrics(shapes);
    expect(metrics.wallCount).toBe(1);
    expect(metrics.furnitureCount).toBe(1);
    // Area of 100x100 points in mm2: 100 * 100 * 10 * 10 = 1,000,000 mm2 = 1 sqm
    expect(metrics.roomAreaSqm).toBe(1);
  });

  it("gets page metrics from getPlannerFabricRuntimeState", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      serializedDraft: JSON.stringify({
        objects: [
          { name: "WALL:1" },
        ],
      }),
    } as any);

    const metrics = getPageMetrics(null);
    expect(metrics.wallCount).toBe(1);
  });
});
