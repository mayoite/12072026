import "@/tests/helpers/nextIntlServerEnMock";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "@/app/(site)/imprint/page";

vi.mock("@/components/home/Hero", () => ({
  Hero: () => <div data-testid="Hero" />,
}));
vi.mock("@/components/shared/ContactTeaser", () => ({
  ContactTeaser: () => <div data-testid="ContactTeaser" />,
}));

describe("app/(site)/imprint/page.tsx", () => {
  it("renders successfully", async () => {
    const page = await Page();
    render(page);
    expect(screen.getByTestId("Hero")).toBeInTheDocument();
    expect(screen.getByTestId("ContactTeaser")).toBeInTheDocument();
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
  });
});
