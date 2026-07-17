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
  });
});
