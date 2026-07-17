import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TopBar } from "@/features/planner/editor/TopBar";
import { plannerSaveStatusLabel } from "@/features/planner/editor/workspaceStatusLabels";

afterEach(() => {
  cleanup();
});

const baseProps = {
  projectName: "Save status plan",
  viewMode: "2d" as const,
};

describe("TopBar save status pill — plannerSaveStatusLabel table", () => {
  it("idle (default / no legacy flags) shows Ready (local), not bare Ready", () => {
    render(<TopBar {...baseProps} />);

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveAttribute("data-status", "idle");
    expect(pill).toHaveAttribute("data-storage", "local");
    expect(pill).toHaveTextContent("Ready (local)");
    expect(pill.textContent).not.toMatch(/^[\s●○✓]*Ready\s*$/);
  });

  it("saveStatus=idle member → Ready (local) via helper", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="authenticated"
        saveStatus="idle"
        saveStorage="local"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    const expected = plannerSaveStatusLabel({
      status: "idle",
      storage: "local",
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: false,
    });
    expect(expected).toBe("Ready (local)");
    expect(pill).toHaveTextContent(expected);
    expect(pill).toHaveAttribute("data-status", "idle");
    expect(pill).toHaveAttribute("data-storage", "local");
  });

  it("saveStatus=saved member → Saved locally (not bare Saved)", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="authenticated"
        saveStatus="saved"
        saveStorage="local"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Saved locally");
    expect(pill.textContent).not.toMatch(/\bSaved\s*$/);
    expect(pill).toHaveAttribute("data-status", "saved");
    expect(pill).toHaveAttribute("data-storage", "local");
  });

  it("saveStatus=saved guest → Draft saved locally", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="guest"
        saveStatus="saved"
        saveStorage="local"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Draft saved locally");
    expect(pill).toHaveAttribute("data-status", "saved");
  });

  it("saveStatusLabel prop wins over saveStatus", () => {
    render(
      <TopBar
        {...baseProps}
        saveStatus="idle"
        saveStatusLabel="Custom label from parent"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Custom label from parent");
    expect(pill).toHaveAttribute("data-status", "idle");
  });

  it("legacy isSynced fallback uses Saved locally (honest helper, not bare Saved)", () => {
    render(<TopBar {...baseProps} isSynced isModified={false} />);

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Saved locally");
    expect(pill.textContent?.trim()).not.toMatch(/^[\s●○✓]*Saved\s*$/);
    expect(pill).toHaveAttribute("data-status", "saved");
  });

  it("legacy isModified fallback uses Unsaved changes via helper (not Modified)", () => {
    render(<TopBar {...baseProps} isModified />);

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Unsaved changes");
    expect(pill).not.toHaveTextContent("Modified");
    expect(pill).toHaveAttribute("data-status", "unsaved");
    // Pill is sole save authority — no brand subline duplicate
    expect(screen.getAllByText("Unsaved changes")).toHaveLength(1);
  });

  it("error status never looks like success; Save becomes Retry save", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="authenticated"
        saveStatus="error"
        saveStorage="local"
        isSynced
        isModified={false}
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveAttribute("data-status", "error");
    expect(pill).toHaveTextContent("Local save failed");
    expect(pill).not.toHaveAttribute("data-synced", "true");
    expect(pill.textContent).not.toMatch(/Saved/i);

    const saveBtn = screen.getByRole("button", { name: /Retry save/i });
    expect(saveBtn).toHaveTextContent("Retry save");
    expect(saveBtn).toHaveAttribute("data-status", "error");
  });

  it("saving disables primary save and keeps distinct pill", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="guest"
        saveStatus="saving"
        saveStorage="local"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveAttribute("data-status", "saving");
    expect(pill).toHaveTextContent("Saving locally…");

    const saveBtn = screen.getByRole("button", { name: /Saving/i });
    expect(saveBtn).toBeDisabled();
    expect(saveBtn).toHaveTextContent("Saving…");
  });

  it("shows offline separately without hiding local save state", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="guest"
        saveStatus="saved"
        saveStorage="local"
        isOffline
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveAttribute("data-connection", "offline");
    expect(pill).toHaveTextContent("Offline · Draft saved locally");
    expect(pill).toHaveAttribute("data-status", "saved");
  });
});
