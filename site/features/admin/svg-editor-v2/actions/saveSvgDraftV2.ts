import type { SvgAssetManifestV2 } from "../model/svgAssetManifestV2";
import type { SvgObjectStorageV2 } from "../persistence/svgDraftStorage";
import { inspectSvgDraftV2 } from "../security/svgSanitizerV2";

async function sha256(body: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", Uint8Array.from(body).buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function saveSvgDraftV2(input: {
  readonly manifest: SvgAssetManifestV2;
  readonly svg: string;
  readonly baseChecksum: string;
  readonly storage: SvgObjectStorageV2;
  readonly now: string;
}) {
  const body = new TextEncoder().encode(input.svg);
  const checksum = await sha256(body);
  if (checksum !== input.baseChecksum) throw new Error("Draft base checksum does not match the editor document");
  const inspection = inspectSvgDraftV2(input.svg);
  const key = `svg-editor-v2/${input.manifest.slug}/draft.svg`;
  const stored = await input.storage.put({ key, body, mimeType: "image/svg+xml", checksum });
  if (!await input.storage.verify({ key, body, mimeType: "image/svg+xml", checksum })) {
    if (stored.created) await input.storage.deleteByExplicitKey(key);
    throw new Error("Draft verification failed");
  }
  return {
    ok: inspection.valid,
    key,
    checksum,
    savedAt: input.now,
    diagnostics: inspection.diagnostics,
  };
}

export async function reopenSvgDraftV2(key: string, storage: SvgObjectStorageV2) {
  const stored = await storage.get(key);
  if (!stored) throw new Error(`SVG draft not found: ${key}`);
  return {
    svg: new TextDecoder().decode(stored.body),
    key,
    mimeType: stored.mimeType,
  };
}
