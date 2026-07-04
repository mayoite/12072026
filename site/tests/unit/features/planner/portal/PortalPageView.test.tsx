import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import PortalPageView from "@/features/planner/portal/PortalPageView";

describe("PortalPageView", () => {
  it("should render default component PortalPageView", () => {
    const { container } = render(React.createElement(PortalPageView, {} as any));
    expect(container).toBeDefined();
  });
});