// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_PLANNER_URL,
  runWallResizeDebug,
  wallDragPoints,
} from "../../../scripts/debug-wall-resize.mjs";

describe("debug-wall-resize (name-mirror)", () => {
  it("computes vertical wall drag from canvas box", () => {
    expect(wallDragPoints(null)).toBeNull();
    expect(wallDragPoints({ x: 0, y: 0, width: 5, height: 5 })).toBeNull();
    const pts = wallDragPoints({ x: 100, y: 50, width: 400, height: 300 });
    expect(pts).toEqual({
      x1: 100 + 400 * 0.5,
      y1: 50 + 300 * 0.12,
      x2: 100 + 400 * 0.5,
      y2: 50 + 300 * 0.12 + 40,
    });
    expect(DEFAULT_PLANNER_URL).toContain("/planner/guest");
  });

  it("drags wall with mocked playwright (no network)", async () => {
    const before = [{ top: 10, left: 20 }];
    const after = [{ top: 50, left: 20 }];
    let evaluateCalls = 0;
    const page = {
      goto: vi.fn(async () => undefined),
      getByRole: vi.fn(() => ({ count: async () => 0, click: async () => undefined })),
      waitForSelector: vi.fn(async () => undefined),
      waitForTimeout: vi.fn(async () => undefined),
      locator: vi.fn((sel: string) => {
        if (sel.includes("Edit room")) {
          return { count: async () => 0, first: () => ({ click: async () => undefined }) };
        }
        return {
          boundingBox: async () => ({ x: 0, y: 0, width: 800, height: 600 }),
        };
      }),
      evaluate: vi.fn(async () => {
        evaluateCalls += 1;
        return evaluateCalls === 1 ? before : after;
      }),
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
    const result = await runWallResizeDebug({
      chromium,
      log: vi.fn(),
      url: DEFAULT_PLANNER_URL,
      exit: vi.fn(),
    });
    expect(result.ok).toBe(true);
    expect(result.before).toEqual(before);
    expect(result.after).toEqual(after);
    expect(page.mouse.down).toHaveBeenCalled();
    expect(browser.close).toHaveBeenCalledOnce();
  });
});
