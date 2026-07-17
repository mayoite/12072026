// @vitest-environment node
/**
 * Name-mirror: scripts/test-r2-upload.ts
 */
import { describe, expect, it, vi } from "vitest";
import {
  buildTestUploadParams,
  resolveR2UploadConfig,
  testUpload,
} from "../../../scripts/test-r2-upload";

describe("test-r2-upload (name-mirror)", () => {
  it("resolves endpoint and intact R2 credentials", () => {
    const cfg = resolveR2UploadConfig({
      CLOUDFLARE_ACCOUNT_ID: "acct-123",
      CLOUDFLARE_R2_ACCESS_KEY_ID: "key-id",
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: "secret",
      CLOUDFLARE_R2_CATALOG_BUCKET: "bucket-a",
    } as NodeJS.ProcessEnv);
    expect(cfg.endpoint).toBe("https://acct-123.r2.cloudflarestorage.com");
    expect(cfg.bucket).toBe("bucket-a");
    expect(cfg.credentialSource).toBe("cloudflare-r2");
    expect(cfg.credentials).toEqual({
      accessKeyId: "key-id",
      secretAccessKey: "secret",
    });
  });

  it("builds a test-auth.json put payload", () => {
    const params = buildTestUploadParams({
      CLOUDFLARE_R2_CATALOG_BUCKET: "cdn",
    } as NodeJS.ProcessEnv);
    expect(params.Bucket).toBe("cdn");
    expect(params.Key).toBe("test-auth.json");
    expect(params.ContentType).toBe("application/json");
    expect(JSON.parse(String(params.Body))).toEqual({ test: "auth" });
  });

  it("returns ok when client send succeeds", async () => {
    const send = vi.fn(async () => ({}));
    const result = await testUpload({
      env: {
        CLOUDFLARE_ACCOUNT_ID: "a",
        CLOUDFLARE_R2_ACCESS_KEY_ID: "key",
        CLOUDFLARE_R2_SECRET_ACCESS_KEY: "secret",
      } as NodeJS.ProcessEnv,
      client: { send } as never,
      logger: { log: () => undefined, error: () => undefined },
    });
    expect(result.ok).toBe(true);
    expect(send).toHaveBeenCalledOnce();
  });

  it("returns failure details when client send rejects", async () => {
    const send = vi.fn(async () => {
      throw new Error("AccessDenied");
    });
    const result = await testUpload({
      env: {
        CLOUDFLARE_R2_ACCESS_KEY_ID: "key",
        CLOUDFLARE_R2_SECRET_ACCESS_KEY: "secret",
        CLOUDFLARE_ACCOUNT_ID: "acct",
      } as NodeJS.ProcessEnv,
      client: { send } as never,
      logger: { log: () => undefined, error: () => undefined },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("AccessDenied");
    }
  });

  it("fails closed when credentials are missing", async () => {
    const result = await testUpload({
      env: {} as NodeJS.ProcessEnv,
      logger: { log: () => undefined, error: () => undefined },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe("missing_r2_config");
    }
  });
});
