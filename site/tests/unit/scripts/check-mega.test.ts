// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const hover = vi.fn(async () => undefined);
const isVisible = vi.fn(async () => true);
const count = vi.fn(async () => 1);
const evaluate = vi.fn(async () => "none");
const catchEvaluate = vi.fn(async () => "none");
const locator = vi.fn((selector: string) => {
  if (selector === "header button[aria-controls=\"products-mega-menu\"]") {
    return { hover };
  }
  if (selector === "#products-mega-menu") {
    return {
      isVisible: Object.assign(isVisible, {
        catch: async () => false,
      }),
      count,
    };
  }
  return {
    evaluate: Object.assign(evaluate, { catch: catchEvaluate }),
  };
});
const screenshot = vi.fn(async () => undefined);
const setViewportSize = vi.fn(async () => undefined);
const goto = vi.fn(async () => undefined);
const close = vi.fn(async () => undefined);
const newPage = vi.fn(async () => ({
  setViewportSize,
  goto,
  locator,
  screenshot,
}));
const launch = vi.fn(async () => ({
  newPage,
  close,
}));
const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

vi.mock("playwright", () => ({
  chromium: {
    launch: (...args: unknown[]) => launch(...args),
  },
}));

describe("check-mega (name-mirror)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    exitSpy.mockClear();
  });

  it("hovers products mega menu, screenshots, and exits 0", async () => {
    await import("../../../scripts/check-mega.mjs");
    await vi.waitFor(() => {
      expect(exitSpy).toHaveBeenCalledWith(0);
    });

    expect(launch).toHaveBeenCalledWith({ headless: true });
    expect(goto).toHaveBeenCalledWith("http://localhost:3000", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    expect(hover).toHaveBeenCalled();
    expect(screenshot).toHaveBeenCalledWith({ path: "screenshots/mega-open.png" });
    expect(close).toHaveBeenCalled();
  });
});
