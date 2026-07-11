import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import { resolvePublicDir } from "@/lib/paths/sitePackageRoot";

export type SvgArtifactState = "published" | "missing" | "invalid";

export type SvgArtifactStatus = {
  readonly state: SvgArtifactState;
  readonly bytes: number;
  readonly updatedAt: number | null;
  readonly hash: string | null;
};

function svgPathForSlug(slug: string): string {
  return path.join(resolvePublicDir(), "svg-catalog", `${slug}.svg`);
}

function hashSvg(contents: string): string {
  return createHash("sha256").update(contents, "utf8").digest("hex");
}

export function readSvgArtifactStatus(slug: string): SvgArtifactStatus {
  const artifactPath = svgPathForSlug(slug);
  if (!existsSync(artifactPath)) {
    return { state: "missing", bytes: 0, updatedAt: null, hash: null };
  }

  try {
    const stat = statSync(artifactPath);
    const contents = readFileSync(artifactPath, "utf8").trim();
    const valid = contents.startsWith("<svg") && contents.endsWith("</svg>");
    return {
      state: valid ? "published" : "invalid",
      bytes: stat.size,
      updatedAt: stat.mtimeMs,
      hash: hashSvg(contents),
    };
  } catch {
    return { state: "invalid", bytes: 0, updatedAt: null, hash: null };
  }
}

export function readSvgArtifactStatuses(
  slugs: ReadonlyArray<string>,
): Readonly<Record<string, SvgArtifactStatus>> {
  const statuses: Record<string, SvgArtifactStatus> = {};
  for (const slug of slugs) {
    statuses[slug] = readSvgArtifactStatus(slug);
  }
  return statuses;
}
