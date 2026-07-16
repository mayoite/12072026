import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />,
}));

import { SiteAnalytics } from "@/components/site/SiteAnalytics";

describe("SiteAnalytics", () => {
  it("mounts Vercel Analytics and Speed Insights (required for window.va)", () => {
    const { getByTestId } = render(<SiteAnalytics />);
    expect(getByTestId("vercel-analytics")).toBeInTheDocument();
    expect(getByTestId("vercel-speed-insights")).toBeInTheDocument();
  });
});
