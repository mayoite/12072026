import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SUSTAINABILITY_PAGE_COPY } from "@/features/site/data/routeCopy";

vi.mock("next/image", () => ({
  default: (props: { alt?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt ?? ""} data-testid="mock-next-image" />
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

vi.mock("@/components/site/EditorialRoute", () => ({
  EditorialArrowLink: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

import SustainabilityPage from "@/app/(site)/sustainability/page";

describe("app/(site)/sustainability/page.tsx", () => {
  it("renders sustainability hero and intro copy", () => {
    render(<SustainabilityPage />);
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: SUSTAINABILITY_PAGE_COPY.heroTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: SUSTAINABILITY_PAGE_COPY.introTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(SUSTAINABILITY_PAGE_COPY.introDescription),
    ).toBeInTheDocument();
  });
});
