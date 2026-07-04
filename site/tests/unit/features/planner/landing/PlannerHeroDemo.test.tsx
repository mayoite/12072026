import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerHeroDemo } from "@/features/planner/landing/PlannerHeroDemo";
import { useReducedMotion } from "framer-motion";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    g: ({ children, ...props }: any) => <g {...props}>{children}</g>,
    rect: ({ children, ...props }: any) => <rect {...props}>{children}</rect>,
    line: ({ children, ...props }: any) => <line {...props}>{children}</line>,
    path: ({ children, ...props }: any) => <path {...props}>{children}</path>,
  },
  useReducedMotion: vi.fn(() => false),
}));

vi.mock("@/lib/helpers/motion", () => ({
  MOTION_EASE: [0.16, 1, 0.3, 1],
}));

describe("PlannerHeroDemo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the canvas and UI structure correctly", () => {
    render(<PlannerHeroDemo />);

    expect(screen.getByText("Office layout · 10 × 8 m")).toBeInTheDocument();
    expect(screen.getByText("2D")).toBeInTheDocument();
    expect(screen.getByText("3D")).toBeInTheDocument();

    expect(screen.getByText("OPEN PLAN · 4 WORKSTATIONS")).toBeInTheDocument();
    expect(screen.getByText("BOARDROOM")).toBeInTheDocument();
    expect(screen.getAllByText("Workstation WS-301")).toHaveLength(1);
    expect(screen.getByText("Boardroom BR-12")).toBeInTheDocument();
    expect(screen.getByText("Storage ST-05")).toBeInTheDocument();
    expect(screen.getByText("10 000 mm")).toBeInTheDocument();
    expect(screen.getByText("8 000 mm")).toBeInTheDocument();

    expect(screen.getByText("6 furniture items")).toBeInTheDocument();
    expect(screen.getByText("2 zones")).toBeInTheDocument();
    expect(screen.getByText("True to scale")).toBeInTheDocument();
  });

  it("sets up interval for cycling state when reduced motion is disabled", () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    vi.mocked(useReducedMotion).mockReturnValue(false);

    render(<PlannerHeroDemo />);

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 10_000);
    setIntervalSpy.mockRestore();
  });

  it("does not set up interval for cycling state when reduced motion is enabled", () => {
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");
    vi.mocked(useReducedMotion).mockReturnValue(true);

    render(<PlannerHeroDemo />);

    expect(setIntervalSpy).not.toHaveBeenCalled();
    setIntervalSpy.mockRestore();
  });
});
