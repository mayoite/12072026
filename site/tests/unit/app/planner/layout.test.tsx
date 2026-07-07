import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerRootLayout, { viewport } from "@/app/planner/layout";
import { SITE_VIEWPORT } from "@/lib/siteViewport";

vi.mock("@/lib/layout/siteLayoutContext", () => ({
  getSiteLayoutContext: vi.fn().mockResolvedValue({ messages: {}, locale: "en", lang: "en-IN" }),
}));

// Mock external providers and components


vi.mock("@/features/planner/components/PlannerLayoutShell", () => ({
  PlannerLayoutShell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="planner-layout-shell">{children}</div>
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

    expect(screen.getByTestId("planner-layout-shell")).toBeInTheDocument();
    expect(screen.getByTestId("service-worker-register")).toBeInTheDocument();
    expect(screen.getByTestId("csrf-bootstrap")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Skip to main content")).toBeInTheDocument();

  });
});
