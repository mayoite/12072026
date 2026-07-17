import { describe, expect, it, afterEach, beforeEach, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { WorkspaceShell } from "@/features/planner/editor/WorkspaceShell";
import workspaceStyles from "@/features/planner/editor/workspace.module.css";

afterEach(() => cleanup());

describe("WorkspaceShell", () => {
  it("renders project name and children canvas region", () => {
    render(
      <WorkspaceShell
        projectName="Shell Plan"
        leftPanel={<div data-testid="left">left</div>}
        rightPanel={<div data-testid="right">right</div>}
      >
        <div data-testid="canvas">canvas</div>
      </WorkspaceShell>,
    );
    expect(document.body.textContent).toMatch(/Shell Plan/);
    expect(screen.getByTestId("canvas")).toHaveTextContent("canvas");
  });

  it("marks shell paper surface honesty (PF-32 ecru stack via surface tokens)", () => {
    const { container } = render(
      <WorkspaceShell projectName="Ecru shell">
        <div>canvas</div>
      </WorkspaceShell>,
    );
    const shell = container.querySelector("[data-planner-surface='paper']");
    expect(shell).not.toBeNull();
    expect(shell).toHaveAttribute("data-planner-surface", "paper");
    // CSS module must own paper tokens — not a cool pure-white hard-code.
    expect(typeof workspaceStyles.shell).toBe("string");
    expect(workspaceStyles.shell.length).toBeGreaterThan(0);
    expect(screen.getByTestId("planner-topbar")).toHaveAttribute(
      "data-mobile-chrome",
      "top",
    );
  });

  it("passes slim chromeMode through to TopBar for mobile density", () => {
    render(
      <WorkspaceShell projectName="Slim shell" chromeMode="slim">
        <div>canvas</div>
      </WorkspaceShell>,
    );
    const topbar = screen.getByTestId("planner-topbar");
    expect(topbar).toHaveAttribute("data-chrome-mode", "slim");
    expect(topbar).toHaveAttribute("data-phone-topbar-max-px", "112");
    expect(
      document.querySelector("[data-chrome-mode='slim']"),
    ).not.toBeNull();
  });

  it("marks small viewport for phone canvas grow (flex middle row)", async () => {
    const previousWidth = window.innerWidth;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 390,
    });
    try {
      const { container } = render(
        <WorkspaceShell projectName="Phone grow" chromeMode="slim">
          <div data-testid="phone-canvas-child">canvas</div>
        </WorkspaceShell>,
      );
      await waitFor(() => {
        expect(container.querySelector("[data-viewport='small']")).not.toBeNull();
      });
      const shell = container.querySelector("[data-phone-canvas-grow='true']");
      expect(shell).not.toBeNull();
      expect(shell).toHaveAttribute("data-chrome-mode", "slim");
      // Middle workspace + canvas classes exist for min-height:0 flex chain
      expect(workspaceStyles.workspace.length).toBeGreaterThan(0);
      expect(workspaceStyles.canvas.length).toBeGreaterThan(0);
      expect(workspaceStyles.shell.length).toBeGreaterThan(0);
    } finally {
      // Restore so later desktop panel tests do not inherit phone tier.
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: previousWidth >= 1024 ? previousWidth : 1280,
      });
      cleanup();
    }
  });

  it("left panel title is Inventory (aligned with TopBar toggle)", () => {
    render(
      <WorkspaceShell
        projectName="Named panels"
        leftPanel={<div>library body</div>}
        rightPanel={<div>props body</div>}
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    // contentOnly left panel keeps compact dock chrome; region labeled Inventory
    const inventory = screen.getByRole("region", { name: "Inventory panel" });
    expect(inventory).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Properties panel" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Properties", level: 2 })).toBeInTheDocument();
    expect(within(inventory).getByRole("button", { name: "Undock panel" })).toBeInTheDocument();
  });

  it("status bar uses customer-facing quote language, not internal BOQ jargon", () => {
    render(
      <WorkspaceShell
        projectName="Metrics shell"
        planMetrics={{
          objects: 3,
          walls: 2,
          furniture: 1,
          workstationSeats: 0,
          floorLabel: "Ground",
          boqReady: true,
          validationErrors: 0,
        }}
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    expect(screen.getByText("Quote ready")).toBeInTheDocument();
    expect(screen.queryByText(/BOQ/i)).not.toBeInTheDocument();
    expect(screen.getByText("Ground")).toBeInTheDocument();
    // Dense single metrics line (not sprawling secondary spans for every count).
    expect(screen.getByTestId("planner-status-metrics")).toHaveTextContent(
      /3 objects · 2 walls · 1 furniture/,
    );
  });

  it("status bar has no fake defaults and no second save chrome (TopBar is sole authority)", () => {
    render(
      <WorkspaceShell
        projectName="Honest status"
        saveStatus="saved"
        saveStatusLabel="Saved local"
        isLocalSaved
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    const statusBar = document.querySelector(".pw-status-bar");
    expect(statusBar).not.toBeNull();
    expect(statusBar).toHaveAttribute("data-save-authority", "topbar");
    // No placeholder noise when parent omits tool track.
    expect(screen.queryByText("Canvas ready")).not.toBeInTheDocument();
    expect(screen.queryByText("Zoom 100%")).not.toBeInTheDocument();
    expect(screen.queryByText(/Wide layout|Medium layout|Phone layout/i)).not.toBeInTheDocument();
    // Save pill once in TopBar only — not duplicated in status bar.
    expect(screen.getAllByTestId("open3d-save-status")).toHaveLength(1);
    // Status bar must not compete with TopBar save verbs / short status.
    expect(statusBar?.textContent ?? "").not.toMatch(
      /Saved local|Ready · local|Saving…|Unsaved|Save draft/i,
    );
  });

  it("floating panel is distinct from docked (Floating badge + data-state)", () => {
    render(
      <WorkspaceShell
        projectName="Float shell"
        rightPanel={<div>props</div>}
      >
        <div>canvas</div>
      </WorkspaceShell>,
    );

    const properties = screen.getByRole("region", { name: "Properties panel" });
    expect(properties).toHaveAttribute("data-state", "docked");
    fireEvent.click(within(properties).getByRole("button", { name: "Undock panel" }));

    const floating = screen.getByRole("region", { name: "Properties panel" });
    expect(floating).toHaveAttribute("data-state", "floating");
    expect(floating).toHaveAttribute("data-floating", "true");
    expect(within(floating).getByText("Floating")).toBeInTheDocument();
  });

  describe("P3 mobile sheets (mutually exclusive inventory / properties)", () => {
    beforeEach(() => {
      localStorage.clear();
      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        value: 390,
      });
    });

    afterEach(() => {
      cleanup();
      vi.restoreAllMocks();
    });

    it("opens only one side sheet at a time on small viewport", async () => {
      const { container } = render(
        <WorkspaceShell
          projectName="Phone sheets"
          leftPanel={<div data-testid="inv-body">Inventory body</div>}
          rightPanel={<div data-testid="prop-body">Properties body</div>}
          chromeMode="slim"
        >
          <div>canvas</div>
        </WorkspaceShell>,
      );

      await waitFor(() => {
        expect(container.querySelector("[data-viewport='small']")).not.toBeNull();
      });

      const invToggle = screen.getByRole("button", {
        name: /Toggle inventory panel/i,
      });
      const propToggle = screen.getByRole("button", {
        name: /Toggle properties panel/i,
      });

      fireEvent.click(invToggle);
      await waitFor(() => {
        expect(container.querySelector("[data-panel-active='left']")).not.toBeNull();
      });
      expect(invToggle).toHaveAttribute("aria-pressed", "true");
      expect(propToggle).toHaveAttribute("aria-pressed", "false");

      fireEvent.click(propToggle);
      await waitFor(() => {
        expect(container.querySelector("[data-panel-active='right']")).not.toBeNull();
      });
      expect(propToggle).toHaveAttribute("aria-pressed", "true");
      expect(invToggle).toHaveAttribute("aria-pressed", "false");
      // Mutual exclusion: only one active panel attr value.
      expect(container.querySelectorAll("[data-panel-active='left']").length).toBe(0);
    });
  });
});
