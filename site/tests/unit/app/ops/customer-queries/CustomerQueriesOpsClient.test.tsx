import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import CustomerQueriesOpsClient from "@/app/ops/customer-queries/CustomerQueriesOpsClient";

vi.mock("@/features/ops/CustomerQueriesOpsPageView", () => ({
  default: (props: any) => <div data-testid="mock-ops-page-view">{JSON.stringify(props)}</div>,
}));

describe("CustomerQueriesOpsClient", () => {
  it("renders the re-exported page view component", () => {
    const { getByTestId } = render(<CustomerQueriesOpsClient testProp="val" />);
    const rendered = getByTestId("mock-ops-page-view");
    expect(rendered).toBeDefined();
    expect(rendered.textContent).toContain("val");
  });
});
