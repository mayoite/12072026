import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminDashboardPageView from "@/features/admin/dashboard/AdminDashboardPageView";

describe("AdminDashboardPageView", () => {
  it("renders the hub without legacy hero copy", () => {
    render(<AdminDashboardPageView />);

    expect(screen.getByRole("heading", { level: 1, name: "Dashboard" })).toBeInTheDocument();
    expect(screen.queryByText("Platform control")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin backend")).not.toBeInTheDocument();
    // Catalog card is labeled "Products" (managed products hub).
    expect(screen.getAllByRole("link", { name: /Products/i }).length).toBeGreaterThan(0);
  });

  it("renders all sections from ADMIN_HUB_SECTIONS", () => {
    render(<AdminDashboardPageView />);

    expect(screen.getByRole("heading", { name: /Planner operations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Catalog" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /CRM & ops/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "System" })).toBeInTheDocument();

    const productsCard = screen.getByRole("link", {
      name: /Products Editable managed products/i,
    });
    expect(productsCard).toHaveAttribute("href", "/admin/catalog");
  });

  it("shows the CRM browser-storage warning on the hub", () => {
    render(<AdminDashboardPageView />);

    expect(screen.getByText(/Browser-only CRM storage\./i)).toBeInTheDocument();
    expect(screen.getByText(/this browser only/i)).toBeInTheDocument();
  });
});
