import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://mock-site-url.com",
}));

import PlannerLandingRoute, { metadata } from "@/app/planner/(marketing)/page";

vi.mock("@/features/planner/landing/PlannerLandingPage", () => ({
  PlannerLandingPage: () => <div data-testid="planner-landing-page" />,
}));

describe("PlannerLandingRoute", () => {
  it("exports correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(JSON.stringify(metadata.title)).toContain("Workspace Planner");
    expect(metadata.alternates?.canonical).toBe("https://mock-site-url.com/planner/");
  });

  it("renders JSON-LD script and landing page component", () => {
    render(<PlannerLandingRoute />);
    expect(screen.getByTestId("planner-landing-page")).toBeInTheDocument();

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("Workspace Planner"))).toBe(true);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("BreadcrumbList"))).toBe(true);
  });
});
