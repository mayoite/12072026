import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://mock-site-url.com",
}));

import PlannerHelpRoute, { metadata } from "@/app/planner/(marketing)/help/page";
import { PLANNER_HELP_FAQ_ITEMS } from "@/features/planner/help/helpSections";

vi.mock("@/features/planner/help/PlannerHelpPage", () => ({
  PlannerHelpPage: () => <div data-testid="planner-help-page" />,
}));

describe("PlannerHelpRoute", () => {
  it("exports correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toContain("Planner Help");
    expect(metadata.alternates?.canonical).toBe("https://mock-site-url.com/planner/help/");
  });

  it("renders JSON-LD scripts and help page component", () => {
    render(<PlannerHelpRoute />);
    expect(screen.getByTestId("planner-help-page")).toBeInTheDocument();

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(3);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("Planner Help"))).toBe(true);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("BreadcrumbList"))).toBe(true);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("FAQPage"))).toBe(true);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes(PLANNER_HELP_FAQ_ITEMS[0].question))).toBe(true);
  });
});
