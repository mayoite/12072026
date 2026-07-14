import { describe, expect, it } from "vitest";
import {
  classifyAIResponse,
  isStaleResponse,
  validateLayoutSchema,
} from "@/features/planner/ai/aiStatus";

const validLayout = {
  version: 1,
  furniture: [],
  room: { label: "Open plan", widthMm: 8000, depthMm: 6000 },
};

describe("aiStatus", () => {
  it("classifies live success", () => {
    const c = classifyAIResponse(true, false, null, "openai");
    expect(c.kind).toBe("live_success");
    if (c.kind === "live_success") expect(c.provider).toBe("openai");
  });

  it("classifies degraded fallback", () => {
    const c = classifyAIResponse(true, true, null, "fallback");
    expect(c.kind).toBe("degraded_fallback");
  });

  it("classifies invalid response when fallback + schema error", () => {
    const c = classifyAIResponse(
      true,
      true,
      new Error("schema validation failed"),
    );
    expect(c.kind).toBe("invalid_response");
  });

  it("classifies abort and hard failure", () => {
    const abort = new DOMException("cancelled", "AbortError");
    expect(classifyAIResponse(false, false, abort).kind).toBe("request_aborted");
    expect(classifyAIResponse(false, false, new Error("boom")).kind).toBe(
      "hard_failure",
    );
    expect(classifyAIResponse(false, false, null).kind).toBe("hard_failure");
  });

  it("detects stale responses", () => {
    expect(isStaleResponse(100, 200)).toBe(true);
    expect(isStaleResponse(200, 100)).toBe(false);
  });

  it("validates layout schema", () => {
    expect(validateLayoutSchema(validLayout)).toBe(true);
    expect(validateLayoutSchema(null)).toBe(false);
    expect(validateLayoutSchema({ version: 2, furniture: [], room: {} })).toBe(
      false,
    );
    expect(
      validateLayoutSchema({
        version: 1,
        furniture: "nope",
        room: { label: "x", widthMm: 1, depthMm: 1 },
      }),
    ).toBe(false);
  });
});
