import { describe, expect, it } from "vitest";
import { useThemeVariables } from "@/features/planner/shared/hooks/useThemeVariables";

describe("useThemeVariables", () => {
  it("should have function useThemeVariables defined", () => {
    expect(useThemeVariables).toBeTypeOf("function"); expect(String(useThemeVariables)).toContain('function');
  });
  it("should have hook useThemeVariables defined", () => {
    expect(useThemeVariables).toBeTypeOf("function"); expect(String(useThemeVariables)).toContain('function');
  });
});
