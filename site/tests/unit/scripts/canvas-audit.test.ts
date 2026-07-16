// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const logs: string[] = [];
const screenshots: string[] = [];

type AnyFn = (...args: unknown[]) => unknown;

function makeLocator(): Record<string, AnyFn> {
  const loc: Record<string, AnyFn> = {};
  const self = new Proxy(loc, {
    get(target, prop: string | symbol) {
      if (typeof prop === "symbol") return undefined;
      if (prop === "then") return undefined;
      if (prop in target) return target[prop];
      if (["first", "last", "nth", "filter", "locator", "and", "or"].includes(prop)) {
        const fn: AnyFn = () => self;
        target[prop] = fn;
        return fn;
      }
      if (prop === "count") {
        const fn = vi.fn(async () => 0);
        target[prop] = fn;
        return fn;
      }
      if (prop === "isVisible" || prop === "isHidden" || prop === "isEnabled") {
        const fn = vi.fn(async () => false);
        target[prop] = fn;
        return fn;
      }
      if (prop === "all") {
        const fn = vi.fn(async () => []);
        target[prop] = fn;
        return fn;
      }
      if (prop === "allTextContents") {
        const fn = vi.fn(async () => []);
        target[prop] = fn;
        return fn;
      }
      if (prop === "boundingBox") {
        const fn = vi.fn(async () => null);
        target[prop] = fn;
        return fn;
      }
      if (prop === "getAttribute") {
        const fn = vi.fn(async () => null);
        target[prop] = fn;
        return fn;
      }
      if (prop === "textContent" || prop === "innerText") {
        const fn = vi.fn(async () => "");
        target[prop] = fn;
        return fn;
      }
      const fn = vi.fn(async () => self);
      target[prop] = fn;
      return fn;
    },
  });
  return self;
}

const page = {
  on: vi.fn(),
  goto: vi.fn(async () => undefined),
  waitForTimeout: vi.fn(async () => undefined),
  waitForSelector: vi.fn(async () => undefined),
  waitForLoadState: vi.fn(async () => undefined),
  screenshot: vi.fn(async (opts: { path: string }) => {
    screenshots.push(opts.path);
  }),
  evaluate: vi.fn(async (fn: unknown) => {
    if (typeof fn === "function") {
      try {
        return (fn as () => unknown).call({
          __fabricExportDraft: () =>
            JSON.stringify({ objects: [] }),
        });
      } catch {
        return {};
      }
    }
    return {};
  }),
  locator: vi.fn(() => makeLocator()),
  getByRole: vi.fn(() => makeLocator()),
  getByText: vi.fn(() => makeLocator()),
  getByLabel: vi.fn(() => makeLocator()),
  getByTestId: vi.fn(() => makeLocator()),
  getByPlaceholder: vi.fn(() => makeLocator()),
  querySelector: vi.fn(() => null),
  mouse: {
    down: vi.fn(async () => undefined),
    up: vi.fn(async () => undefined),
    move: vi.fn(async () => undefined),
    click: vi.fn(async () => undefined),
  },
  keyboard: {
    press: vi.fn(async () => undefined),
    type: vi.fn(async () => undefined),
    down: vi.fn(async () => undefined),
    up: vi.fn(async () => undefined),
  },
  click: vi.fn(async () => undefined),
  fill: vi.fn(async () => undefined),
  setViewportSize: vi.fn(async () => undefined),
};

const context = {
  newPage: vi.fn(async () => page),
  addInitScript: vi.fn(async () => undefined),
  close: vi.fn(async () => undefined),
};

const browserClose = vi.fn(async () => undefined);
const launch = vi.fn(async () => ({
  newContext: vi.fn(async () => context),
  close: browserClose,
}));

vi.mock("@playwright/test", () => ({
  chromium: { launch },
}));

vi.mock("node:fs", async () => {
  const actual = await vi.importActual("node:fs") as Record<string, unknown> & { readFileSync?: (...args: never[]) => unknown; default?: unknown };
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

const logSpy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
  logs.push(args.map(String).join(" "));
});

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/canvas-audit.mjs");

describe("canvas-audit (name-mirror)", () => {
  beforeEach(() => {
    logs.length = 0;
    screenshots.length = 0;
    vi.clearAllMocks();
    logSpy.mockClear();
  });

  it("launches guest planner audit, screenshots canvas, prints JSON report", async () => {
    await import(pathToFileURL(scriptPath).href);

    expect(launch).toHaveBeenCalled();
    expect(page.goto).toHaveBeenCalledWith(
      expect.stringContaining("http://localhost:3000/planner/guest/"),
      expect.anything(),
    );
    expect(screenshots.some((p) => p.includes("canvas-audit.png"))).toBe(true);
    expect(browserClose).toHaveBeenCalled();

    const reportLine = logs.find((line) => line.includes('"timestamp"') || line.includes("issueCount"));
    expect(reportLine).toBeDefined();
    const report = JSON.parse(reportLine!) as {
      url: string;
      viewport: { width: number; height: number };
      summary?: { issueCount: number };
      issues?: unknown[];
    };
    expect(report.url).toContain("/planner/guest/");
    expect(report.viewport).toEqual({ width: 1440, height: 900 });
    expect(Array.isArray(report.issues) || typeof report.summary?.issueCount === "number").toBe(
      true,
    );
  });
});
