import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";

vi.mock("node:path", () => ({
  default: {
    join: (...parts: string[]) => parts.join("/"),
    basename: (p: string) => p.split("/").pop() ?? p,
    resolve: (...parts: string[]) => parts.join("/"),
  },
  join: (...parts: string[]) => parts.join("/"),
  basename: (p: string) => p.split("/").pop() ?? p,
  resolve: (...parts: string[]) => parts.join("/"),
}));

vi.mock("node:fs", () => ({
  default: {
    existsSync: vi.fn(() => false),
    readFileSync: vi.fn(() => ""),
    statSync: vi.fn(() => ({ mtime: new Date("2026-06-28T00:00:00.000Z") })),
  },
  existsSync: vi.fn(() => false),
  readFileSync: vi.fn(() => ""),
  statSync: vi.fn(() => ({ mtime: new Date("2026-06-28T00:00:00.000Z") })),
}));

vi.mock("@/features/admin/inventory/AdminInventoryPageView", () => ({
  default: ({
    csv,
    generatedAt,
    rowCount,
  }: {
    csv: string;
    generatedAt: string | null;
    rowCount: number;
  }) => (
    <div
      data-testid="admin-inventory-view"
      data-rows={String(rowCount)}
      data-generated={generatedAt ?? "none"}
      data-csv-empty={String(csv.length === 0)}
    />
  ),
}));

import AdminInventoryPage from "@/app/admin/inventory/page";

describe("app/admin/inventory/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fs.existsSync).mockReturnValue(false);
  });

  it("renders inventory view with empty props when CSV is missing", () => {
    render(<AdminInventoryPage />);

    const view = screen.getByTestId("admin-inventory-view");
    expect(view).toBeInTheDocument();
    expect(view).toHaveAttribute("data-rows", "0");
    expect(view).toHaveAttribute("data-generated", "none");
    expect(view).toHaveAttribute("data-csv-empty", "true");
  });

  it("loads CSV and passes row count when inventory file exists", () => {
    const csv = "route,type\n/admin,page\n/planner,page\n";
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(csv);
    vi.mocked(fs.statSync).mockReturnValue({
      mtime: new Date("2026-07-17T12:00:00.000Z"),
    } as fs.Stats);

    render(<AdminInventoryPage />);

    const view = screen.getByTestId("admin-inventory-view");
    expect(view).toHaveAttribute("data-rows", "2");
    expect(view).toHaveAttribute("data-generated", "2026-07-17T12:00:00.000Z");
    expect(view).toHaveAttribute("data-csv-empty", "false");
  });
});
