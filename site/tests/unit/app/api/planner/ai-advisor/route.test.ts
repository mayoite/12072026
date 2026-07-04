import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const requestProviderText = vi.hoisted(() => vi.fn());
const resolveProviderChain = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: (req: NextRequest) => Promise<Response>) => handler,
}));

vi.mock("@/lib/ai/providerChain", () => ({
  resolveProviderChain,
  requestProviderText,
}));

import { POST } from "@/app/api/planner/ai-advisor/route";

const primaryProvider = {
  provider: "openrouter" as const,
  apiKey: "primary-key",
  baseURL: "https://openrouter.ai/api/v1",
  model: "test-model",
};

const backupProvider = {
  provider: "openrouter" as const,
  apiKey: "backup-key",
  baseURL: "https://openrouter.ai/api/v1",
  model: "test-model",
};

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/planner/ai-advisor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("app/api/planner/ai-advisor/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveProviderChain.mockReturnValue([primaryProvider, backupProvider]);
  });

  it("falls back to backup provider when primary fails", async () => {
    requestProviderText
      .mockRejectedValueOnce(new Error("primary down"))
      .mockResolvedValueOnce("Backup advisor reply");

    const res = await POST(
      createRequest({
        messages: [{ role: "user", content: "Place 6 desks" }],
      }),
    );

    expect(res.status).toBe(200);
    const payload = await res.json();
    expect(payload.content).toBe("Backup advisor reply");
    expect(payload.degraded).toBe(true);
    expect(requestProviderText).toHaveBeenCalledTimes(2);
    expect(requestProviderText.mock.calls[0]?.[0]?.apiKey).toBe("primary-key");
    expect(requestProviderText.mock.calls[1]?.[0]?.apiKey).toBe("backup-key");
  });

  it("returns heuristic fallback when all providers fail", async () => {
    requestProviderText.mockRejectedValue(new Error("all providers down"));

    const res = await POST(
      createRequest({
        messages: [{ role: "user", content: "Place 6 desks near the window" }],
      }),
    );

    expect(res.status).toBe(200);
    const payload = await res.json();
    expect(payload.degraded).toBe(true);
    expect(payload.content).toMatch(/6 desks|workstations/i);
    expect(requestProviderText).toHaveBeenCalledTimes(2);
  });
});
