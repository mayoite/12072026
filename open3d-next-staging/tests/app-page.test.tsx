import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import Page from "../app/page";

describe("app/page", () => {
  it("renders the donor-style floor plan shell and wires the main controls", async () => {
    const user = userEvent.setup();

    render(<Page />);

    expect(screen.getByText("BUILD")).toBeInTheDocument();
    expect(screen.getByText("ROOMS")).toBeInTheDocument();
    expect(screen.getByText("OBJECTS")).toBeInTheDocument();
    expect(screen.getByText("Floor Plan Editor")).toBeInTheDocument();
    expect(screen.getByText("No Selection")).toBeInTheDocument();
    expect(screen.getByText("Saved ✓")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "ROOMS" }));
    expect(screen.getByRole("button", { name: /Rectangle/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Living Room/ })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "OBJECTS" }));
    expect(screen.getByPlaceholderText("Search furniture...")).toBeInTheDocument();

    await user.click(screen.getByText(/Floor: Ground Floor/));
    await user.click(screen.getByRole("option", { name: "First Floor" }));
    expect(screen.getByText("Unsaved •")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Saved ✓")).toBeInTheDocument();

    await user.click(screen.getByTitle("Zoom in (+)"));
    expect(screen.getByText("Zoom: 125%")).toBeInTheDocument();

    await user.click(screen.getByTitle("Zoom out (−)"));
    expect(screen.getByText("Zoom: 100%")).toBeInTheDocument();
  });
});
