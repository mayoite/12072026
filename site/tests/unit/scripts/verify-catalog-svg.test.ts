// @vitest-environment node
/**
 * Name-mirror: scripts/verify-catalog-svg.mjs
 */
import { describe, expect, it, vi } from "vitest";
import {
  CATALOG_SELECTOR,
  CATALOG_SVG_GUEST_URL,
  PREVIEW_SVG_SELECTOR,
  START_PLACING_RE,
  analyzeCatalogSvgHtml,
  verifyCatalogSvg,
} from "../../../scripts/verify-catalog-svg.mjs";

describe("verify-catalog-svg (name-mirror)", () => {
  it("locks guest URL and catalog selectors", () => {
    expect(CATALOG_SVG_GUEST_URL).toContain("/planner/guest");
    expect(START_PLACING_RE.test("Open planner")).toBe(true);
    expect(CATALOG_SELECTOR).toBe(".pw-catalog");
    expect(PREVIEW_SVG_SELECTOR).toContain("svg");
  });

  it("analyzes svg markup for path/polyline/var/hex fills", () => {
    const info = analyzeCatalogSvgHtml(
      '<svg><path d="M0 0"/><polyline points="0,0"/><rect fill="var(--block-fill)"/><circle fill="#abc"/></svg>',
    );
    expect(info.hasPath).toBe(true);
    expect(info.hasPolyline).toBe(true);
    expect(info.hasVar).toBe(true);
    expect(info.hasHex).toBe(true);
  });

  it("runs browser flow with a mocked playwright page", async () => {
    const evaluate = vi.fn(async () => ({
      hasPath: true,
      hasPolyline: false,
      hasVar: true,
      hasHex: false,
      childTags: ["path"],
      previews: 1,
    }));
    const waitForTimeout = vi.fn(async () => undefined);
    const waitForSelector = vi.fn(async () => undefined);
    const goto = vi.fn(async () => undefined);
    const click = vi.fn(async () => undefined);
    const getByRole = vi.fn(() => ({ click }));
    const newPage = vi.fn(async () => ({
      goto,
      getByRole,
      waitForSelector,
      waitForTimeout,
      evaluate,
    }));
    const close = vi.fn(async () => undefined);

    const info = await verifyCatalogSvg({
      browserFactory: async () => ({ newPage, close }),
    });

    expect(goto).toHaveBeenCalledWith(CATALOG_SVG_GUEST_URL, { timeout: 60000 });
    expect(waitForSelector).toHaveBeenCalledWith(CATALOG_SELECTOR, { timeout: 60000 });
    expect(info.hasPath).toBe(true);
    expect(close).toHaveBeenCalled();
  });
});
