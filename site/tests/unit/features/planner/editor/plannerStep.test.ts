import { describe, it, expect, vi } from "vitest";
import {
  evaluatePlannerStepGates,
  getPlannerStepHint,
  getPlannerStepActionLabel,
  canAdvancePlannerStep,
  previousPlannerStep,
  nextPlannerStep,
  countMeasurementShapes,
} from "@/features/planner/editor/plannerStep";
import { getPlannerFabricRuntimeState } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntimeState: vi.fn(),
}));

describe("plannerStep", () => {
  it("counts measurement shapes correctly", () => {
    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      serializedDraft: JSON.stringify({
        objects: [
          { name: "DRAW:measure_1" },
          { name: "DRAW:measure_2" },
          { name: "WALL:1" },
        ],
      }),
    } as any);

    expect(countMeasurementShapes()).toBe(2);
  });

  it("evaluates planner step gates correctly", () => {
    const metrics = {
      shapeCount: 5,
      roomAreaSqm: 20,
      zoneAreaSqm: 0,
      wallCount: 4,
      furnitureCount: 3,
      calibrated: false,
    };

    vi.mocked(getPlannerFabricRuntimeState).mockReturnValue({
      serializedDraft: JSON.stringify({ objects: [] }),
    } as any);

    const gates = evaluatePlannerStepGates(null, metrics);
    expect(gates.hasSpaceShell).toBe(true);
    expect(gates.hasFurniture).toBe(true);
    expect(gates.canOpenExport).toBe(true);
  });

  it("resolves hints, labels, and navigation steps", () => {
    const gates = {
      hasSpaceShell: true,
      hasFurniture: true,
      hasMeasurement: true,
      measurementCount: 2,
      canOpenExport: true,
    };

    expect(getPlannerStepHint("draw", gates)).toContain("Space shell is ready");
    expect(getPlannerStepActionLabel("place")).toBe("Go to Review");
    expect(canAdvancePlannerStep("review", gates)).toBe(true);
    expect(previousPlannerStep("place")).toBe("draw");
    expect(nextPlannerStep("place")).toBe("review");
  });
});
