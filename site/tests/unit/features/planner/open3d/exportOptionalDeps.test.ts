import { beforeEach, describe, expect, it, vi } from "vitest";

import { createRectangularRoomProject } from "@/features/planner/open3d/model/project";

vi.mock("jspdf", () => {
  throw new Error("jspdf missing");
});

vi.mock("dxf-writer", () => {
  throw new Error("dxf-writer missing");
});

import { exportAsDXF, exportAsPDF } from "@/features/planner/open3d/shared/export/exportUtils";

function project() {
  return createRectangularRoomProject({
    name: "Optional Deps",
    widthMm: 4000,
    depthMm: 3000,
  });
}

describe("export optional dependency failures", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      scale: vi.fn(),
      fillRect: vi.fn(),
      strokeStyle: "",
      lineCap: "",
      lineWidth: 0,
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
  });

  it("returns null when jspdf and dxf-writer cannot be loaded", async () => {
    expect(await exportAsPDF(project())).toBeNull();
    expect(await exportAsDXF(project())).toBeNull();
  });
});
