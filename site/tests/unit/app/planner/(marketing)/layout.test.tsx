import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import PlannerMarketingLayout from "@/app/planner/(marketing)/layout";

describe("app/planner/(marketing)/layout.tsx", () => {
  it("renders children (marketing layout pass-through)", () => {
    render(
      <PlannerMarketingLayout>
        <div data-testid="marketing-child">Marketing child</div>
      </PlannerMarketingLayout>,
    );
    expect(screen.getByTestId("marketing-child")).toBeInTheDocument();
    expect(screen.getByText("Marketing child")).toBeInTheDocument();
  });
});
