import { describe, expect, it } from "vitest";
import {
  annotationDraftFromSegment,
  annotationMatchesSegment,
  dimensionLabelForLength,
  linearLengthMm,
  offsetDimensionGeometry,
  openingAlongWallDimensionDrafts,
  overallRoomDimensionDrafts,
  paintGeometryFromAnnotation,
  wallDimensionDrafts,
} from "@/features/planner/lib/geometry/dimensions";
import { rectangularRoomMetrics } from "@/features/planner/lib/geometry/roomOutline";
import type { PlannerWall } from "@/features/planner/model/types";

describe("dimensions geometry", () => {
  it("measures length and builds offset paint geometry with label", () => {
    expect(linearLengthMm({ x: 0, y: 0 }, { x: 3000, y: 0 })).toBe(3000);
    const geom = offsetDimensionGeometry(
      { x: 0, y: 0 },
      { x: 3000, y: 0 },
      400,
      undefined,
      "mm",
    );
    expect(geom).not.toBeNull();
    expect(geom!.lengthMm).toBe(3000);
    // Left normal of +X segment is +Y in plan mm (see offsetDimensionGeometry).
    expect(geom!.lineStart.y).toBeCloseTo(400, 5);
    expect(geom!.lineEnd.y).toBeCloseTo(400, 5);
    expect(geom!.label).toContain("3000");
    expect(dimensionLabelForLength(1500, "mm")).toContain("1500");
  });

  it("builds wall and overall room dimension drafts", () => {
    const walls: PlannerWall[] = [
      {
        id: "a",
        start: { x: 0, y: 0 },
        end: { x: 5000, y: 0 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
      {
        id: "b",
        start: { x: 5000, y: 0 },
        end: { x: 5000, y: 4000 },
        thickness: 150,
        height: 2700,
        color: "#000",
      },
    ];
    const wallDrafts = wallDimensionDrafts(walls, 400, "mm");
    expect(wallDrafts).toHaveLength(2);
    expect(wallDrafts[0]?.label).toBeDefined();

    const metrics = rectangularRoomMetrics({ x: 0, y: 0 }, { x: 5000, y: 4000 });
    const overall = overallRoomDimensionDrafts(metrics.corners, 700, "mm");
    expect(overall).toHaveLength(2);
    expect(overall[0]?.x2 - overall[0]!.x1).toBe(5000);
  });

  it("round-trips annotation paint geometry and matches segments", () => {
    const draft = annotationDraftFromSegment(
      { x: 0, y: 0 },
      { x: 2000, y: 0 },
      400,
      undefined,
      "mm",
    );
    expect(draft).not.toBeNull();
    const annotation = { id: "d1", ...draft! };
    const paint = paintGeometryFromAnnotation(annotation, "mm");
    expect(paint?.lengthMm).toBe(2000);
    expect(
      annotationMatchesSegment(annotation, { x: 0, y: 0 }, { x: 2000, y: 0 }),
    ).toBe(true);
    expect(
      annotationMatchesSegment(annotation, { x: 0, y: 0 }, { x: 1000, y: 0 }),
    ).toBe(false);
  });

  it("chains wall-start, opening widths, and wall-end segments", () => {
    const wall: Pick<PlannerWall, "start" | "end"> = {
      start: { x: 0, y: 0 },
      end: { x: 4000, y: 0 },
    };
    // Door centre 1000 width 800 → [600,1400]; window centre 3000 width 1000 → [2500,3500]
    const drafts = openingAlongWallDimensionDrafts(
      wall,
      [
        { position: 1000 / 4000, widthMm: 800 },
        { position: 3000 / 4000, widthMm: 1000 },
      ],
      400,
      "mm",
    );
    // 0→600, 600→1400, 1400→2500, 2500→3500, 3500→4000
    expect(drafts).toHaveLength(5);
    const lengths = drafts.map((d) => Math.abs(d.x2 - d.x1));
    expect(lengths).toEqual([600, 800, 1100, 1000, 500]);
  });

  it("returns a single full-wall draft when openings list is empty", () => {
    const wall: Pick<PlannerWall, "start" | "end"> = {
      start: { x: 0, y: 0 },
      end: { x: 3000, y: 0 },
    };
    const drafts = openingAlongWallDimensionDrafts(wall, [], 400, "mm");
    expect(drafts).toHaveLength(1);
    expect(drafts[0]?.x2 - drafts[0]!.x1).toBe(3000);
  });

  it("skips zero-width openings and short residual gaps", () => {
    const wall: Pick<PlannerWall, "start" | "end"> = {
      start: { x: 0, y: 0 },
      end: { x: 2000, y: 0 },
    };
    // Opening flush to start with tiny residual before it is skipped by MIN_DIMENSION.
    const drafts = openingAlongWallDimensionDrafts(
      wall,
      [
        { position: 0, widthMm: 0 },
        { position: 0.5, widthMm: 400 },
      ],
      400,
      "mm",
    );
    // 0→800, 800→1200, 1200→2000
    expect(drafts.map((d) => Math.abs(d.x2 - d.x1))).toEqual([800, 400, 800]);
  });
});
