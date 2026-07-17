// @vitest-environment node
/**
 * Name-mirror: scripts/take-planner-screenshot.mjs
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { describe, expect, it, vi } from "vitest";
import {
  OPEN_LIBRARY_RE,
  PLANNER_GUEST_PATH,
  PLANNER_SCREENSHOT_FILENAME,
  PLANNER_SCREENSHOT_VIEWPORT,
  START_PLACING_RE,
  WORKSPACE_SELECTOR,
  plannerGuestUrl,
  resolveScreenshotOutDir,
  resolveScreenshotOutPath,
  takePlannerScreenshot,
} from "../../../scripts/take-planner-screenshot.mjs";

describe("take-planner-screenshot (name-mirror)", () => {
  it("builds guest URL and screenshot output paths", () => {
    expect(PLANNER_GUEST_PATH).toBe("/planner/guest");
    expect(plannerGuestUrl("http://localhost:3000")).toBe(
      "http://localhost:3000/planner/guest",
    );
    expect(PLANNER_SCREENSHOT_VIEWPORT).toEqual({ width: 1440, height: 900 });
    expect(START_PLACING_RE.test("Open planner")).toBe(true);
    expect(OPEN_LIBRARY_RE.test("Open library panel")).toBe(true);
    expect(WORKSPACE_SELECTOR).toContain(".pw-workspace");
    const outDir = resolveScreenshotOutDir("E:/repo");
    expect(outDir.replace(/\\/g, "/")).toMatch(/results\/screenshots$/);
    expect(path.basename(resolveScreenshotOutPath("E:/repo"))).toBe(
      PLANNER_SCREENSHOT_FILENAME,
    );
  });

  it("drives a mocked browser to capture a screenshot", async () => {
    const screenshot = vi.fn(async () => undefined);
    const waitForTimeout = vi.fn(async () => undefined);
    const waitForSelector = vi.fn(async () => undefined);
    const goto = vi.fn(async () => undefined);
    const click = vi.fn(async () => undefined);
    const count = vi.fn(async () => 1);
    const first = vi.fn(() => ({ click, count }));
    const getByRole = vi.fn(() => ({ first }));
    const newPage = vi.fn(async () => ({
      goto,
      waitForTimeout,
      waitForSelector,
      getByRole,
      screenshot,
    }));
    const close = vi.fn(async () => undefined);
    const browserFactory = vi.fn(async () => ({ newPage, close }));

    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "planner-shot-"));
    try {
      const out = await takePlannerScreenshot({
        outDir,
        base: "http://example.test",
        browserFactory,
      });

      expect(goto).toHaveBeenCalledWith("http://example.test/planner/guest", expect.any(Object));
      expect(screenshot).toHaveBeenCalled();
      expect(close).toHaveBeenCalled();
      expect(path.basename(out)).toBe(PLANNER_SCREENSHOT_FILENAME);
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });
});
