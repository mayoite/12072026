import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inspector } from "@/features/planner/shared/components/Inspector";
import type { CatalogItem } from "@/features/planner/shared/catalog/types";

const item: CatalogItem = {
  id: "desk-1",
  name: "Task Desk",
  category: "desks",
  dimensions: { widthMm: 1200, depthMm: 600, heightMm: 750 },
};

describe("Inspector", () => {
  it("shows empty state when nothing selected", () => {
    render(<Inspector selectedItem={null} />);
    expect(screen.getByText("No item selected")).toBeInTheDocument();
  });

  it("shows name, category, and dimensions for selection", () => {
    render(<Inspector selectedItem={item} />);
    expect(screen.getByText("Task Desk")).toBeInTheDocument();
    expect(screen.getByText("desks")).toBeInTheDocument();
    expect(screen.getByText(/1200 × 600 × 750 mm/)).toBeInTheDocument();
    expect(screen.getByLabelText("X")).toBeInTheDocument();
    expect(screen.getByLabelText("Y°")).toBeInTheDocument();
  });
});
