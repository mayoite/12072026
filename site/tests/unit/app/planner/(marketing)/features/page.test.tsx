import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://mock-site-url.com",
}));

import PlannerFeaturesHubRoute, { metadata } from "@/app/planner/(marketing)/features/page";

vi.mock("@/features/planner/landing/PlannerFeaturesHubPage", () => ({
  PlannerFeaturesHubPage: () => <div data-testid="planner-features-hub-page" />,
}));

describe("PlannerFeaturesHubRoute", () => {
  it("exports correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toContain("Planner Features");
    expect(metadata.alternates?.canonical).toBe("https://mock-site-url.com/planner/features/");
  });

  it("renders JSON-LD scripts and features hub page component", () => {
    render(<PlannerFeaturesHubRoute />);
    expect(screen.getByTestId("planner-features-hub-page")).toBeInTheDocument();

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("Planner Features"))).toBe(true);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("BreadcrumbList"))).toBe(true);
  });
});
