import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GuestPortalPage from "@/app/(site)/portal/guest/page";

describe("app/(site)/portal/guest/page.tsx", () => {
  it("renders guest portal shell without redirecting or loading remote plans", () => {
    render(<GuestPortalPage />);

    expect(screen.getByTestId("guest-portal-page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /guest workspace entry/i })).toBeInTheDocument();
    expect(screen.getByTestId("guest-portal-empty")).toBeInTheDocument();
    expect(screen.getByTestId("guest-portal-open-planner")).toHaveAttribute(
      "href",
      "/planner/guest/",
    );
    expect(screen.getByTestId("guest-portal-sign-in")).toHaveAttribute(
      "href",
      "/access?next=%2Fportal",
    );
  });
});
