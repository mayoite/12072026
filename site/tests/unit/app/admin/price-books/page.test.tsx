import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AdminPriceBooksPage, {
  dynamic,
  metadata,
} from "@/app/admin/price-books/page";
import {
  DEFAULT_PRICE_BOOK_ID,
  ensureDefaultPriceBookSeeded,
  readAdminPriceBook,
} from "@/features/admin/pricing/priceBookAdmin.server";

vi.mock("@/features/admin/pricing/priceBookAdmin.server", () => ({
  DEFAULT_PRICE_BOOK_ID: "pb-linear-2026-q3",
  ensureDefaultPriceBookSeeded: vi.fn(),
  readAdminPriceBook: vi.fn(),
}));

vi.mock("@/features/admin/pricing/AdminPriceBookPageView", () => ({
  AdminPriceBookPageView: ({
    initialContract,
  }: {
    initialContract: unknown;
  }) => (
    <div
      data-testid="admin-price-book-view"
      data-has-contract={String(initialContract != null)}
    />
  ),
}));

describe("app/admin/price-books/page.tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readAdminPriceBook).mockResolvedValue({
      contract: { bookId: DEFAULT_PRICE_BOOK_ID },
      snapshot: {},
    } as never);
  });

  it("exports force-dynamic and admin title metadata", () => {
    expect(dynamic).toBe("force-dynamic");
    expect(metadata.title).toBe("Price books | Oando Admin");
  });

  it("seeds default book and renders AdminPriceBookPageView", async () => {
    const page = await AdminPriceBooksPage();
    render(page);

    expect(ensureDefaultPriceBookSeeded).toHaveBeenCalled();
    expect(readAdminPriceBook).toHaveBeenCalledWith(DEFAULT_PRICE_BOOK_ID);
    const view = screen.getByTestId("admin-price-book-view");
    expect(view).toHaveAttribute("data-has-contract", "true");
  });

  it("passes null contract when book payload is missing", async () => {
    vi.mocked(readAdminPriceBook).mockResolvedValue(null);
    const page = await AdminPriceBooksPage();
    render(page);

    expect(screen.getByTestId("admin-price-book-view")).toHaveAttribute(
      "data-has-contract",
      "false",
    );
  });
});
