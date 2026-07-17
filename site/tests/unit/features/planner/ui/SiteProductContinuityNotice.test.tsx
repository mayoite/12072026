import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteProductContinuityNotice } from "@/features/planner/ui/SiteProductContinuityNotice";

const searchParamsGet = vi.fn<(key: string) => string | null>(() => null);

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => searchParamsGet(key),
  }),
}));

describe("SiteProductContinuityNotice", () => {
  beforeEach(() => {
    searchParamsGet.mockReset();
    searchParamsGet.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders nothing without siteProduct", () => {
    const { container } = render(<SiteProductContinuityNotice />);
    expect(container.firstChild).toBeNull();
  });

  it("shows Designing with banner for humanized siteProduct", () => {
    searchParamsGet.mockImplementation((key) =>
      key === "siteProduct" ? "super-chair-001" : null,
    );
    render(<SiteProductContinuityNotice />);
    const banner = screen.getByTestId("site-product-continuity-banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("data-site-product", "super-chair-001");
    expect(screen.getByText("Designing with Super Chair")).toBeInTheDocument();
  });

  it("dismisses without blocking the workspace", () => {
    searchParamsGet.mockImplementation((key) =>
      key === "siteProduct" ? "fluid-x" : null,
    );
    render(<SiteProductContinuityNotice />);
    fireEvent.click(
      screen.getByRole("button", { name: /dismiss product continuity/i }),
    );
    expect(screen.queryByTestId("site-product-continuity-banner")).toBeNull();
  });
});
