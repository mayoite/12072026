// @vitest-environment node
/**
 * Name-mirror: scripts/translate-deferred-marketing-flat.mjs
 */
import { describe, expect, it } from "vitest";
import {
  BATCH_SIZE,
  chunk,
  collectLeaves,
  setByPath,
  shouldSkipTranslation,
} from "../../../scripts/translate-deferred-marketing-flat.mjs";

describe("translate-deferred-marketing-flat (name-mirror)", () => {
  it("skips urls, paths, phones, emails, and numeric stats", () => {
    expect(shouldSkipTranslation("https://oando.co.in")).toBe(true);
    expect(shouldSkipTranslation("/products")).toBe(true);
    expect(shouldSkipTranslation("hello@oando.co.in")).toBe(true);
    expect(shouldSkipTranslation("+91 98765 43210")).toBe(true);
    expect(shouldSkipTranslation("14+")).toBe(true);
    expect(shouldSkipTranslation("Office desks")).toBe(false);
  });

  it("collects non-skippable string leaves with dotted paths", () => {
    const leaves = collectLeaves({
      title: "Hello",
      href: "/x",
      items: [{ label: "One" }, { label: "https://x.test" }],
    });
    expect(leaves).toEqual([
      { path: "title", value: "Hello" },
      { path: "items[0].label", value: "One" },
    ]);
  });

  it("sets values by path including array indexes", () => {
    const root: Record<string, unknown> = {};
    setByPath(root, "hero.title[0]", "Line");
    setByPath(root, "cta.label", "Go");
    expect(root).toEqual({
      hero: { title: ["Line"] },
      cta: { label: "Go" },
    });
  });

  it("chunks leaves using BATCH_SIZE default", () => {
    expect(BATCH_SIZE).toBe(35);
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
});
