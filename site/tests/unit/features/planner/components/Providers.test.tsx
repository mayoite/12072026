import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Providers } from "@/features/planner/components/Providers";

describe("Providers", () => {
  it("renders children without extra wrapper nodes", () => {
    const { container } = render(
      <Providers>
        <p data-testid="inner">workspace</p>
      </Providers>,
    );
    expect(screen.getByTestId("inner")).toHaveTextContent("workspace");
    expect(container.querySelector("p")).toBe(screen.getByTestId("inner"));
  });
});
