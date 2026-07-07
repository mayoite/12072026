import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs/promises";
import PortfolioPage from "@/app/(site)/portfolio/page";

vi.mock("@/lib/site-data/routeMetadata", () => ({
  PORTFOLIO_PAGE_METADATA: {},
}));

vi.mock("@/lib/site-data/routeCopy", () => ({
  PORTFOLIO_CLIENTS: [
    { id: "alpha", folder: "Alpha Team", name: "Alpha Team", location: "Patna", summary: "Alpha summary" },
    { id: "beta", folder: "Beta", name: "Beta", location: "Delhi", summary: "Beta summary" },
    { id: "gamma", folder: "Gamma", name: "Gamma", location: "Mumbai", summary: "Gamma summary" },
  ],
}));

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
    expect(screen.getByText(/Spaces we/i)).toBeInTheDocument();
    expect(screen.getByText(/delivered/i)).toBeInTheDocument();

    const normalizePath = (value: string) => value.replaceAll("\\", "/");
    expect(normalizePath(String(mockedReaddir.mock.calls[0]?.[0]))).toContain(
      "public/images/projects/Alpha Team",
    );
    expect(normalizePath(String(mockedReaddir.mock.calls[1]?.[0]))).toContain(
      "public/images/projects/Beta",
    );
    expect(normalizePath(String(mockedReaddir.mock.calls[2]?.[0]))).toContain(
      "public/images/projects/Gamma",
    );

    expect(screen.getByRole("heading", { name: "Alpha Team" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gamma" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Beta" })).toBeNull();

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(5);
    expect(images[0]).toHaveAttribute("src", "/images/projects/Alpha%20Team/alpha%20shot.png");
    expect(images[1]).toHaveAttribute("src", "/images/projects/Alpha%20Team/board%20room%201.jpg");
    expect(images[2]).toHaveAttribute("src", "/images/projects/Alpha%20Team/z.webp");
    expect(images[4]).toHaveAttribute("src", "/images/projects/Gamma/detail%20shot.jpg");
  });

  it("renders the empty state when file reads fail", async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error("ENOENT"));

    const jsx = await PortfolioPage();
    render(jsx);

    expect(screen.getByTestId("home-marketing-layout")).toBeInTheDocument();
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });
});
