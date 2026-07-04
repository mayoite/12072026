import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminCrmProjectDetailPage from "@/app/admin/crm/projects/[id]/page";

vi.mock("@/features/crm/ProjectDetailView", () => ({
  default: (props: { projectId: string; embedded?: boolean }) => (
    <div data-testid="crm-project-detail-view">{JSON.stringify(props)}</div>
  ),
}));

describe("app/admin/crm/projects/[id]/page.tsx", () => {
  it("renders the project detail admin page shell", async () => {
    const page = await AdminCrmProjectDetailPage({
      params: Promise.resolve({ id: "project-42" }),
    });

    render(page);

    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Project detail" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Linked planner documents and client context."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("crm-project-detail-view")).toHaveTextContent(
      '"projectId":"project-42"',
    );
    expect(screen.getByTestId("crm-project-detail-view")).toHaveTextContent(
      '"embedded":true',
    );
  });
});
