import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/features/planner/shared/components/ThemeProvider";

vi.mock("@/lib/theme/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canonical-theme">{children}</div>
  ),
}));

describe("shared ThemeProvider", () => {
  it("wraps children with canonical theme provider", () => {
    render(
      <ThemeProvider defaultTheme="premium-light">
        <span>child</span>
      </ThemeProvider>,
    );
    expect(screen.getByTestId("canonical-theme")).toBeInTheDocument();
    expect(screen.getByText("child")).toBeInTheDocument();
  });
});
