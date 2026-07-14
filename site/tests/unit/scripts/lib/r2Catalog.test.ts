// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("scripts/lib/r2Catalog re-export (name-mirror)", () => {
  const originalEnv = { ...process.env };
  const originalArgv = [...process.argv];

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
    delete process.env.CLOUDFLARE_R2_CATALOG_BUCKET;
    delete process.env.CLOUDFLARE_R2_BUCKET;
    delete process.env.R2_CATALOG_BUCKET;
  });

  afterEach(() => {
    process.env = originalEnv;
    process.argv = originalArgv;
  });

  it("re-exports DEFAULT_CATALOG_BUCKET and resolveCatalogBucketName from lib/storage", async () => {
    const fromScripts = await import("@/scripts/lib/r2Catalog");
    const fromLib = await import("@/lib/storage/r2Catalog");

    expect(fromScripts.DEFAULT_CATALOG_BUCKET).toBe(fromLib.DEFAULT_CATALOG_BUCKET);
    expect(fromScripts.DEFAULT_CATALOG_BUCKET).toBe("oando-asset-cdn");
    expect(fromScripts.resolveCatalogBucketName()).toBe("oando-asset-cdn");
  });

  it("honors CLI --bucket= override via re-exported resolver", async () => {
    process.argv = [...process.argv, "--bucket=script-mirror-bucket"];
    const { resolveCatalogBucketName } = await import("@/scripts/lib/r2Catalog");
    expect(resolveCatalogBucketName()).toBe("script-mirror-bucket");
  });

  it("exposes createR2CatalogClient and contentTypeForKey", async () => {
    const mod = await import("@/scripts/lib/r2Catalog");
    expect(typeof mod.createR2CatalogClient).toBe("function");
    expect(typeof mod.contentTypeForKey).toBe("function");
    expect(mod.contentTypeForKey("foo.svg")).toMatch(/svg|image|octet/i);
  });
});
