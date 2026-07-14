import { describe, expect, it } from "vitest";
import type {
  PlannerExportMeta,
  PlannerItemPlacement,
  PlannerRoomConfig,
  PlannerSaveState,
  UnitSystem,
} from "@/features/planner/shared/types";

describe("shared/types index", () => {
  it("exports placement and room config shapes", () => {
    const room: PlannerRoomConfig = { widthMm: 6000, depthMm: 4000, wallHeightMm: 3000 };
    const unit: UnitSystem = "metric";
    const placement: PlannerItemPlacement = {
      id: "p1",
      catalogId: "desk-1",
      name: "Desk",
      category: "desks",
      x: 0,
      y: 0,
      rotationDeg: 0,
      widthMm: 1200,
      depthMm: 600,
      heightMm: 750,
      catalogMeshType: "desk-rect",
    };
    expect(room.widthMm).toBe(6000);
    expect(unit).toBe("metric");
    expect(placement.catalogMeshType).toBe("desk-rect");
  });

  it("exports save state and export meta", () => {
    const states: PlannerSaveState[] = ["idle", "saving", "saved", "error"];
    const meta: PlannerExportMeta = {
      projectName: "HQ",
      roomWidthMm: 6000,
      roomDepthMm: 4000,
      generatedAt: "2026-07-13T12:00:00.000Z",
    };
    expect(states).toContain("saved");
    expect(meta.projectName).toBe("HQ");
  });
});
