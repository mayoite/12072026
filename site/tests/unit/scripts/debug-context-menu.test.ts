// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

import {
  DEFAULT_PLANNER_URL,
  VIEWPORT,
  plannerLocalStorageKeys,
  runContextMenuDebug,
} from "../../../scripts/debug-context-menu.mjs";

describe("debug-context-menu (name-mirror)", () => {
  it("filters planner-related storage keys", () => {
    expect(
      plannerLocalStorageKeys([
        "planner-draft",
        "theme",
        "guest-session",
        "project-setup-v1",
      ]),
    ).toEqual(["planner-draft", "guest-session", "project-setup-v1"]);
  });

  it("uses guest planner URL with devtools flag", () => {
    expect(DEFAULT_PLANNER_URL).toContain("/planner/guest");
    expect(DEFAULT_PLANNER_URL).toContain("plannerDevTools=1");
    expect(VIEWPORT.width).toBe(1440);
  });

  it("navigates with mocked playwright and reports menu count", async () => {
    const page = {
      goto: vi.fn(async () => ({ status: () => 200 })),
      locator: vi.fn((sel: string) => {
        if (sel === "#project-setup-name") {
          return {
            waitFor: async () => undefined,
            isVisible: async () => false,
            fill: async () => undefined,
          };
        }
        if (sel === ".pw-workspace") {
          return { waitFor: async () => undefined };
        }
        if (sel === "#main") {
          return {
            boundingBox: async () => ({ x: 10, y: 10, width: 800, height: 600 }),
          };
        }
        if (sel.includes("context-menu")) {
          return { count: async () => 1 };
        }
        return {
          count: async () => 0,
          first: () => ({ click: async () => undefined }),
          click: async () => undefined,
        };
      }),
      getByRole: vi.fn(() => ({
        click: async () => undefined,
        first: () => ({ count: async () => 0, click: async () => undefined }),
      })),
      waitForSelector: vi.fn(async () => undefined),
      waitForTimeout: vi.fn(async () => undefined),
      mouse: { click: vi.fn(async () => undefined) },
    };
    const context = {
      addInitScript: vi.fn(async () => undefined),
      newPage: vi.fn(async () => page),
    };
    const browser = {
      newContext: vi.fn(async () => context),
      close: vi.fn(async () => undefined),
    };
    const chromium = { launch: vi.fn(async () => browser) };
    const log = vi.fn();
    const result = await runContextMenuDebug({
      chromium,
      log,
      url: DEFAULT_PLANNER_URL,
    });
    expect(page.goto).toHaveBeenCalledWith(
      DEFAULT_PLANNER_URL,
      expect.objectContaining({ waitUntil: "domcontentloaded" }),
    );
    expect(result.status).toBe(200);
    expect(result.menuVisible).toBe(1);
    expect(browser.close).toHaveBeenCalledOnce();
  });
});
