// @vitest-environment node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { describe, expect, it } from "vitest";

import {
  auditCompatProduct,
  collectProductDocuments,
  collectProductImages,
} from "@/lib/catalog/site/specSchema";
import type { CompatProduct, Product } from "@/lib/catalog/site/getProducts";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const scriptPath = path.join(siteRoot, "scripts/audit-product-quality.ts");

function loadCsvEscape(): (value: unknown) => string {
  const source = fs.readFileSync(scriptPath, "utf8");
  const match = source.match(/function csvEscape\(value: unknown\): string \{[\s\S]*?\n\}/);
  if (!match) throw new Error("csvEscape not found");
  const stripped = match[0]
    .replace(/: unknown/g, "")
    .replace(/: string/g, "");
  const sandbox: { String: typeof String; csvEscape?: (value: unknown) => string } = {
    String,
  };
  vm.runInNewContext(`${stripped}; this.csvEscape = csvEscape;`, sandbox);
  if (!sandbox.csvEscape) throw new Error("csvEscape failed to load");
  return sandbox.csvEscape;
}

/** Mirrors toCompatProduct mapping used by audit-product-quality (no Supabase). */
function toCompatProduct(product: Product): CompatProduct {
  const specsObject =
    product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? (product.specs as Record<string, unknown>)
      : {};
  const specsDimensions =
    typeof specsObject.dimensions === "string" ? specsObject.dimensions.trim() : "";
  const specsMaterials = Array.isArray(specsObject.materials)
    ? specsObject.materials.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const specsFeatures = Array.isArray(specsObject.features)
    ? specsObject.features.map((item) => String(item).trim()).filter(Boolean)
    : [];

  const baseProduct: CompatProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description || "",
    flagshipImage: product.flagship_image || "",
    sceneImages: Array.isArray((product as { scene_images?: unknown }).scene_images)
      ? (product as { scene_images?: unknown }).scene_images
      : [],
    variants: Array.isArray((product as { variants?: unknown }).variants)
      ? ((product as { variants?: unknown }).variants as CompatProduct["variants"])
      : [],
    detailedInfo: {
      overview: product.description || "",
      features: specsFeatures,
      dimensions: specsDimensions,
      materials: specsMaterials,
    },
    metadata: {
      ...(product.metadata ?? {}),
      sustainabilityScore:
        product.metadata?.sustainabilityScore ?? product.specs?.sustainability_score,
    },
    "3d_model": product["3d_model"],
    threeDModelUrl: product["3d_model"],
    technicalDrawings: [],
    documents: [],
    images: Array.isArray(product.images) ? product.images : [],
    altText:
      product.alt_text ||
      product.metadata?.ai_alt_text ||
      product.metadata?.aiAltText ||
      `${product.name} product image`,
    specs: specsObject,
  };

  const documents = collectProductDocuments(baseProduct);
  return {
    ...baseProduct,
    technicalDrawings: documents,
    documents,
  };
}

describe("audit-product-quality", () => {
  it("audits catalog products via Supabase + auditCompatProduct (not run live here)", () => {
    expect(fs.existsSync(scriptPath)).toBe(true);
    const source = fs.readFileSync(scriptPath, "utf8");
    expect(source).toContain("createSupabaseAdminClient");
    expect(source).toContain("auditCompatProduct");
    expect(source).toContain("toCompatProduct");
    expect(source).toContain("csvEscape");
    expect(source).toContain("docs");
    expect(source).toContain("Product Quality Audit");
  });

  it("csv-escapes audit row fields", () => {
    const csvEscape = loadCsvEscape();
    expect(csvEscape("ok")).toBe("ok");
    expect(csvEscape('He said "no"')).toBe('"He said ""no"""');
    expect(csvEscape("a,b")).toBe('"a,b"');
    expect(csvEscape(undefined)).toBe("");
  });

  it("maps product rows into CompatProduct and runs auditCompatProduct offline", () => {
    const product = {
      id: "p1",
      slug: "chair-a",
      name: "Chair A",
      description: "A sturdy chair",
      flagship_image: "/images/chair-a.jpg",
      images: ["/images/chair-a.jpg", "/images/chair-a-2.jpg"],
      alt_text: "Chair A front",
      category_id: "seating",
      series_id: "series-1",
      series_name: "Series 1",
      specs: {
        dimensions: "600x600x800",
        materials: ["steel", "fabric"],
        features: ["stackable"],
        sustainability_score: 7,
      },
      metadata: {},
      "3d_model": null,
    } as unknown as Product;

    const compat = toCompatProduct(product);
    expect(compat.slug).toBe("chair-a");
    expect(compat.flagshipImage).toBe("/images/chair-a.jpg");
    expect(compat.detailedInfo.dimensions).toBe("600x600x800");
    expect(compat.detailedInfo.materials).toEqual(["steel", "fabric"]);
    expect(collectProductImages(compat).length).toBeGreaterThan(0);

    const issues = auditCompatProduct("seating", compat);
    expect(Array.isArray(issues)).toBe(true);
  });
});
