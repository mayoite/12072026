import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AdminCatalogListView } from "@/features/planner/admin/AdminCatalogListView";

vi.mock("@/features/planner/admin/AdminCatalogManager", () => ({
  AdminCatalogManager: ({ title, description, catalogType }: any) => (
    <div data-testid="mock-catalog-manager">
      <h1>{title}</h1>
      <p>{description}</p>
      <span>Type: {catalogType}</span>
    </div>
  ),
}));

describe("AdminCatalogListView wrapper", () => {
  it("renders AdminCatalogManager passing props through", () => {
    render(
      <AdminCatalogListView
        title="Standard catalog"
        description="Standard products CRUD"
        catalogType="standard"
      />
    );

    expect(screen.getByTestId("mock-catalog-manager")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Standard catalog" })).toBeInTheDocument();
    expect(screen.getByText("Standard products CRUD")).toBeInTheDocument();
    expect(screen.getByText("Type: standard")).toBeInTheDocument();
  });
});
