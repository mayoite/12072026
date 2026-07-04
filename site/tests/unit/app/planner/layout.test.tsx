import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerRootLayout, { viewport } from "@/app/planner/layout";
import { SITE_VIEWPORT } from "@/lib/siteViewport";

vi.mock("@/lib/layout/siteLayoutContext", () => ({
  getSiteLayoutContext: vi.fn().mockResolvedValue({ messages: {}, lang: "en-IN" }),
}));

// Mock external providers and components
vi.mock("@/app/(site)/providers/QueryProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>,
}));

vi.mock("@/components/site/RouteChrome", () => ({
  RouteChrome: ({ position }: { position: string }) => <div data-testid="route-chrome" data-position={position} />,
}));

vi.mock("@/lib/theme/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

vi.mock("@/features/planner/components/PlannerBodyTheme", () => ({
  PlannerBodyTheme: () => <div data-testid="planner-body-theme" />,
}));

vi.mock("@/features/planner/editor/PlannerErrorBoundary", () => ({
  PlannerErrorBoundary: ({ children, label }: { children: React.ReactNode; label: string }) => (
    <div data-testid="error-boundary" data-label={label}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/pwa/ServiceWorkerRegister", () => ({
  ServiceWorkerRegister: () => <div data-testid="service-worker-register" />,
}));

vi.mock("@/components/security/CsrfBootstrap", () => ({
  CsrfBootstrap: () => <div data-testid="csrf-bootstrap" />,
}));

vi.mock("@/lib/fonts", () => ({
  ciscoSans: { variable: "cisco-sans-var" },
  helveticaNeue: { variable: "helvetica-neue-var" },
}));

describe("PlannerRootLayout", () => {
  it("has the correct viewport configuration", () => {
    expect(viewport).toEqual(SITE_VIEWPORT);
  });

  it("renders layout correctly with children", async () => {
    const children = <div data-testid="test-child">Child Content</div>;
    const resolvedLayout = await PlannerRootLayout({ children });
    render(resolvedLayout);

    expect(screen.getByTestId("query-provider")).toBeInTheDocument();
    expect(screen.getByTestId("theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("planner-body-theme")).toBeInTheDocument();
    expect(screen.getByTestId("service-worker-register")).toBeInTheDocument();
    expect(screen.getByTestId("csrf-bootstrap")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();

    const chromes = screen.getAllByTestId("route-chrome");
    expect(chromes).toHaveLength(2);
    expect(chromes[0]).toHaveAttribute("data-position", "top");
    expect(chromes[1]).toHaveAttribute("data-position", "bottom");

    const errorBoundary = screen.getByTestId("error-boundary");
    expect(errorBoundary).toHaveAttribute("data-label", "Planner");
  });
});
