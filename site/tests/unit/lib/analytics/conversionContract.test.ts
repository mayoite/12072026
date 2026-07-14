import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  trackConversionEvent,
  filterEventPrivacy,
  SITE_EVENT_CONTRACT,
  CONVERSION_EVENTS,
  clearConversionDedupe,
  type ConversionEventName,
} from "@/lib/analytics/conversionContract";

describe("conversionContract", () => {
  let mockTrack: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clearConversionDedupe();
    mockTrack = vi.fn();
    vi.stubGlobal("window", { va: { track: mockTrack } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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
      geometry: { x: 1 },
      boqLines: [{ sku: "a" }],
      email: "user@example.com",
      name: "Jane",
    };

    const result = filterEventPrivacy(payload, { allowPersonalData: true });

    expect(result).not.toHaveProperty("geometry");
    expect(result).not.toHaveProperty("boqLines");
    expect(result).toHaveProperty("email", "user@example.com");
    expect(result).toHaveProperty("name", "Jane");
  });

  it("strips denylisted keys inside nested objects", () => {
    const payload = {
      locale: "en",
      nested: { geometry: { x: 1 }, keep: "value" },
      list: [{ boqLines: [1], ok: 2 }],
    };

    const result = filterEventPrivacy(payload) as {
      nested: { keep?: string };
      list: Array<{ ok?: number }>;
    };

    expect(result.nested).toEqual({ keep: "value" });
    expect(result.list[0]).toEqual({ ok: 2 });
  });

  it("covers all 9 funnel events in the contract", () => {
    const allEvents = Object.values(CONVERSION_EVENTS) as ConversionEventName[];
    const covered = Object.keys(SITE_EVENT_CONTRACT.events) as ConversionEventName[];

    expect(covered).toHaveLength(allEvents.length);
    for (const event of allEvents) {
      expect(covered).toContain(event);
      expect(SITE_EVENT_CONTRACT.events[event].requiredFields.length).toBeGreaterThan(0);
      expect(SITE_EVENT_CONTRACT.events[event].owner).toBeTruthy();
    }
    expect(SITE_EVENT_CONTRACT.funnelOrder).toEqual(allEvents);
  });
});
