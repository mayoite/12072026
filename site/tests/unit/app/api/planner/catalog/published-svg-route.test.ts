import { createHash } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import { buildPublishedSvgResponse } from "@/features/planner/catalog-api/buildPublishedSvgResponse.server";

const SVG = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';
const CHECKSUM = createHash("sha256").update(SVG, "utf8").digest("hex");
const REVISION_ID = "desk-linear-r-0123456789abcdefabcd";

function dependencies(overrides?: {
  readonly checksum?: string;
  readonly readObject?: () => Promise<string | null>;
  readonly loadArtifact?: () => Promise<
    { checksum: string; storageKey: string } | null
  >;
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

describe("published SVG route", () => {
  it("serves the active immutable revision with hardened headers", async () => {
    const deps = dependencies();
    const response = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
      REVISION_ID,
      deps,
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(SVG);
    expect(response.headers.get("content-type")).toBe(
      "image/svg+xml; charset=utf-8",
    );
    expect(response.headers.get("cache-control")).toContain("immutable");
    expect(response.headers.get("etag")).toBe(`"${CHECKSUM}"`);
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(deps.readObject).toHaveBeenCalledOnce();
  });

  it("returns 304 without reading storage for a matching ETag", async () => {
    const deps = dependencies();
    const response = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`, {
        headers: { "If-None-Match": `"${CHECKSUM}"` },
      }),
      REVISION_ID,
      deps,
    );

    expect(response.status).toBe(304);
    expect(deps.readObject).not.toHaveBeenCalled();
  });

  it("fails closed for invalid, unpublished, missing, and corrupt artifacts", async () => {
    const invalid = await buildPublishedSvgResponse(
      new Request("http://localhost/api/planner/catalog/svg/bad"),
      "../bad",
      dependencies(),
    );
    expect(invalid.status).toBe(404);

    const unpublished = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
      REVISION_ID,
      dependencies({ loadArtifact: vi.fn(async () => null) }),
    );
    expect(unpublished.status).toBe(404);

    const missing = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
      REVISION_ID,
      dependencies({ readObject: vi.fn(async () => null) }),
    );
    expect(missing.status).toBe(503);

    const corrupt = await buildPublishedSvgResponse(
      new Request(`http://localhost/api/planner/catalog/svg/${REVISION_ID}`),
      REVISION_ID,
      dependencies({ checksum: "0".repeat(64) }),
    );
    expect(corrupt.status).toBe(500);
  });
});
