import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildPlannerDocumentFromEditor } from "@/features/planner/document/plannerDocumentBridge";
import { getPlannerFabricRuntime } from "@/features/planner/canvas-fabric";

vi.mock("@/features/planner/model/plannerDocument", () => ({
  createEmptyPlannerDocument: vi.fn().mockImplementation((val) => val),
}));

vi.mock("@/features/planner/model/plannerJsonSafe", () => ({
  toPlannerJsonSafe: vi.fn().mockImplementation((val) => val),
}));

vi.mock("@/features/planner/canvas-fabric", () => ({
  getPlannerFabricRuntime: vi.fn(),
}));

vi.mock("@/features/planner/editor/planMetrics", () => ({
  getPageMetrics: vi.fn().mockReturnValue({ totalFloorAreaSqm: 100 }),
}));

vi.mock("@/features/planner/onboarding/projectSetup", () => ({
  metadataToDocumentFields: vi.fn().mockReturnValue({ roomWidthMm: 5000, roomDepthMm: 7000 }),
}));

vi.mock("@/features/planner/lib/fabricDocumentBridge", () => ({
  buildPlannerDocumentFromFabric: vi.fn().mockReturnValue({
    name: "Mock Doc",
    unitSystem: "mm",
    itemCount: 3,
    sceneJson: {},
  }),
}));

vi.mock("../store/workspaceStore", () => ({
  serializeWorkspaceState: vi.fn().mockReturnValue({ unitSystem: "metric" }),
  usePlannerWorkspaceStore: {
    getState: vi.fn().mockReturnValue({
      projectMetadata: { projectName: "Sample Proj" },
    }),
  },
}));

describe("plannerDocumentBridge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds PlannerDocument successfully from editor state", () => {
    vi.mocked(getPlannerFabricRuntime).mockReturnValue({
      exportDraft: () => '{"objects": []}',
    } as any);

    const doc = buildPlannerDocumentFromEditor(null, { title: "Custom Title" });
    expect(doc.title).toBe("Custom Title");
    expect(doc.itemCount).toBe(3);
    expect(doc.roomWidthMm).toBe(10000); // from square root of totalFloorAreaSqm 100 sqm = 10m = 10000mm
  });
});
