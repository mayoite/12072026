import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminSettingsPageView from "@/features/admin/settings/AdminSettingsPageView";

vi.mock("@/features/planner/lib/featureFlags", () => ({
  getAllFlagsGrouped: () => [
    {
      group: "General",
      flags: [{ name: "flag_a", description: "Flag A", defaultValue: false }],
    },
  ],
  DEFAULT_FLAGS: { flag_a: false },
}));

vi.mock("@/features/admin/workspace-catalog/AdminWorkspaceCatalogPageView", () => ({
  AdminCanvasConfigSection: () => <div data-testid="canvas-config-section" />,
}));

describe("AdminSettingsPageView (name-mirror)", () => {
  it("renders settings and flag defaults", () => {
    render(<AdminSettingsPageView />);
    expect(screen.getByText("Settings & configuration")).toBeInTheDocument();
    expect(screen.getByTestId("canvas-config-section")).toBeInTheDocument();
    expect(screen.getByText("flag_a")).toBeInTheDocument();
  });
});
