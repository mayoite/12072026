import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminCrmClientsPage from "@/app/admin/crm/clients/page";

vi.mock("@/features/crm/ClientsView", () => ({
  default: (props: { embedded?: boolean }) => (
    <div data-testid="crm-clients-view">{JSON.stringify(props)}</div>
  ),
}));

describe("app/admin/crm/clients/page.tsx", () => {
  it("renders the clients admin page shell", () => {
    render(<AdminCrmClientsPage />);

    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Clients" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Client records, contact context, and linked projects."),
    ).toBeInTheDocument();
    expect(screen.getByTestId("crm-clients-view")).toHaveTextContent(
      '"embedded":true',
    );
  });
});
