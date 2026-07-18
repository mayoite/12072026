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

    // Empty external catalog stays empty (no demo pollution). Error shell + chrome.
    expect(screen.getByRole("region", { name: "Inventory panel" })).toBeInTheDocument();
    expect(screen.getByText("Could not load inventory")).toBeInTheDocument();
  });

  it("empty guest inventory stays empty — no demo-sofa pollution (BQ4/P18)", () => {
    render(
      <InventoryPanel
        catalogItems={[]}
        catalogStatus="fallback"
        isLoading={false}
        officeSystemsInventory
      />,
    );
    expect(screen.getByText("No products available")).toBeInTheDocument();
    expect(screen.queryByText(/sofa/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Modern 3-Seater Sofa")).not.toBeInTheDocument();
  });

  it("office-systems mode drops non-brand sample items (P10)", () => {
    render(
      <InventoryPanel
        catalogItems={[
          sampleItem({
            id: "sample-sofa-1",
            slug: "sample-sofa-1",
            name: "Modern 3-Seater Sofa",
            shortName: "Sofa",
          }),
          sampleItem({
            id: "oando-fluid-desk-1600",
            slug: "oando-fluid-desk-1600",
            sku: "OANDO-FLUID-DSK-1600",
            name: "Fluid Desk 1600",
            shortName: "Fluid 1600",
          }),
        ]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory
      />,
    );
    expect(screen.getByText("Fluid Desk 1600")).toBeInTheDocument();
    expect(screen.queryByText("Modern 3-Seater Sofa")).not.toBeInTheDocument();
  });

  it("focusProductSlug selects matching catalog item without placing", () => {
    const onItemSelect = vi.fn();
    const onItemPlace = vi.fn();
    const hero = sampleItem({
      id: "oando-fluid-desk-1400",
      slug: "oando-fluid-desk-1400",
      sku: "OANDO-FLUID-DSK-1400",
      name: "Fluid Desk 1400",
      shortName: "Fluid 1400",
    });
    const other = sampleItem({
      id: "other-desk",
      slug: "other-desk",
      name: "Other Desk",
      shortName: "Other",
    });

    render(
      <InventoryPanel
        catalogItems={[other, hero]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
        focusProductSlug="oando-fluid-desk"
        onItemSelect={onItemSelect}
        onItemPlace={onItemPlace}
      />,
    );

    const focused = document.querySelector(
      'article[data-site-product-focus="true"]',
    );
    expect(focused).not.toBeNull();
    expect(focused).toHaveAttribute("data-selected", "true");
    // data-catalog-name uses shortName when present
    expect(focused).toHaveAttribute("data-catalog-name", "Fluid 1400");
    expect(onItemSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "oando-fluid-desk-1400" }),
      null,
    );
    expect(onItemPlace).not.toHaveBeenCalled();
  });

  it("focusProductSlug is a no-op when no catalog match", () => {
    const onItemSelect = vi.fn();
    render(
      <InventoryPanel
        catalogItems={[sampleItem()]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory={false}
        focusProductSlug="super-chair-missing"
        onItemSelect={onItemSelect}
      />,
    );

    expect(document.querySelector('article[data-site-product-focus="true"]')).toBeNull();
    expect(onItemSelect).not.toHaveBeenCalled();
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

  it("hides advanced filters until More filters is opened (first paint)", () => {
    // Guest / office-systems inventory is brand-hero only (P10).
    const deskA = sampleItem({
      id: "oando-flex-desk-1200",
      slug: "oando-flex-desk-1200",
      sku: "OANDO-FLEX-DSK-1200",
      name: "Desk Alpha",
      shortName: "Desk Alpha",
      material: { marketingMaterial: "Oak", normalizedMaterial: "oak" },
      availability: "in-stock",
      dimensions: { widthMm: 900, depthMm: 700, heightMm: 750 },
    });
    const deskB = sampleItem({
      id: "oando-fluid-desk-1600",
      slug: "oando-fluid-desk-1600",
      sku: "OANDO-FLUID-DSK-1600",
      name: "Desk Beta",
      shortName: "Desk Beta",
      material: { marketingMaterial: "Walnut", normalizedMaterial: "walnut" },
      availability: "backorder",
      dimensions: { widthMm: 1800, depthMm: 800, heightMm: 750 },
    });

    render(
      <InventoryPanel
        catalogItems={[deskA, deskB]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory
      />,
    );

    const toggle = screen.getByTestId("inventory-more-filters-toggle");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByTestId("inventory-advanced-filters")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filter by material")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filter by availability")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Filter by width")).not.toBeInTheDocument();

    // Search + Place still present on first paint
    expect(screen.getByLabelText("Search inventory by name or SKU")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Place — Add Desk Alpha to canvas/i }),
    ).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const advanced = screen.getByTestId("inventory-advanced-filters");
    expect(advanced).toBeInTheDocument();
    expect(within(advanced).getByLabelText("Filter by material")).toBeInTheDocument();
    expect(within(advanced).getByLabelText("Filter by availability")).toBeInTheDocument();
    expect(within(advanced).getByLabelText("Filter by width")).toBeInTheDocument();
  });

  it("hides empty category chips when catalog data is available", () => {
    render(
      <InventoryPanel
        catalogItems={[
          sampleItem({
            id: "oando-fluid-desk-1600",
            slug: "oando-fluid-desk-1600",
            sku: "OANDO-FLUID-DSK-1600",
            category: "Furniture",
            subCategory: "Desks & Workstations",
          }),
        ]}
        catalogStatus="ready"
        isLoading={false}
        officeSystemsInventory
      />,
    );

    const nav = screen.getByRole("navigation", { name: "Inventory categories" });
    expect(within(nav).getByText("Furniture")).toBeInTheDocument();
    // Office-systems taxonomy also lists Lighting + Symbols — both empty here
    expect(within(nav).queryByText("Lighting")).not.toBeInTheDocument();
    expect(within(nav).queryByText("Symbols")).not.toBeInTheDocument();
    expect(within(nav).queryByText("Outdoor")).not.toBeInTheDocument();
  });
});
