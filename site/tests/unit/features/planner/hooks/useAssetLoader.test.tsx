import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAssetLoader } from "@/features/planner/hooks/useAssetLoader";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { Mesh, Matrix4 } from "three";

vi.mock("@/features/planner/shared/catalog/catalogAdapter", () => ({
  loadPlannerCatalog: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  useGLTF: {
    preload: vi.fn(),
  },
}));

vi.mock("@react-three/fiber", () => ({
  useLoader: vi.fn(),
}));

vi.mock("three", async (importOriginal) => {
  const original = await importOriginal<any>();
  class MockMesh {
    name = "mock-mesh";
    geometry = {};
    material = {};
    matrixWorld = new original.Matrix4();
    castShadow = true;
    receiveShadow = false;
  }
  return {
    ...original,
    Mesh: MockMesh,
  };
});

describe("useAssetLoader", () => {
  const mockCatalogItems = [
    {
      id: "item-1",
      name: "Item 1",
      modelUrl: "https://example.com/item1.glb",
      thumbnail: "https://example.com/item1.svg",
      color: "#ff0000",
      dimensions: {
        widthMm: 1000,
        depthMm: 800,
        heightMm: 750,
      },
    },
    {
      id: "item-2",
      name: "Item 2",
      modelUrl: "https://example.com/item2.glb",
      imageUrl: "https://example.com/item2.png",
      dimensions: {
        widthMm: 1200,
        depthMm: 900,
        heightMm: 800,
      },
    },
  ] as any[];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads catalog using loadCatalog if catalogItems is not provided", async () => {
    const loadCatalogMock = vi.fn().mockResolvedValue(mockCatalogItems);
    vi.mocked(useLoader).mockReturnValue([]);

    const { result } = renderHook(() =>
      useAssetLoader({
        catalogIds: ["item-1"],
        loadCatalog: loadCatalogMock,
      })
    );

    expect(result.current.isLoadingCatalog).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoadingCatalog).toBe(false);
    });

    expect(loadCatalogMock).toHaveBeenCalledTimes(1);
    expect(result.current.catalogById.get("item-1")?.modelUrl).toBe(
      "https://example.com/item1.glb"
    );
  });

  it("uses provided catalogItems immediately without loading", () => {
    vi.mocked(useLoader).mockReturnValue([]);

    const { result } = renderHook(() =>
      useAssetLoader({
        catalogIds: ["item-1", "item-2"],
        catalogItems: mockCatalogItems,
      })
    );

    expect(result.current.isLoadingCatalog).toBe(false);
    expect(result.current.catalogById.size).toBe(2);
    expect(result.current.catalogById.get("item-1")?.dimensionsMm.width).toBe(1000);
  });

  it("preloads and loads GLTF assets when enabled", () => {
    const mockGltf = {
      scene: {
        updateMatrixWorld: vi.fn(),
        matrixWorld: new Matrix4(),
        traverse: (cb: any) => {
          const mesh = new Mesh();
          cb(mesh);
        },
      },
    };

    vi.mocked(useLoader).mockReturnValue([mockGltf]);

    const { result } = renderHook(() =>
      useAssetLoader({
        catalogIds: ["item-1"],
        catalogItems: mockCatalogItems,
        enabled: true,
      })
    );

    expect(useGLTF.preload).toHaveBeenCalledWith("https://example.com/item1.glb");
    expect(useLoader).toHaveBeenCalledWith(expect.any(Function), ["https://example.com/item1.glb"]);

    const asset = result.current.assetsByCatalogId.get("item-1");
    expect(asset).toBeDefined();
    expect(asset?.primitives.length).toBe(1);
    expect(asset?.primitives[0].key).toBe("mock-mesh-0");
  });

  it("handles missing catalog IDs", () => {
    vi.mocked(useLoader).mockReturnValue([]);

    const { result } = renderHook(() =>
      useAssetLoader({
        catalogIds: ["item-1", "item-nonexistent"],
        catalogItems: mockCatalogItems,
      })
    );

    expect(result.current.missingCatalogIds).toEqual(["item-nonexistent"]);
  });

  it("does not load if enabled is false", () => {
    vi.mocked(useLoader).mockReturnValue([]);

    renderHook(() =>
      useAssetLoader({
        catalogIds: ["item-1"],
        catalogItems: mockCatalogItems,
        enabled: false,
      })
    );

    expect(useLoader).toHaveBeenCalledWith(expect.any(Function), []);
  });
});
