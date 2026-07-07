import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminDashboardPageView from "@/features/planner/admin/AdminDashboardPageView";

describe("AdminDashboardPageView", () => {
  it("renders the hero without duplicate quick-action links", () => {
    render(<AdminDashboardPageView />);

    expect(screen.getByText("Platform control")).toBeInTheDocument();
    expect(screen.getByText("Admin backend")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Edit catalog/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Review plans/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Standard catalog/i })).toHaveLength(1);
  });

  it("renders all sections from ADMIN_HUB_SECTIONS", () => {
    render(<AdminDashboardPageView />);

    // Hub sections titles
    expect(screen.getByRole("heading", { name: /Planner operations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Catalog assets/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /CRM & ops/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Platform" })).toBeInTheDocument();

    const standardCatalogCard = screen.getByRole("link", { name: /Standard catalog/i });
    expect(standardCatalogCard).toHaveAttribute("href", "/admin/catalog");
  });

  it("shows the CRM browser-storage warning on the hub", () => {
    render(<AdminDashboardPageView />);

    expect(screen.getByText(/Browser-only CRM storage\./i)).toBeInTheDocument();
    expect(screen.getByText(/save to localStorage on the current browser/i)).toBeInTheDocument();
  });
});
