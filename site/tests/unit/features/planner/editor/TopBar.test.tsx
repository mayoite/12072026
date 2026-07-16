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

  it("labels guest save/export as local-only downloads", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    render(
      <TopBar
        accessContext="guest"
        projectName="Guest Draft"
        viewMode="2d"
        saveStatus="idle"
        saveCloudEnabled={false}
        onSave={onSave}
      />,
    );

    expect(screen.getByTestId("planner-guest-local-badge")).toHaveTextContent(/Local only/i);
    expect(screen.getByTestId("open3d-save-status").textContent).toMatch(/Guest session \(local\)/i);
    expect(screen.getByTestId("open3d-save-status")).toHaveAttribute("data-storage", "local");

    const saveBtn = screen.getByTestId("planner-save-button");
    expect(saveBtn).toHaveTextContent(/Save draft/i);
    expect(saveBtn).toHaveAttribute("aria-label", expect.stringMatching(/this device/i));

    await user.click(saveBtn);
    expect(onSave).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId("planner-guest-export")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export — download plan or BOQ to this device/i }),
    ).toBeInTheDocument();
    // Guest has no Import — persistence actions are member-only.
    expect(screen.queryByRole("button", { name: /Import/i })).toBeNull();
  });
});
