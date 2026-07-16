import { describe, expect, it, vi } from "vitest";
import {
  placeModularWithGeneratedGlbBrowser,
  writeGeneratedGlbViaApi,
} from "@/features/planner/asset-engine/mesh/placeModularWithGeneratedGlbBrowser";
import type { PlannerCatalogItem } from "@/features/planner/project/catalog/catalogTypes";
import type { PlannerProject } from "@/features/planner/project/model/types";

function emptyProject(): PlannerProject {
  return {
    id: "project-browser-place",
    name: "Browser place",
    activeFloorId: "floor-1",
    displayUnit: "mm",
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z",
    floors: [
      {
        id: "floor-1",
        name: "Floor 1",
        level: 0,
        walls: [],
        rooms: [],
        doors: [],
        windows: [],
        furniture: [],
        stairs: [],
        columns: [],
        guides: [],
        measurements: [],
        annotations: [],
        textAnnotations: [],
        groups: [],
      },
    ],
  };
}

function modularCatalogItem(): PlannerCatalogItem {
  return {
    id: "cabinet-v0",
    slug: "cabinet-v0",
    sku: "CAB-V0",
    name: "Cabinet V0",
    shortName: "Cabinet",
    description: "Modular",
    category: "Furniture",
    subCategory: "Cabinets",
    taxonomyPath: "Furniture > Cabinets",
    dimensions: { widthMm: 600, depthMm: 580, heightMm: 720 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: {
      marketingMaterial: "White",
      normalizedMaterial: "white",
    },
    roomTags: ["Kitchen"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "flat-pack",
    flatPack: true,
    tags: ["cabinet"],
    variants: [],
    provenance: { source: "sample_data" },
    symbolOnly: false,
    geometryMode: "modular-cabinet-v0",
  };
}

describe("writeGeneratedGlbViaApi", () => {
  it("POSTs buffer and returns publicUrlPath on ok body", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        relativePath: "catalog-assets/generated/cab.glb",
        publicUrlPath: "/catalog-assets/generated/cab.glb",
        byteLength: 4,
      }),
    })) as unknown as typeof fetch;

    const result = await writeGeneratedGlbViaApi(
      new Uint8Array([1, 2, 3, 4]).buffer,
      "catalog-assets/generated/cab.glb",
      { fetchImpl },
    );

    expect(result.publicUrlPath).toBe("/catalog-assets/generated/cab.glb");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/planner/generated-glb");
    expect(init.method).toBe("POST");
    expect(
      (init.headers as Record<string, string>)["X-Generated-Glb-Relative-Path"],
    ).toBe("catalog-assets/generated/cab.glb");
  });

  it("throws when HTTP not ok", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ ok: false }),
    })) as unknown as typeof fetch;

    await expect(
      writeGeneratedGlbViaApi(new ArrayBuffer(8), "catalog-assets/generated/x.glb", {
        fetchImpl,
      }),
    ).rejects.toThrow(/HTTP 500/);
  });
});

describe("placeModularWithGeneratedGlbBrowser", () => {
  it("writeToPublic true: stamps after successful write API", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        relativePath: "catalog-assets/generated/placeholder.glb",
        publicUrlPath: "/catalog-assets/generated/placeholder.glb",
        byteLength: 100,
      }),
    })) as unknown as typeof fetch;

    const result = await placeModularWithGeneratedGlbBrowser(
      emptyProject(),
      modularCatalogItem(),
      { x: 1000, y: 2000 },
      { placedFrom: "click", writeToPublic: true, fetchImpl },
    );

    expect(result.stamped).toBe(true);
    expect(result.written).toBe(true);
    expect(result.publicUrlPath).toBe(
      "/catalog-assets/generated/placeholder.glb",
    );
    const furniture = result.project.floors[0]?.furniture[0];
    expect(furniture?.generatedGlbUrl).toBeDefined();
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(fetchImpl).toHaveBeenCalled();
  });

  it("write API failure leaves furniture unstamped (procedural)", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ ok: false }),
    })) as unknown as typeof fetch;

    const result = await placeModularWithGeneratedGlbBrowser(
      emptyProject(),
      modularCatalogItem(),
      { x: 0, y: 0 },
      { placedFrom: "click", writeToPublic: true, fetchImpl },
    );

    expect(result.stamped).toBe(false);
    expect(result.written).toBe(false);
    const furniture = result.project.floors[0]?.furniture[0];
    expect(furniture?.generatedGlbUrl).toBeUndefined();
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
  });

  it("writeToPublic false: stamps without fetch", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    const result = await placeModularWithGeneratedGlbBrowser(
      emptyProject(),
      modularCatalogItem(),
      { x: 0, y: 0 },
      { writeToPublic: false, fetchImpl },
    );

    expect(result.stamped).toBe(true);
    expect(result.written).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result.project.floors[0]?.furniture[0]?.generatedGlbUrl).toBeDefined();
  });
});
