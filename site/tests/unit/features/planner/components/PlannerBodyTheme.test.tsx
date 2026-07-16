import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PlannerBodyTheme } from "@/features/planner/components/PlannerBodyTheme";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("PlannerBodyTheme", () => {
  beforeEach(() => {
    document.body.className = "";
  });

  it("applies workspace shell class on workspace route", () => {
    vi.mocked(usePathname).mockReturnValue("/planner/canvas");

    render(<PlannerBodyTheme />);

    expect(document.body.classList.contains("planner-workspace")).toBe(true);
    expect(document.body.classList.contains("scheme-page")).toBe(false);
  });

  it("applies marketing shell class on other routes", () => {
    vi.mocked(usePathname).mockReturnValue("/home");

    render(<PlannerBodyTheme />);

    expect(document.body.classList.contains("planner-workspace")).toBe(false);
    expect(document.body.classList.contains("scheme-page")).toBe(true);
  });

  it("unlocks document scroll when leaving workspace routes", () => {
    vi.mocked(usePathname).mockReturnValue("/planner/canvas");
    const { rerender } = render(<PlannerBodyTheme />);
    expect(document.body.classList.contains("overflow-hidden")).toBe(true);

    vi.mocked(usePathname).mockReturnValue("/planner");
    rerender(<PlannerBodyTheme />);

    expect(document.body.classList.contains("overflow-hidden")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });
});
