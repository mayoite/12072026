import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { PlannerHelpPanel } from "@/features/planner/help/PlannerHelpPanel";
import { PLANNER_HELP_SECTIONS } from "@/features/planner/help/helpSections";

describe("PlannerHelpPanel", () => {
  it("renders help topics for guests with guest banner", () => {
    render(<PlannerHelpPanel accessContext="guest" />);

    expect(screen.getByTestId("planner-help-panel")).toHaveAttribute(
      "data-access",
      "guest",
    );
    expect(screen.getByTestId("planner-help-guest-banner")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Help" })).toBeInTheDocument();
    expect(
      screen.getByText(PLANNER_HELP_SECTIONS[0]!.title),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /full help center/i })).toHaveAttribute(
      "href",
      "/planner/help/",
    );
  });

  it("does not show guest banner for authenticated members", () => {
    render(<PlannerHelpPanel accessContext="authenticated" />);

    expect(screen.queryByTestId("planner-help-guest-banner")).not.toBeInTheDocument();
    expect(screen.getByTestId("planner-help-panel")).toHaveAttribute(
      "data-access",
      "authenticated",
    );
  });

  it("filters sections by search query", () => {
    render(<PlannerHelpPanel />);

    const search = screen.getByRole("searchbox", { name: /search help topics/i });
    fireEvent.change(search, { target: { value: "keyboard" } });

    expect(screen.getByText("Keyboard shortcuts")).toBeInTheDocument();
    expect(screen.queryByText("Getting started")).not.toBeInTheDocument();
  });

  it("calls onClose from footer button", () => {
    const onClose = vi.fn();
    render(<PlannerHelpPanel onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
