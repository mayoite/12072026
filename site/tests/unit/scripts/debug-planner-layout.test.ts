// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  PLANNER_GUEST_URL,
  VIEWPORT,
  layoutSelectors,
  runPlannerLayoutDebug,
} from "../../../scripts/debug-planner-layout.mjs";

describe("debug-planner-layout (name-mirror)", () => {
  it("exposes workspace layout selectors", () => {
    const s = layoutSelectors();
    expect(s.canvas).toBe("#main");
    expect(s.grid).toBe(".fcw-workspace-grid");
    expect(s.canvasWrap).toBe(".canvas-wrap");
    expect(PLANNER_GUEST_URL).toBe("http://localhost:3000/planner/guest/");
    expect(VIEWPORT).toEqual({ width: 1440, height: 900 });
  });

  it("collects layout via mocked browser", async () => {
    const layout = {
      grid: { w: 1200, h: 800 },
      canvas: { w: 900, h: 700 },
      kids: [],
      leftPanels: [],
    };
    const page = {
      goto: vi.fn(async () => undefined),
      getByRole: vi.fn(() => ({
        count: async () => 0,
        waitFor: async () => undefined,
        click: async () => undefined,
        first: () => ({ count: async () => 0, click: async () => undefined }),
      })),
      waitForSelector: vi.fn(async () => undefined),
      waitForTimeout: vi.fn(async () => undefined),
      evaluate: vi.fn(async () => layout),
    };
    const browser = {
      newPage: vi.fn(async () => page),
      close: vi.fn(async () => undefined),
    };
    const chromium = { launch: vi.fn(async () => browser) };
    const result = await runPlannerLayoutDebug({
      chromium,
      log: vi.fn(),
      url: PLANNER_GUEST_URL,
    });
    expect(page.goto).toHaveBeenCalledWith(
      PLANNER_GUEST_URL,
      expect.objectContaining({ waitUntil: "domcontentloaded" }),
    );
    expect(result.canvas?.w).toBe(900);
    expect(browser.close).toHaveBeenCalledOnce();
  });
});
