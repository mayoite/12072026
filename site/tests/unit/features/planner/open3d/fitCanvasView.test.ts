import { describe, expect, it } from "vitest";

import {
  CANVAS_DEFAULT_SCALE,
  fitCanvasTransformToFloor,
  nativeCanvasScaleLimits,
} from "@/features/planner/open3d/lib/geometry/fitCanvasView";
import { projectToScreen } from "@/features/planner/open3d/lib/geometry/snapping";
import { createOpen3dProject } from "@/features/planner/open3d/model/project";

describe("fitCanvasView", () => {
  it("exposes scale limits aligned with planner viewport config", () => {
    expect(CANVAS_DEFAULT_SCALE).toBe(0.1);
    expect(nativeCanvasScaleLimits().min).toBe(0.02);
    expect(nativeCanvasScaleLimits().max).toBe(0.15);
    expect(nativeCanvasScaleLimits().fitMax).toBeCloseTo(0.15);
  });

  it("frames empty floors to the configured default world square", () => {
    const project = createOpen3dProject({ name: "Empty" });
    const transform = fitCanvasTransformToFloor(project.floors[0]!, 800, 600);
    expect(transform.scale).toBeGreaterThan(0);
    expect(transform.scale).toBeLessThanOrEqual(0.15);
    const topLeft = projectToScreen({ x: 0, y: 0 }, transform);
    const bottomRight = projectToScreen({ x: 30_000, y: 30_000 }, transform);
    expect(topLeft.x).toBeGreaterThanOrEqual(0);
    expect(topLeft.y).toBeGreaterThanOrEqual(0);
    expect(bottomRight.x).toBeLessThanOrEqual(800);
    expect(bottomRight.y).toBeLessThanOrEqual(600);
  });

  it("centers wall geometry inside the viewport", () => {
    const project = createOpen3dProject({ name: "Wall" });
    const floor = {
      ...project.floors[0]!,
      walls: [
        {
          id: "w1",
          start: { x: 0, y: 0 },
          end: { x: 6000, y: 0 },
          thickness: 100,
          height: 2700,
          color: "#ccc",
        },
      ],
    };
    const transform = fitCanvasTransformToFloor(floor, 800, 600);
    const start = projectToScreen({ x: 0, y: 0 }, transform);
    const end = projectToScreen({ x: 6000, y: 0 }, transform);
    expect(start.x).toBeGreaterThanOrEqual(0);
    expect(end.x).toBeLessThanOrEqual(800);
    expect(Math.abs((start.x + end.x) / 2 - 400)).toBeLessThan(2);
  });
});
