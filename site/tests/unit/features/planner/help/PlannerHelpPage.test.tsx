import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PlannerHelpPage } from "@/features/planner/help/PlannerHelpPage";
import { PLANNER_HELP_SECTIONS } from "@/features/planner/help/helpSections";

describe("PlannerHelpPage", () => {
  it("renders help page with all sections by default", () => {
    render(<PlannerHelpPage />);

    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.getByTestId("home-section")).toBeInTheDocument();

    expect(screen.getByText("Help center")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Workspace planner guide/i })).toBeInTheDocument();
    expect(
      screen.getByText(`${PLANNER_HELP_SECTIONS.length} of ${PLANNER_HELP_SECTIONS.length} topics`)
    ).toBeInTheDocument();

    // Check that some sample sections are rendered
    expect(screen.getByRole("heading", { name: "Getting started" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Canvas basics" })).toBeInTheDocument();
  });

  it("filters topics based on search query", () => {
    render(<PlannerHelpPage />);

    const searchInput = screen.getByPlaceholderText("Search help…");
    fireEvent.change(searchInput, { target: { value: "getting" } });

    expect(screen.getByRole("heading", { name: "Getting started" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Canvas basics" })).not.toBeInTheDocument();

    // Should also search keywords/summary
    fireEvent.change(searchInput, { target: { value: "ctrl" } });
    expect(screen.getByRole("heading", { name: "Keyboard shortcuts" })).toBeInTheDocument();
  });

  it("shows empty state and allows resetting when query has no matches", () => {
    render(<PlannerHelpPage />);

    const searchInput = screen.getByPlaceholderText("Search help…");
    fireEvent.change(searchInput, { target: { value: "nonexistenttopic123" } });

    expect(screen.getByText("No topics match your search.")).toBeInTheDocument();
    expect(screen.getByText(`0 of ${PLANNER_HELP_SECTIONS.length} topics`)).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    fireEvent.click(clearButton);

    expect(screen.queryByText("No topics match your search.")).not.toBeInTheDocument();
    expect(screen.getByText(`${PLANNER_HELP_SECTIONS.length} of ${PLANNER_HELP_SECTIONS.length} topics`)).toBeInTheDocument();
    expect(searchInput).toHaveValue("");
  });

  it("renders feature links for sections that have featureSlug", () => {
    render(<PlannerHelpPage />);

    // Section with featureSlug: "3d-view" (Canvas basics)
    const heading = screen.getByRole("heading", { name: "Canvas basics" });
    const article = heading.closest("article");
    expect(article).not.toBeNull();

    // Find the feature page link inside that article
    const featureLink = article?.querySelector('a[href="/planner/features/3d-view/"]');
    expect(featureLink).toBeInTheDocument();
    expect(featureLink?.textContent).toContain("Feature page");
  });
});
