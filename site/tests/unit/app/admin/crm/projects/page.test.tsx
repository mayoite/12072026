import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminCrmProjectsPage from "@/app/admin/crm/projects/page";

vi.mock("@/features/crm/ProjectsView", () => ({
  default: (props: { embedded?: boolean }) => (
    <div data-testid="crm-projects-view">{JSON.stringify(props)}</div>
  ),
}));

describe("app/admin/crm/projects/page.tsx", () => {
  it("renders the projects admin page shell", () => {
    render(<AdminCrmProjectsPage />);

    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Projects" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Active deals, floor plans, and delivery pipelines."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("crm-projects-view")).toHaveTextContent(
      '"embedded":true',
    );
  });
});
