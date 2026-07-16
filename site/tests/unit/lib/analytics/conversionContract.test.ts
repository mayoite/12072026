import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockTrack = vi.fn();
vi.mock("@vercel/analytics", () => ({
  track: (...args: unknown[]) => mockTrack(...args),
}));

import {
  trackConversionEvent,
  filterEventPrivacy,
  SITE_EVENT_CONTRACT,
  CONVERSION_EVENTS,
  clearConversionDedupe,
  type ConversionEventName,
} from "@/lib/analytics/conversionContract";
import { CONSENT_ACCEPTED, CONSENT_COOKIE } from "@/lib/consent";
import { _clearSiteEventQueueForTests } from "@/lib/analytics/eventQueue";

describe("conversionContract", () => {
  beforeEach(() => {
    clearConversionDedupe();
    _clearSiteEventQueueForTests();
    mockTrack.mockClear();
    document.cookie = `${CONSENT_COOKIE}=${CONSENT_ACCEPTED}; path=/`;
    vi.stubGlobal("window", {
      va: vi.fn(),
      vaq: [],
      location: { protocol: "http:" },
    });
  });

  afterEach(() => {
    document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; path=/`;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    clearConversionDedupe();
    _clearSiteEventQueueForTests();
  });

  it("does not emit or burn dedupe when consent is missing", () => {
    document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; path=/`;
    const fields = { pathname: "/home", locale: "en" };

    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);
    expect(mockTrack).not.toHaveBeenCalled();

    document.cookie = `${CONSENT_COOKIE}=${CONSENT_ACCEPTED}; path=/`;
    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);
    expect(mockTrack).toHaveBeenCalledTimes(1);
  });

  it("dedupes PAGE_VIEW within TTL and does not double-emit", () => {
    const fields = { pathname: "/home", locale: "en" };

    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);
    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);
    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);

    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith(CONVERSION_EVENTS.PAGE_VIEW, {
      pathname: "/home",
      locale: "en",
    });
  });

  it("re-fires PAGE_VIEW after the dedupe TTL expires", () => {
    vi.useFakeTimers();
    const fields = { pathname: "/home", locale: "en" };

    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);
    vi.advanceTimersByTime(31_000);
    trackConversionEvent(CONVERSION_EVENTS.PAGE_VIEW, fields);

    expect(mockTrack).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("filters geometry, boqLines and personal fields by default", () => {
    const payload = {
      pathname: "/p",
      locale: "en",
      geometry: { x: 1 },
      boqLines: [{ sku: "a" }],
      email: "user@example.com",
      name: "Jane",
    };

    const result = filterEventPrivacy(payload);

    expect(result).not.toHaveProperty("geometry");
    expect(result).not.toHaveProperty("boqLines");
    expect(result).not.toHaveProperty("email");
    expect(result).not.toHaveProperty("name");
    expect(result).toHaveProperty("pathname", "/p");
    expect(result).toHaveProperty("locale", "en");
  });

  it("keeps email/name only when allowPersonalData is true", () => {
    const payload = {
      pathname: "/p",
      locale: "en",
      email: "user@example.com",
      name: "Jane",
    };

    const result = filterEventPrivacy(payload, { allowPersonalData: true });
    expect(result).toHaveProperty("email", "user@example.com");
    expect(result).toHaveProperty("name", "Jane");
  });

  it("covers all 9 funnel events in the contract", () => {
    expect(SITE_EVENT_CONTRACT.funnelOrder).toHaveLength(9);
    for (const name of SITE_EVENT_CONTRACT.funnelOrder) {
      expect(SITE_EVENT_CONTRACT.events[name as ConversionEventName]).toBeDefined();
    }
  });
});
