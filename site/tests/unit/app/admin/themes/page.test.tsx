import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminThemesPage, { metadata } from "@/app/admin/themes/page";

vi.mock("@/app/admin/themes/ThemeEditor", () => ({
  ThemeEditor: () => <div data-testid="admin-theme-editor">Theme editor</div>,
}));

describe("app/admin/themes/page.tsx", () => {
  it("exports Theme Manager metadata", () => {
    expect(metadata.title).toBe("Theme Manager | Oando Admin");
  });

  it("renders admin page shell and ThemeEditor", () => {
    render(<AdminThemesPage />);

    expect(
      screen.getByRole("heading", { name: "Theme Manager" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/System · planner materials/i)).toBeInTheDocument();
    expect(screen.getByTestId("admin-theme-editor")).toBeInTheDocument();
    expect(
      screen.getByText(/does not change the admin shell or marketing site theme/i),
    ).toBeInTheDocument();
  });
});
