import { describe, expect, it, vi } from "vitest";
import { spansOverlap, clampOpeningAlong, pointAlongWall, wallSegmentFromEditorShape, openingCandidateFromShape, collectOpeningCandidates, checkOpeningPlacementOnWall } from "@/features/planner/lib/geometry/openingCollision";

vi.mock("fabric", () => {
  const mockCanvas = {
    add: vi.fn(),
    remove: vi.fn(),
    renderAll: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getWidth: vi.fn(() => 800),
    getHeight: vi.fn(() => 600),
    setWidth: vi.fn(),
    setHeight: vi.fn(),
    getZoom: vi.fn(() => 1),
    setZoom: vi.fn(),
    getObjects: vi.fn(() => []),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
  };
  return {
    fabric: {
      Canvas: vi.fn(() => mockCanvas),
      Rect: vi.fn(() => ({})),
      Circle: vi.fn(() => ({})),
      Path: vi.fn(() => ({})),
      Group: vi.fn(() => ({})),
    }
  };
});

describe("openingCollision", () => {
  it("should have function spansOverlap defined", () => {
    expect(spansOverlap).toBeTypeOf("function");
  });
  it("should have function clampOpeningAlong defined", () => {
    expect(clampOpeningAlong).toBeTypeOf("function");
  });
  it("should have function pointAlongWall defined", () => {
    expect(pointAlongWall).toBeTypeOf("function");
  });
  it("should have function wallSegmentFromEditorShape defined", () => {
    expect(wallSegmentFromEditorShape).toBeTypeOf("function");
  });
  it("should have function openingCandidateFromShape defined", () => {
    expect(openingCandidateFromShape).toBeTypeOf("function");
  });
  it("should have function collectOpeningCandidates defined", () => {
    expect(collectOpeningCandidates).toBeTypeOf("function");
  });
  it("should have function checkOpeningPlacementOnWall defined", () => {
    expect(checkOpeningPlacementOnWall).toBeTypeOf("function");
  });
});