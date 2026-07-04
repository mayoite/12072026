import { describe, it, expect } from "vitest";
import {
  slugifyCatalogToken,
  normalizeRequestedCategoryId,
  getCanonicalCategoryId,
  getCanonicalSubcategoryId,
  getCanonicalSubcategoryLabel,
  resolveCanonicalSubcategory,
  buildCanonicalSeriesId,
  buildCanonicalProductRouteSlug,
  classifyToRequestedCategory,
  classifyToRequestedSubcategory,
  getCatalogCategoryLabel,
  getCatalogCategoryDescription,
  getCatalogCategoryHref,
  getRequestedCategoryRouteSegment,
  getCatalogProductHref,
  buildCatalogCategoryNav,
  buildRequestedCategoryCatalog,
  Catalog_CATEGORY_ORDER,
  _Catalog_CATEGORY_LABELS
} from "@/features/catalog/categories";

describe("Catalog Categories Utilities", () => {
  describe("slugifyCatalogToken", () => {
    it("converts spaces and special characters to single dashes and lowercase", () => {
      expect(slugifyCatalogToken("Mesh Chair & Stool")).toBe("mesh-chair-and-stool");
      expect(slugifyCatalogToken("  Executive   Chair  ")).toBe("executive-chair");
      expect(slugifyCatalogToken("Ã© / é")).toBe("e-e");
      expect(slugifyCatalogToken(null)).toBe("");
    });
  });

  describe("normalizeRequestedCategoryId", () => {
    it("resolves exact and legacy categories", () => {
      expect(normalizeRequestedCategoryId("seating")).toBe("seating");
      expect(normalizeRequestedCategoryId("storage")).toBe("storages");
      expect(normalizeRequestedCategoryId("educational")).toBe("education");
      expect(normalizeRequestedCategoryId("oando-tables")).toBe("tables");
      expect(normalizeRequestedCategoryId("collaborative")).toBe("soft-seating");
      expect(normalizeRequestedCategoryId("desks-cabin-tables")).toBe("tables");
      expect(normalizeRequestedCategoryId("chairs-mesh")).toBe("seating");
      expect(normalizeRequestedCategoryId("others-1")).toBe("soft-seating");
      expect(normalizeRequestedCategoryId("unknown-category")).toBeNull();
    });
  });

  describe("getCanonicalCategoryId", () => {
    it("calls normalizeRequestedCategoryId", () => {
      expect(getCanonicalCategoryId("storage")).toBe("storages");
    });
  });

  describe("getCanonicalSubcategoryId", () => {
    it("finds subcategory definitions and falls back to slugify", () => {
      expect(getCanonicalSubcategoryId("seating", "Mesh chairs")).toBe("mesh");
      expect(getCanonicalSubcategoryId("seating", "training chair")).toBe("study");
      expect(getCanonicalSubcategoryId("seating", "Random Sub")).toBe("random-sub");
      expect(getCanonicalSubcategoryId("invalid", "Random")).toBe("random");
    });
  });

  describe("getCanonicalSubcategoryLabel", () => {
    it("returns definition label or fallback", () => {
      expect(getCanonicalSubcategoryLabel("seating", "mesh", "Fallback")).toBe("Mesh chairs");
      expect(getCanonicalSubcategoryLabel("invalid-cat", "mesh", "Fallback")).toBe("Fallback");
      expect(getCanonicalSubcategoryLabel("seating", "unknown-id", "Fallback")).toBe("Fallback");
    });
  });

  describe("resolveCanonicalSubcategory", () => {
    it("resolves correctly based on combined text checks", () => {
      // Seating
      expect(resolveCanonicalSubcategory("seating", { productName: "Ergo Mesh" }).label).toBe("Mesh chairs");
      expect(resolveCanonicalSubcategory("seating", { description: "bar stool" }).label).toBe("Cafe chairs");
      expect(resolveCanonicalSubcategory("seating", { subcategory: "Study" }).label).toBe("Study chairs");
      expect(resolveCanonicalSubcategory("seating", { productName: "Fabric visitor chair" }).label).toBe("Fabric chairs");
      expect(resolveCanonicalSubcategory("seating", { productName: "Leather Boss Chair" }).label).toBe("Leather chairs");

      // Workstations
      expect(resolveCanonicalSubcategory("workstations", { productName: "Height Adjustable" }).label).toBe("Height Adjustable Series");
      expect(resolveCanonicalSubcategory("workstations", { description: "panel system" }).label).toBe("Panel Series");
      expect(resolveCanonicalSubcategory("workstations", { productName: "Desk" }).label).toBe("Desking Series");

      // Tables
      expect(resolveCanonicalSubcategory("tables", { productName: "Meeting Room" }).label).toBe("Meeting Tables");
      expect(resolveCanonicalSubcategory("tables", { description: "training table" }).label).toBe("Training Tables");
      expect(resolveCanonicalSubcategory("tables", { productName: "Cafe Table" }).label).toBe("Cafe Tables");
      expect(resolveCanonicalSubcategory("tables", {}).label).toBe("Cabin Tables");

      // Storages
      expect(resolveCanonicalSubcategory("storages", { description: "locker box" }).label).toBe("Locker");
      expect(resolveCanonicalSubcategory("storages", { productName: "Metal Cabinet" }).label).toBe("Metal Storage");
      expect(resolveCanonicalSubcategory("storages", { description: "compactor unit" }).label).toBe("Compactor Storage");
      expect(resolveCanonicalSubcategory("storages", {}).label).toBe("Prelam Storage");

      // Soft seating
      expect(resolveCanonicalSubcategory("soft-seating", { description: "2-seater sofa" }).label).toBe("Sofa");
      expect(resolveCanonicalSubcategory("soft-seating", { productName: "Collaborative Pod" }).label).toBe("Collaborative");
      expect(resolveCanonicalSubcategory("soft-seating", { description: "coffee table" }).label).toBe("Occasional Tables");
      expect(resolveCanonicalSubcategory("soft-seating", { productName: "Pouffee Ottoman" }).label).toBe("Pouffee");
      expect(resolveCanonicalSubcategory("soft-seating", {}).label).toBe("Lounge");

      // Education
      expect(resolveCanonicalSubcategory("education", { description: "auditorium layout" }).label).toBe("Auditorium");
      expect(resolveCanonicalSubcategory("education", { description: "hostel bed" }).label).toBe("Hostel");
      expect(resolveCanonicalSubcategory("education", { productName: "Library racks" }).label).toBe("Library");
      expect(resolveCanonicalSubcategory("education", {}).label).toBe("Classroom");

      // Invalid category fallback
      const fallback = resolveCanonicalSubcategory("invalid-cat", { subcategory: "My Sub", productName: "My Prod" });
      expect(fallback.id).toBe("my-sub");
      expect(fallback.label).toBe("My Sub");
    });
  });

  describe("buildCanonicalSeriesId & buildCanonicalProductRouteSlug", () => {
    it("builds correct canonical strings", () => {
      expect(buildCanonicalSeriesId("seating", "mesh", "Executive Series")).toBe("seating-mesh-executive-series");
      expect(buildCanonicalProductRouteSlug("seating", "mesh", "Herman Chair")).toBe("seating-mesh-herman-chair");
    });
  });

  describe("classifyToRequestedCategory & classifyToRequestedSubcategory", () => {
    it("classifies correctly based on baseCategoryId and contents", () => {
      const mockItem = {
        product: { id: "p1", name: "Classic Chair", category_id: "sc", slug: "classic", metadata: { subcategory: "mesh" } },
        baseCategoryId: "seating",
        seriesName: "Task Chairs",
      };
      expect(classifyToRequestedCategory(mockItem)).toBe("seating");
      expect(classifyToRequestedSubcategory("seating", mockItem)).toBe("Mesh chairs");

      // Test fallback matching by token
      const educationItem = {
        product: { id: "p2", name: "Hostel Cabinet", category_id: "sc", slug: "cab" },
        baseCategoryId: "unknown",
        seriesName: "Racks",
      };
      expect(classifyToRequestedCategory(educationItem)).toBe("education");
    });
  });

  describe("getCatalogCategoryLabel & getCatalogCategoryDescription & Hrefs", () => {
    it("returns label, description, and hrefs correctly", () => {
      expect(getCatalogCategoryLabel("seating", "Default")).toBe("Seating");
      expect(getCatalogCategoryLabel("invalid", "Default")).toBe("Default");

      expect(getCatalogCategoryDescription("seating", "Default Desc")).toBe("Leather, mesh, training and cafe chair collections.");
      expect(getCatalogCategoryDescription("invalid", "Default Desc")).toBe("Default Desc");

      expect(getCatalogCategoryHref("seating")).toBe("/products/seating");

      expect(getRequestedCategoryRouteSegment("oando-seating")).toBe("seating");
      expect(getRequestedCategoryRouteSegment("oando-unknown")).toBe("unknown");

      expect(getCatalogProductHref("seating", "task-chair")).toBe("/products/seating/task-chair");
      expect(getCatalogProductHref("seating", "")).toBe("/products/seating");
    });
  });

  describe("buildCatalogCategoryNav", () => {
    it("returns mapped navigation items", () => {
      const nav = buildCatalogCategoryNav(["seating", "tables"]);
      expect(nav).toEqual([
        { id: "seating", label: "Seating", href: "/products/seating" },
        { id: "tables", label: "Tables", href: "/products/tables" },
      ]);
    });
  });

  describe("buildRequestedCategoryCatalog", () => {
    it("builds the catalog correctly from raw nested data structure", () => {
      const mockNestedCatalog = [
        {
          id: "seating",
          name: "Seating",
          description: "Desc",
          series: [
            {
              id: "s1",
              name: "Task Chairs",
              description: "Series Desc",
              products: [
                { id: "p1", name: "Mesh Ergonomic Chair", category_id: "seating", slug: "mesh-ergo" },
              ],
            },
          ],
        },
      ];

      const built = buildRequestedCategoryCatalog(mockNestedCatalog);
      expect(built).toHaveLength(Catalog_CATEGORY_ORDER.length);
      const seatingCat = built.find((c) => c.id === "seating");
      expect(seatingCat).toBeDefined();
      expect(seatingCat?.name).toBe("Seating");
      expect(seatingCat?.series).toHaveLength(1);
      expect(seatingCat?.series[0].name).toBe("Seating Series"); // Seating maps all to 'Seating Series'
      expect(seatingCat?.series[0].products[0].metadata?.subcategoryId).toBe("mesh");
    });
  });
});
