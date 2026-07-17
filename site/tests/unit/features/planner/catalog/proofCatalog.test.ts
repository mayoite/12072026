import { describe, expect, it } from "vitest";
import { proofCatalogItem } from "@/features/planner/catalog/proofCatalog";

describe("proofCatalog", () => {
  it("exposes a positive-footprint proof chair", () => {
    expect(proofCatalogItem.id).toBe("proof-chair");
    expect(proofCatalogItem.widthMm).toBe(600);
    expect(proofCatalogItem.depthMm).toBe(600);
    expect(proofCatalogItem.fallback).toBe("box");
    expect(proofCatalogItem.previewUrl).toMatch(/\.svg$|proof/i);
  });
});
