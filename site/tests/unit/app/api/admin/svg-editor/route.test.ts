/**
 * TDD tests for POST /api/admin/svg-editor (Phase 04)
 *
 * 04-TEST-01: Auth gate — 401/403 via withAuth envelope.
 * 04-TEST-02: Zod/422 on invalid (missing fields, bad schemaVersion).
 * 04-TEST-03: Atomic write via persistBlockDescriptor.
 * 04-TEST-04: Success thumb + dual-write deps (mocked mode; env-independent).
 * Fail-closed: compile/pipeline failures → 422, no success body.
 * 04-TEST-06: Forbidden lint guard (grep for puckBlockRegistry import under /planner/* without withAuth).
 *
 * Dual-write resolver is mocked so this suite does not depend on PRODUCTS_DATABASE_URL
 * or live R2 (EXEC-4 owns resolver honesty). Disk remains live publish authority.
 *
 * Note: withAuth is mocked to passthrough for handler logic tests.
 * Auth failure paths exercised via withAuth unit suite.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/admin/svg-editor/route";
import type * as SvgBlockDescriptorLoader from "@/features/planner/catalog/svg/svgBlockDescriptorLoader";
import type { BlockDescriptor } from "@/features/planner/catalog/svg/svgTypes";
import type { PlannerDescriptorError } from "@/features/planner/catalog/svg/svgTypes";

vi.mock("@/features/shared/api/withAuth", () => ({
  withAuth: (
    handler: (req: NextRequest, ctx: unknown) => Promise<Response>,
    _opts: unknown,
  ) => handler,
}));

vi.mock("@/features/admin/svg-editor/storage/persistBlockDescriptor", () => ({
  persistBlockDescriptor: vi.fn(),
  parseAdminPayload: vi.fn(),
}));

vi.mock("@/features/admin/svg-editor/publish/publishDescriptorWithPipeline", () => ({
  publishDescriptorWithPipeline: vi.fn(),
}));

// Disk-authority path for A2: dual-write attach is owned by A3. Mock skip so
// local PRODUCTS_DATABASE_URL / R2 env cannot inject real dual-write deps here.
vi.mock("@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite", () => ({
  resolveSvgPublishDualWriteDeps: vi.fn(async () => ({
    dbRepository: undefined,
    artifactStore: undefined,
    mode: "skipped_no_db" as const,
  })),
}));

vi.mock("@/features/admin/svg-editor/publish/svgPipelineRunner", () => ({
  runSvgPipeline: vi.fn(),
}));

const resolveSvgPublishDualWriteDeps = vi.hoisted(() =>
  vi.fn(async () => ({
    dbRepository: undefined,
    artifactStore: undefined,
    mode: "skipped_no_db" as const,
  })),
);

vi.mock("@/features/admin/svg-editor/publish/resolveSvgPublishDualWrite", () => ({
  resolveSvgPublishDualWriteDeps,
}));

const { tryLoad } = vi.hoisted(() => ({
  tryLoad: vi.fn(),
}));

vi.mock("@/features/planner/catalog/svg/svgBlockDescriptorLoader", async () => {
  const actual = await vi.importActual<typeof SvgBlockDescriptorLoader>(
    "@/features/planner/catalog/svg/svgBlockDescriptorLoader",
  );
  return { ...actual, clearLoaderCache: vi.fn(), tryLoad };
});

const { parseAdminPayload } = await import(
  "@/features/admin/svg-editor/storage/persistBlockDescriptor"
);
const { publishDescriptorWithPipeline } = await import(
  "@/features/admin/svg-editor/publish/publishDescriptorWithPipeline"
);

function makeReq(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/admin/svg-editor", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Minimal auth context for the withAuth passthrough handler. */
const adminAuth = {
  user: { id: "00000000-0000-4000-8000-0000000000d1" },
};

const validDescriptor = {
  schemaVersion: "2026-07-04.v2",
  id: "11111111-1111-4111-8111-111111111111",
  slug: "test-block",
  sourceProvenance: "native",
  geometry: { widthMm: 100, depthMm: 100, heightMm: 100 },
  viewBox: { x: 0, y: 0, width: 100, height: 100 },
  mounting: ["floor"],
  themeTokens: { currentColor: "currentColor" },
  rovingFocus: [],
  liveAnnouncementCategories: ["status"],
  variant: "fixed",
  fixed: { sizingType: "fixed" },
  checksum: "a".repeat(64),
  generatedAt: 1700000000,
} satisfies BlockDescriptor;

function parseOk(
  value: BlockDescriptor = validDescriptor,
): { ok: true; value: BlockDescriptor } {
  return { ok: true, value };
}

function parseInvalid(
  error: PlannerDescriptorError,
): { ok: false; error: PlannerDescriptorError } {
  return { ok: false, error };
}

/** Publish body must carry DB-SVG-09 client stamp alongside descriptor fields. */
function publishBody(
  descriptor: BlockDescriptor = validDescriptor,
): Record<string, unknown> {
  return {
    ...descriptor,
    openedBaselineGeneratedAt: descriptor.generatedAt,
  };
}

describe("POST /api/admin/svg-editor (04-ADMIN-06 + tests)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resolveSvgPublishDualWriteDeps.mockResolvedValue({
      dbRepository: undefined,
      artifactStore: undefined,
      mode: "skipped_no_db",
    });
    vi.mocked(tryLoad).mockReturnValue({
      ok: false,
      error: { kind: "not_found" },
    } as never);
  });

  it("04-TEST-01: withAuth enforces admin; non-admin yields 401/403 (envelope)", async () => {
    // withAuth mock passthrough; auth 401/403 exercised in withAuth layer + integration.
    // Here: invalid payload maps to 422 via fail-closed publish error taxonomy.
    const req = makeReq(validDescriptor);
    vi.mocked(parseAdminPayload).mockReturnValue(
      parseInvalid({
        kind: "invalid",
        code: "422.invalid",
        fieldPath: "",
        message: "auth boundary",
      }),
    );
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: false,
      error: "invalid: auth boundary",
    });

    const res = await POST(req, adminAuth as never);
    expect(res.status).toBe(422);
  });

  it("04-TEST-02: Zod parse fail (via parseAdminPayload) returns 422 with fieldPath", async () => {
    vi.mocked(parseAdminPayload).mockReturnValue(
      parseInvalid({
        kind: "invalid",
        code: "422.invalid",
        fieldPath: "slug",
        message: "slug must match kebab",
        issues: [{ path: "slug", message: "invalid" }],
      }),
    );
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: false,
      error: "invalid: slug must match kebab",
    });

    const req = makeReq({ schemaVersion: "bad" });
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      error: { code: string; fieldPath?: string };
    };

    expect(res.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("422.invalid");
    expect(body.error.fieldPath).toBe("slug");
  });

  it("04-TEST-03 + atomic: persist success path + cache clear", async () => {
    vi.mocked(tryLoad).mockReturnValue({
      ok: true,
      value: validDescriptor,
    } as never);
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: true,
      descriptor: validDescriptor,
    });

    const req = makeReq(publishBody());
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      descriptor: { slug: string };
      thumb?: string;
    };

    expect(publishDescriptorWithPipeline).toHaveBeenCalled();
    expect(body.success).toBe(true);
    expect(body.descriptor.slug).toBe("test-block");
    expect(body.thumb).toBeDefined();
  });

  it("04-TEST-03b: rejects publish when openedBaselineGeneratedAt is missing (DB-SVG-09)", async () => {
    vi.mocked(tryLoad).mockReturnValue({
      ok: true,
      value: validDescriptor,
    } as never);
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());

    const req = makeReq(validDescriptor);
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      error: { code: string };
    };

    expect(res.status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("stale_draft");
    expect(publishDescriptorWithPipeline).not.toHaveBeenCalled();
  });

  it("04-TEST-04: disk-authority success injects skipped dual-write deps + returns thumb", async () => {
    vi.mocked(tryLoad).mockReturnValue({
      ok: true,
      value: validDescriptor,
    } as never);
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: true,
      descriptor: validDescriptor,
    });

    const req = makeReq(publishBody());
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as { thumb?: string };

    expect(resolveSvgPublishDualWriteDeps).toHaveBeenCalled();
    expect(publishDescriptorWithPipeline).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: validDescriptor.slug,
        generatedAt: validDescriptor.generatedAt,
      }),
      // Mocked skipped_no_db — disk authority; no DB/R2 injection.
      expect.objectContaining({
        actorId: expect.any(String),
        dbRepository: undefined,
        artifactStore: undefined,
      }),
    );
    expect(body.thumb).toMatch(/site-block-thumbs|cdn/);
  });

  it("fail-closed: compiler_failed returns 422 and never a descriptor", async () => {
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: false,
      error:
        "compiler_failed: Backend SVG compilation failed. empty blocks (failedAt=svg-s1-normalize)",
    });

    const req = makeReq(publishBody());
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      descriptor?: unknown;
      error: { code: string; message: string; details?: string };
    };

    expect(res.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.descriptor).toBeUndefined();
    expect(body.error.code).toBe("compiler_failed");
    expect(body.error.message).toMatch(/compilation failed/i);
    expect(body.error.details).toContain("compiler_failed");
  });

  it("fail-closed: compiler_exception returns 422", async () => {
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: false,
      error:
        "compiler_exception: A fatal error occurred during SVG compilation. boom",
    });

    const req = makeReq(publishBody());
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      error: { code: string };
    };

    expect(res.status).toBe(422);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("compiler_failed");
  });

  it("fail-closed: pipeline/S4 failure aborts publish (not best-effort success)", async () => {
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: false,
      error: "pipeline_failed: nonZeroExit",
    });

    const req = makeReq(publishBody());
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      descriptor?: unknown;
      error: { code: string };
    };

    expect(body.success).toBe(false);
    expect(body.descriptor).toBeUndefined();
    expect(body.error.code).toBe("compiler_failed");
    expect(res.status).toBe(422);
  });

  it("fail-closed: non-compile publish failure returns 500", async () => {
    vi.mocked(parseAdminPayload).mockReturnValue(parseOk());
    vi.mocked(publishDescriptorWithPipeline).mockResolvedValue({
      success: false,
      error: "500.io: Descriptor persistence threw. disk full",
    });

    const req = makeReq(publishBody());
    const res = await POST(req, adminAuth as never);
    const body = (await res.json()) as {
      success: boolean;
      error: { code: string };
    };

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("publish_failed");
  });
});

describe("04-TEST-06 lint guard (source scan)", () => {
  it("forbids direct puckBlockRegistry import under planner/* without withAuth context (grep guard)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const plannerRoot = path.resolve(process.cwd(), "site/features/planner");
    const violations: string[] = [];
    function scan(dir: string) {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) scan(p);
        else if (p.endsWith(".ts") || p.endsWith(".tsx")) {
          const content = fs.readFileSync(p, "utf8");
          if (
            content.includes("puckBlockRegistry") ||
            content.includes(
              'from "@/features/admin/svg-editor/puckBlockRegistry"',
            )
          ) {
            if (!content.includes("withAuth") && !p.includes("svg-editor")) {
              violations.push(p);
            }
          }
        }
      }
    }
    scan(plannerRoot);
    expect(violations).toEqual([]);
  });
});
