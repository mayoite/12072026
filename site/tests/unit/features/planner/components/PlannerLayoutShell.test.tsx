import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlannerLayoutShell } from "@/features/planner/components/PlannerLayoutShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/planner/canvas",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/app/(site)/providers/QueryProvider", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="query">{children}</div>,
}));

vi.mock("@/lib/theme/ThemeProvider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme">{children}</div>,
}));

vi.mock("@/components/site/RouteChrome", () => ({
  RouteChrome: ({ position }: { position: string }) => <div data-testid={`chrome-${position}`} />,
}));

vi.mock("@/features/planner/components/PlannerBodyTheme", () => ({
  PlannerBodyTheme: () => <div data-testid="body-theme" />,
}));

vi.mock("@/features/planner/editor/PlannerErrorBoundary", () => ({
  PlannerErrorBoundary: ({ children, label }: { children: React.ReactNode; label?: string }) => (
    <div data-testid="error-boundary" data-label={label ?? ""}>{children}</div>
  ),
}));

describe("PlannerLayoutShell", () => {
  it("wraps children in main with providers and dual route chrome", () => {
    render(
      <PlannerLayoutShell>
        <span>child-content</span>
      </PlannerLayoutShell>,
    );
    expect(screen.getByText("child-content")).toBeDefined();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByTestId("chrome-top")).toBeDefined();
    expect(screen.getByTestId("chrome-bottom")).toBeDefined();
    expect(screen.getByTestId("error-boundary")).toHaveAttribute("data-label", "Planner");
  });
});
