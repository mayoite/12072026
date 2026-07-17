// @vitest-environment node
import { describe, expect, it } from "vitest";

import {
  normalizePlannerExportContentType,
  PLANNER_CLOUD_EXPORT_CONTENT_TYPES,
} from "@/features/planner/export/plannerCloudExportContentType";

describe("plannerCloudExportContentType (name-mirror)", () => {
  it("exports a fixed allowlist without HTML or script MIME types", () => {
    expect(PLANNER_CLOUD_EXPORT_CONTENT_TYPES).toEqual([
      "application/json",
      "text/plain",
      "text/csv",
      "application/csv",
    ]);
    expect(PLANNER_CLOUD_EXPORT_CONTENT_TYPES).not.toContain("text/html");
    expect(PLANNER_CLOUD_EXPORT_CONTENT_TYPES).not.toContain("application/javascript");
  });

  it("defaults empty/missing input to application/json", () => {
    expect(normalizePlannerExportContentType(undefined)).toBe("application/json");
    expect(normalizePlannerExportContentType(null)).toBe("application/json");
    expect(normalizePlannerExportContentType("")).toBe("application/json");
    expect(normalizePlannerExportContentType("   ")).toBe("application/json");
  });

  it("accepts allowlisted types and strips charset parameters", () => {
    expect(normalizePlannerExportContentType("text/csv;charset=utf-8")).toBe("text/csv");
    expect(normalizePlannerExportContentType("Application/JSON")).toBe("application/json");
    expect(normalizePlannerExportContentType("text/plain")).toBe("text/plain");
    expect(normalizePlannerExportContentType("application/csv")).toBe("application/csv");
  });

  it("rejects XSS-prone and unknown content types", () => {
    expect(normalizePlannerExportContentType("text/html")).toBeNull();
    expect(normalizePlannerExportContentType("image/svg+xml")).toBeNull();
    expect(normalizePlannerExportContentType("application/javascript")).toBeNull();
    expect(normalizePlannerExportContentType("multipart/form-data")).toBeNull();
  });
});
