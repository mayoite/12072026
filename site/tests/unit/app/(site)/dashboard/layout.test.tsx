import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import DashboardLayout, { metadata } from "@/app/(site)/dashboard/layout";

describe("app/(site)/dashboard/layout.tsx", () => {
  it("exports noindex dashboard metadata", () => {
    expect(metadata.title).toBe("Dashboard | One&Only");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("renders children directly", () => {
    render(
      <DashboardLayout>
        <div data-testid="dashboard-child">Dashboard child</div>
      </DashboardLayout>,
    );
    expect(screen.getByTestId("dashboard-child")).toBeInTheDocument();
  });
});
