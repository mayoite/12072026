import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TRUSTED_BY_PAGE_COPY } from "@/features/site/data/routeCopy";

vi.mock("@/components/ClientBadge", () => ({
  ClientBadge: ({ name }: { name?: string }) => (
    <div data-testid="mock-client-badge">{name}</div>
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

vi.mock("@/components/home/WhyChooseUs", () => ({
  WhyChooseUs: () => <div data-testid="mock-why-choose-us" />,
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

import TrustedByPage from "@/app/(site)/trusted-by/page";

describe("app/(site)/trusted-by/page.tsx", () => {
  it("renders trusted-by hero and overview copy", () => {
    render(<TrustedByPage />);
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: TRUSTED_BY_PAGE_COPY.heroTitle,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(TRUSTED_BY_PAGE_COPY.overviewKicker)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: TRUSTED_BY_PAGE_COPY.overviewTitle,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(TRUSTED_BY_PAGE_COPY.overviewDescription),
    ).toBeInTheDocument();
  });
});
