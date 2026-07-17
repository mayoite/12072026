import { describe, expect, it } from "vitest";

import {
  DEFAULT_DOOR_WIDTH_MM,
  DEFAULT_WINDOW_WIDTH_MM,
  OPENING_END_MARGIN_MM,
  OPENING_GAP_MM,
  clampOpeningCenterAlongMm,
  collectOpeningSpansOnWall,
  defaultOpeningWidthMm,
  openingLineEndpointsMm,
  openingPlacementRejectMessage,
  openingSpanFromNormalized,
  openingSpansOverlap,
  resolveOpeningPlacementAtPoint,
  wallOpeningPickToleranceMm,
} from "@/features/planner/lib/geometry/openingPlacement";
import type { PlannerDoor, PlannerWall, PlannerWindow } from "@/features/planner/model/types";

const wall = (overrides: Partial<PlannerWall> = {}): PlannerWall => ({
  id: "wall-1",
  start: { x: 0, y: 0 },
  end: { x: 4000, y: 0 },
  thickness: 150,
  height: 2700,
  color: "#ccc",
  ...overrides,
});

describe("openingPlacement", () => {
  it("exposes default opening widths", () => {
    expect(DEFAULT_DOOR_WIDTH_MM).toBe(900);
    expect(DEFAULT_WINDOW_WIDTH_MM).toBe(1200);
    expect(defaultOpeningWidthMm("door")).toBe(DEFAULT_DOOR_WIDTH_MM);
    expect(defaultOpeningWidthMm("window")).toBe(DEFAULT_WINDOW_WIDTH_MM);
  });

  it("computes wall pick tolerance from thickness", () => {
    expect(wallOpeningPickToleranceMm(wall())).toBe(150 / 2 + 80);
    expect(wallOpeningPickToleranceMm(wall({ thickness: 0 }))).toBe(150 / 2 + 80);
  });

  it("clamps opening centres away from wall ends", () => {
    expect(clampOpeningCenterAlongMm(4000, 100, 900)).toBeGreaterThan(450);
    expect(clampOpeningCenterAlongMm(4000, 3900, 900)).toBeLessThan(3550);
  });

  it("detects overlapping spans with gap", () => {
    expect(openingSpansOverlap({ start: 800, end: 1400 }, { start: 1300, end: 1900 })).toBe(
      true,
    );
    expect(
      openingSpansOverlap(
        { start: 800, end: 1200 },
        { start: 1200 + OPENING_GAP_MM + 1, end: 1800 },
      ),
    ).toBe(false);
  });

  it("resolves placement on the nearest valid host wall", () => {
    const walls = [
      wall(),
      wall({ id: "wall-2", start: { x: 0, y: 0 }, end: { x: 0, y: 3000 } }),
    ];
    const resolved = resolveOpeningPlacementAtPoint(
      { x: 2000, y: 20 },
      walls,
      DEFAULT_DOOR_WIDTH_MM,
      [],
      [],
    );
    expect("rejected" in resolved).toBe(false);
    if ("rejected" in resolved) return;
    expect(resolved.wallId).toBe("wall-1");
    expect(resolved.position).toBeGreaterThan(0);
    expect(resolved.position).toBeLessThan(1);
    expect(resolved.angleRadians).toBeCloseTo(0);
  });

  it("rejects off-wall clicks", () => {
    const result = resolveOpeningPlacementAtPoint(
      { x: 2000, y: 500 },
      [wall()],
      DEFAULT_DOOR_WIDTH_MM,
      [],
      [],
    );
    expect(result).toEqual({ rejected: true, reason: "off-wall" });
  });

  it("rejects overlapping openings on the same wall", () => {
    const doors: PlannerDoor[] = [
      {
        id: "door-1",
        wallId: "wall-1",
        position: 0.3,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
    ];
    const result = resolveOpeningPlacementAtPoint(
      { x: 1300, y: 0 },
      [wall()],
      DEFAULT_DOOR_WIDTH_MM,
      doors,
      [],
    );
    expect(result).toEqual({ rejected: true, reason: "overlap" });
  });

  it("allows openings at the same normalized position on different walls", () => {
    const walls = [
      wall({ id: "wall-a" }),
      wall({ id: "wall-b", start: { x: 0, y: 2000 }, end: { x: 4000, y: 2000 } }),
    ];
    const doors: PlannerDoor[] = [
      {
        id: "door-a",
        wallId: "wall-a",
        position: 0.5,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
    ];
    const result = resolveOpeningPlacementAtPoint(
      { x: 2000, y: 2000 },
      walls,
      DEFAULT_DOOR_WIDTH_MM,
      doors,
      [],
    );
    expect("rejected" in result).toBe(false);
    if ("rejected" in result) return;
    expect(result.wallId).toBe("wall-b");
  });

  it("rejects openings too close to wall ends after clamping", () => {
    const shortWall = wall({ end: { x: 1000, y: 0 } });
    const result = resolveOpeningPlacementAtPoint(
      { x: 50, y: 0 },
      [shortWall],
      DEFAULT_DOOR_WIDTH_MM,
      [],
      [],
    );
    expect(result).toEqual({ rejected: true, reason: "wall-end" });
  });

  it("builds opening line endpoints aligned to the host wall", () => {
    const vertical = wall({
      start: { x: 100, y: 0 },
      end: { x: 100, y: 3000 },
    });
    const { start, end } = openingLineEndpointsMm(vertical, 0.5, 900);
    expect(start.x).toBeCloseTo(end.x, 0);
    expect(Math.abs(end.y - start.y)).toBeCloseTo(900, 0);
  });

  it("collects spans only for the requested wall", () => {
    const doors: PlannerDoor[] = [
      {
        id: "door-a",
        wallId: "wall-a",
        position: 0.5,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
    ];
    const windows: PlannerWindow[] = [
      {
        id: "window-b",
        wallId: "wall-b",
        position: 0.5,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "standard",
      },
    ];
    const spans = collectOpeningSpansOnWall("wall-a", 4000, doors, windows);
    expect(spans).toHaveLength(1);
    expect(spans[0]?.id).toBe("door-a");
  });

  it("maps reject reasons to user messages", () => {
    expect(openingPlacementRejectMessage("overlap")).toMatch(/overlap/i);
    expect(openingPlacementRejectMessage("off-wall")).toMatch(/wall/i);
  });

  it("normalizes span geometry from position and width", () => {
    const span = openingSpanFromNormalized(4000, 0.5, 900);
    expect(span.center).toBe(2000);
    expect(span.end - span.start).toBe(900);
    expect(span.start).toBeGreaterThanOrEqual(OPENING_END_MARGIN_MM);
  });
});
