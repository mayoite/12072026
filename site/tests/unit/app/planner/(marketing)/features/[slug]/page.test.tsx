import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { notFound } from "next/navigation";
import { PLANNER_FEATURE_PAGES } from "@/features/planner/landing/plannerFeaturePages";

vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://mock-site-url.com",
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NOT_FOUND");
  }),
}));

vi.mock("@/features/planner/landing/PlannerFeaturePageView", () => ({
  PlannerFeaturePageView: ({ slug }: { slug: string }) => (
    <div data-testid="planner-feature-page-view" data-slug={slug} />
  ),
}));

import PlannerFeatureRoute, {
  generateStaticParams,
  generateMetadata,
} from "@/app/planner/(marketing)/features/[slug]/page";

describe("PlannerFeatureRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates correct static params", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(PLANNER_FEATURE_PAGES.length);
    expect(params[0]).toHaveProperty("slug");
  });

  it("generates metadata for valid slug", async () => {
    const validSlug = PLANNER_FEATURE_PAGES[0].slug;
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: validSlug }) });
    expect(metadata).toBeDefined();
    expect(metadata.title).toContain("Workspace Planner");
    expect(metadata.alternates?.canonical).toBe(`https://mock-site-url.com/planner/features/${validSlug}/`);
  });

  it("generates empty metadata for invalid slug", async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: "invalid-slug" }) });
    expect(metadata).toEqual({});
  });

  it("renders feature view page for valid slug", async () => {
    const validSlug = PLANNER_FEATURE_PAGES[0].slug;
    const resolvedRoute = await PlannerFeatureRoute({ params: Promise.resolve({ slug: validSlug }) });
    render(resolvedRoute);

    expect(screen.getByTestId("planner-feature-page-view")).toBeInTheDocument();
    expect(screen.getByTestId("planner-feature-page-view")).toHaveAttribute("data-slug", validSlug);
    expect(notFound).not.toHaveBeenCalled();

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(2);
    expect(Array.from(scripts).some((script) => script.innerHTML.includes("BreadcrumbList"))).toBe(true);
  });

  it("triggers notFound for invalid slug", async () => {
    await expect(
      PlannerFeatureRoute({ params: Promise.resolve({ slug: "invalid-slug" }) }),
    ).rejects.toThrow("NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
