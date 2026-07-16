import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GuestPortalPageView from "@/features/planner/portal/GuestPortalPageView";

describe("GuestPortalPageView", () => {
  it("shows clear guest empty state and planner CTA (no spinner)", () => {
    render(<GuestPortalPageView />);

    expect(screen.getByTestId("guest-portal-page")).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("guest-portal-empty")).toHaveTextContent(
      /no cloud plan history/i,
    );
    expect(screen.getByTestId("guest-portal-open-planner")).toBeInTheDocument();
  });
});
