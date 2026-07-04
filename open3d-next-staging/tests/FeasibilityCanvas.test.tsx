import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeasibilityCanvas } from "../src/canvas-fabric/FeasibilityCanvas";

describe("FeasibilityCanvas", () => {
  it("renders the core command strip and filters command search", () => {
    render(<FeasibilityCanvas />);

    expect(screen.getByRole("main", { name: /open3d react feasibility editor/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/floor plan drawing surface/i)).toBeInTheDocument();

    const toolbar = screen.getByRole("toolbar", { name: /canvas tools/i });
    expect(within(toolbar).getAllByRole("button")).toHaveLength(6);

    fireEvent.change(screen.getByRole("searchbox", { name: /search commands/i }), {
      target: { value: "zoom" },
    });

    expect(screen.getAllByRole("button", { name: /command result/i })).toHaveLength(3);
    expect(screen.getByRole("button", { name: /zoom in command result/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /zoom out command result/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset view command result/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /draw wall command result/i })).not.toBeInTheDocument();
  });
});
