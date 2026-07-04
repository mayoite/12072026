import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminCrmQuotesPage from "@/app/admin/crm/quotes/page";

vi.mock("@/features/crm/QuotesView", () => ({
  default: (props: { embedded?: boolean }) => (
    <div data-testid="crm-quotes-view">{JSON.stringify(props)}</div>
  ),
}));

describe("app/admin/crm/quotes/page.tsx", () => {
  it("renders the quotes admin page shell", () => {
    render(<AdminCrmQuotesPage />);

    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Quotes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Quote drafts, approvals, and follow-up status."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("crm-quotes-view")).toHaveTextContent(
      '"embedded":true',
    );
  });
});
