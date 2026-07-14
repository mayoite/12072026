import { describe, expect, it } from "vitest";
import {
  ADVISOR_ERROR_CODES,
  ADVISOR_ERROR_MESSAGES,
  getAdvisorErrorMessage,
} from "@/features/planner/project/ai/advisorTypes";

describe("advisorTypes", () => {
  it("maps every error code to a non-empty message", () => {
    const codes = Object.values(ADVISOR_ERROR_CODES);
    expect(codes.length).toBeGreaterThan(0);
    for (const code of codes) {
      expect(ADVISOR_ERROR_MESSAGES[code].length).toBeGreaterThan(3);
      expect(getAdvisorErrorMessage(code)).toBe(ADVISOR_ERROR_MESSAGES[code]);
    }
  });

  it("falls back for unknown codes", () => {
    const msg = getAdvisorErrorMessage("not-a-real-code" as never);
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });
});
