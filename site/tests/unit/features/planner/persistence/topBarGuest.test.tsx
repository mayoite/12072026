import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TopBar } from "@/features/planner/editor/TopBar";

afterEach(() => {
  cleanup();
});

describe("TopBar guest persistence gate", () => {
  it("shows guest-safe save + Export menu with BOQ (no Import / quote cart)", () => {
    render(
      <TopBar
        accessContext="guest"
        projectName="Guest plan"
        viewMode="2d"
      />,
    );

    expect(screen.getByRole("button", { name: /Save draft/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save draft/i })).toHaveTextContent("Save draft");
    expect(screen.getByRole("button", { name: /Export/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^Import/ })).not.toBeInTheDocument();
  });

  it("guest Export menu fires boq-json (first-class BOQ download path)", () => {
    const onExport = vi.fn();
    render(
      <TopBar
        accessContext="guest"
        projectName="Guest plan"
        viewMode="2d"
        onExport={onExport}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Download BOQ \(JSON\)/i }));
    expect(onExport).toHaveBeenCalledWith("boq-json");

    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Download BOQ \(CSV\)/i }));
    expect(onExport).toHaveBeenCalledWith("boq-csv");

    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Download plan \(JSON\)/i }));
    expect(onExport).toHaveBeenCalledWith("json");

    // Guest surface stays honest: no quote cart / workstation-only ERP theater.
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    expect(
      screen.queryByRole("menuitem", { name: /quote cart/i }),
    ).not.toBeInTheDocument();
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
