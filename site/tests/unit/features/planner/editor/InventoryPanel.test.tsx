import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { InventoryPanel } from "@/features/planner/editor/InventoryPanel";

const catalogHook = {
  items: [],
  isLoading: false,
  status: "ready" as const,
  resolveItem: () => null,
  isStale: false,
  error: null,
  retry: vi.fn(),
};

vi.mock("@/features/planner/project/catalog/usePlannerWorkspaceCatalog", () => ({
  usePlannerWorkspaceCatalog: () => catalogHook,
  usePlannerSvgCatalog: () => catalogHook,
}));

describe("InventoryPanel", () => {
  it("renders inventory chrome", () => {
    const { container } = render(
      <InventoryPanel catalogItems={[]} catalogStatus="ready" isLoading={false} />,
    );
    expect(container.firstChild).not.toBeNull();
    expect((container.textContent ?? "").length).toBeGreaterThan(0);
  });
});
