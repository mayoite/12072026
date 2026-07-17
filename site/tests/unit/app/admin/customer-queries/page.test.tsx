import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminCustomerQueriesPage from "@/app/admin/customer-queries/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/admin/customer-queries",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/features/ops/CustomerQueriesOpsPageView", () => ({
  default: (props: { embedded?: boolean }) => (
    <div data-testid="customer-queries-ops">{JSON.stringify(props)}</div>
  ),
}));

vi.mock("@/features/crm/CrmSubnav", () => ({
  CrmSubnav: () => <nav aria-label="CRM sections">subnav</nav>,
}));

describe("app/admin/customer-queries/page.tsx", () => {
  it("renders CRM subnav and embedded server-backed ops view", () => {
    render(<AdminCustomerQueriesPage />);

    expect(screen.getByLabelText("CRM sections")).toBeInTheDocument();
    expect(screen.getByTestId("customer-queries-ops")).toHaveTextContent(
      '"embedded":true',
    );
  });
});
