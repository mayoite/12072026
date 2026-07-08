import { describe, expect, it, vi } from "vitest";
import type * as lucidereactType0 from "@phosphor-icons/react";
import { render, screen } from "@testing-library/react";
import { PlannerFeaturesHubPage } from "@/features/planner/landing/PlannerFeaturesHubPage";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useReducedMotion: vi.fn(() => false),
}));

vi.mock("@phosphor-icons/react", async (importOriginal) => {
  const actual = await importOriginal<typeof lucidereactType0>();
  const iconProxy = (name: string) => () => <span data-testid={`icon-${name}`} />;
  return {
    ...actual,
    ArrowRight: iconProxy("ArrowRight"),
    Ruler: iconProxy("Ruler"),
    Users: iconProxy("Users"),
    MapPin: iconProxy("MapPin"),
    ChevronRight: iconProxy("ChevronRight"),
  };
});

vi.mock("@/features/planner/landing/PlannerBreadcrumbs", () => ({
  PlannerBreadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

vi.mock("@/features/planner/landing/PlannerHeroDemo", () => ({
  PlannerHeroDemo: () => <div data-testid="hero-demo">Hero Demo</div>,
}));

describe("PlannerFeaturesHubPage", () => {
  it("renders homepage marketing shell, hero content, features, and steps", () => {
    render(<PlannerFeaturesHubPage />);

    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.getAllByTestId("home-section").length).toBeGreaterThan(0);
    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByTestId("hero-demo")).toBeInTheDocument();

    expect(document.body.textContent).toMatch(/plan.*office|workspace.*planner|office.*planner/i);
    expect(screen.getByText("Import sketch")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Dimensions and area totals" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Real furniture, real sizes" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sketch your floor" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Drop in catalog furniture" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Export & quote" })).toBeInTheDocument();
  });
});
