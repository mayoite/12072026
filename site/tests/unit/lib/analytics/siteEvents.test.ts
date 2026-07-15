import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  trackSiteCtaClick,
  trackPlannerLaunchClicked,
  trackSiteSearchSubmitted,
  trackSitePageView,
  _trackCompareToggled,
  _trackQuoteCartAdded,
  _trackContactSubmission,
} from "@/lib/analytics/siteEvents";
import { CONSENT_ACCEPTED, CONSENT_COOKIE } from "@/lib/consent";
import { clearConversionDedupe } from "@/lib/analytics/conversionContract";

describe("siteEvents", () => {
  const mockTrack = vi.fn();

  beforeEach(() => {
    mockTrack.mockClear();
    clearConversionDedupe();
    vi.stubGlobal("window", {
      va: {
        track: mockTrack,
      },
    });
    document.cookie = `${CONSENT_COOKIE}=${CONSENT_ACCEPTED}; path=/`;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; path=/`;
    clearConversionDedupe();
  });

  it("does not emit when analytics consent is missing", () => {
    document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; path=/`;
    trackSiteCtaClick({
      href: "/contact",
      label: "Contact",
      pathname: "/home",
      surface: "hero",
    });
    expect(mockTrack).not.toHaveBeenCalled();
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
    trackPlannerLaunchClicked({
      sourcePage: "/home",
      surface: "hero",
      productSlug: "chair",
      categoryId: "seating",
    });
    expect(mockTrack).toHaveBeenCalledWith("planner_launch_clicked", {
      pathname: "/home",
      surface: "hero",
      productSlug: "chair",
      categoryId: "seating",
    });
    expect(mockTrack).toHaveBeenCalledWith(
      "planner_entry",
      expect.objectContaining({
        sourcePage: "/home",
        locale: "en",
      }),
    );

    trackSiteSearchSubmitted({
      pathname: "/home",
      surface: "header",
      queryLength: 5,
      destination: "/search",
    });
    expect(mockTrack).toHaveBeenCalledWith("site_search_submitted", {
      pathname: "/home",
      surface: "header",
      queryLength: 5,
      destination: "/search",
    });

    _trackCompareToggled({
      pathname: "/products",
      surface: "grid",
      categoryId: "seating",
      productId: "chair",
      nextState: "added",
    });
    expect(mockTrack).toHaveBeenCalledWith("compare_toggled", expect.any(Object));

    _trackQuoteCartAdded({
      pathname: "/products",
      surface: "pdp",
      productId: "chair",
    });
    expect(mockTrack).toHaveBeenCalledWith("quote_cart_added", expect.any(Object));

    _trackContactSubmission({
      pathname: "/contact",
      surface: "form",
      source: "contact-page",
      status: "success",
    });
    expect(mockTrack).toHaveBeenCalledWith("contact_submission", expect.any(Object));
  });

  it("emits consent-gated page_view conversion events", () => {
    trackSitePageView({
      pathname: "/about",
      locale: "en",
      referrer: "https://google.com",
    });
    expect(mockTrack).toHaveBeenCalledWith("page_view", {
      pathname: "/about",
      locale: "en",
      referrer: "https://google.com",
    });
  });
});