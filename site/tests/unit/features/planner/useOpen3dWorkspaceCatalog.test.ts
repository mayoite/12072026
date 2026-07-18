import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type PropsWithChildren } from "react";

import { usePlannerWorkspaceCatalog, usePlannerSvgCatalog } from "@/features/planner/catalog/usePlannerWorkspaceCatalog";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

function renderCatalogHook() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    createElement(QueryClientProvider, { client }, children)
  );
  return renderHook(() => usePlannerWorkspaceCatalog(), { wrapper });
}

function brandHeroItem(
  overrides: Partial<PlannerCatalogItem> & Pick<PlannerCatalogItem, "id" | "name">,
): PlannerCatalogItem {
  return {
    slug: overrides.id,
    sku: overrides.sku ?? overrides.id.toUpperCase(),
    shortName: overrides.shortName ?? overrides.name,
    description: overrides.description ?? "Brand hero",
    category: "Furniture",
    subCategory: "Desks & Workstations",
    taxonomyPath: "Furniture > Desks & Workstations",
    dimensions: { widthMm: 1600, depthMm: 800, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [], previewImageUrl: "/svg-catalog/hero.svg" },
    material: { marketingMaterial: "Laminate", normalizedMaterial: "laminate" },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "flat-pack",
    flatPack: true,
    tags: ["desk", "workstation"],
    variants: [],
    provenance: { source: "descriptor-loader" },
    symbolOnly: false,
    ...overrides,
  };
}

describe("usePlannerWorkspaceCatalog", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exports usePlannerSvgCatalog as the Phase 06 plan alias", () => {
    expect(usePlannerSvgCatalog).toBe(usePlannerWorkspaceCatalog);
  });

  it("loads brand-hero items from svg-blocks / configurator API", async () => {
    const liveItem = brandHeroItem({
      id: "oando-fluid-desk-1600",
      name: "Fluid Desk 1600",
      sku: "OANDO-FLUID-DSK-1600",
      description: "Live workstation",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [liveItem] }),
      }),
    );

    const { result } = renderCatalogHook();

    await waitFor(() => {
      expect(result.current.status).toBe("ready");
    });

    expect(result.current.items.some((item) => item.id === "oando-fluid-desk-1600")).toBe(
      true,
    );
    expect(result.current.resolveItem("oando-fluid-desk-1600")?.name).toBe(
      "Fluid Desk 1600",
    );

    vi.unstubAllGlobals();
  });

  it("starts in loading state with isLoading true and empty guest list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      }),
    );
    const { result } = renderCatalogHook();
    expect(result.current.status).toBe("loading");
    expect(result.current.isLoading).toBe(true);
    // No demo pollution while loading (P18 / BQ4).
    expect(result.current.items).toEqual([]);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    vi.unstubAllGlobals();
  });

  it("falls back to honest empty list (no demo seed) when API returns no items", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      }),
    );

    const { result } = renderCatalogHook();

    await waitFor(() => {
      expect(result.current.status).not.toBe("loading");
    });

    expect(result.current.status).toBe("fallback");
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(false);

    vi.unstubAllGlobals();
  });

  it("resolveItem returns undefined for unknown id after load", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      }),
    );
    const { result } = renderCatalogHook();
    await waitFor(() => expect(result.current.status).not.toBe("loading"));
    expect(result.current.resolveItem("nonexistent-xyz")).toBeUndefined();
    vi.unstubAllGlobals();
  });

  it("keeps brand heroes from loader primary and drops non-hero pollution", async () => {
    const liveItem = brandHeroItem({
      id: "oando-breeze-task-chair",
      name: "Breeze Task Chair",
      sku: "OANDO-BREEZE-CHR-TSK",
    });
    const pollution: PlannerCatalogItem = {
      ...liveItem,
      id: "sample-sofa-1",
      slug: "sample-sofa-1",
      sku: "SAMPLE-SOFA-1",
      name: "Demo Sofa",
      provenance: { source: "sample_data" },
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [liveItem, pollution] }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderCatalogHook();
    await waitFor(() => expect(result.current.status).not.toBe("loading"));
    expect(result.current.items.map((i) => i.id)).toEqual(["oando-breeze-task-chair"]);
    expect(result.current.items.some((i) => i.id === "sample-sofa-1")).toBe(false);
    vi.unstubAllGlobals();
  });

  it("does not report loading after data settles even when status is ready", async () => {
    const liveItem = brandHeroItem({
      id: "oando-fluid-desk-1600",
      name: "Fluid Desk 1600",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ items: [liveItem] }),
      }),
    );
    const { result } = renderCatalogHook();
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.items.length).toBeGreaterThan(0);
    vi.unstubAllGlobals();
  });
});
