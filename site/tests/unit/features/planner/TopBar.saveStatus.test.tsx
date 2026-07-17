import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TopBar } from "@/features/planner/editor/TopBar";
import {
  plannerSaveStatusLabel,
  resolvePlannerSaveChrome,
} from "@/features/planner/editor/workspaceStatusLabels";

afterEach(() => {
  cleanup();
});

const baseProps = {
  projectName: "Save status plan",
  viewMode: "2d" as const,
};

/** Collect visible save chrome strings (pill + primary button only). */
function saveChromeTexts(): { pill: string; button: string } {
  const pill = screen.getByTestId("open3d-save-status").textContent ?? "";
  const button = screen.getByTestId("planner-save-button").textContent ?? "";
  return { pill, button };
}

function countSavingMentions(pill: string, button: string): number {
  return [pill, button].filter((t) => /saving/i.test(t)).length;
}

describe("TopBar save status — single authoritative map", () => {
  it("idle (default / no legacy flags) shows Ready · local, not bare Ready", () => {
    render(<TopBar {...baseProps} />);

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveAttribute("data-status", "idle");
    expect(pill).toHaveAttribute("data-ui-state", "idle");
    expect(pill).toHaveAttribute("data-storage", "local");
    expect(pill).toHaveTextContent("Ready · local");
    expect(pill.textContent).not.toMatch(/^[\s●○✓]*Ready\s*$/);
  });

  it("saveStatus=idle member → Ready · local via helper", () => {
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
    expect(expected).toBe("Ready · local");
    expect(pill).toHaveTextContent(expected);
    expect(pill).toHaveAttribute("data-status", "idle");
    expect(pill).toHaveAttribute("data-storage", "local");
  });

  it("saveStatus=saved member → Saved local (not bare Saved)", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="authenticated"
        saveStatus="saved"
        saveStorage="local"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Saved local");
    expect(pill.textContent).not.toMatch(/\bSaved\s*$/);
    expect(pill).toHaveAttribute("data-status", "saved");
    expect(pill).toHaveAttribute("data-ui-state", "saved");
    expect(pill).toHaveAttribute("data-storage", "local");
  });

  it("saveStatus=saved guest → Draft local", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="guest"
        saveStatus="saved"
        saveStorage="local"
      />,
    );

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Draft local");
    expect(pill).toHaveAttribute("data-status", "saved");
  });

  it("saveStatusLabel prop wins over saveStatus for pill text only", () => {
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
    // Button still from the single map
    expect(screen.getByTestId("planner-save-button")).toHaveTextContent("Save");
  });

  it("legacy isSynced fallback uses Saved local (honest helper, not bare Saved)", () => {
    render(<TopBar {...baseProps} isSynced isModified={false} />);

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Saved local");
    expect(pill.textContent?.trim()).not.toMatch(/^[\s●○✓]*Saved\s*$/);
    expect(pill).toHaveAttribute("data-status", "saved");
  });

  it("dirty shows one dirty label; button is Save not Unsaved", () => {
    render(<TopBar {...baseProps} isModified />);

    const pill = screen.getByTestId("open3d-save-status");
    expect(pill).toHaveTextContent("Unsaved");
    expect(pill).not.toHaveTextContent("Modified");
    expect(pill).toHaveAttribute("data-status", "unsaved");
    expect(pill).toHaveAttribute("data-ui-state", "dirty");
    // Exactly one dirty status string in the tree
    expect(screen.getAllByText("Unsaved")).toHaveLength(1);

    const btn = screen.getByTestId("planner-save-button");
    expect(btn).toHaveTextContent("Save");
    expect(btn.textContent).not.toMatch(/unsaved/i);
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
    expect(pill).toHaveAttribute("data-ui-state", "error");
    expect(pill).toHaveTextContent("Save failed");
    expect(pill).not.toHaveAttribute("data-synced", "true");
    expect(pill.textContent).not.toMatch(/Saved/i);

    const saveBtn = screen.getByRole("button", { name: /Retry save/i });
    expect(saveBtn).toHaveTextContent("Retry save");
    expect(saveBtn).toHaveAttribute("data-status", "error");
  });

  it("saving: one Saving label only (no dual Saving… + SAVING LOCALLY)", () => {
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
    expect(pill).toHaveAttribute("data-ui-state", "saving");
    // Status is storage-only — not a second Saving verb
    expect(pill).toHaveTextContent("Local");
    expect(pill.textContent).not.toMatch(/Saving/i);

    const saveBtn = screen.getByTestId("planner-save-button");
    expect(saveBtn).toBeDisabled();
    expect(saveBtn).toHaveTextContent("Saving…");

    const { pill: pillText, button } = saveChromeTexts();
    expect(countSavingMentions(pillText, button)).toBe(1);
    // Explicitly forbid the old dual pair
    expect(`${pillText} ${button}`).not.toMatch(/Saving locally/i);
  });

  it("member saving also has exactly one Saving surface", () => {
    render(
      <TopBar
        {...baseProps}
        accessContext="authenticated"
        saveStatus="saving"
        saveStorage="local"
      />,
    );
    const { pill, button } = saveChromeTexts();
    expect(countSavingMentions(pill, button)).toBe(1);
    expect(button).toMatch(/Saving/i);
    expect(pill).not.toMatch(/Saving/i);
  });

  it("shows offline without hiding local save state; offline is ui-state", () => {
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
    expect(pill).toHaveAttribute("data-ui-state", "offline");
    expect(pill).toHaveTextContent("Offline · Draft local");
    expect(pill).toHaveAttribute("data-status", "saved");
  });

  it("chrome from resolvePlannerSaveChrome matches rendered TopBar", () => {
    const chrome = resolvePlannerSaveChrome({
      status: "unsaved",
      storage: "local",
      lastSavedAt: null,
      cloudEnabled: false,
      guestMode: true,
    });
    render(
      <TopBar
        {...baseProps}
        accessContext="guest"
        saveStatus="unsaved"
        saveStorage="local"
      />,
    );
    expect(screen.getByTestId("open3d-save-status")).toHaveTextContent(chrome.statusLabel);
    expect(screen.getByTestId("planner-save-button")).toHaveTextContent(chrome.buttonLabel);
  });
});
