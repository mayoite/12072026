import { describe, expect, it } from "vitest";
import {
  Catalog,
  Inspector,
  ThemeProvider,
} from "@/features/planner/shared/components";

describe("shared/components index", () => {
  it("re-exports Catalog, Inspector, ThemeProvider", () => {
    expect(Catalog).toBeTypeOf("function");
    expect(Catalog.name.length).toBeGreaterThan(0);
    expect(Inspector).toBeTypeOf("function");
    expect(Inspector.name.length).toBeGreaterThan(0);
    expect(ThemeProvider).toBeTypeOf("function");
    expect(ThemeProvider.name.length).toBeGreaterThan(0);
  });
});
