import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { metadata } from "@/app/(site)/planning/page";
import { PLANNING_PAGE_METADATA } from "@/features/site/data/routeMetadata";

vi.mock("@/components/home/Hero", () => ({
  Hero: () => <div data-testid="Hero" />,
}));
vi.mock("@/components/shared/ContactTeaser", () => ({
  ContactTeaser: () => <div data-testid="ContactTeaser" />,
}));
vi.mock("@/components/shared/RouteCtaBand", () => ({
  RouteCtaBand: ({
    actions,
  }: {
    actions?: { href: string; label: string }[];
  }) => (
    <div data-testid="RouteCtaBand">
      {(actions ?? []).map((action) => (
        <a key={`${action.href}-${action.label}`} href={action.href}>
          {action.label}
        </a>
      ))}
    </div>
  ),
}));
vi.mock("@/components/shared/SectionIntro", () => ({
  SectionIntro: ({ title }: { title: string }) => (
    <div data-testid="SectionIntro">{title}</div>
  ),
}));
vi.mock("@/components/ui/TrackedLink", () => ({
  TrackedLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("app/(site)/planning/page.tsx", () => {
  it("exports registry planning metadata (SITE-SEO-01 lockstep)", () => {
    expect(metadata).toBe(PLANNING_PAGE_METADATA);
  });

  it("renders planner entry + contact paths without Admin", () => {
    render(<Page />);
    expect(screen.getByTestId("Hero")).toBeInTheDocument();
    expect(screen.getByTestId("ContactTeaser")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Open Oando Planner" })).toHaveAttribute(
      "href",
      "/planner",
    );
    const contactLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/contact");
    expect(contactLinks.length).toBeGreaterThan(0);

    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href") ?? "";
      expect(href.toLowerCase()).not.toMatch(/^\/admin(\/|$)/);
    }
  });
});
