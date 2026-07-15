import "server-only";

import { createHash } from "node:crypto";

import { createSupabaseAdminClient } from "@/platform/supabase/supabaseAdmin";

export interface SvgStorageCandidateV2 {
  readonly key: string;
  readonly body: Uint8Array;
  readonly mimeType: string;
  readonly checksum: string;
}

export interface SvgStoredObjectV2 {
  readonly provider: "supabase" | "r2";
  readonly bucket: string;
  readonly key: string;
  readonly mimeType: string;
  readonly contentLength: number;
  readonly checksum: string;
  readonly created: boolean;
}

export interface SvgStorageReadV2 {
  readonly body: Uint8Array;
  readonly mimeType: string;
  readonly contentLength: number;
}

export interface SvgStorageDriverV2 {
  put(key: string, body: Uint8Array, mimeType: string): Promise<void>;
  get(key: string): Promise<SvgStorageReadV2 | null>;
  remove(key: string): Promise<void>;
}

export interface SvgObjectStorageV2 {
  put(candidate: SvgStorageCandidateV2): Promise<SvgStoredObjectV2>;
  get(key: string): Promise<SvgStorageReadV2 | null>;
  verify(candidate: SvgStorageCandidateV2): Promise<boolean>;
  deleteByExplicitKey(key: string): Promise<void>;
}

function sha256(body: Uint8Array): string {
  return createHash("sha256").update(body).digest("hex");
}

export class VerifiedSvgObjectStorageV2 implements SvgObjectStorageV2 {
  constructor(
    private readonly driver: SvgStorageDriverV2,
    private readonly provider: SvgStoredObjectV2["provider"],
    private readonly bucket: string,
  ) {}

  async put(candidate: SvgStorageCandidateV2): Promise<SvgStoredObjectV2> {
    if (sha256(candidate.body) !== candidate.checksum) {
      throw new Error(`SVG storage candidate checksum is invalid: ${candidate.key}`);
    }
    const existing = await this.driver.get(candidate.key);
    if (existing) {
      const matches = existing.contentLength === candidate.body.byteLength
        && existing.mimeType === candidate.mimeType
        && sha256(existing.body) === candidate.checksum;
      if (!matches) throw new Error(`SVG storage object conflict: ${candidate.key}`);
      return {
        provider: this.provider,
        bucket: this.bucket,
        key: candidate.key,
        mimeType: candidate.mimeType,
        contentLength: candidate.body.byteLength,
        checksum: candidate.checksum,
        created: false,
      };
    }
    await this.driver.put(candidate.key, candidate.body, candidate.mimeType);
    if (!(await this.verify(candidate))) {
      await this.driver.remove(candidate.key);
      throw new Error(`SVG storage verification failed: ${candidate.key}`);
    }
    return {
      provider: this.provider,
      bucket: this.bucket,
      key: candidate.key,
      mimeType: candidate.mimeType,
      contentLength: candidate.body.byteLength,
      checksum: candidate.checksum,
      created: true,
    };
  }

  get(key: string): Promise<SvgStorageReadV2 | null> {
    return this.driver.get(key);
  }

  async verify(candidate: SvgStorageCandidateV2): Promise<boolean> {
    const stored = await this.driver.get(candidate.key);
    return stored !== null
      && stored.contentLength === candidate.body.byteLength
      && stored.mimeType === candidate.mimeType
      && sha256(stored.body) === candidate.checksum;
  }

  async deleteByExplicitKey(key: string): Promise<void> {
    if (!key.trim()) throw new Error("SVG storage deletion requires an explicit key");
    await this.driver.remove(key);
  }
}

export type SupabaseSvgStorageDriver = SvgStorageDriverV2;

export class SupabaseSvgDraftStorage extends VerifiedSvgObjectStorageV2 {
  constructor(driver: SupabaseSvgStorageDriver, bucket: string) {
    super(driver, "supabase", bucket);
  }
}

export function createSupabaseSvgDraftStorage(bucket = "svg-editor-v2-private"): SupabaseSvgDraftStorage {
  const client = createSupabaseAdminClient();
  const storage = client.storage.from(bucket);
  const driver: SupabaseSvgStorageDriver = {
    async put(key, body, mimeType) {
      const { error } = await storage.upload(key, body, { contentType: mimeType, upsert: false });
      if (error && !/already exists|duplicate/i.test(error.message)) throw error;
    },
    async get(key) {
      const { data, error } = await storage.download(key);
      if (error || !data) return null;
      return {
        body: new Uint8Array(await data.arrayBuffer()),
        mimeType: data.type,
        contentLength: data.size,
      };
    },
    async remove(key) {
      const { error } = await storage.remove([key]);
      if (error) throw error;
    },
  };
  return new SupabaseSvgDraftStorage(driver, bucket);
}
