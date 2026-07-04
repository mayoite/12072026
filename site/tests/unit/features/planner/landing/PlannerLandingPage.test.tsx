import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerLandingPage } from "@/features/planner/landing/PlannerLandingPage";

vi.mock("@phosphor-icons/react", () => ({
  ArrowRight: () => "ArrowRight",
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@/lib/helpers/motion", () => ({
  MOTION_EASE: [0.25, 0.1, 0.25, 1],
  hoverLift: {},
  staggerContainer: {},
  staggerItem: {},
}));

vi.mock("@/features/planner/landing/PlannerFloorplanHero", () => ({
  PlannerFloorplanHero: () => <div data-testid="floorplan-hero">Floorplan Hero</div>,
}));

vi.mock("@/features/planner/landing/plannerLandingIcons", () => ({
  PLANNER_LANDING_ICONS: {
    measure: () => "MeasureIcon",
    catalog: () => "CatalogIcon",
    "3d-view": () => "3dViewIcon",
    export: () => "ExportIcon",
  },
}));

vi.mock("@/features/planner/landing/plannerLandingData", () => ({
  PLANNER_HERO: {
    titleLead: "Plan your ",
    titleAccent: "office",
    description: "True-scale floor plans, real catalog furniture, PDF export.",
    primaryCta: { label: "Start free", href: "/planner/guest/" },
    secondaryCta: { label: "Sign in", href: "/login/" },
    featuresCta: { label: "All features", href: "/planner/features/" },
    helpCta: { label: "Help", href: "/planner/help/" },
    bottomCta: { title: "Start free — no account required.", memberLoginLabel: "Sign in" },
  },
  PLANNER_LANDING_FEATURES: [
    { slug: "measure", href: "/measure", title: "Room sizes", tagline: "Dimensions" },
  ],
  PLANNER_STEPS: [
    { step: "01", title: "Sketch your floor" },
  ],
}));

describe("PlannerLandingPage", () => {
  it("renders landing sections, hero and steps correctly", () => {
    render(<PlannerLandingPage />);

    expect(screen.getByTestId("floorplan-hero")).toBeInTheDocument();
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.getByText("Room sizes")).toBeInTheDocument();
    expect(screen.getByText("Sketch your floor")).toBeInTheDocument();
    expect(screen.getByText("Start free — no account required.")).toBeInTheDocument();
  });
});
