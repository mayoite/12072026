import { describe, expect, it } from "vitest";
import { boqToQuoteCart, boqToQuoteSummary } from "@/features/planner/shared/boq/quoteCartBridge";

describe("quoteCartBridge", () => {
  it("should have function boqToQuoteCart defined", () => {
    expect(boqToQuoteCart).toBeTypeOf("function"); expect(String(boqToQuoteCart)).toContain('function');
  });
  it("should have function boqToQuoteSummary defined", () => {
    expect(boqToQuoteSummary).toBeTypeOf("function"); expect(String(boqToQuoteSummary)).toContain('function');
  });
});