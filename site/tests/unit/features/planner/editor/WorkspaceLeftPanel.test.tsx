import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkspaceLeftPanel } from "@/features/planner/editor/WorkspaceLeftPanel";

const inventoryProps = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === "siteProduct" ? "oando-fluid-desk-1400" : null),
  }),
}));

vi.mock("@/features/planner/editor/InventoryPanel", () => ({
  InventoryPanel: (props: { focusProductSlug?: string | null }) => {
    inventoryProps(props);
    return (
      <div data-testid="inventory" data-focus={props.focusProductSlug ?? ""}>
        inventory
      </div>
    );
  },
}));

describe("WorkspaceLeftPanel", () => {
  it("renders inventory panel (library chrome lives on the inventory surface)", () => {
    inventoryProps.mockClear();
    render(
      <WorkspaceLeftPanel
        catalogItems={[]}
        isLoading={false}
        catalogStatus="ready"
        onItemPlace={vi.fn()}
        onWorkstationConfigPlace={vi.fn()}
        onWorkstationConfigBatchPlace={vi.fn()}
      />,
    );
    expect(screen.getByTestId("inventory")).toBeInTheDocument();
    expect(screen.getByText("inventory")).toBeInTheDocument();
  });

  it("forwards siteProduct query as focusProductSlug for inventory continuity", () => {
    inventoryProps.mockClear();
    render(
      <WorkspaceLeftPanel
        catalogItems={[]}
        isLoading={false}
        catalogStatus="ready"
        onItemPlace={vi.fn()}
        onWorkstationConfigPlace={vi.fn()}
        onWorkstationConfigBatchPlace={vi.fn()}
      />,
    );
    expect(inventoryProps).toHaveBeenCalledWith(
      expect.objectContaining({
        focusProductSlug: "oando-fluid-desk-1400",
      }),
    );
    expect(screen.getByTestId("inventory")).toHaveAttribute(
      "data-focus",
      "oando-fluid-desk-1400",
    );
  });
});
