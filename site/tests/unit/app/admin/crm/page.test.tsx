import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminCrmIndexPage from "@/app/admin/crm/page";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/crm",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/features/crm/CrmHubView", () => ({
  default: () => <div data-testid="crm-hub-view">CRM hub</div>,
}));

vi.mock("@/features/crm/CrmSubnav", () => ({
  CrmSubnav: () => <nav aria-label="CRM sections">subnav</nav>,
}));

describe("app/admin/crm/page.tsx", () => {
  it("renders the pipeline hub (not a redirect to projects)", () => {
    render(<AdminCrmIndexPage />);

    expect(screen.getByRole("heading", { name: "Pipeline hub" })).toBeInTheDocument();
    expect(screen.getByText("CRM")).toBeInTheDocument();
    expect(screen.getByText(/localStorage demo/i)).toBeInTheDocument();
    expect(screen.getByText(/server-backed inbox/i)).toBeInTheDocument();
    expect(screen.getByTestId("crm-hub-view")).toBeInTheDocument();
    expect(screen.getByLabelText("CRM sections")).toBeInTheDocument();
  });
});
