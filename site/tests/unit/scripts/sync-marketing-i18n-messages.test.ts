// @vitest-environment node
/**
 * Name-mirror: scripts/sync-marketing-i18n-messages.mjs
 */
import { describe, expect, it } from "vitest";
import { mergeMarketingIntoEn } from "../../../scripts/sync-marketing-i18n-messages.mjs";

describe("sync-marketing-i18n-messages (name-mirror)", () => {
  it("merges marketing namespaces over en and deep-merges home", () => {
    const en = {
      home: { title: "Old", keep: "yes" },
      about: { title: "About EN" },
      leftover: 1,
    };
    const marketing = {
      home: { title: "New", cta: "Go" },
      about: { title: "About MKT" },
      products: { title: "Products" },
    };
    const merged = mergeMarketingIntoEn(en, marketing);
    expect(merged.leftover).toBe(1);
    expect(merged.about.title).toBe("About MKT");
    expect(merged.products.title).toBe("Products");
    expect(merged.home.title).toBe("New");
    expect(merged.home.keep).toBe("yes");
    expect(merged.home.cta).toBe("Go");
  });
});
