// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const screenshot = vi.fn(async () => undefined);
const goto = vi.fn(async () => undefined);
const waitForTimeout = vi.fn(async () => undefined);
const pageClose = vi.fn(async () => undefined);
const browserClose = vi.fn(async () => undefined);
const newPage = vi.fn(async () => ({
  goto,
  waitForTimeout,
  screenshot,
  close: pageClose,
}));
const launch = vi.fn(async () => ({ newPage, close: browserClose }));

vi.mock("playwright", () => ({
  chromium: { launch },
}));

vi.mock("fs", async () => {
  const actual = await vi.importActual("fs") as Record<string, unknown> & { readFileSync?: (...args: never[]) => unknown; default?: unknown };
  return {
    ...actual,
    mkdirSync: vi.fn(),
  };
});

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/capture-responsive.mjs");

describe("capture-responsive (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("captures home and planner across four viewports", async () => {
    await import(pathToFileURL(scriptPath).href);

    expect(launch).toHaveBeenCalledTimes(1);
    // 2 pages × 4 viewports
    expect(newPage).toHaveBeenCalledTimes(8);
    expect(goto).toHaveBeenCalledWith("http://localhost:3000/", {
      waitUntil: "networkidle",
    });
    expect(goto).toHaveBeenCalledWith("http://localhost:3000/planner", {
      waitUntil: "networkidle",
    });
    expect(screenshot).toHaveBeenCalledWith({
      path: "results/responsive/home-mobile.png",
      fullPage: true,
    });
    expect(screenshot).toHaveBeenCalledWith({
      path: "results/responsive/planner-desktop.png",
      fullPage: true,
    });
    expect(pageClose).toHaveBeenCalledTimes(8);
    expect(browserClose).toHaveBeenCalledTimes(1);
  });
});
