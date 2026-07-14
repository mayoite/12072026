import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import {
  requestProviderText,
  resolveProviderChain,
} from "@/lib/ai/providerChain";
import { createRectangularRoomProject } from "@/features/planner/project/model/project";

vi.mock("@/lib/ai/providerChain", () => ({
  requestProviderText: vi.fn(),
  resolveProviderChain: vi.fn(),
}));

vi.mock("@/features/planner/project/model/project", () => ({
  createRectangularRoomProject: vi.fn(),
}));

import { POST } from "@/app/api/planner/project-sketch/route";

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/planner/project-sketch", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("app/api/planner/project-sketch/route.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST returns 400 when imageDataUrl is missing", async () => {
    const res = await POST(makeReq({ projectName: "Room" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/imageDataUrl/);
  });

  it("POST returns 500 when no AI provider is configured", async () => {
    vi.mocked(resolveProviderChain).mockReturnValue([]);
    const res = await POST(
      makeReq({ imageDataUrl: "data:image/png;base64,abc" }),
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toMatch(/No AI provider/);
  });

  it("POST converts sketch dimensions into a rectangular project", async () => {
    vi.mocked(resolveProviderChain).mockReturnValue([
      { provider: "gemini", model: "gemini-pro" },
    ] as never);
    vi.mocked(requestProviderText).mockResolvedValue(
      JSON.stringify({ widthMm: 5000, depthMm: 3500 }),
    );
    const project = {
      name: "Sketch Conversion",
      displayUnit: "mm",
      floors: [{ id: "f1" }],
    };
    vi.mocked(createRectangularRoomProject).mockReturnValue(project as never);

    const res = await POST(
      makeReq({
        imageDataUrl: "data:image/png;base64,abc",
        projectName: "Office",
        displayUnit: "ft",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe("completed");
    expect(body.project).toEqual(project);
    expect(createRectangularRoomProject).toHaveBeenCalledWith({
      name: "Office",
      widthMm: 5000,
      depthMm: 3500,
    });
    expect(project.displayUnit).toBe("ft");
  });
});
