import { describe, expect, it } from "vitest";
import {
  buildBoq,
  boqToQuoteCart,
  boqToQuoteSummary,
} from "@/features/planner/shared/boq";
import type { BoqSummary } from "@/features/planner/shared/boq/types";

const emptyBoq: BoqSummary = {
  lineItems: [],
  totalItems: 0,
  totalPriceInr: 0,
  generatedAt: "2026-07-13T12:00:00.000Z",
  subtotalInr: 0,
  gstRate: 0.18,
  gstAmountInr: 0,
  grandTotalInr: 0,
};

describe("shared/boq index", () => {
  it("re-exports buildBoq that returns empty summary for empty input", () => {
    const boq = buildBoq([], new Map());
    expect(boq.lineItems).toEqual([]);
    expect(boq.totalItems).toBe(0);
    expect(boq.gstRate).toBe(0.18);
  });

  it("re-exports quote cart bridges", () => {
    const cart = boqToQuoteCart(emptyBoq);
    const quote = boqToQuoteSummary(emptyBoq);
    expect(Array.isArray(cart) || typeof cart === "object").toBe(true);
    expect(quote).toBeDefined();
  });
});
