/**
 * Name-mirror coverage for lib/storage/r2Catalog (mocked SDK).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
const S3Client = vi.fn(function MockS3Client(this: { send: typeof send }) {
  this.send = send;
});
const GetObjectCommand = vi.fn(function MockGetObjectCommand(
  this: { input: unknown },
  input: unknown,
) {
  this.input = input;
});

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client,
  GetObjectCommand,
}));

describe("r2Catalog", () => {
  const originalEnv = { ...process.env };
  const originalArgv = [...process.argv];

  beforeEach(() => {
    vi.resetModules();
    send.mockReset();
    S3Client.mockClear();
    GetObjectCommand.mockClear();
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
    delete process.env.CLOUDFLARE_R2_CATALOG_BUCKET;
    delete process.env.CLOUDFLARE_R2_BUCKET;
    delete process.env.R2_CATALOG_BUCKET;
    delete process.env.CLOULDFLARE_S3_URL;
    delete process.env.CLOUDFLARE_S3_URL;
    delete process.env.CLOUDFLARE_ACCOUNT_ID;
    delete process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    delete process.env.CLOULD_ACCESS_KEY_ID;
    delete process.env.CLOUDFLARE_ACCESS_KEY_ID;
    delete process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    delete process.env.CLOULDFLARE_S3_SECRET_ACCESS_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
    process.argv = originalArgv;
  });

  it("defaults bucket name and accepts --bucket CLI override", async () => {
    const mod = await import("@/lib/storage/r2Catalog");
    expect(mod.DEFAULT_CATALOG_BUCKET).toBe("oando-asset-cdn");
    expect(mod.resolveCatalogBucketName()).toBe("oando-asset-cdn");

    process.argv = ["node", "script", "--bucket=custom-bucket"];
    expect(mod.resolveCatalogBucketName()).toBe("custom-bucket");
  });

  it("resolves R2 endpoint from explicit URL or account id", async () => {
    const mod = await import("@/lib/storage/r2Catalog");
    expect(mod.resolveR2Endpoint()).toBeNull();

    process.env.CLOUDFLARE_S3_URL = "https://example.r2.cloudflarestorage.com/";
    expect(mod.resolveR2Endpoint()).toBe(
      "https://example.r2.cloudflarestorage.com/",
    );

    delete process.env.CLOUDFLARE_S3_URL;
    process.env.CLOUDFLARE_ACCOUNT_ID = "acct123";
    expect(mod.resolveR2Endpoint()).toBe(
      "https://acct123.r2.cloudflarestorage.com",
    );
  });

  it("resolves credentials only when both access and secret exist", async () => {
    const mod = await import("@/lib/storage/r2Catalog");
    expect(mod.resolveR2Credentials()).toBeNull();

    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key";
    expect(mod.resolveR2Credentials()).toBeNull();

    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "secret";
    expect(mod.resolveR2Credentials()).toEqual({
      accessKeyId: "key",
      secretAccessKey: "secret",
    });
  });

  it("maps content types by object key extension", async () => {
    const { contentTypeForKey } = await import("@/lib/storage/r2Catalog");
    expect(contentTypeForKey("a.JSON")).toBe("application/json");
    expect(contentTypeForKey("a.jpg")).toBe("image/jpeg");
    expect(contentTypeForKey("a.jpeg")).toBe("image/jpeg");
    expect(contentTypeForKey("a.png")).toBe("image/png");
    expect(contentTypeForKey("a.webp")).toBe("image/webp");
    expect(contentTypeForKey("a.pdf")).toBe("application/pdf");
    expect(contentTypeForKey("a.bin")).toBe("application/octet-stream");
  });

  it("throws when createR2CatalogClient lacks endpoint or credentials", async () => {
    const { createR2CatalogClient } = await import("@/lib/storage/r2Catalog");
    expect(() => createR2CatalogClient()).toThrow(/Missing R2 config/i);
  });

  it("creates an S3 client when endpoint and credentials are present", async () => {
    process.env.CLOUDFLARE_S3_URL = "https://example.r2.cloudflarestorage.com";
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key";
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "secret";

    const { createR2CatalogClient } = await import("@/lib/storage/r2Catalog");
    const client = createR2CatalogClient();
    expect(S3Client).toHaveBeenCalledWith(
      expect.objectContaining({
        region: "auto",
        endpoint: "https://example.r2.cloudflarestorage.com",
        credentials: { accessKeyId: "key", secretAccessKey: "secret" },
      }),
    );
    expect(client).toBeDefined();
  });

  it("returns null from readR2ObjectText without credentials", async () => {
    const { readR2ObjectText } = await import("@/lib/storage/r2Catalog");
    await expect(readR2ObjectText("backups/catalog/catalog-latest.json")).resolves.toBeNull();
  });

  it("reads object body text when R2 responds", async () => {
    process.env.CLOUDFLARE_S3_URL = "https://example.r2.cloudflarestorage.com";
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key";
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "secret";
    send.mockResolvedValue({
      Body: {
        transformToString: vi.fn().mockResolvedValue('{"ok":true}'),
      },
    });

    const { readR2ObjectText } = await import("@/lib/storage/r2Catalog");
    await expect(readR2ObjectText("k.json")).resolves.toBe('{"ok":true}');
  });

  it("returns null when the GetObject call fails", async () => {
    process.env.CLOUDFLARE_S3_URL = "https://example.r2.cloudflarestorage.com";
    process.env.CLOUDFLARE_R2_ACCESS_KEY_ID = "key";
    process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY = "secret";
    send.mockRejectedValue(new Error("network"));

    const { readR2ObjectText } = await import("@/lib/storage/r2Catalog");
    await expect(readR2ObjectText("missing.json")).resolves.toBeNull();
  });
});
