import { describe, expect, it } from "vitest";

import {
  projectToScreen,
  screenToProject,
  zoomTransformAt,
  type CanvasTransform,
} from "@/features/planner/open3d/lib/geometry/snapping";

describe("zoomTransformAt anchor invariance", () => {
  it("keeps the world point under the cursor fixed after zoom in/out", () => {
    const transform: CanvasTransform = { origin: { x: -4000, y: -2500 }, scale: 0.1 };
    const screenPoint = { x: 320, y: 240 };
    const worldBefore = screenToProject(screenPoint, transform);

    const zoomedIn = zoomTransformAt(transform, screenPoint, 1.25);
    const worldAfterIn = screenToProject(screenPoint, zoomedIn);
    expect(worldAfterIn.x).toBeCloseTo(worldBefore.x, 8);
    expect(worldAfterIn.y).toBeCloseTo(worldBefore.y, 8);
    expect(zoomedIn.scale).toBeCloseTo(0.125, 8);

    const zoomedOut = zoomTransformAt(zoomedIn, screenPoint, 0.8);
    const worldAfterOut = screenToProject(screenPoint, zoomedOut);
    expect(worldAfterOut.x).toBeCloseTo(worldBefore.x, 8);
    expect(worldAfterOut.y).toBeCloseTo(worldBefore.y, 8);
  });

  it("preserves anchor across projectToScreen / screenToProject after zoom clamp", () => {
    const transform: CanvasTransform = { origin: { x: 10, y: 20 }, scale: 2 };
    const screenPoint = { x: 100, y: 50 };
    const world = screenToProject(screenPoint, transform);

    // factor that would exceed maximumScale (2) — clamps scale, still anchors.
    const clamped = zoomTransformAt(transform, screenPoint, 100);
    expect(clamped.scale).toBe(2);
    const worldAfterClamp = screenToProject(screenPoint, clamped);
    expect(worldAfterClamp.x).toBeCloseTo(world.x, 8);
    expect(worldAfterClamp.y).toBeCloseTo(world.y, 8);

    // Round-trip world point through screen after a non-clamp zoom.
    const zoomed = zoomTransformAt(transform, screenPoint, 0.5);
    expect(zoomed.scale).toBe(1);
    const screenOfWorld = projectToScreen(world, zoomed);
    expect(screenOfWorld.x).toBeCloseTo(screenPoint.x, 8);
    expect(screenOfWorld.y).toBeCloseTo(screenPoint.y, 8);
  });

  it("clamps to minimumScale while keeping the cursor world point fixed", () => {
    const transform: CanvasTransform = { origin: { x: 0, y: 0 }, scale: 0.05 };
    const screenPoint = { x: 40, y: 60 };
    const worldBefore = screenToProject(screenPoint, transform);
    const zoomed = zoomTransformAt(transform, screenPoint, 0.001);
    expect(zoomed.scale).toBe(0.02);
    const worldAfter = screenToProject(screenPoint, zoomed);
    expect(worldAfter.x).toBeCloseTo(worldBefore.x, 8);
    expect(worldAfter.y).toBeCloseTo(worldBefore.y, 8);
  });
});
