import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";
import type { SvgObjectStorageV2, SvgStoredObjectV2 } from "../persistence/svgDraftStorage";
import { sanitizeSvgForPublishV2 } from "../security/svgSanitizerV2";

async function sha256(body: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", Uint8Array.from(body).buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function publishSvgAssetV2(input: {
  readonly manifest: SvgAssetManifestV2;
  readonly expectedVersion: number;
  readonly expectedChecksum: string;
  readonly actorId: string;
  readonly svg: string;
  readonly png: Uint8Array;
  readonly releaseStorage: SvgObjectStorageV2;
  readonly publish: (input: {
    readonly manifest: SvgAssetManifestV2;
    readonly expectedVersion: number;
    readonly expectedChecksum: string;
    readonly actorId: string;
    readonly artifacts: readonly SvgStoredObjectV2[];
  }) => Promise<"committed" | "already-committed">;
}) {
  const sanitizedSvg = sanitizeSvgForPublishV2(input.svg);
  const svgBody = new TextEncoder().encode(sanitizedSvg);
  const baseKey = `svg-editor-v2/${input.manifest.slug}/release-${input.manifest.currentVersion}`;
  const candidates = [
    { key: `${baseKey}.svg`, body: svgBody, mimeType: "image/svg+xml", checksum: await sha256(svgBody) },
    { key: `${baseKey}.png`, body: input.png, mimeType: "image/png", checksum: await sha256(input.png) },
  ] as const;
  const stored: SvgStoredObjectV2[] = [];
  try {
    for (const candidate of candidates) {
      const artifact = await input.releaseStorage.put(candidate);
      stored.push(artifact);
      if (!await input.releaseStorage.verify(candidate)) throw new Error(`Release verification failed: ${candidate.key}`);
    }
    const status = await input.publish({
      manifest: input.manifest,
      expectedVersion: input.expectedVersion,
      expectedChecksum: input.expectedChecksum,
      actorId: input.actorId,
      artifacts: stored,
    });
    return { status, artifacts: stored, sanitizedSvg };
  } catch (error) {
    await Promise.all(stored.filter((artifact) => artifact.created)
      .map((artifact) => input.releaseStorage.deleteByExplicitKey(artifact.key)));
    throw error;
  }
}
