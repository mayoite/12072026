/**
 * Name-mirror: features/shared/entry/ChooseProductPage
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChooseProductPage } from "@/features/shared/entry/ChooseProductPage";

vi.mock("next/navigation", () => ({
  usePathname: () => "/choose-product",
}));

describe("ChooseProductPage", () => {
  it("renders guest mode with guest canvas entry", () => {
    render(<ChooseProductPage guestMode authenticated={false} />);

    expect(screen.getByText("Guest access")).toBeInTheDocument();
    const entry = screen.getByRole("link", { name: /Workspace Planner/i });
    expect(entry.getAttribute("href")).toContain("/planner/guest");
    expect(entry.getAttribute("href")).toContain("siteSource=");
    expect(screen.queryByRole("link", { name: "Open portal" })).not.toBeInTheDocument();
  });

  it("renders member mode with canvas entry and portal link", () => {
    render(<ChooseProductPage guestMode={false} authenticated />);

    expect(screen.getByText("Member access")).toBeInTheDocument();
    const entry = screen.getByRole("link", { name: /Workspace Planner/i });
    expect(entry.getAttribute("href")).toContain("/planner/canvas");
    expect(entry.getAttribute("href")).toContain("siteSource=");
    expect(screen.getByRole("link", { name: "Open portal" })).toHaveAttribute(
      "href",
      "/portal",
    );
    expect(screen.getByRole("link", { name: "View planner overview" })).toHaveAttribute(
      "href",
      "/planner",
    );
  });

  it("shows access-check label when neither guest nor authenticated", () => {
    render(<ChooseProductPage guestMode={false} authenticated={false} />);
    expect(screen.getByText("Access check")).toBeInTheDocument();
  });
});