// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const repoRoot = path.resolve(siteRoot, "..");
const outDir = path.join(repoRoot, "results/planner/benchmark-quality");
const jsonPath = path.join(outDir, "console-capture.json");
const scriptPath = path.join(siteRoot, "scripts/capture-planner-console.mjs");

function makeLocator() {
  const loc: {
    first: () => typeof loc;
    filter: () => typeof loc;
    click: ReturnType<typeof vi.fn>;
    fill: ReturnType<typeof vi.fn>;
    isVisible: ReturnType<typeof vi.fn>;
  } = {
    first() {
      return loc;
    },
    filter() {
      return loc;
    },
    click: vi.fn(async () => undefined),
    fill: vi.fn(async () => undefined),
    isVisible: vi.fn(async () => false),
  };
  return loc;
}

const page = {
  on: vi.fn(),
  goto: vi.fn(async () => undefined),
  waitForTimeout: vi.fn(async () => undefined),
  screenshot: vi.fn(async () => undefined),
  getByRole: vi.fn(() => makeLocator()),
  locator: vi.fn(() => makeLocator()),
};

const browserClose = vi.fn(async () => undefined);
const launch = vi.fn(async () => ({
  newPage: vi.fn(async () => page),
  close: browserClose,
}));

vi.mock("@playwright/test", () => ({
  chromium: { launch },
}));

const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

describe("capture-planner-console (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
    process.env.PLAYWRIGHT_BASE_URL = "http://localhost:3000";
    if (fs.existsSync(jsonPath)) fs.rmSync(jsonPath, { force: true });
  });

  it("visits open3d and guest routes, writes console-capture.json, exits 0 when clean", async () => {
    await import(pathToFileURL(scriptPath).href);

    expect(launch).toHaveBeenCalledWith({ headless: true });
    expect(page.goto).toHaveBeenCalledWith(
      "http://localhost:3000/planner/canvas/?plannerDevTools=1",
      expect.objectContaining({ waitUntil: "domcontentloaded" }),
    );
    expect(page.goto).toHaveBeenCalledWith(
      "http://localhost:3000/planner/guest/?plannerDevTools=1",
      expect.objectContaining({ waitUntil: "domcontentloaded" }),
    );
    expect(page.screenshot).toHaveBeenCalled();

    await vi.waitFor(() => {
      expect(fs.existsSync(jsonPath)).toBe(true);
    });

    const payload = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as {
      errorCount: number;
      zeroConsoleErrors: boolean;
      baseURL: string;
      errors: unknown[];
    };
    expect(payload.baseURL).toBe("http://localhost:3000");
    expect(payload.errorCount).toBe(0);
    expect(payload.zeroConsoleErrors).toBe(true);
    expect(Array.isArray(payload.errors)).toBe(true);
    expect(exitSpy).toHaveBeenCalledWith(0);
    expect(browserClose).toHaveBeenCalled();
  });
});
