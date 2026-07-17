import { describe, expect, it } from "vitest";
import {
  humanizeCatalogSlug,
  catalogSlugSearchTags,
} from "@/features/planner/catalog/catalogLabelUtils";

describe("catalogLabelUtils", () => {
  it("humanizes slugs and drops trailing serials", () => {
    expect(humanizeCatalogSlug("chaise-lounge-001")).toBe("Chaise Lounge");
    expect(humanizeCatalogSlug("desk-v0")).toMatch(/Desk/i);
    expect(humanizeCatalogSlug("")).toBe("Catalog item");
    expect(humanizeCatalogSlug("   ")).toBe("Catalog item");
    expect(humanizeCatalogSlug("oando-fluid-desk-1600")).toBe("Fluid Desk 1600");
    expect(humanizeCatalogSlug("oando-breeze-task-chair")).toMatch(/Breeze/i);
  });

  it("extracts search tags from slug parts", () => {
    expect(catalogSlugSearchTags("chaise-lounge-001")).toEqual(
      expect.arrayContaining(["chaise", "lounge"]),
    );
    expect(catalogSlugSearchTags("")).toEqual([]);
    // length > 1 filter keeps "ab"
    expect(catalogSlugSearchTags("ab")).toEqual(["ab"]);
    expect(catalogSlugSearchTags("a")).toEqual([]);
  });
});
