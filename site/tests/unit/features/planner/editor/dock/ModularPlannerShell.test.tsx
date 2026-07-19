import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

import { ModularPlannerShell } from "@/features/planner/editor/dock/ModularPlannerShell";

let mockIsMobile = true;
vi.mock("@/features/planner/hooks/useIsMobile", () => ({
  useIsMobile: () => mockIsMobile,
}));

/** StudioShell drives resizable dock layout; unit tests stub it to render slots flat. */
vi.mock("@/features/studio/shell", () => ({
  StudioShell: ({
    canvas,
    panels = [],
  }: {
    canvas: React.ReactNode;
    panels?: readonly { id: string; content: React.ReactNode }[];
  }) => (
    <div data-testid="studio-shell-mock">
      <div data-testid="studio-canvas">{canvas}</div>
      {panels.map((panel) => (
        <div key={panel.id} data-testid={`studio-panel-${panel.id}`}>
          {panel.content}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/features/planner/cloud-store/workspaceStore", () => ({
  usePlannerWorkspaceStore: (
    selector: (state: { plannerStep: string; setPlannerStep: (s: string) => void }) => unknown,
  ) =>
    selector({
      plannerStep: "draw",
      setPlannerStep: vi.fn(),
    }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("ModularPlannerShell desktop dock (StudioShell)", () => {
  beforeEach(() => {
    mockIsMobile = false;
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    mockIsMobile = true;
  });

  it("mounts the StudioShell with a canvas plus inventory + properties dock panels", async () => {
    render(
      <ModularPlannerShell
        projectName="Desktop shell"
        inventory={<div data-testid="inv-slot">Inventory</div>}
        properties={<div data-testid="props-slot">Properties</div>}
        activeTool="wall"
        onToolChange={vi.fn()}
      >
        <div data-testid="plan-stage">plan</div>
      </ModularPlannerShell>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("studio-shell-mock")).toBeInTheDocument();
    });

    // Canvas always present; both dock panels declared (visibility driven by step).
    expect(screen.getByTestId("plan-stage")).toHaveTextContent("plan");
    expect(screen.getByTestId("studio-panel-inventory")).toBeInTheDocument();
    expect(screen.getByTestId("studio-panel-properties")).toBeInTheDocument();
    expect(screen.getByTestId("inv-slot")).toBeInTheDocument();

    // Desktop keeps the modular studio surface + pinned tool rail.
    expect(
      document.querySelector("[data-modular-dock='true']"),
    ).not.toBeNull();
    expect(screen.getByTestId("canvas-tool-rail")).toBeInTheDocument();
  });
});

describe("ModularPlannerShell mobile chrome (P3)", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 390,
    });
  });

  it("renders deliberate top + bottom mobile chrome with slim TopBar", async () => {
    render(
      <ModularPlannerShell
        projectName="Mobile shell"
        inventory={<div>Inventory</div>}
        properties={<div>Properties</div>}
        activeTool="select"
        onToolChange={vi.fn()}
        density="touch"
      >
        <div data-testid="plan-stage">plan</div>
      </ModularPlannerShell>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("planner-mobile-shell")).toBeInTheDocument();
    });

    const topbar = screen.getByTestId("planner-topbar");
    expect(topbar).toHaveAttribute("data-mobile-chrome", "top");
    expect(topbar).toHaveAttribute("data-chrome-mode", "slim");

    expect(screen.getByTestId("planner-mobile-canvas")).toHaveAttribute(
      "data-mobile-chrome",
      "canvas",
    );

    const bottom = screen.getByTestId("planner-mobile-bottom-chrome");
    expect(bottom).toHaveAttribute("data-mobile-chrome", "bottom");
    expect(bottom).toHaveAttribute("aria-label", "Canvas tools");

    const rail = screen.getByTestId("canvas-tool-rail");
    expect(rail).toHaveAttribute("data-mobile-chrome", "bottom");
    expect(rail).toHaveAttribute("data-dock-managed", "true");
    expect(rail).toHaveAttribute("data-orientation", "horizontal");

    expect(
      document.querySelector("[data-planner-surface='studio']"),
    ).not.toBeNull();
    expect(screen.getByTestId("plan-stage")).toHaveTextContent("plan");
  });

  it("keeps studio surface honesty on the WorkspaceShell mobile host", async () => {
    const { container } = render(
      <ModularPlannerShell
        projectName="Studio phone"
        inventory={<div>inv</div>}
        properties={<div>props</div>}
        activeTool="wall"
        onToolChange={vi.fn()}
      >
        <div>canvas</div>
      </ModularPlannerShell>,
    );

    await waitFor(() => {
      expect(
        document.querySelector("[data-planner-surface='studio']"),
      ).not.toBeNull();
    });
    expect(container.querySelector("[data-chrome-mode='slim']")).not.toBeNull();
  });

  it("W4 guest mobile: calm quote status, no object power density, workflow guest chrome", async () => {
    render(
      <ModularPlannerShell
        accessContext="guest"
        projectName="Guest phone"
        inventory={<div>inv</div>}
        properties={<div>props</div>}
        activeTool="select"
        onToolChange={vi.fn()}
        planMetrics={{
          objects: 5,
          walls: 3,
          furniture: 2,
          workstationSeats: 4,
          floorLabel: "Ground",
          boqReady: true,
          validationErrors: 0,
        }}
      >
        <div data-testid="guest-plan-stage">plan</div>
      </ModularPlannerShell>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("planner-mobile-shell")).toBeInTheDocument();
    });

    // Workflow bar gets guest accessContext (same as desktop modular path).
    const workflow = document.querySelector("[aria-label='Planner workflow']");
    expect(workflow).not.toBeNull();
    expect(workflow).toHaveAttribute("data-guest-chrome", "true");

    // Status bar via WorkspaceShell: quote calm language only.
    const metrics = screen.getByTestId("planner-status-metrics");
    expect(metrics).toHaveAttribute("data-guest-chrome", "true");
    expect(screen.getByTestId("planner-status-quote")).toHaveTextContent(
      "Quote ready",
    );
    // Match counts only — quote copy may say "furniture".
    expect(metrics).not.toHaveTextContent(/\d+\s+objects/);
    expect(metrics).not.toHaveTextContent(/\d+\s+walls/);
    expect(metrics).not.toHaveTextContent(/\d+\s+furniture/);
    expect(metrics).not.toHaveTextContent(/\d+\s+seats/);
  });
});
