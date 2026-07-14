// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

function thenable<T>(value: T) {
  return {
    then: (resolve: (v: T) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve(value).then(resolve, reject),
    catch: (fn: (e: unknown) => unknown) => Promise.resolve(value).catch(fn),
  };
}

const evaluate = vi.fn(async () => "rgba(0,0,0,0)");
const isVisible = vi.fn(async () => true);
const count = vi.fn(async () => 4);
const textContent = vi.fn(() => thenable("Guided"));
const filter = vi.fn(() => ({ textContent }));
const first = vi.fn(() => ({
  isVisible,
  evaluate,
}));
const locator = vi.fn(() => ({
  evaluate,
  first,
  count,
  filter,
  isVisible,
}));
const screenshot = vi.fn(async () => undefined);
const setViewportSize = vi.fn(async () => undefined);
const goto = vi.fn(async () => undefined);
const waitForTimeout = vi.fn(async () => undefined);
const pageEvaluate = vi.fn(async () => "rgb(255, 255, 255)");
const close = vi.fn(async () => undefined);
const newPage = vi.fn(async () => ({
  setViewportSize,
  goto,
  waitForTimeout,
  screenshot,
  locator,
  evaluate: pageEvaluate,
}));
const launch = vi.fn(async () => ({
  newPage,
  close,
}));

vi.mock("playwright", () => ({
  chromium: {
    launch: (...args: unknown[]) => launch(...args),
  },
}));

describe("check-header (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("launches playwright, captures screenshots, and closes the browser", async () => {
    await import("../../../scripts/check-header.mjs");

    expect(launch).toHaveBeenCalledWith({ headless: true });
    expect(setViewportSize).toHaveBeenCalledWith({ width: 1440, height: 900 });
    expect(goto).toHaveBeenCalledWith("http://localhost:3000", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    expect(screenshot).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
