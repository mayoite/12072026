import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { ProjectSetupGate } from "@/features/planner/onboarding/ProjectSetupGate";

describe("ProjectSetupGate", () => {
  it("should render component ProjectSetupGate", () => {
    // Basic test
    const { container } = render(
      React.createElement(ProjectSetupGate, null, React.createElement("div")),
    );
    expect(container).toBeDefined();
  });
  it("should have function ProjectSetupGate defined", () => {
    expect(ProjectSetupGate).toBeTypeOf("function");
  });
});
