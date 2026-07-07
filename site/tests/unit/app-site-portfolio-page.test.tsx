import { describe, it, expect, vi, beforeEach } from "vitest";
import type * as routeCopyType0 from "@/lib/site-data/routeCopy";
import { render, screen } from "@testing-library/react";
import fs from "node:fs/promises";
import PortfolioPage from "@/app/(site)/portfolio/page";

vi.mock("@/lib/site-data/routeMetadata", () => ({
  PORTFOLIO_PAGE_METADATA: {},
}));

vi.mock("@/lib/site-data/routeCopy", async (importOriginal) => {
  const actual = await importOriginal<typeof routeCopyType0>();

  return {
    ...actual,
    PORTFOLIO_CLIENTS: [
      { id: "alpha", folder: "Alpha Team", name: "Alpha Team", location: "Patna", summary: "Alpha summary" },
      { id: "beta", folder: "Beta", name: "Beta", location: "Delhi", summary: "Beta summary" },
      { id: "gamma", folder: "Gamma", name: "Gamma", location: "Mumbai", summary: "Gamma summary" },
    ],
  };
});

vi.mock("node:fs/promises", () => ({
  default: {
    readdir: vi.fn(),
  },
}));

describe("PortfolioPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders only clients with at least two filtered images", async () => {
    const mockedReaddir = vi.mocked(fs.readdir);
    mockedReaddir
      .mockResolvedValueOnce(["z.webp", "notes.txt", "board room 1.jpg", "alpha shot.png"])
      .mockResolvedValueOnce(["single.webp"])
      .mockResolvedValueOnce(["cover.webp", "detail shot.jpg"]);

    const jsx = await PortfolioPage();
    render(jsx);

    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alpha Team" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gamma" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Beta" })).toBeNull();
  });

  it("renders the empty state when file reads fail", async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error("ENOENT"));

    const jsx = await PortfolioPage();
    render(jsx);

    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
