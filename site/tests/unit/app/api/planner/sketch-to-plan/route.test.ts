import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const requestSketchToPlan = vi.hoisted(() => vi.fn());
const classifySketchConversionError = vi.hoisted(() => vi.fn());
const getSketchRecoveryMessage = vi.hoisted(() => vi.fn());

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: (req: NextRequest) => Promise<Response>) => handler,
}));

vi.mock("@/features/planner/ai/sketchToPlan", () => ({
  requestSketchToPlan,
  classifySketchConversionError,
  getSketchRecoveryMessage,
}));

import { POST } from "@/app/api/planner/sketch-to-plan/route";

describe("app/api/planner/sketch-to-plan/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createReq = (body: unknown) =>
    new NextRequest("http://localhost/api/planner/sketch-to-plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  const validPayload = {
    fileName: "sketch.png",
    imageDataUrl: "data:image/png;base64,aGVsbG8=",
    prompt: "Convert this floor sketch into walls",
  };

  it("returns validation error for invalid payload", async () => {
    const res = await POST(createReq({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("returns preview objects on successful conversion", async () => {
    requestSketchToPlan.mockResolvedValue({
      objects: [{ type: "wall" }],
      warnings: ["low confidence"],
    });

    const res = await POST(createReq(validPayload));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe("preview");
    expect(body.objects).toHaveLength(1);
    expect(requestSketchToPlan).toHaveBeenCalled();
  });

  it("returns fallback response for recoverable sketch errors", async () => {
    requestSketchToPlan.mockRejectedValue(new Error("unsupported format"));
    classifySketchConversionError.mockReturnValue({
      reason: "unsupported_format",
      message: "Unsupported image format",
    });
    getSketchRecoveryMessage.mockReturnValue("Please upload PNG or JPEG.");

    const res = await POST(createReq(validPayload));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("fallback");
    expect(body.reason).toBe("unsupported_format");
  });
});
