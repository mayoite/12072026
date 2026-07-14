// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  PLANNER_URL,
  VIEWPORT,
  runZoomDebug,
  zoomDelta,
} from "../../../scripts/debug-zoom.mjs";

describe("debug-zoom (name-mirror)", () => {
  it("computes zoom label deltas", () => {
    expect(zoomDelta("100%", "125%")).toBe(25);
    expect(zoomDelta("bad", "100%")).toBeNull();
    expect(PLANNER_URL).toContain("plannerDevTools=1");
    expect(VIEWPORT.height).toBe(900);
  });

  it("clicks zoom controls with mocked browser", async () => {
    const reads = [
      { w: 800, h: 600, label: "100%" },
      { w: 800, h: 600, label: "110%" },
      { w: 800, h: 600, label: "120%" },
    ];
    let i = 0;
    const page = {
      goto: vi.fn(async () => undefined),
      getByRole: vi.fn(() => ({
        isVisible: async () => false,
        count: async () => 0,
        click: async () => undefined,
        first: () => ({ count: async () => 0, click: async () => undefined }),
      })),
      locator: vi.fn((sel: string) => {
        if (sel === "#project-setup-name") {
          return { fill: async () => undefined };
        }
        if (sel.includes("Zoom in")) {
          return { click: vi.fn(async () => undefined) };
        }
        return { click: async () => undefined, count: async () => 0, first: () => ({}) };
      }),
      waitForSelector: vi.fn(async () => undefined),
      waitForTimeout: vi.fn(async () => undefined),
      evaluate: vi.fn(async () => reads[i++] ?? reads[reads.length - 1]),
    };
    const ctx = {
      addInitScript: vi.fn(async () => undefined),
      newPage: vi.fn(async () => page),
    };
    const browser = {
      newContext: vi.fn(async () => ctx),
      close: vi.fn(async () => undefined),
    };
    const chromium = { launch: vi.fn(async () => browser) };
    const result = await runZoomDebug({
      chromium,
      log: vi.fn(),
      url: PLANNER_URL,
    });
    expect(page.goto).toHaveBeenCalledWith(
      PLANNER_URL,
      expect.objectContaining({ waitUntil: "domcontentloaded" }),
    );
    expect(result.before.label).toBe("100%");
    expect(result.afterTwo.label).toBe("120%");
    expect(zoomDelta(result.before.label, result.afterTwo.label)).toBe(20);
    expect(browser.close).toHaveBeenCalledOnce();
  });
});
