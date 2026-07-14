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
  it("resolves endpoint from CLOULDFLARE_* env names used by the script", () => {
    const cfg = resolveR2UploadConfig({
      CLOULDFLARE_ACCOUNT_ID: "acct-123",
      CLOULDFLARE_SECRET_API_TOKEN: "tok",
      CLOUDFLARE_R2_CATALOG_BUCKET: "bucket-a",
    } as NodeJS.ProcessEnv);
    expect(cfg.endpoint).toBe("https://acct-123.r2.cloudflarestorage.com");
    expect(cfg.bucket).toBe("bucket-a");
    expect(cfg.credentials.accessKeyId).toBe("acct-123");
    expect(cfg.credentials.secretAccessKey).toBe("tok");
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
        CLOULDFLARE_ACCOUNT_ID: "a",
        CLOULDFLARE_SECRET_API_TOKEN: "b",
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
      client: { send } as never,
      logger: { log: () => undefined, error: () => undefined },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain("AccessDenied");
    }
  });
});
