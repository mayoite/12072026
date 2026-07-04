import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  trackSiteCtaClick,
  trackPlannerLaunchClicked,
  trackSiteSearchSubmitted,
  _trackCompareToggled,
  _trackQuoteCartAdded,
  _trackContactSubmission,
} from "@/lib/analytics/siteEvents";

describe("siteEvents", () => {
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

  it("emits events correctly based on href category", () => {
    trackSiteCtaClick({
      href: "/downloads/pdf",
      label: "Download",
      pathname: "/home",
      surface: "hero",
    });
    expect(mockTrack).toHaveBeenCalledWith("resource_desk_clicked", {
      href: "/downloads/pdf",
      label: "Download",
      pathname: "/home",
      surface: "hero",
    });

    trackSiteCtaClick({
      href: "https://wa.me/something",
      label: "WhatsApp",
      pathname: "/home",
      surface: "hero",
    });
    expect(mockTrack).toHaveBeenCalledWith("whatsapp_contact_clicked", {
      href: "https://wa.me/something",
      label: "WhatsApp",
      pathname: "/home",
      surface: "hero",
    });
  });

  it("tracks launch, search, compare, quote and contact events", () => {
    trackPlannerLaunchClicked({ pathname: "/home", surface: "hero" });
    expect(mockTrack).toHaveBeenCalledWith("planner_launch_clicked", { pathname: "/home", surface: "hero" });

    trackSiteSearchSubmitted({ pathname: "/home", surface: "header", queryLength: 5, destination: "/search" });
    expect(mockTrack).toHaveBeenCalledWith("site_search_submitted", { pathname: "/home", surface: "header", queryLength: 5, destination: "/search" });
  });
});
