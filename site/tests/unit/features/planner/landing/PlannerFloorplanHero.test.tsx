import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerFloorplanHero } from "@/features/planner/landing/PlannerFloorplanHero";

vi.mock("@phosphor-icons/react", () => ({
  ArrowRight: () => <span data-testid="arrow-right" />,
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useReducedMotion: vi.fn(() => false),
}));

vi.mock("@/lib/helpers/motion", () => ({
  MOTION_EASE: [0.16, 1, 0.3, 1],
  MOTION_TOKENS: { slow: 0.5, medium: 0.35, distanceSm: 16 },
  useMotionSafeHover: vi.fn(() => ({})),
}));

vi.mock("@/features/planner/landing/PlannerHeroDemo", () => ({
  PlannerHeroDemo: () => <div data-testid="hero-demo">Hero Demo</div>,
}));

describe("PlannerFloorplanHero", () => {
  it("renders correctly with title, CTAs, proof points and visual demo", () => {
    render(<PlannerFloorplanHero />);

    // Title (may be split across elements — current data: "Plan your office")
    expect(document.body.textContent).toMatch(/plan.*office|workspace.*planner/i);

    // Primary CTA (label changed to 'Start free')
    const tryCta = screen.getByRole("link", { name: /Start free|Try free|free/i });
    expect(tryCta).toBeInTheDocument();
    expect(screen.getByTestId("arrow-right")).toBeInTheDocument();

    // Secondary CTA
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();

    // Proof points (from PLANNER_PROOF)
    expect(screen.getByText("Import sketch")).toBeInTheDocument();

    // Hero demo inside visual container
    expect(screen.getByTestId("hero-demo")).toBeInTheDocument();
  });
});
