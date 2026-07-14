import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CatalogPanel } from "@/features/planner/catalog-api/CatalogPanel";
import { usePlannerCatalogStore } from "@/features/planner/catalog-api/catalogStore";

vi.mock("@/features/planner/catalog-api/catalogStore", () => ({
  usePlannerCatalogStore: vi.fn(),
}));

vi.mock("@/features/planner/catalog-api/CatalogBlockPreview", () => ({
  CatalogBlockPreview: () => <div data-testid="block-preview" />,
}));

vi.mock("@/features/planner/catalog-api/catalogDrop", () => ({
  hideNativeDragPreview: vi.fn(),
}));

vi.mock("@/features/planner/catalog-api/shapeTypeRegistry", () => ({
  writeCatalogDragPayload: vi.fn(),
  isCatalogShapeType: vi.fn().mockReturnValue(false),
  isRoomCatalogShapeType: vi.fn().mockReturnValue(false),
  PlannerCatalogShapeType: { desk: "desk", zone: "zone" },
  catalogShapeTypeToFurnitureType: vi.fn().mockReturnValue("desk"),
}));

describe("CatalogPanel", () => {
  const mockSetQuery = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getMockStore = (overrides = {}) => ({
    query: "",
    setQuery: mockSetQuery,
    items: [
      { id: "desk-1", name: "Buddy Task Desk", description: "Laminate top desk", tags: ["desks"], category: "desks", widthMm: 120, heightMm: 60, shapeType: "linear" },
    ],
    catalogSource: "buddy",
    managedCount: 5,
    catalogHydrating: false,
    purposeFilter: null,
    recentIds: [],
    ...overrides,
  });

  it("renders catalog items and updates search query", () => {
    vi.mocked(usePlannerCatalogStore).mockImplementation((selector: any) =>
      selector(getMockStore())
    );

    render(<CatalogPanel />);

    expect(screen.getByText("Element library")).toBeInTheDocument();
    expect(screen.getByText("Buddy Task Desk")).toBeInTheDocument();

    const searchInput = screen.getByLabelText("Search catalog elements");
    fireEvent.change(searchInput, { target: { value: "Desk" } });
    expect(mockSetQuery).toHaveBeenCalledWith("Desk");
  });

  it("clicks catalog items to trigger place action", () => {
    const mockItemClick = vi.fn();
    vi.mocked(usePlannerCatalogStore).mockImplementation((selector: any) =>
      selector(getMockStore())
    );

    render(<CatalogPanel onItemClick={mockItemClick} />);

    const itemBtn = screen.getByLabelText("Add Buddy Task Desk to canvas");
    fireEvent.click(itemBtn);

    expect(mockItemClick).toHaveBeenCalled();
  });
});
