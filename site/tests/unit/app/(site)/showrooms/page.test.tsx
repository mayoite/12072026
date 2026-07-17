import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ShowroomsPage, { metadata } from "@/app/(site)/showrooms/page";

vi.mock("@/features/site/data/routeMetadata", () => ({
  SHOWROOMS_PAGE_METADATA: { title: "Showrooms Title" },
}));

vi.mock("@/features/site/data/routeCopy", () => ({
  SHOWROOMS_PAGE_COPY: {
    heroTitle: "Showrooms, journey, and client delivery.",
    heroSubtitle: "Visit us in Patna.",
    highlightsKicker: "Signature deliveries",
  },
  SHOWROOMS_HIGHLIGHTS: [
    { title: "Highlight 1", detail: "Detail 1" },
    { title: "Highlight 2", detail: "Detail 2" },
  ],
}));

vi.mock("@/features/site/data/homepage", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    DEFAULT_HERO_FALLBACK: "/images/hero/dmrc-hero.webp",
  };
});

describe("ShowroomsPage Route", () => {
  it("renders standard marketing hero and visit details", () => {
    expect(metadata).toEqual({ title: "Showrooms Title" });

    render(<ShowroomsPage />);

    expect(screen.getByText(/Showrooms, journey/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Visit One&Only" })).toBeInTheDocument();
    expect(screen.getByText("Highlight 1")).toBeInTheDocument();
    expect(screen.getByText("Highlight 2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Plan a visit" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
  });
});
