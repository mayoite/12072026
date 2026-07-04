import { describe, it, expect } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { AdminDashboard } from "@/features/admin/ui/AdminDashboard";

describe("AdminDashboard", () => {
  it("renders metrics and titles correctly", () => {
    const { getByText } = render(<AdminDashboard />);
    expect(getByText("Platform Overview")).toBeDefined();
    expect(getByText("Total Active Users")).toBeDefined();
    expect(getByText("1,248")).toBeDefined();
    expect(getByText("Workspaces Created")).toBeDefined();
    expect(getByText("156")).toBeDefined();
    expect(getByText("Daily Interactions")).toBeDefined();
    expect(getByText("8,409")).toBeDefined();
  });
});
