import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TopBar } from "../src/editor/TopBar";

describe("TopBar", () => {
  it("renders the workspace controls and dispatches menu actions", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();
    const onDisplayUnitChange = vi.fn();
    const onImport = vi.fn();
    const onExport = vi.fn();

    render(
      <TopBar
        projectName="Phase 5 Workspace Demo"
        viewMode="2d"
        floors={[
          { id: "floor-1", name: "Ground Floor" },
          { id: "floor-2", name: "First Floor" },
        ]}
        activeFloorId="floor-1"
        displayUnit="cm"
        isSynced
        onViewModeChange={onViewModeChange}
        onDisplayUnitChange={onDisplayUnitChange}
        onImport={onImport}
        onExport={onExport}
      />,
    );

    expect(screen.getByRole("heading", { name: "Phase 5 Workspace Demo" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "2D" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "3D" })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("button", { name: /Floor: Ground Floor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Display unit: cm/i })).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "3D" }));
    expect(onViewModeChange).toHaveBeenCalledWith("3d");

    await user.click(screen.getByRole("button", { name: /Display unit: cm/i }));
    await user.click(screen.getByRole("option", { name: "m" }));
    expect(onDisplayUnitChange).toHaveBeenCalledWith("m");

    await user.click(screen.getByRole("button", { name: "Import" }));
    await user.click(screen.getByRole("menuitem", { name: "Import from file..." }));
    expect(onImport).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Export" }));
    await user.click(screen.getByRole("menuitem", { name: "Export as JSON" }));
    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it("shows modified state, floor fallback, and dismisses menus from the overlay", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <TopBar
        projectName="Guest Workspace"
        viewMode="3d"
        floors={[{ id: "floor-1", name: "Ground Floor" }]}
        displayUnit="m"
        isModified
        isSynced={false}
      />,
    );

    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    expect(screen.getByText("Modified")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "3D" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("button", { name: /Floor: Select/i })).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "2D" }));
    expect(screen.getByRole("radio", { name: "3D" })).toHaveAttribute("aria-checked", "true");

    await user.click(screen.getByRole("button", { name: "Import" }));
    await user.click(screen.getByRole("menuitem", { name: "Import from file..." }));

    await user.click(screen.getByRole("button", { name: "Export" }));
    await user.click(screen.getByRole("menuitem", { name: "Export as JSON" }));

    await user.click(screen.getByRole("button", { name: /Display unit: m/i }));
    expect(screen.getByRole("listbox", { name: "Select display unit" })).toBeInTheDocument();

    await user.click(screen.getByRole("option", { name: "in" }));
    await user.click(screen.getByRole("button", { name: /Display unit: m/i }));
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);

    expect(screen.queryByRole("listbox", { name: "Select display unit" })).not.toBeInTheDocument();
  });

  it("hides persistence actions for guest sessions", () => {
    render(
      <TopBar
        accessContext="guest"
        projectName="Guest Workspace"
        viewMode="2d"
      />,
    );

    expect(screen.queryByRole("button", { name: "Import" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Export" })).not.toBeInTheDocument();
  });
});
