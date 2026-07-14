import { describe, expect, it } from "vitest";
import type { ExportFormat, ExportLayout } from "@/features/planner/shared/export/types";

describe("shared/export/types", () => {
  it("accepts ExportLayout with required room and project fields", () => {
    const layout: ExportLayout = {
      projectName: "HQ",
      roomWidthMm: 6000,
      roomDepthMm: 4000,
      unitSystem: "metric",
      generatedAt: "2026-07-13T12:00:00.000Z",
      clientName: "Acme",
    };
    expect(layout.roomWidthMm * layout.roomDepthMm).toBe(24_000_000);
    expect(layout.unitSystem).toBe("metric");
  });

  it("allows known export formats", () => {
    const formats: ExportFormat[] = ["pdf", "csv", "json"];
    expect(formats).toContain("csv");
    expect(formats).toHaveLength(3);
  });
});
