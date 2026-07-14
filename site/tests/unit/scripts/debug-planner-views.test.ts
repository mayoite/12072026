// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  PLANNER_GUEST_URL,
  SCREENSHOT_DIR,
  formatConsoleLine,
  runPlannerViewsDebug,
  shouldCaptureConsoleType,
} from "../../../scripts/debug-planner-views.mjs";

describe("debug-planner-views (name-mirror)", () => {
  it("formats console capture helpers", () => {
    expect(shouldCaptureConsoleType("warning")).toBe(true);
    expect(shouldCaptureConsoleType("info")).toBe(false);
    expect(formatConsoleLine("error", "boom", 4)).toBe("error: boom");
    expect(SCREENSHOT_DIR).toBe("screenshots");
    expect(PLANNER_GUEST_URL).toContain("/planner/guest");
  });

  it("reads active view state with mocked chromium", async () => {
    const state = { activeView: "2D", has2d: true, has3d: true };
    const page = {
      on: vi.fn(),
      goto: vi.fn(async () => undefined),
      waitForTimeout: vi.fn(async () => undefined),
      getByRole: vi.fn(() => ({
        waitFor: async () => undefined,
        click: async () => undefined,
        first: () => ({
          count: async () => 0,
          click: async () => undefined,
        }),
      })),
      waitForSelector: vi.fn(async () => undefined),
      evaluate: vi.fn(async () => state),
    };
    const browser = {
      newPage: vi.fn(async () => page),
      close: vi.fn(async () => undefined),
    };
    const chromium = { launch: vi.fn(async () => browser) };
    const mkdir = vi.fn();
    const result = await runPlannerViewsDebug({
      chromium,
      mkdir,
      log: vi.fn(),
      url: PLANNER_GUEST_URL,
    });
    expect(mkdir).toHaveBeenCalledWith("screenshots", { recursive: true });
    expect(page.goto).toHaveBeenCalledWith(
      PLANNER_GUEST_URL,
      expect.objectContaining({ timeout: 120000 }),
    );
    expect(result.state.activeView).toBe("2D");
    expect(result.state.has3d).toBe(true);
  });
});
