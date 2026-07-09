import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  placeModularWithGeneratedGlbPlan,
  stampFurnitureFromModularOptions,
  stampFurnitureGeneratedGlb,
} from "@/features/planner/asset-engine";
import { modularCabinetV0GeneratedRelativePath } from "@/features/planner/open3d/catalog/modularCabinetV0GlbExport";
import { defaultCabinetV0Options } from "@/features/planner/open3d/catalog/modularCabinetV0";
import { placeCatalogItemInProject } from "@/features/planner/open3d/catalog/placementAction";
import { isSystemGeneratedGlbUrl } from "@/features/planner/lib/glbAssetPolicy";
import type { Open3dCatalogItem } from "@/features/planner/open3d/catalog/catalogTypes";
import type {
  Open3dFurnitureItem,
  Open3dProject,
} from "@/features/planner/open3d/model/types";

const tempRoots: string[] = [];

function tempPublicRoot(): string {
  const root = mkdtempSync(path.join(tmpdir(), "p0-2-place-modular-"));
  tempRoots.push(root);
  return root;
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const root = tempRoots.pop();
    if (root) {
      try {
        rmSync(root, { recursive: true, force: true });
      } catch {
        // best-effort cleanup
      }
    }
  }
});

function emptyProject(): Open3dProject {
  return {
    id: "project-modular-place-stamp",
    name: "Modular place stamp",
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

function modularCatalogItem(
  overrides: Partial<Open3dCatalogItem> = {},
): Open3dCatalogItem {
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
    ...overrides,
  };
}

function boxCatalogItem(): Open3dCatalogItem {
  return {
    id: "sample-desk-1",
    slug: "sample-desk-1",
    sku: "DESK-001",
    name: "Desk",
    shortName: "Desk",
    description: "Desk",
    category: "Furniture",
    subCategory: "Desks",
    taxonomyPath: "Furniture > Desks",
    dimensions: { widthMm: 1600, depthMm: 800, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [] },
    material: {
      marketingMaterial: "Oak",
      normalizedMaterial: "oak",
    },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "flat-pack",
    flatPack: true,
    tags: ["desk"],
    variants: [],
    provenance: { source: "sample_data" },
    symbolOnly: false,
    geometryMode: "box",
  };
}

function sampleModularFurniture(
  overrides: Partial<Open3dFurnitureItem> = {},
): Open3dFurnitureItem {
  return {
    id: "11111111-1111-4111-8111-111111111111",
    catalogId: "cabinet-v0",
    position: { x: 0, y: 0 },
    rotation: 0,
    scale: { x: 1, y: 1, z: 1 },
    geometryMode: "modular-cabinet-v0",
    modularOptions: defaultCabinetV0Options({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    }),
    ...overrides,
  };
}

const defaultCabinetPath = modularCabinetV0GeneratedRelativePath(
  defaultCabinetV0Options({
    widthMm: 600,
    depthMm: 580,
    heightMm: 720,
    doorStyle: "slab",
    material: "white",
  }),
);

describe("stampFurnitureFromModularOptions (path-only stamp)", () => {
  it("stamps modularCabinetV0GeneratedRelativePath without binary export", () => {
    const item = sampleModularFurniture();
    expect(item.generatedGlbUrl).toBeUndefined();

    const expected = modularCabinetV0GeneratedRelativePath(
      defaultCabinetV0Options(item.modularOptions),
    );
    expect(isSystemGeneratedGlbUrl(expected)).toBe(true);

    const stamped = stampFurnitureFromModularOptions(item);
    expect(stamped.generatedGlbUrl).toBe(expected);
    expect(stamped.geometryMode).toBe("modular-cabinet-v0");
    // Original unchanged.
    expect(item.generatedGlbUrl).toBeUndefined();
    // Same result as explicit path stamp.
    expect(stampFurnitureGeneratedGlb(item, expected).generatedGlbUrl).toBe(
      expected,
    );
  });

  it("documents path-only: plan path may not exist on disk yet", () => {
    const stamped = stampFurnitureFromModularOptions(sampleModularFurniture());
    // Path is under generated marker; no upload / file write claimed.
    expect(stamped.generatedGlbUrl).toMatch(
      /^catalog-assets\/generated\/modular-cabinet-v0-/,
    );
    expect(stamped.generatedGlbUrl?.endsWith(".glb")).toBe(true);
  });

  it("rejects non-modular furniture", () => {
    expect(() =>
      stampFurnitureFromModularOptions(
        sampleModularFurniture({
          geometryMode: "box",
          modularOptions: undefined,
        }),
      ),
    ).toThrow(/modular-cabinet-v0/i);
  });

  it("rejects modular geometry without modularOptions", () => {
    expect(() =>
      stampFurnitureFromModularOptions(
        sampleModularFurniture({ modularOptions: undefined }),
      ),
    ).toThrow(/modularOptions/i);
  });
});

describe("placeModularWithGeneratedGlbPlan (write + stamp)", () => {
  it("places, exports G5, writes under publicRoot, stamps relativePath", async () => {
    const position = { x: 120, y: 340 };
    const publicRoot = tempPublicRoot();
    const result = await placeModularWithGeneratedGlbPlan(
      emptyProject(),
      modularCatalogItem(),
      position,
      { placedFrom: "api", publicRoot },
    );

    expect(result.stamped).toBe(true);
    expect(result.written).toBe(true);
    expect(result.furnitureId.length).toBeGreaterThan(0);
    expect(isSystemGeneratedGlbUrl(result.relativePath)).toBe(true);
    expect(result.relativePath).toBe(defaultCabinetPath);
    expect(result.publicUrlPath).toBe(`/${defaultCabinetPath}`);
    expect(result.writtenAbsolutePath).toBeTruthy();
    expect(existsSync(result.writtenAbsolutePath!)).toBe(true);
    const bytes = readFileSync(result.writtenAbsolutePath!);
    expect(bytes.byteLength).toBeGreaterThan(100);

    const furniture = result.project.floors[0]?.furniture.find(
      (f) => f.id === result.furnitureId,
    );
    expect(furniture).toBeDefined();
    expect(furniture?.position).toEqual(position);
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.modularOptions).toEqual({
      widthMm: 600,
      depthMm: 580,
      heightMm: 720,
      doorStyle: "slab",
      material: "white",
    });
    expect(furniture?.generatedGlbUrl).toBe(result.relativePath);
    // Return shape has no buffer — path only, not remote-uploaded.
    expect(Object.prototype.hasOwnProperty.call(result, "buffer")).toBe(false);
  }, 30_000);

  it("honest default: plain placeCatalogItemInProject leaves generatedGlbUrl unset", () => {
    const placement = placeCatalogItemInProject(
      emptyProject(),
      modularCatalogItem(),
      null,
      { placedFrom: "click", position: { x: 1, y: 2 } },
    );
    const furniture = placement.result.project.floors[0]?.furniture[0];
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.generatedGlbUrl).toBeUndefined();
  });

  it("writeToPublic:false stamps without disk write (legacy memory stamp)", async () => {
    const result = await placeModularWithGeneratedGlbPlan(
      emptyProject(),
      modularCatalogItem(),
      { x: 0, y: 0 },
      { writeToPublic: false, placedFrom: "api" },
    );
    expect(result.stamped).toBe(true);
    expect(result.written).toBe(false);
    expect(result.writtenAbsolutePath).toBeNull();
    expect(result.publicUrlPath).toBeNull();
    const furniture = result.project.floors[0]?.furniture.find(
      (f) => f.id === result.furnitureId,
    );
    expect(furniture?.generatedGlbUrl).toBe(result.relativePath);
  }, 30_000);

  it("throws for non-modular catalog items", async () => {
    await expect(
      placeModularWithGeneratedGlbPlan(
        emptyProject(),
        boxCatalogItem(),
        { x: 0, y: 0 },
        { publicRoot: tempPublicRoot() },
      ),
    ).rejects.toThrow(/modular-cabinet-v0/i);
  }, 15_000);

  it("respects materialOverride for modular path write+stamp", async () => {
    const publicRoot = tempPublicRoot();
    const result = await placeModularWithGeneratedGlbPlan(
      emptyProject(),
      modularCatalogItem(),
      { x: 0, y: 0 },
      { materialOverride: "oak", placedFrom: "api", publicRoot },
    );
    expect(result.stamped).toBe(true);
    expect(result.written).toBe(true);
    expect(result.relativePath).toContain("-oak.glb");
    expect(existsSync(result.writtenAbsolutePath!)).toBe(true);
    const furniture = result.project.floors[0]?.furniture.find(
      (f) => f.id === result.furnitureId,
    );
    expect(furniture?.modularOptions?.material).toBe("oak");
    expect(furniture?.generatedGlbUrl).toBe(result.relativePath);
  }, 30_000);

  it("write failure leaves furniture unstamped (procedural)", async () => {
    // publicRoot that cannot be created as a directory write target: use a file path.
    const publicRoot = tempPublicRoot();
    const blocked = path.join(publicRoot, "not-a-dir");
    // Create a file so mkdir under .../not-a-dir/catalog-assets fails when parent is a file.
    const { writeFileSync } = await import("node:fs");
    writeFileSync(blocked, "block", "utf8");

    const result = await placeModularWithGeneratedGlbPlan(
      emptyProject(),
      modularCatalogItem(),
      { x: 5, y: 5 },
      { publicRoot: blocked, placedFrom: "api" },
    );

    expect(result.written).toBe(false);
    expect(result.stamped).toBe(false);
    const furniture = result.project.floors[0]?.furniture.find(
      (f) => f.id === result.furnitureId,
    );
    expect(furniture?.geometryMode).toBe("modular-cabinet-v0");
    expect(furniture?.generatedGlbUrl).toBeUndefined();
  }, 30_000);
});

describe("path-only vs write+stamp naming", () => {
  it("path-only and write+stamp converge on the same relativePath for same options", async () => {
    const place = await placeModularWithGeneratedGlbPlan(
      emptyProject(),
      modularCatalogItem(),
      { x: 10, y: 20 },
      { publicRoot: tempPublicRoot() },
    );
    expect(place.stamped).toBe(true);
    expect(place.written).toBe(true);

    const pathOnly = stampFurnitureFromModularOptions(
      sampleModularFurniture({
        modularOptions: defaultCabinetV0Options({
          widthMm: 600,
          depthMm: 580,
          heightMm: 720,
          doorStyle: "slab",
          material: "white",
        }),
      }),
    );

    expect(pathOnly.generatedGlbUrl).toBe(place.relativePath);
    expect(pathOnly.generatedGlbUrl).toBe(
      place.project.floors[0]?.furniture.find((f) => f.id === place.furnitureId)
        ?.generatedGlbUrl,
    );
  }, 30_000);
});
