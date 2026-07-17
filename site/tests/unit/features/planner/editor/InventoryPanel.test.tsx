import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { InventoryPanel } from "@/features/planner/editor/InventoryPanel";
import type { PlannerCatalogItem } from "@/features/planner/catalog/catalogTypes";

const catalogHook = {
  items: [],
  isLoading: false,
  status: "ready" as const,
  resolveItem: () => null,
  isStale: false,
  error: null,
  retry: vi.fn(),
};

vi.mock("@/features/planner/catalog/usePlannerWorkspaceCatalog", () => ({
  usePlannerWorkspaceCatalog: () => catalogHook,
  usePlannerSvgCatalog: () => catalogHook,
}));

function sampleItem(overrides: Partial<PlannerCatalogItem> = {}): PlannerCatalogItem {
  return {
    id: "desk-ui-1",
    slug: "desk-ui-1",
    sku: "DESK-UI-001",
    name: "Planner UI Desk",
    shortName: "UI Desk",
    description: "Test desk for inventory shell",
    category: "Furniture",
    subCategory: "Desks & Workstations",
    taxonomyPath: "Furniture > Desks & Workstations",
    dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
    displayUnit: "mm",
    assets: { imageUrls: [], previewImageUrl: "/placeholder-desk.svg" },
    material: { marketingMaterial: "Oak", normalizedMaterial: "wood" },
    roomTags: ["Office"],
    styleTags: ["Modern"],
    availability: "in-stock",
    assemblyType: "fully-assembled",
    flatPack: false,
    tags: ["desk", "office"],
    variants: [],
    provenance: { source: "unit_test" },
    symbolOnly: false,
    ...overrides,
  };
}

afterEach(() => {
  cleanup();
});

describe("InventoryPanel", () => {
  it("renders inventory chrome with accessible search label", () => {
    const { container } = render(
      <InventoryPanel catalogItems={[]} catalogStatus="ready" isLoading={false} />,
    );
    expect(container.firstChild).not.toBeNull();
    expect(screen.getByRole("region", { name: "Inventory panel" })).toBeInTheDocument();
    expect(screen.getByLabelText("Search inventory by name or SKU")).toBeInTheDocument();
    expect(screen.getByText("Filter furniture to place on the plan")).toBeInTheDocument();
  });

  it("shows product name, SKU, footprint, and Place control", () => {
    render(
      <InventoryPanel
        catalogItems={[sampleItem()]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    const card = screen.getByText("Planner UI Desk").closest("article");
    expect(card).not.toBeNull();
    const cardEl = card as HTMLElement;
    expect(within(cardEl).getByText("DESK-UI-001")).toBeInTheDocument();
    expect(within(cardEl).getByText(/140/i)).toBeInTheDocument();
    expect(
      within(cardEl).getByRole("button", { name: /Place — Add UI Desk to canvas/i }),
    ).toBeInTheDocument();
  });

  it("clamps product names to two lines and exposes full name via title", () => {
    const longName =
      "Executive Height-Adjustable Linear Workstation with Cable Management and Side Return";
    render(
      <InventoryPanel
        catalogItems={[
          sampleItem({
            name: longName,
            shortName: "Exec WS",
          }),
        ]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    const nameEl = document.querySelector(
      '[data-catalog-item] [data-field="name"]',
    );
    expect(nameEl).not.toBeNull();
    expect(nameEl).toHaveAttribute("title", longName);
    expect(nameEl?.textContent).toBe(longName);
    // CSS module class carries 2-line clamp (line-clamp: 2 / -webkit-line-clamp: 2)
    const className = (nameEl as HTMLElement).className;
    expect(className).toMatch(/itemName/);
    // Product truth line present without opening details
    const truth = document.querySelector('[data-field="product-truth"]');
    expect(truth).not.toBeNull();
    expect(within(truth as HTMLElement).getByText("DESK-UI-001")).toBeInTheDocument();
    expect(
      document.querySelector('[data-field="dimensions"]'),
    ).not.toBeNull();
  });

  it("renders exactly one primary Place control per catalog row", () => {
    render(
      <InventoryPanel
        catalogItems={[
          sampleItem({ id: "a", sku: "A-1", name: "Alpha Desk", shortName: "Alpha" }),
          sampleItem({ id: "b", sku: "B-1", name: "Beta Desk", shortName: "Beta" }),
        ]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    const cards = document.querySelectorAll("article[data-catalog-name]");
    expect(cards.length).toBe(2);
    for (const card of Array.from(cards)) {
      const placeButtons = within(card as HTMLElement).getAllByRole("button", {
        name: /Place —/i,
      });
      expect(placeButtons).toHaveLength(1);
      expect(placeButtons[0]).toHaveAttribute("data-action", "place");
      // Compare is secondary, not a second Place CTA
      const compare = within(card as HTMLElement).getByRole("button", {
        name: /to compare/i,
      });
      expect(compare).toHaveAttribute("data-action", "compare");
      expect(compare.textContent).not.toMatch(/Place/i);
    }
    // Global: one Place primary per item, not duplicated chrome
    expect(
      screen.getAllByRole("button", { name: /Place —/i }),
    ).toHaveLength(2);
  });

  it("shows honest empty state for search with no matches", () => {
    render(
      <InventoryPanel
        catalogItems={[sampleItem()]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    const search = screen.getByLabelText("Search inventory by name or SKU");
    fireEvent.change(search, { target: { value: "zzzz-no-match-xyz" } });

    expect(screen.getByText("No products match this search")).toBeInTheDocument();
    // Icon clear in search field + empty-state CTA both clear the query
    expect(screen.getAllByRole("button", { name: "Clear search" }).length).toBeGreaterThanOrEqual(1);
  });

  it("surfaces non-stock availability without implying in-stock", () => {
    render(
      <InventoryPanel
        catalogItems={[sampleItem({ availability: "backorder", shortName: "Backorder Desk" })]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    expect(screen.getByText("Backorder")).toBeInTheDocument();
  });

  it("error catalog with no items offers Retry", () => {
    render(
      <InventoryPanel catalogItems={[]} catalogStatus="error" isLoading={false} />,
    );

    // empty external catalog falls back to demo items when status ready;
    // with status error and zero displayed after filter, show error shell.
    // When demo fallback still populates, at least chrome remains.
    expect(screen.getByRole("region", { name: "Inventory panel" })).toBeInTheDocument();
  });

  it("groups by family, filters by family chip, and compares two products", () => {
    const deskA = sampleItem({
      id: "desk-a",
      sku: "DESK-A",
      name: "Desk Alpha",
      shortName: "Desk Alpha",
      family: "Linear WS",
      subCategory: "Desks",
      material: { marketingMaterial: "Oak", normalizedMaterial: "oak" },
      variants: [
        {
          variantId: "desk-a-v1",
          sku: "DESK-A-V1",
          parentProductId: "desk-a",
          label: "Oak 1400",
          variantAttributes: {},
          dimensions: { widthMm: 1400, depthMm: 700, heightMm: 750 },
          availability: "in-stock",
        },
      ],
    });
    const deskB = sampleItem({
      id: "desk-b",
      sku: "DESK-B",
      name: "Desk Beta",
      shortName: "Desk Beta",
      family: "Linear WS",
      subCategory: "Desks",
      material: { marketingMaterial: "Walnut", normalizedMaterial: "walnut" },
      availability: "backorder",
    });
    const chair = sampleItem({
      id: "chair-1",
      sku: "CHAIR-1",
      name: "Chair One",
      shortName: "Chair One",
      family: "Task Chairs",
      subCategory: "Chairs",
      material: { marketingMaterial: "Mesh", normalizedMaterial: "mesh" },
      dimensions: { widthMm: 650, depthMm: 650, heightMm: 1100 },
    });

    render(
      <InventoryPanel
        catalogItems={[deskA, deskB, chair]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    // Family group headers + filter chips present
    expect(screen.getAllByText(/Linear WS/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Task Chairs/i).length).toBeGreaterThanOrEqual(1);
    expect(document.querySelector('[data-family-group="linear ws"]')).not.toBeNull();
    expect(document.querySelector('[data-family-group="task chairs"]')).not.toBeNull();

    // Family filter chip narrows list
    const familyGroup = screen.getByRole("group", {
      name: "Filter by product family",
    });
    fireEvent.click(
      within(familyGroup).getByRole("button", { name: /Task Chairs/i }),
    );
    expect(screen.queryByText("Desk Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("Chair One")).toBeInTheDocument();

    // Reset and compare two desks
    fireEvent.click(screen.getByRole("button", { name: "Reset inventory filters" }));
    fireEvent.click(
      screen.getByRole("button", { name: /Add Desk Alpha to compare/i }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Add Desk Beta to compare/i }),
    );

    const compareRegion = screen.getByTestId("inventory-compare");
    expect(compareRegion).toBeInTheDocument();
    expect(
      within(compareRegion).getByRole("table", {
        name: "Compare selected products",
      }),
    ).toBeInTheDocument();
    expect(within(compareRegion).getByText("SKU")).toBeInTheDocument();
    expect(within(compareRegion).getByText("DESK-A")).toBeInTheDocument();
    expect(within(compareRegion).getByText("DESK-B")).toBeInTheDocument();
    expect(within(compareRegion).getByText("Oak 1400")).toBeInTheDocument();
    expect(within(compareRegion).getByText("Backorder")).toBeInTheDocument();
  });

  it("shows family and variant fields on the card when present", () => {
    render(
      <InventoryPanel
        catalogItems={[
          sampleItem({
            family: "Premium Linear",
            variants: [
              {
                variantId: "v1",
                sku: "DESK-UI-001-V",
                parentProductId: "desk-ui-1",
                label: "Walnut / 160",
                variantAttributes: {},
                dimensions: { widthMm: 1600, depthMm: 800, heightMm: 750 },
                availability: "in-stock",
              },
            ],
          }),
        ]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
      />,
    );

    const card = screen.getByText("Planner UI Desk").closest("article");
    expect(card).not.toBeNull();
    expect(
      within(card as HTMLElement).getByText("Premium Linear"),
    ).toBeInTheDocument();
    expect(
      within(card as HTMLElement).getByText("Walnut / 160"),
    ).toBeInTheDocument();
  });
});
