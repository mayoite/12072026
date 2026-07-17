import { describe, it, expect, vi, beforeEach } from "vitest";

type OpenAiClientProbe = {
  baseURL: string;
  apiKey: string;
};

// Mock OpenAI as a class
vi.mock("openai", () => {
  return {
    default: class MockOpenAI {
      baseURL: string;
      apiKey: string;
      constructor(config: { baseURL: string; apiKey: string }) {
        this.baseURL = config.baseURL;
        this.apiKey = config.apiKey;
      }
    },
  };
});

function asProbe(client: unknown): OpenAiClientProbe {
  return client as OpenAiClientProbe;
}

describe("gradient", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("should use GRADIENT_API_KEY if present", async () => {
    process.env.GRADIENT_API_KEY = "grad-key";
    process.env.DO_AI_API_KEY = "do-key";

    const { gradientRegular, gradientHigher, MODELS } = await import(
      "../../../lib/gradient"
    );

    expect(asProbe(gradientRegular).apiKey).toBe("grad-key");
    expect(asProbe(gradientHigher).apiKey).toBe("grad-key");
    expect(asProbe(gradientRegular).baseURL).toBe(
      "https://inference.do-ai.run/v1",
    );
    expect(MODELS.regular).toBe("llama3.3-70b-instruct");
  });

  it("should fallback to DO_AI_API_KEY if GRADIENT_API_KEY is missing", async () => {
    delete process.env.GRADIENT_API_KEY;
    process.env.DO_AI_API_KEY = "do-key";

    const { gradientRegular } = await import("../../../lib/gradient");

    expect(asProbe(gradientRegular).apiKey).toBe("do-key");
  });

  it("should default to empty string if both keys are missing", async () => {
    delete process.env.GRADIENT_API_KEY;
    delete process.env.DO_AI_API_KEY;

    const { gradientRegular } = await import("../../../lib/gradient");

    expect(asProbe(gradientRegular).apiKey).toBe("");
  });
});
