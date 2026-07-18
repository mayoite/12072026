import { describe, expect, it } from "vitest";
import {
  humanizeCatalogSlug,
  catalogSlugSearchTags,
  resolveCatalogDisplayName,
  formatBoqLineDisplayName,
} from "@/features/planner/catalog/catalogLabelUtils";

describe("catalogLabelUtils", () => {
  it("humanizes slugs and drops trailing serials", () => {
    expect(humanizeCatalogSlug("chaise-lounge-001")).toBe("Chaise Lounge");
    expect(humanizeCatalogSlug("desk-v0")).toMatch(/Desk/i);
    expect(humanizeCatalogSlug("")).toBe("Catalog item");
    expect(humanizeCatalogSlug("   ")).toBe("Catalog item");
    expect(humanizeCatalogSlug(null)).toBe("Catalog item");
    expect(humanizeCatalogSlug(undefined)).toBe("Catalog item");
  });

  it("shows human brand series names for oando-* slugs (B4)", () => {
    expect(humanizeCatalogSlug("oando-fluid-desk-1600")).toBe("Fluid Desk 1600");
    expect(humanizeCatalogSlug("oando-omnia-desk-1800")).toBe("Omnia Desk 1800");
    expect(humanizeCatalogSlug("oando-breeze-task-chair")).toBe(
      "Breeze Task Chair",
    );
    expect(humanizeCatalogSlug("oando-phoenix-l-desk-1600")).toBe(
      "Phoenix L-Desk 1600",
    );
    expect(humanizeCatalogSlug("oando-fluid-ws-linear-1200")).toBe(
      "Fluid Workstation Linear 1200",
    );
  });

  it("humanizes commercial OANDO-* SKUs with series + type tokens (B4)", () => {
    expect(humanizeCatalogSlug("OANDO-FLUID-DSK-1600")).toBe("Fluid Desk 1600");
    expect(humanizeCatalogSlug("OANDO-OMNIA-DSK-1800")).toBe("Omnia Desk 1800");
    expect(humanizeCatalogSlug("OANDO-BREEZE-CHR-TSK")).toBe(
      "Breeze Chair Task",
    );
    expect(humanizeCatalogSlug("OANDO-CLASSY-MTG-1800")).toBe(
      "Classy Meeting 1800",
    );
    expect(humanizeCatalogSlug("OANDO-FLUID-WS-L1200")).toBe(
      "Fluid Workstation L1200",
    );
  });

  it("resolves display name: preferred name > slug > sku > catalogId", () => {
    expect(
      resolveCatalogDisplayName({
        name: "Fluid Pro Desk",
        slug: "oando-fluid-desk-1600",
        sku: "OANDO-FLUID-DSK-1600",
      }),
    ).toBe("Fluid Pro Desk");

    expect(
      resolveCatalogDisplayName({
        slug: "oando-omnia-desk-1800",
        sku: "OANDO-OMNIA-DSK-1800",
      }),
    ).toBe("Omnia Desk 1800");

    expect(
      resolveCatalogDisplayName({
        sku: "OANDO-FLUID-DSK-1400",
      }),
    ).toBe("Fluid Desk 1400");

    expect(
      resolveCatalogDisplayName({
        catalogId: "oando-flex-desk-1200",
      }),
    ).toBe("Flex Desk 1200");

    expect(resolveCatalogDisplayName({})).toBe("Catalog item");
  });

  it("formats BOQ line as brand name + SKU when SKU present (B11)", () => {
    expect(
      formatBoqLineDisplayName("Fluid Desk 1600", "OANDO-FLUID-DSK-1600"),
    ).toBe("Fluid Desk 1600 · OANDO-FLUID-DSK-1600");

    expect(formatBoqLineDisplayName("Task Chair", "")).toBe("Task Chair");
    expect(formatBoqLineDisplayName("", "OANDO-BREEZE-CHR-TSK")).toBe(
      "OANDO-BREEZE-CHR-TSK",
    );
    expect(
      formatBoqLineDisplayName(
        "Fluid Desk 1600 · OANDO-FLUID-DSK-1600",
        "OANDO-FLUID-DSK-1600",
      ),
    ).toBe("Fluid Desk 1600 · OANDO-FLUID-DSK-1600");
    expect(formatBoqLineDisplayName(null, null)).toBe("Catalog item");
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
