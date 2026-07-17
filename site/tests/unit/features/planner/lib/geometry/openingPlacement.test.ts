import { describe, expect, it } from "vitest";

import {
  DEFAULT_DOOR_WIDTH_MM,
  DEFAULT_WINDOW_WIDTH_MM,
  OPENING_END_MARGIN_MM,
  OPENING_GAP_MM,
  clampOpeningCenterAlongMm,
  collectOpeningSpansOnWall,
  defaultOpeningWidthMm,
  openingCenterPointOnWall,
  openingLineEndpointsMm,
  openingPlacementRejectMessage,
  openingSpanFromNormalized,
  openingSpansOverlap,
  projectOpeningAlongHostWall,
  resolveOpeningPlacementAtPoint,
  resolveOpeningRepositionOnHostWall,
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

  it("clamps opening centres away from wall ends with exact margins", () => {
    // half=450 + endMargin=80 → min 530, max 3470 on a 4000 mm wall
    expect(clampOpeningCenterAlongMm(4000, 100, 900)).toBe(530);
    expect(clampOpeningCenterAlongMm(4000, 3900, 900)).toBe(3470);
    expect(clampOpeningCenterAlongMm(4000, 2000, 900)).toBe(2000);
    // Degenerate: opening + margins cannot fit — pin to midpoint
    expect(clampOpeningCenterAlongMm(1000, 0, 900)).toBe(500);
    expect(clampOpeningCenterAlongMm(1000, 999, 900, OPENING_END_MARGIN_MM)).toBe(
      500,
    );
  });

  it("detects overlapping spans with gap", () => {
    expect(openingSpansOverlap({ start: 800, end: 1400 }, { start: 1300, end: 1900 })).toBe(
      true,
    );
    // Exactly OPENING_GAP_MM clear of each other is allowed (not overlap).
    expect(
      openingSpansOverlap(
        { start: 800, end: 1200 },
        { start: 1200 + OPENING_GAP_MM, end: 1800 },
      ),
    ).toBe(false);
    // One millimetre inside the required gap is overlap.
    expect(
      openingSpansOverlap(
        { start: 800, end: 1200 },
        { start: 1200 + OPENING_GAP_MM - 1, end: 1800 },
      ),
    ).toBe(true);
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
    const center = openingCenterPointOnWall(vertical, 0.5);
    expect(center).toEqual({ x: 100, y: 1500 });
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

  it("excludes a moving opening id from collected spans", () => {
    const doors: PlannerDoor[] = [
      {
        id: "door-a",
        wallId: "wall-1",
        position: 0.3,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
      {
        id: "door-b",
        wallId: "wall-1",
        position: 0.7,
        width: 900,
        height: 2100,
        type: "single",
        swingDirection: "left",
        flipSide: false,
      },
    ];
    const windows: PlannerWindow[] = [
      {
        id: "window-a",
        wallId: "wall-1",
        position: 0.5,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "standard",
      },
    ];
    const withoutSelf = collectOpeningSpansOnWall(
      "wall-1",
      4000,
      doors,
      windows,
      "door-a",
    );
    expect(withoutSelf.map((s) => s.id).sort()).toEqual(["door-b", "window-a"]);
  });

  it("maps reject reasons to user messages", () => {
    expect(openingPlacementRejectMessage("overlap")).toMatch(/overlap/i);
    expect(openingPlacementRejectMessage("off-wall")).toMatch(/wall/i);
    expect(openingPlacementRejectMessage("wall-end")).toMatch(/end/i);
    expect(openingPlacementRejectMessage("wall-too-short")).toMatch(/short/i);
  });

  it("rejects non-finite or non-positive opening width as wall-too-short", () => {
    expect(
      resolveOpeningPlacementAtPoint({ x: 2000, y: 0 }, [wall()], 0, [], []),
    ).toEqual({ rejected: true, reason: "wall-too-short" });
    expect(
      resolveOpeningPlacementAtPoint(
        { x: 2000, y: 0 },
        [wall()],
        Number.NaN,
        [],
        [],
      ),
    ).toEqual({ rejected: true, reason: "wall-too-short" });
    expect(
      projectOpeningAlongHostWall({ x: 2000, y: 0 }, wall(), -10),
    ).toEqual({ rejected: true, reason: "wall-too-short" });
  });

  it("allows re-placement of an existing opening via excludeId", () => {
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
    const nearExisting = resolveOpeningPlacementAtPoint(
      { x: 1200, y: 0 },
      [wall()],
      DEFAULT_DOOR_WIDTH_MM,
      doors,
      [],
      { excludeId: "door-1" },
    );
    expect("rejected" in nearExisting).toBe(false);
    if ("rejected" in nearExisting) return;
    expect(nearExisting.wallId).toBe("wall-1");
    expect(nearExisting.position).toBeCloseTo(1200 / 4000, 5);
  });

  it("returns zero-length line endpoints for a collapsed wall", () => {
    const collapsed = wall({ start: { x: 50, y: 50 }, end: { x: 50, y: 50 } });
    const { start, end } = openingLineEndpointsMm(collapsed, 0.5, 900);
    expect(start).toEqual({ x: 50, y: 50 });
    expect(end).toEqual({ x: 50, y: 50 });
  });

  it("normalizes span geometry from position and width", () => {
    const span = openingSpanFromNormalized(4000, 0.5, 900);
    expect(span.center).toBe(2000);
    expect(span.end - span.start).toBe(900);
    expect(span.start).toBeGreaterThanOrEqual(OPENING_END_MARGIN_MM);
  });

  describe("reposition along host wall", () => {
    const host = wall();
    const door: PlannerDoor = {
      id: "door-1",
      wallId: "wall-1",
      position: 0.3,
      width: 900,
      height: 2100,
      type: "single",
      swingDirection: "left",
      flipSide: false,
    };

    it("projects drag point onto host wall with end clamp (no overlap check)", () => {
      const projected = projectOpeningAlongHostWall(
        { x: 2500, y: 400 },
        host,
        door.width,
      );
      expect("rejected" in projected).toBe(false);
      if ("rejected" in projected) return;
      expect(projected.wallId).toBe("wall-1");
      expect(projected.position).toBeCloseTo(2500 / 4000, 5);
    });

    it("repositions an opening excluding itself from overlap", () => {
      const resolved = resolveOpeningRepositionOnHostWall(
        { x: 1200, y: 0 },
        host,
        door.width,
        [door],
        [],
        { excludeId: door.id },
      );
      expect("rejected" in resolved).toBe(false);
      if ("rejected" in resolved) return;
      expect(resolved.position).toBeCloseTo(1200 / 4000, 5);
    });

    it("rejects reposition that overlaps another opening", () => {
      const window: PlannerWindow = {
        id: "window-1",
        wallId: "wall-1",
        position: 0.7,
        width: 1200,
        height: 1200,
        sillHeight: 900,
        type: "standard",
      };
      const resolved = resolveOpeningRepositionOnHostWall(
        { x: 2800, y: 0 },
        host,
        door.width,
        [door],
        [window],
        { excludeId: door.id },
      );
      expect(resolved).toEqual({ rejected: true, reason: "overlap" });
    });

    it("stays on the given host wall (does not re-host)", () => {
      const other = wall({
        id: "wall-2",
        start: { x: 0, y: 0 },
        end: { x: 0, y: 4000 },
      });
      // Point is nearer the vertical wall, but host is fixed to wall-1.
      const resolved = resolveOpeningRepositionOnHostWall(
        { x: 50, y: 2000 },
        host,
        door.width,
        [door],
        [],
        { excludeId: door.id },
      );
      expect("rejected" in resolved).toBe(false);
      if ("rejected" in resolved) return;
      expect(resolved.wallId).toBe(host.id);
      expect(resolved.wallId).not.toBe(other.id);
      // Projected along horizontal wall near start, then end-clamped.
      expect(resolved.position).toBeGreaterThan(0);
      expect(resolved.position).toBeLessThan(0.2);
    });

    it("rejects reposition when wall is too short for width", () => {
      const short = wall({ end: { x: 500, y: 0 } });
      const resolved = resolveOpeningRepositionOnHostWall(
        { x: 250, y: 0 },
        short,
        DEFAULT_DOOR_WIDTH_MM,
        [],
        [],
        { excludeId: "door-x" },
      );
      expect(resolved).toEqual({ rejected: true, reason: "wall-too-short" });
    });
  });
});
