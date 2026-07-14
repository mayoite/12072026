import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { SplitViewLayout } from "@/features/planner/shared/components/SplitViewLayout";

describe("SplitViewLayout", () => {
  it("should render component SplitViewLayout", () => {
    // Basic test
    const { container } = render(
      React.createElement(SplitViewLayout, {
        view: "2d",
        children2D: React.createElement("div"),
        children3D: React.createElement("div"),
      }),
    );
    expect(container).toBeDefined();
  });
  it("should have function SplitViewLayout defined", () => {
    expect(SplitViewLayout).toBeTypeOf("function"); expect(String(SplitViewLayout)).toContain('function');
  });
});
