import "server-only";

import { createHash } from "node:crypto";

import {
  loadCurrentPublishedSvgArtifact,
  type PublishedSvgArtifact,
} from "@/features/planner/catalog-api/publishedSvgArtifact.server";
import { readR2ObjectText } from "@/lib/storage/r2Catalog";

const REVISION_ID_PATTERN = /^[a-z][a-z0-9-]{1,127}$/;
const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

export type PublishedSvgRouteDependencies = {
  readonly loadArtifact: (
    revisionId: string,
  ) => Promise<PublishedSvgArtifact | null>;
  readonly readObject: (storageKey: string) => Promise<string | null>;
};

const DEFAULT_DEPENDENCIES: PublishedSvgRouteDependencies = {
  loadArtifact: loadCurrentPublishedSvgArtifact,
  readObject: (storageKey) => readR2ObjectText(storageKey),
};

function sha256Utf8(body: string): string {
  return createHash("sha256").update(body, "utf8").digest("hex");
}

function immutableHeaders(checksum: string): HeadersInit {
  return {
    "Cache-Control": IMMUTABLE_CACHE,
    "Content-Security-Policy":
      "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    "Cross-Origin-Resource-Policy": "same-origin",
    ETag: `"${checksum}"`,
    "X-Content-Type-Options": "nosniff",
  };
}

/**
 * Serve immutable published SVG bytes for a revision currently pointed by an
 * active Planner product. Extracted from the route module so Next route types
 * only see HTTP method exports.
 */
export async function buildPublishedSvgResponse(
  request: Request,
  revisionId: string,
  dependencies: PublishedSvgRouteDependencies = DEFAULT_DEPENDENCIES,
): Promise<Response> {
  if (!REVISION_ID_PATTERN.test(revisionId)) {
    return new Response("Not found", { status: 404 });
  }

  let artifact: PublishedSvgArtifact | null;
  try {
    artifact = await dependencies.loadArtifact(revisionId);
  } catch {
    return new Response("SVG service unavailable", { status: 503 });
  }
  if (!artifact) return new Response("Not found", { status: 404 });

  const headers = immutableHeaders(artifact.checksum);
  if (request.headers.get("if-none-match") === `"${artifact.checksum}"`) {
    return new Response(null, { status: 304, headers });
  }

  let svg: string | null;
  try {
    svg = await dependencies.readObject(artifact.storageKey);
  } catch {
    svg = null;
  }
  if (svg === null) {
    return new Response("SVG service unavailable", { status: 503 });
  }
  if (sha256Utf8(svg) !== artifact.checksum) {
    return new Response("SVG integrity check failed", { status: 500 });
  }

  return new Response(svg, {
    status: 200,
    headers: {
      ...headers,
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
