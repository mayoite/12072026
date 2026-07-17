import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/home/Hero", () => ({
  Hero: (props: { title: string; subtitle?: string }) => (
    <header data-testid="mock-hero">
      <h1>{props.title}</h1>
      {props.subtitle ? <p>{props.subtitle}</p> : null}
    </header>
  ),
}));

vi.mock("@/components/home/layout", () => ({
  HomeMarketingLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-marketing-layout">{children}</div>
  ),
  HomeSection: ({ children }: { children: React.ReactNode }) => <section>{children}</section>,
  HomeSectionInner: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/components/shared/ContactTeaser", () => ({
  ContactTeaser: () => <div data-testid="mock-contact-teaser" />,
}));

vi.mock("@/lib/siteUrl", () => ({
  SITE_URL: "https://example.com",
}));

vi.mock("@/lib/security/sanitize", () => ({
  sanitizeJsonForScript: (value: unknown) => JSON.stringify(value),
}));

vi.mock("@/features/site/data/seo", () => ({
  buildPageMetadata: () => ({ title: "Workspace Templates" }),
  buildPageJsonLd: () => ({ "@type": "CollectionPage" }),
}));

import TemplatesPage from "@/app/(site)/templates/page";

describe("app/(site)/templates/page.tsx", () => {
  it("renders workspace templates shell with planner entry links", () => {
    render(<TemplatesPage />);
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /workspace templates/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /template library in progress/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open planning desk/i })).toHaveAttribute(
      "href",
      "/planning",
    );
    expect(screen.getByRole("link", { name: /request a layout/i })).toHaveAttribute(
      "href",
      "/contact",
    );
  });
});
