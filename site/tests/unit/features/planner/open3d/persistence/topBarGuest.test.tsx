import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopBar } from "@/features/planner/open3d/editor/TopBar";

describe("TopBar guest persistence gate", () => {
  it("shows guest-safe save and JSON export without full import/export menus", () => {
    render(
      <TopBar
        accessContext="guest"
        projectName="Guest plan"
        viewMode="2d"
      />,
    );

    expect(screen.getByRole("button", { name: "Save draft" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export JSON" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Import/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Export$/ })).not.toBeInTheDocument();
  });

  it("shows Import and Export controls for authenticated sessions", () => {
    render(
      <TopBar
        accessContext="authenticated"
        projectName="Member plan"
        viewMode="2d"
      />,
    );

    expect(screen.getByRole("button", { name: /^Import/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Export/ })).toBeInTheDocument();
  });
});
