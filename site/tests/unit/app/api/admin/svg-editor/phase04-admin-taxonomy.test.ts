/**
 * Phase 04 — live API taxonomy checks (04-ADMIN-09)
 * Uses real parseAdminPayload + route handler (withAuth mocked).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/admin/svg-editor/route";
import type * as PersistBlockDescriptor from "@/features/planner/admin/svg-editor/persistBlockDescriptor";

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: (handler: (req: NextRequest) => Promise<Response>) => handler,
}));

vi.mock("@/features/planner/admin/svg-editor/persistBlockDescriptor", async () => {
  const actual = await vi.importActual<typeof PersistBlockDescriptor>(
    "@/features/planner/admin/svg-editor/persistBlockDescriptor",
  );
  return {
    ...actual,
    persistBlockDescriptor: vi.fn(),
  };
});

vi.mock("@/features/planner/admin/svg-editor/svgPipelineRunner", () => ({
  runSvgPipeline: vi.fn(),
}));

const { persistBlockDescriptor } = await import(
  "@/features/planner/admin/svg-editor/persistBlockDescriptor"
);

function postJson(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/admin/svg-editor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("Phase 04 — 04-ADMIN-09 descriptor 422 taxonomy (integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 422.invalid with fieldPath for missing slug (real Zod boundary)", async () => {
    const res = await POST(
      postJson({ schemaVersion: "2026-07-04.v2" }) as never,
      {} as never,
    );
    const body = (await res.json()) as {
      success: boolean;
      error: { code: string; fieldPath: string; message: string };
    };

    expect(res.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("422.invalid");
    expect(body.error.fieldPath.length).toBeGreaterThanOrEqual(0);
    expect(persistBlockDescriptor).not.toHaveBeenCalled();
  });

  it("returns 422.invalid for hex literal theme tokens (anti-copy / Zod)", async () => {
    const res = await POST(
      postJson({
        schemaVersion: "2026-07-04.v2",
        id: "11111111-1111-4111-8111-111111111111",
        slug: "hex-theme-block",
        sourceProvenance: "native",
        geometry: { widthMm: 100, depthMm: 100, heightMm: 100 },
        viewBox: { x: 0, y: 0, width: 100, height: 100 },
        mounting: ["floor"],
        themeTokens: {
          currentColor: "currentColor",
          "--color-accent": "#112233",
        },
        rovingFocus: [],
        liveAnnouncementCategories: ["status"],
        variant: "fixed",
        fixed: { sizingType: "fixed" },
        checksum: "a".repeat(64),
      }) as never,
      {} as never,
    );
    const body = (await res.json()) as {
      error: { code: string; fieldPath: string };
    };

    expect(res.status).toBe(422);
    expect(body.error.code).toBe("422.invalid");
    expect(body.error.fieldPath.length).toBeGreaterThan(0);
  });
});
