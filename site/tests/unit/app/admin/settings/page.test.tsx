import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AdminSettingsPage from "@/app/admin/settings/page";

vi.mock("@/features/admin/settings/AdminSettingsPageView", () => ({
  default: () => <div data-testid="admin-settings-view">Settings</div>,
}));

describe("app/admin/settings/page.tsx", () => {
  it("renders AdminSettingsPageView under the admin route", () => {
    render(<AdminSettingsPage />);
    expect(screen.getByTestId("admin-settings-view")).toBeInTheDocument();
  });
});
