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

const pageState = {
  viewport: { w: 1440, h: 900 },
  document: { w: 1440, h: 900, hasHScroll: false, hasVScroll: false },
  mainCanvas: { x: 0, y: 0, w: 800, h: 600 },
  stageCard: { x: 0, y: 0, w: 900, h: 700 },
  elementAtCanvasCenter: { id: "main", tag: "CANVAS" },
  pane2dActive: "true",
  rightPanel: { display: "none", w: 0, visibility: "hidden" },
  subtopbars: [],
  fabricApis: {
    exportDraft: true,
    placeCatalog: true,
    floorplanCtx: true,
  },
  canvasBodyViewMode: "2d",
  regions: {},
  layout: {},
};

const page = {
  on: vi.fn(),
  goto: vi.fn(async () => undefined),
  waitForTimeout: vi.fn(async () => undefined),
  waitForSelector: vi.fn(async () => undefined),
  waitForLoadState: vi.fn(async () => undefined),
  screenshot: vi.fn(async (opts: { path: string }) => {
    screenshots.push(opts.path);
  }),
  evaluate: vi.fn(async () => pageState),
  locator: vi.fn(() => makeLocator()),
  getByRole: vi.fn(() => makeLocator()),
  getByText: vi.fn(() => makeLocator()),
  getByLabel: vi.fn(() => makeLocator()),
  mouse: {
    down: vi.fn(async () => undefined),
    up: vi.fn(async () => undefined),
    move: vi.fn(async () => undefined),
    click: vi.fn(async () => undefined),
  },
  keyboard: {
    press: vi.fn(async () => undefined),
    type: vi.fn(async () => undefined),
  },
  click: vi.fn(async () => undefined),
};

const context = {
  newPage: vi.fn(async () => page),
  addInitScript: vi.fn(async () => undefined),
  close: vi.fn(async () => undefined),
};

const browserClose = vi.fn(async () => undefined);
const launch = vi.fn(async () => ({
  newContext: vi.fn(async () => context),
  newPage: vi.fn(async () => page),
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
const scriptPath = path.join(siteRoot, "scripts/check-full-page.mjs");

describe("check-full-page (name-mirror)", () => {
  beforeEach(() => {
    logs.length = 0;
    screenshots.length = 0;
    vi.clearAllMocks();
    logSpy.mockClear();
  });

  it("audits planner guest full page and prints structured report", async () => {
    process.env.PLANNER_URL = "http://localhost:3000";
    await import(pathToFileURL(scriptPath).href);

    expect(launch).toHaveBeenCalled();
    expect(page.goto).toHaveBeenCalledWith(
      expect.stringContaining("/planner/guest/"),
      expect.anything(),
    );
    expect(browserClose).toHaveBeenCalled();

    const reportLine = logs.find(
      (line) => line.includes('"timestamp"') || line.includes("issueCount") || line.includes('"url"'),
    );
    expect(reportLine).toBeDefined();
    const report = JSON.parse(reportLine!) as {
      url: string;
      viewport: { width: number; height: number };
      issues?: unknown[];
      summary?: { issueCount: number };
      apis?: { exportDraft?: boolean };
    };
    expect(report.url).toContain("/planner/guest/");
    expect(report.viewport.width).toBe(1440);
    expect(
      Array.isArray(report.issues) || typeof report.summary?.issueCount === "number",
    ).toBe(true);
    expect(report.apis?.exportDraft).toBe(true);
  });
});
