import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Providers } from "@/features/planner/components/Providers";

vi.mock("@/features/planner/components/WorkspaceThemeProvider", () => ({
  ThemeProvider: ({ children }: any) => <div data-testid="mock-theme-provider">{children}</div>,
}));

describe("Providers", () => {
  it("renders children wrapped inside ThemeProvider", () => {
    render(
      <Providers>
        <span data-testid="child">Child content</span>
      </Providers>
    );

    expect(screen.getByTestId("mock-theme-provider")).toBeInTheDocument();
    expect(screen.getByTestId("child")).toHaveTextContent("Child content");
  });
});
