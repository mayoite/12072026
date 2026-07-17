// @vitest-environment node
import { createHash } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import { buildPublishedSvgResponse } from "@/features/planner/catalog-api/buildPublishedSvgResponse.server";

vi.mock("server-only", () => ({}));

const SVG =
  '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';
const CHECKSUM = createHash("sha256").update(SVG, "utf8").digest("hex");
const REVISION_ID = "side-table-001-r-0123456789abcdef";

function deps(overrides?: {
  readonly checksum?: string;
  readonly loadArtifact?: () => Promise<{ checksum: string; storageKey: string } | null>;
  readonly readObject?: () => Promise<string | null>;
}) {
  return {
    loadArtifact:
      overrides?.loadArtifact ??
      vi.fn(async () => ({
        checksum: overrides?.checksum ?? CHECKSUM,
        storageKey: `svg-revisions/${REVISION_ID}.svg`,
      })),
    readObject: overrides?.readObject ?? vi.fn(async () => SVG),
  };
}

describe("buildPublishedSvgResponse.server (name-mirror)", () => {
  it("serves active revision bytes with immutable cache and integrity headers", async () => {
    const dependencies = deps();
    const response = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
      REVISION_ID,
      dependencies,
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(SVG);
    expect(response.headers.get("content-type")).toBe("image/svg+xml; charset=utf-8");
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(response.headers.get("etag")).toBe(`"${CHECKSUM}"`);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(dependencies.readObject).toHaveBeenCalledWith(
      `svg-revisions/${REVISION_ID}.svg`,
    );
  });

  it("returns 304 when If-None-Match matches checksum without reading object storage", async () => {
    const dependencies = deps();
    const response = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`, {
        headers: { "If-None-Match": `"${CHECKSUM}"` },
      }),
      REVISION_ID,
      dependencies,
    );

    expect(response.status).toBe(304);
    expect(dependencies.readObject).not.toHaveBeenCalled();
  });

  it("fails closed for invalid ids, missing artifacts, storage miss, and checksum mismatch", async () => {
    expect(
      (
        await buildPublishedSvgResponse(
          new Request("http://localhost/api/planner/catalog/svg/../bad"),
          "../bad",
          deps(),
        )
      ).status,
    ).toBe(404);

    expect(
      (
        await buildPublishedSvgResponse(
          new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
          REVISION_ID,
          deps({ loadArtifact: vi.fn(async () => null) }),
        )
      ).status,
    ).toBe(404);

    expect(
      (
        await buildPublishedSvgResponse(
          new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
          REVISION_ID,
          deps({ readObject: vi.fn(async () => null) }),
        )
      ).status,
    ).toBe(503);

    expect(
      (
        await buildPublishedSvgResponse(
          new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
          REVISION_ID,
          deps({ checksum: "0".repeat(64) }),
        )
      ).status,
    ).toBe(500);
  });

  it("maps loadArtifact throw to 503 without touching disk catalog paths", async () => {
    const dependencies = deps({
      loadArtifact: vi.fn(async () => {
        throw new Error("db down");
      }),
    });
    const response = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
      REVISION_ID,
      dependencies,
    );
    expect(response.status).toBe(503);
    expect(await response.text()).toBe("SVG service unavailable");
    expect(dependencies.readObject).not.toHaveBeenCalled();
  });
});
