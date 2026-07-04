import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useOpen3dWorkspaceCatalog } from "@/features/planner/open3d/catalog/useOpen3dWorkspaceCatalog";

describe("useOpen3dWorkspaceCatalog", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("loads live catalog items from the configurator API", async () => {
    const liveItem = {
      id: "ws-1",
      slug: "ws-1",
      sku: "WS-1",
      name: "2 Seater Workstation",
      shortName: "2 Seater",
      description: "Live workstation",
      category: "Furniture",
      subCategory: "Workstations",
      taxonomyPath: "Furniture > Workstations",
      dimensions: { widthMm: 2400, depthMm: 600, heightMm: 750 },
      displayUnit: "mm",
      assets: { imageUrls: [], previewImageUrl: "/img.svg" },
      material: { marketingMaterial: "Laminate", normalizedMaterial: "laminate" },
      roomTags: ["Office"],
      styleTags: ["Modern"],
      availability: "in-stock",
      assemblyType: "flat-pack",
      flatPack: true,
      tags: ["workstation"],
      variants: [],
      provenance: { source: "configurator_api" },
      symbolOnly: false,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [liveItem] }),
      }),
    );

    const { result } = renderHook(() => useOpen3dWorkspaceCatalog());

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.resolveItem("ws-1")?.name).toBe("2 Seater Workstation");

    vi.unstubAllGlobals();
  });
});
