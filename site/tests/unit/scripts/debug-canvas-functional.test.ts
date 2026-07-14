// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  PLANNER_GUEST_URL,
  VIEWPORT,
  formatConsoleLine,
  runCanvasFunctionalDebug,
  shouldCaptureConsoleType,
} from "../../../scripts/debug-canvas-functional.mjs";

function mockPlaywrightPage(layout = { objects: 0, canvas: { w: 800, h: 600 } }) {
  const handlers: Record<string, Array<(...args: unknown[]) => void>> = {};
  const page = {
    on: vi.fn((event: string, cb: (...args: unknown[]) => void) => {
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(cb);
    }),
    goto: vi.fn(async () => undefined),
    getByRole: vi.fn(() => ({
      count: async () => 0,
      click: async () => undefined,
    })),
    waitForSelector: vi.fn(async () => undefined),
    waitForTimeout: vi.fn(async () => undefined),
    evaluate: vi.fn(async () => layout),
    locator: vi.fn(() => ({
      count: async () => 0,
      first: () => ({ click: async () => undefined }),
      boundingBox: async () => ({ x: 0, y: 0, width: 800, height: 600 }),
    })),
    mouse: {
      move: vi.fn(async () => undefined),
      down: vi.fn(async () => undefined),
      up: vi.fn(async () => undefined),
    },
  };
  const browser = {
    newPage: vi.fn(async () => page),
    close: vi.fn(async () => undefined),
  };
  const chromium = { launch: vi.fn(async () => browser) };
  return { chromium, browser, page, handlers };
}

describe("debug-canvas-functional (name-mirror)", () => {
  it("captures error and warning console types", () => {
    expect(shouldCaptureConsoleType("error")).toBe(true);
    expect(shouldCaptureConsoleType("warning")).toBe(true);
    expect(shouldCaptureConsoleType("log")).toBe(false);
    expect(formatConsoleLine("error", "x".repeat(600)).length).toBeLessThanOrEqual(
      "error: ".length + 500,
    );
  });

  it("targets guest planner URL and desktop viewport", () => {
    expect(PLANNER_GUEST_URL).toContain("/planner/guest");
    expect(VIEWPORT).toEqual({ width: 1440, height: 900 });
  });

  it("runs layout probe with mocked chromium (no network)", async () => {
    const { chromium, browser, page } = mockPlaywrightPage({
      objects: 2,
      canvas: { w: 1000, h: 700 },
    });
    const log = vi.fn();
    const result = await runCanvasFunctionalDebug({ chromium, log, url: PLANNER_GUEST_URL });
    expect(chromium.launch).toHaveBeenCalledOnce();
    expect(page.goto).toHaveBeenCalledWith(PLANNER_GUEST_URL, { timeout: 90000 });
    expect(result.layout.objects).toBe(2);
    expect(browser.close).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith("LAYOUT", expect.any(String));
  });
});
