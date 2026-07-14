/**
 * Name-mirror: features/shared/entry/ChooseProductPage
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChooseProductPage } from "@/features/shared/entry/ChooseProductPage";

describe("ChooseProductPage", () => {
  it("renders guest mode with guest canvas entry", () => {
    render(<ChooseProductPage guestMode authenticated={false} />);

    expect(screen.getByText("Guest access")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Workspace Planner/i })).toHaveAttribute(
      "href",
      "/planner/guest",
    );
    expect(screen.queryByRole("link", { name: "Open portal" })).not.toBeInTheDocument();
  });

  it("renders member mode with canvas entry and portal link", () => {
    render(<ChooseProductPage guestMode={false} authenticated />);

    expect(screen.getByText("Member access")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Workspace Planner/i })).toHaveAttribute(
      "href",
      "/planner/canvas",
    );
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
