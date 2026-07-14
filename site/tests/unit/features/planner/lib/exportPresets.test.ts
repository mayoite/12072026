import { describe, expect, it } from "vitest";
import {
  EXPORT_PRESETS,
  getExportPreset,
  type ExportPresetId,
} from "@/features/planner/lib/exportPresets";

describe("exportPresets", () => {
  it("defines three branded presets", () => {
    const ids = Object.keys(EXPORT_PRESETS) as ExportPresetId[];
    expect(ids).toEqual(
      expect.arrayContaining(["proposal", "technical", "client-presentation"]),
    );
  });

  it("returns preset by id", () => {
    expect(getExportPreset("proposal").showLogo).toBe(true);
    expect(getExportPreset("technical").colorScheme).toBe("monochrome");
    expect(getExportPreset("client-presentation").paperSize).toBe(
      "A4-landscape",
    );
  });
});
