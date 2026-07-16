import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopBar } from "@/features/planner/editor/TopBar";

afterEach(() => cleanup());

describe("TopBar", () => {
  it("shows project name and save status", () => {
    render(
      <TopBar
        projectName="Mirror Plan"
        viewMode="2d"
        onViewModeChange={vi.fn()}
      />,
    );
    expect(document.body.textContent).toMatch(/Mirror Plan/);
    expect(screen.getByTestId("open3d-save-status")).toBeDefined();
    expect(screen.getByTestId("open3d-save-status").textContent?.length).toBeGreaterThan(0);
  });

  it("renders desktop Grid and Snap buttons wired to toggles", async () => {
    const onToggleGrid = vi.fn();
    const onToggleSnap = vi.fn();
    const user = userEvent.setup();

    render(
      <TopBar
        projectName="Grid Plan"
        viewMode="2d"
        gridEnabled
        snapEnabled={false}
        onToggleGrid={onToggleGrid}
        onToggleSnap={onToggleSnap}
      />,
    );

    const gridBtn = screen.getByRole("button", { name: /Disable grid/i });
    const snapBtn = screen.getByRole("button", { name: /Enable snap/i });

    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(snapBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(gridBtn);
    await user.click(snapBtn);

    expect(onToggleGrid).toHaveBeenCalledTimes(1);
    expect(onToggleSnap).toHaveBeenCalledTimes(1);
  });
});
