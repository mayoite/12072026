import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlannerThemeToggle } from "@/features/planner/components/PlannerThemeToggle";
import { useTheme } from "@/features/planner/components/WorkspaceThemeProvider";

vi.mock("@/features/planner/components/WorkspaceThemeProvider", () => ({
  useTheme: vi.fn(),
}));

vi.mock("@/features/planner/ui/PlannerTooltip", () => ({
  PlannerTooltip: ({ children, label }: any) => <div data-testid="tooltip" data-label={label}>{children}</div>,
}));

describe("PlannerThemeToggle", () => {
  it("renders buttons and handles theme change click", () => {
    const mockSetTheme = vi.fn();
    vi.mocked(useTheme).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<PlannerThemeToggle />);

    const lightBtn = screen.getByRole("radio", { name: "Light" });
    const darkBtn = screen.getByRole("radio", { name: "Dark" });

    expect(lightBtn).toHaveAttribute("aria-checked", "true");
    expect(darkBtn).toHaveAttribute("aria-checked", "false");

    fireEvent.click(darkBtn);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
