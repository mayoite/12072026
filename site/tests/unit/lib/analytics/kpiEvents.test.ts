import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  trackKpiRendered,
  trackKpiFallbackUsed,
  trackKpiMismatchDetected,
  compareKpiField,
} from "@/lib/analytics/kpiEvents";

describe("kpiEvents", () => {
  let mockTrack: any;

  beforeEach(() => {
    mockTrack = vi.fn();
    vi.stubGlobal("window", {
      va: {
        track: mockTrack,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls track when trackKpiRendered is called", () => {
    trackKpiRendered({ asOfDate: "2026-06-26", source: "supabase" });
    expect(mockTrack).toHaveBeenCalledWith("kpi_rendered", {
      asOfDate: "2026-06-26",
      source: "supabase",
    });
  });

  it("calls track when trackKpiFallbackUsed is called", () => {
    trackKpiFallbackUsed({ source: "local" });
    expect(mockTrack).toHaveBeenCalledWith("kpi_fallback_used", {
      source: "local",
    });
  });

  it("calls track when trackKpiMismatchDetected is called", () => {
    trackKpiMismatchDetected({ page: "home", field: "revenue", expected: 100, actual: 90 });
    expect(mockTrack).toHaveBeenCalledWith("kpi_mismatch_detected", {
      page: "home",
      field: "revenue",
      expected: 100,
      actual: 90,
    });
  });

  it("compares KPI fields and calls track if mismatch is detected", () => {
    compareKpiField("home", "revenue", 90, 100);
    expect(mockTrack).toHaveBeenCalledWith("kpi_mismatch_detected", {
      page: "home",
      field: "revenue",
      expected: 100,
      actual: 90,
    });

    mockTrack.mockClear();
    compareKpiField("home", "revenue", 100, 100);
    expect(mockTrack).not.toHaveBeenCalled();
  });
});
