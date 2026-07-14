import { describe, expect, it } from "vitest";
import {
  PLANNER_ORBIT_DEFAULT_ENABLED,
  getPlannerViewerControlProps,
  formatMm,
  formatMeters,
  mmToWorld,
  formatAreaSqm,
  Lazy3DViewer,
} from "@/features/planner/3d";

describe("3d/index barrel", () => {
  it("re-exports orbit defaults", () => {
    expect(PLANNER_ORBIT_DEFAULT_ENABLED).toBe(true);
    expect(getPlannerViewerControlProps()).toEqual({ enableControls: true });
  });

  it("re-exports format helpers", () => {
    expect(typeof formatMm(1500)).toBe("string");
    expect(typeof formatMeters(1500)).toBe("string");
    expect(mmToWorld(1000)).toBeCloseTo(1, 5);
    expect(typeof formatAreaSqm(1_000_000)).toBe("string");
  });

  it("exports Lazy3DViewer component", () => {
    expect(typeof Lazy3DViewer).toBe("function");
  });
});
