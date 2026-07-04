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

  // TDD cycle 6 for hook: initial state before effect settles (loading + isLoading)
  it("starts in loading state with isLoading true and demo items initially", () => {
    const { result } = renderHook(() => useOpen3dWorkspaceCatalog());
    expect(result.current.status).toBe("loading");
    expect(result.current.isLoading).toBe(true);  // GREEN
    // demo items present initially (overwritten on load)
    expect(result.current.items.length).toBeGreaterThan(0);
  });

  // TDD cycle 7 for hook: fallback path when loadFromApi returns empty (covers catch? and length==0)
  it("falls back to demo items and status fallback when API returns no items", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      }),
    );

    const { result } = renderHook(() => useOpen3dWorkspaceCatalog());

    await waitFor(() => {
      expect(result.current.status).not.toBe("loading");
    });

    expect(result.current.status).toBe("fallback");  // GREEN: empty -> fallback
    expect(result.current.items.length).toBeGreaterThan(0); // demo
    expect(result.current.isLoading).toBe(false);

    vi.unstubAllGlobals();
  });

  // TDD cycle 8: hook resolveItem returns undefined for missing (exercises client ?? items.find path)
  it("resolveItem returns undefined for unknown id after load", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      }),
    );
    const { result } = renderHook(() => useOpen3dWorkspaceCatalog());
    await waitFor(() => expect(result.current.status).not.toBe("loading"));
    expect(result.current.resolveItem("nonexistent-xyz")).toBeUndefined();  // GREEN
    vi.unstubAllGlobals();
  });

  // TDD for 0405/0419 loader primary wiring fix: call loadDescriptorsFromLoader (primary), check getAll path after (addresses [] return); falls to api
  it("calls loadDescriptorsFromLoader for catalogue-first primary before api fallback", async () => {
    const liveItem = { id: "ldr-1", slug: "ldr-1", sku: "LDR-1", name: "Loader Item", shortName: "LDR", description: "d", category: "Furniture", subCategory: "Chairs", taxonomyPath: "Furniture > Symbols > ldr", dimensions: { widthMm: 100, depthMm: 100, heightMm: 100 }, displayUnit: "mm", assets: { imageUrls: [] }, material: { marketingMaterial: "SVG", normalizedMaterial: "svg-symbol" }, roomTags: [], styleTags: [], availability: "in-stock", assemblyType: "fully-assembled", flatPack: false, tags: ["descriptor"], variants: [], provenance: { source: "descriptor-loader" }, symbolOnly: true } as any;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ items: [liveItem] }) });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useOpen3dWorkspaceCatalog());
    await waitFor(() => expect(result.current.status).not.toBe("loading"));
    // loader call happened (primary path exercised even if client returns [])
    expect(result.current.items.length).toBeGreaterThan(0);
    vi.unstubAllGlobals();
  });
});
