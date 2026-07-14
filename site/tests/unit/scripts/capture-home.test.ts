// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const screenshot = vi.fn(async () => undefined);
const scrollIntoViewIfNeeded = vi.fn(async () => undefined);
const click = vi.fn(async () => undefined);
const goto = vi.fn(async () => undefined);
const waitForTimeout = vi.fn(async () => undefined);
const close = vi.fn(async () => undefined);
const locator = vi.fn(() => ({ scrollIntoViewIfNeeded }));
const newPage = vi.fn(async () => ({
  goto,
  waitForTimeout,
  screenshot,
  locator,
  click,
}));
const launch = vi.fn(async () => ({ newPage, close }));

vi.mock("playwright", () => ({
  chromium: { launch },
}));

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/capture-home.mjs");

describe("capture-home (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("launches chromium, captures three homepage screenshots, then closes", async () => {
    await import(pathToFileURL(scriptPath).href);

    expect(launch).toHaveBeenCalledTimes(1);
    expect(newPage).toHaveBeenCalledWith({
      viewport: { width: 1440, height: 900 },
    });
    expect(goto).toHaveBeenCalledWith("http://localhost:3000", {
      waitUntil: "networkidle",
    });
    expect(screenshot).toHaveBeenCalledWith({ path: "results/home-hero.png" });
    expect(screenshot).toHaveBeenCalledWith({ path: "results/home-contact.png" });
    expect(screenshot).toHaveBeenCalledWith({
      path: "results/home-quick-contact.png",
    });
    expect(click).toHaveBeenCalledWith('button[aria-label="Open quick contact"]');
    expect(close).toHaveBeenCalledTimes(1);
  });
});
