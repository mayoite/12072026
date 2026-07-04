import { describe, expect, it, vi } from "vitest";
import { buildPlannerDocumentFromFabric, getFabricSnapshotFromDocument, loadPlannerDocumentIntoFabric } from "@/features/planner/lib/fabricDocumentBridge";

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

describe("fabricDocumentBridge", () => {
  it("should have function buildPlannerDocumentFromFabric defined", () => {
    expect(buildPlannerDocumentFromFabric).toBeTypeOf("function");
  });
  it("should have function getFabricSnapshotFromDocument defined", () => {
    expect(getFabricSnapshotFromDocument).toBeTypeOf("function");
  });
  it("should have function loadPlannerDocumentIntoFabric defined", () => {
    expect(loadPlannerDocumentIntoFabric).toBeTypeOf("function");
  });
});