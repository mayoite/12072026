/**
 * Write system-generated GLB bytes under site/public/ so Next serves
 * `/catalog-assets/generated/<file>.glb`.
 *
 * Node/server helper (uses node:fs). Policy-gated: only paths under
 * catalog-assets/generated/ are accepted (no designer static, no blob:, no traversal).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  GENERATED_GLB_PATH_MARKER,
  assertNoDesignerStaticGlb,
  isSystemGeneratedGlbUrl,
} from "@/features/planner/lib/glbAssetPolicy";
import { resolvePublicDir } from "@/lib/paths/sitePackageRoot";

export type WriteGeneratedGlbToPublicOptions = {
  /**
   * Override public root (unit tests use a temp dir).
   * Default: site/public via resolvePublicDir().
   */
  publicRoot?: string;
};

export type WriteGeneratedGlbToPublicResult = {
  /** Policy-safe document path (no leading slash). */
  readonly relativePath: string;
  /** Absolute filesystem path of the written file. */
  readonly absolutePath: string;
  /** Byte length of the written buffer. */
  readonly byteLength: number;
  /**
   * URL path Next serves from public/ (leading slash).
   * e.g. /catalog-assets/generated/foo.glb
   */
  readonly publicUrlPath: string;
};

/**
 * Normalize and assert a relative path is a writable system-generated GLB path.
 * Rejects blob:, designer static, path traversal, absolute paths, non-.glb.
 */
export function assertWritableGeneratedGlbRelativePath(
  relativePath: string,
): string {
  const trimmed = relativePath.trim().replace(/\\/g, "/");
  const noLead = trimmed.replace(/^\/+/, "");

  if (!noLead) {
    throw new Error(
      "writeGeneratedGlbToPublic requires a non-empty relativePath " +
        `under ${GENERATED_GLB_PATH_MARKER}`,
    );
  }

  if (noLead.startsWith("blob:")) {
    throw new Error(
      "writeGeneratedGlbToPublic cannot write blob: URLs to public disk",
    );
  }

  if (noLead.includes("..") || path.isAbsolute(noLead) || /^[a-zA-Z]:/.test(noLead)) {
    throw new Error(
      "writeGeneratedGlbToPublic rejects absolute or traversal paths: " +
        noLead,
    );
  }

  assertNoDesignerStaticGlb(noLead, "relativePath");
  if (!isSystemGeneratedGlbUrl(noLead)) {
    throw new Error(
      "relativePath must pass isSystemGeneratedGlbUrl " +
        `(${GENERATED_GLB_PATH_MARKER}… only)`,
    );
  }

  if (!noLead.startsWith(GENERATED_GLB_PATH_MARKER)) {
    throw new Error(
      `relativePath must start with ${GENERATED_GLB_PATH_MARKER} (got ${noLead})`,
    );
  }

  if (!noLead.toLowerCase().endsWith(".glb")) {
    throw new Error(
      `relativePath must end with .glb (got ${noLead})`,
    );
  }

  return noLead;
}

/**
 * Write GLB bytes to publicRoot/relativePath after policy path asserts.
 * Creates parent directories as needed.
 */
export function writeGeneratedGlbToPublic(
  buffer: ArrayBuffer,
  relativePath: string,
  options?: WriteGeneratedGlbToPublicOptions,
): WriteGeneratedGlbToPublicResult {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength === 0) {
    throw new Error(
      "writeGeneratedGlbToPublic requires a non-empty ArrayBuffer",
    );
  }

  const safeRelative = assertWritableGeneratedGlbRelativePath(relativePath);
  const publicRoot = options?.publicRoot ?? resolvePublicDir();
  const absolutePath = path.resolve(publicRoot, ...safeRelative.split("/"));

  const generatedRoot = path.resolve(
    publicRoot,
    ...GENERATED_GLB_PATH_MARKER.replace(/\/$/, "").split("/"),
  );
  const relToGenerated = path.relative(generatedRoot, absolutePath);
  if (
    !relToGenerated ||
    relToGenerated.startsWith("..") ||
    path.isAbsolute(relToGenerated)
  ) {
    throw new Error(
      "writeGeneratedGlbToPublic: resolved path escapes " +
        GENERATED_GLB_PATH_MARKER,
    );
  }

  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, Buffer.from(buffer));

  return {
    relativePath: safeRelative,
    absolutePath,
    byteLength: buffer.byteLength,
    publicUrlPath: `/${safeRelative}`,
  };
}
