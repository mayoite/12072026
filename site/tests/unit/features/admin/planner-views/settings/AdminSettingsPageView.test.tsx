import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminSettingsPageView from "@/features/admin/settings/AdminSettingsPageView";

vi.mock("@/features/planner/lib/featureFlags", () => ({
  getAllFlagsGrouped: () => [
    {
      group: "General",
      flags: [
        { name: "flag_a", description: "Flag A", defaultValue: false },
        { name: "flag_b", description: "Flag B", defaultValue: true },
      ],
    },
  ],
  DEFAULT_FLAGS: {
    flag_a: false,
    flag_b: true,
  },
}));

vi.mock("@/features/admin/workspace-catalog/AdminWorkspaceCatalogPageView", () => ({
  AdminCanvasConfigSection: () => <div data-testid="canvas-config-section" />,
}));

describe("AdminSettingsPageView", () => {
  it("renders headers and configuration sections", () => {
    render(<AdminSettingsPageView />);

    expect(screen.getByText("Settings & configuration")).toBeInTheDocument();
    expect(screen.getByText("Platform parameters")).toBeInTheDocument();
    expect(screen.getByTestId("canvas-config-section")).toBeInTheDocument();
  });

  it("renders feature flag defaults", () => {
    render(<AdminSettingsPageView />);

    expect(screen.getByText("Feature flag defaults")).toBeInTheDocument();
    
    // Check if flag_a is rendered and marked as 'off'
    expect(screen.getByText("flag_a")).toBeInTheDocument();
    expect(screen.getByText("off")).toBeInTheDocument();

    // Check if flag_b is rendered and marked as 'on'
    expect(screen.getByText("flag_b")).toBeInTheDocument();
    expect(screen.getByText("on")).toBeInTheDocument();
  });

  it("renders environment variable list", () => {
    render(<AdminSettingsPageView />);

    expect(screen.getByText("Environment variables")).toBeInTheDocument();
    expect(screen.getByText("NEXT_PUBLIC_SUPABASE_URL")).toBeInTheDocument();
    expect(screen.getByText("SUPABASE_SERVICE_ROLE_KEY")).toBeInTheDocument();
  });

  it("renders catalog data paths", () => {
    render(<AdminSettingsPageView />);

    expect(screen.getByText("Catalog data paths")).toBeInTheDocument();
    
    const standardCatalogLink = screen.getByRole("link", { name: "Standard catalog" });
    expect(standardCatalogLink).toBeInTheDocument();
    expect(standardCatalogLink).toHaveAttribute("href", "/admin/catalog");
  });
});
