import { describe, expect, it, vi } from "vitest";
import { runPlannerComplianceCheck } from "@/features/planner/lib/compliance";

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

describe("compliance", () => {
  it("should have function runPlannerComplianceCheck defined", () => {
    expect(runPlannerComplianceCheck).toBeTypeOf("function");
    expect(runPlannerComplianceCheck.name.length).toBeGreaterThan(0);
  });

  it("does not silently claim a clean plan (points callers at live validation)", () => {
    const messages = runPlannerComplianceCheck(null, []);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toMatch(/runFloorValidation/i);
  });
});
