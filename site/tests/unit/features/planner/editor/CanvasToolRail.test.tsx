import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { CanvasToolRail } from "@/features/planner/editor/CanvasToolRail";

const isMobileMock = vi.fn(() => false);

vi.mock("@/features/planner/hooks/useIsMobile", () => ({
  useIsMobile: () => isMobileMock(),
}));

afterEach(() => {
  cleanup();
  isMobileMock.mockReturnValue(false);
});

describe("CanvasToolRail", () => {
  it("renders live tool controls with accessible names", () => {
    render(<CanvasToolRail activeTool="select" onToolChange={vi.fn()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios.length).toBeGreaterThan(3);
    const labels = radios.map((el) => el.getAttribute("aria-label") ?? "");
    expect(labels.some((l) => /select/i.test(l))).toBe(true);
    expect(labels.some((l) => /wall/i.test(l))).toBe(true);
    expect(document.querySelector('[data-testid="canvas-tool-wall"]')).not.toBeNull();
  });

  it("shows live draw tools on the Dockview rail (including dimension)", () => {
    render(
      <CanvasToolRail activeTool="select" onToolChange={vi.fn()} dockManaged />,
    );

    expect(screen.getByTestId("canvas-tool-select")).toBeInTheDocument();
    expect(screen.getByTestId("canvas-tool-wall")).toBeInTheDocument();
    expect(screen.getByTestId("canvas-tool-room")).toBeInTheDocument();
    expect(screen.getByTestId("canvas-tool-opening")).toBeInTheDocument();
    expect(screen.getByTestId("canvas-tool-placement")).toBeInTheDocument();
    // Dimension is live (canvasTool.ts) — must stay visible when dock-managed.
    expect(screen.getByTestId("canvas-tool-dimension")).toBeInTheDocument();
    // Desktop dock-managed remains a vertical CAD strip unless phone layout.
    expect(screen.getByTestId("canvas-tool-rail")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(screen.getByTestId("canvas-tool-rail")).not.toHaveAttribute(
      "data-mobile-chrome",
    );
  });

  it("marks dockManaged phone rail as deliberate bottom mobile chrome", () => {
    isMobileMock.mockReturnValue(true);
    render(
      <CanvasToolRail activeTool="select" onToolChange={vi.fn()} dockManaged />,
    );
    const rail = screen.getByTestId("canvas-tool-rail");
    expect(rail).toHaveAttribute("data-mobile-chrome", "bottom");
    expect(rail).toHaveAttribute("data-orientation", "horizontal");
    expect(rail).toHaveAttribute("data-dock-managed", "true");
    // One dense rail only — no stacked second strip
    expect(rail).toHaveAttribute("data-rail-density", "single-dense");
    expect(screen.getAllByTestId("canvas-tool-rail")).toHaveLength(1);
  });

  it("declares ≥44px tap floor on live tool and view controls (UI-MOB-03)", () => {
    isMobileMock.mockReturnValue(true);
    render(
      <CanvasToolRail
        activeTool="select"
        onToolChange={vi.fn()}
        dockManaged
        gridEnabled
        snapEnabled
        onToggleGrid={vi.fn()}
        onToggleSnap={vi.fn()}
      />,
    );

    const tools = [
      "canvas-tool-select",
      "canvas-tool-wall",
      "canvas-tool-room",
      "canvas-tool-placement",
    ];
    for (const id of tools) {
      expect(screen.getByTestId(id)).toHaveAttribute("data-min-tap-px", "44");
    }
  });

  it("renders explicit product tools in parametric mode", () => {
    const onParametricToolChange = vi.fn();
    render(
      <CanvasToolRail
        mode="parametric"
        activeToolId="fit"
        tools={[
          { kind: "command", id: "fit", label: "Fit", command: "fit" },
          {
            kind: "part-focus",
            id: "headboard",
            label: "Headboard",
            partRole: "headboard",
          },
        ]}
        onParametricToolChange={onParametricToolChange}
        layout="wide"
      />,
    );

    expect(screen.getByRole("button", { name: "Headboard" })).toBeInTheDocument();
    expect(screen.getByTestId("canvas-tool-rail")).toHaveAttribute(
      "data-mode",
      "parametric",
    );
    expect(screen.getByTestId("canvas-tool-rail")).toHaveAttribute(
      "data-layout",
      "wide",
    );
  });
});
