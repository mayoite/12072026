import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  resolveProductImages,
  hasLocalAssetSource,
  catalogSlugForProduct
} from "@/lib/catalog/site/imageMetadata";

const mockExistsSync = vi.hoisted(() => vi.fn());
const mockStatSync = vi.hoisted(() => vi.fn());
const mockReaddirSync = vi.hoisted(() => vi.fn());

vi.mock("node:fs", () => ({
  default: {
    existsSync: mockExistsSync,
    statSync: mockStatSync,
    readdirSync: mockReaddirSync,
  },
}));

vi.mock("@/features/site/data/localCatalogIndex.json", () => ({
  default: [
    {
      id: "p1",
      slug: "oando-seating--task-chair",
      category_id: "seating",
      name: "Task Chair",
      images: ["/images/catalog/oando-seating--task-chair/image-1.jpg"],
      flagship_image: "/images/catalog/oando-seating--task-chair/image-1.jpg"
    },
    {
      id: "p2",
      slug: "oando-tables--ops-table",
      category_id: "tables",
      name: "Ops Table",
      images: [],
    }
  ]
}));

describe("Image Metadata Resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("catalogSlugForProduct", () => {
    it("returns correct canonical slugs for categories", () => {
      expect(catalogSlugForProduct("oando-workstations", "Trio Desk")).toBe("oando-workstations--trio-desk");
      expect(catalogSlugForProduct("oando-tables", "Opus Table")).toBe("oando-tables--opus-table");
      expect(catalogSlugForProduct("meeting-tables", "Collaborate")).toBe("oando-tables--collaborate");
      expect(catalogSlugForProduct("oando-storage", "Prelam Box")).toBe("oando-storage--prelam-box");
      expect(catalogSlugForProduct("oando-soft-seating", "Luna")).toBe("oando-soft-seating--luna");
      expect(catalogSlugForProduct("oando-seating", "Arvo")).toBe("oando-seating--arvo");
      expect(catalogSlugForProduct("oando-educational", "Hostel Bed")).toBe("oando-educational--hostel-bed");
      expect(catalogSlugForProduct("oando-collaborative", "Pod")).toBe("oando-collaborative--pod");
      expect(catalogSlugForProduct("oando-custom", "Custom")).toBe("oando-custom--custom");
      expect(catalogSlugForProduct(null, "No Category")).toBeNull();
    });
  });

  describe("resolveProductImages", () => {
    it("resolves from catalog index by slug if files exist", () => {
      mockExistsSync.mockReturnValue(true);

      const result = resolveProductImages({ slug: "oando-seating--task-chair", name: "Task Chair" });
      expect(result).not.toBeNull();
      expect(result?.source).toBe("catalog-index-slug");
      expect(result?.images).toEqual(["/images/catalog/oando-seating--task-chair/image-1.jpg"]);
      expect(result?.flagshipImage).toBe("/images/catalog/oando-seating--task-chair/image-1.jpg");
    });

    it("resolves from catalog index by name if files exist", () => {
      mockExistsSync.mockReturnValue(true);

      const result = resolveProductImages({ categoryId: "oando-seating", name: "Task Chair" });
      expect(result).not.toBeNull();
      expect(result?.source).toBe("catalog-index-slug");
      expect(result?.matchedSlug).toBe("oando-seating--task-chair");
    });

    it("resolves from directory listing if catalog index is empty or has no existing images", () => {
      // existsSync returns false for files, but true for directory path checks
      mockExistsSync.mockImplementation((path: string) => {
        if (path.includes("image-1.jpg") || path.includes("image-1.png") || path.includes("image-1.webp")) {
          return false;
        }
        return true;
      });
      mockStatSync.mockReturnValue({ isDirectory: () => true });
      mockReaddirSync.mockReturnValue(["image-1.webp", "image-2.webp", "unrelated.txt"]);

      const result = resolveProductImages({ slug: "oando-seating--task-chair", name: "Task Chair" });
      expect(result).not.toBeNull();
      expect(result?.source).toBe("catalog-dir-slug");
      expect(result?.images).toEqual([
        "/images/catalog/oando-seating--task-chair/image-1.webp",
        "/images/catalog/oando-seating--task-chair/image-2.webp"
      ]);
    });

    it("resolves canonical directory if direct slug is missing", () => {
      mockExistsSync.mockImplementation((filePath: string) => {
        if (filePath.includes("oando-tables--ops-table/image-1.png")) return true;
        if (filePath.includes("oando-tables--ops-table") && !filePath.includes("image-")) return true;
        return false;
      });
      mockStatSync.mockReturnValue({ isDirectory: () => true });
      mockReaddirSync.mockReturnValue(["image-1.png"]);

      const result = resolveProductImages({ categoryId: "oando-tables", name: "Ops Table" });
      expect(result).not.toBeNull();
      expect(result?.source).toBe("catalog-dir-canonical");
    });

    it("resolves explicit candidates for projects/products with pre-mapped paths", () => {
      mockExistsSync.mockImplementation((filePath: string) => {
        const normalized = filePath.replace(/\\/g, "/");
        return normalized.includes("images/projects/project-gallery");
      });

      const result = resolveProductImages({ categoryId: "projects", name: "Abdul Hai Office" });
      expect(result).not.toBeNull();
      expect(result?.source).toBe("explicit-candidate");
      expect(result?.images).toEqual([
        "/images/projects/project-gallery-01.webp",
        "/images/projects/project-gallery-02.webp"
      ]);
    });

    it("returns null if no matches can be found", () => {
      mockExistsSync.mockReturnValue(false);
      const result = resolveProductImages({ categoryId: "invalid", name: "Non-existent" });
      expect(result).toBeNull();
    });
  });

  describe("hasLocalAssetSource", () => {
    it("returns true/false correctly based on resolution success", () => {
      mockExistsSync.mockReturnValue(true);
      expect(hasLocalAssetSource("projects", "Abdul Hai Office")).toBe(true);

      mockExistsSync.mockReturnValue(false);
      expect(hasLocalAssetSource("invalid", "Non-existent")).toBe(false);
    });
  });
});
