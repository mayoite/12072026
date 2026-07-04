import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AdminInventoryPageView from "@/features/planner/admin/AdminInventoryPageView";

describe("AdminInventoryPageView", () => {
  const mockCsv = [
    "kind,url_route,area,render_mode,auth,file,summary",
    'page,/admin,admin,ssr,admin,app/admin/page.tsx,"Admin dashboard panel"',
    'api,/api/products,site,route,public,app/api/products/route.ts,"Get products list"',
    'page,/dashboard,member,ssr,member,app/dashboard/page.tsx,"Member main panel"',
    'page,/results,old,ssr,member,app/results/page.tsx,"Results ""archived"" page"', // quote escaping
  ].join("\n");

  it("renders empty state when CSV is empty", () => {
    render(<AdminInventoryPageView csv="" generatedAt={null} rowCount={0} />);
    expect(screen.getByText(/Inventory file is missing or empty/i)).toBeInTheDocument();
  });

  it("parses CSV correctly and displays records", () => {
    render(<AdminInventoryPageView csv={mockCsv} generatedAt="2026-06-26T12:00:00Z" rowCount={4} />);

    expect(screen.getByText(/4\s+rows/i)).toBeInTheDocument();
    expect(screen.getByText("/admin")).toBeInTheDocument();
    expect(screen.getByText("Get products list")).toBeInTheDocument();
    
    // Check double quote escaping logic
    expect(screen.getByText('Results "archived" page')).toBeInTheDocument();
  });

  it("filters items by kind select box", () => {
    render(<AdminInventoryPageView csv={mockCsv} generatedAt={null} rowCount={4} />);

    const selects = screen.getAllByRole("combobox");
    const kindFilterSelect = selects[0];

    // Select 'api' kind
    fireEvent.change(kindFilterSelect, { target: { value: "api" } });

    expect(screen.getByText("/api/products")).toBeInTheDocument();
    expect(screen.queryByText("/admin")).not.toBeInTheDocument();
    expect(screen.queryByText("/dashboard")).not.toBeInTheDocument();
  });

  it("filters items by area select box", () => {
    render(<AdminInventoryPageView csv={mockCsv} generatedAt={null} rowCount={4} />);

    const selects = screen.getAllByRole("combobox");
    const areaFilterSelect = selects[1];

    // Select 'member' area
    fireEvent.change(areaFilterSelect, { target: { value: "member" } });

    expect(screen.getByText("/dashboard")).toBeInTheDocument();
    expect(screen.queryByText("/admin")).not.toBeInTheDocument();
  });

  it("filters items by text search query", () => {
    render(<AdminInventoryPageView csv={mockCsv} generatedAt={null} rowCount={4} />);

    const searchInput = screen.getByPlaceholderText("Search route, file, summary…");
    
    // Search for "dashboard"
    fireEvent.change(searchInput, { target: { value: "dashboard" } });

    expect(screen.getByText("/admin")).toBeInTheDocument();
    expect(screen.queryByText("/api/products")).not.toBeInTheDocument();
  });
});
